// All learning-progress rules live here (not in the screens), so they are enforced
// no matter how the user navigates: completion conditions, one-time rewards, answer locking.
(function () {
  const App = window.App;
  const S = App.store;
  const cfg = App.config;

  const topic = (id) => App.topics.get(id);
  const prog = (id) => S.topicProgress(id);
  const minMs = () => cfg.minReadingSeconds * 1000;

  function markStarted(id) {
    const p = prog(id);
    if (p.startedAt) return;
    p.startedAt = Date.now();
    p.startedDay = S.today();
    S.save();
  }

  // Learning progress = the lesser of "time engaged" and "how far through the lesson",
  // so it only reaches 100% when BOTH reading conditions are met.
  function reading(id) {
    const p = S.peekTopic(id);
    const r = p ? p.reading : { engagedMs: 0, maxScroll: 0, reachedEnd: false, minTimeMet: false };
    const timeFrac = Math.min(1, r.engagedMs / minMs());
    const scrollFrac = r.reachedEnd ? 1 : r.maxScroll;
    const done = !!(p && p.completedAt);
    return {
      timeFrac,
      scrollFrac,
      minTimeMet: r.minTimeMet,
      reachedEnd: r.reachedEnd,
      percent: done ? 100 : Math.floor(Math.min(timeFrac, scrollFrac) * 100),
    };
  }

  const quickCheckUnlocked = (id) => {
    const r = prog(id).reading;
    return r.minTimeMet && r.reachedEnd;
  };

  function answerQuickCheck(id, choice) {
    const p = prog(id);
    if (p.quickCheck || !quickCheckUnlocked(id)) return;
    p.quickCheck = { answer: choice, correct: choice === topic(id).quickCheck.correctAnswer, at: Date.now() };
    S.save();
  }

  // Awards the reading points exactly once, and only when all three conditions hold.
  function completeTopic(id) {
    const p = prog(id);
    if (p.completedAt || !quickCheckUnlocked(id) || !p.quickCheck) return 0;
    p.completedAt = Date.now();
    p.completedDay = S.today();
    S.save();
    const t = topic(id);
    return App.points.award(`reading:${id}`, t.readingPoints ?? cfg.points.reading, { topicId: id, kind: 'reading' });
  }

  function answerQuestion(id, kind, question, choice, defaultPoints) {
    const p = prog(id);
    const bucket = kind === 'quiz' ? p.quiz.answers : p.bonus.answers;
    if (bucket[question.id] != null) return 0; // answers are locked once given
    bucket[question.id] = choice;
    S.save();
    if (choice !== question.correctAnswer) return 0; // no negative marking, ever
    return App.points.award(`${kind}:${id}:${question.id}`, question.points ?? defaultPoints, { topicId: id, kind });
  }

  function score(id, kind) {
    const t = topic(id);
    const p = S.peekTopic(id);
    const questions = kind === 'quiz' ? t.quizQuestions : t.bonusQuestions;
    const answers = p ? (kind === 'quiz' ? p.quiz.answers : p.bonus.answers) : {};
    const fallback = kind === 'quiz' ? cfg.points.quizCorrect : cfg.points.bonusCorrect;
    return {
      total: questions.length,
      answered: questions.filter((q) => answers[q.id] != null).length,
      correct: questions.filter((q) => answers[q.id] === q.correctAnswer).length,
      earned: App.points.forTopic(id)[kind] || 0,
      max: questions.reduce((sum, q) => sum + (q.points ?? fallback), 0),
    };
  }

  App.progress = {
    markStarted,
    reading,
    quickCheckUnlocked,
    answerQuickCheck,
    completeTopic,

    answerQuiz: (id, q, choice) => answerQuestion(id, 'quiz', q, choice, cfg.points.quizCorrect),
    finishQuiz(id) {
      const p = prog(id);
      const all = topic(id).quizQuestions.every((q) => p.quiz.answers[q.id] != null);
      if (!p.quizCompletedAt && all) {
        p.quizCompletedAt = Date.now();
        S.save();
      }
    },
    quizScore: (id) => score(id, 'quiz'),

    answerBonus: (id, q, choice) => answerQuestion(id, 'bonus', q, choice, cfg.points.bonusCorrect),
    finishBonus(id) {
      const p = prog(id);
      if (p.bonus.finishedAt) return;
      p.bonus.finishedAt = Date.now();
      p.bonus.skipped = topic(id).bonusQuestions.some((q) => p.bonus.answers[q.id] == null);
      S.save();
    },
    bonusScore: (id) => score(id, 'bonus'),

    answerFlash(id, choice) {
      const p = prog(id);
      if (p.flash) return;
      p.flash = { answer: choice, correct: choice === topic(id).yesterdayFlashQuestion.correctAnswer, day: S.today(), at: Date.now() };
      S.save();
    },
  };
})();

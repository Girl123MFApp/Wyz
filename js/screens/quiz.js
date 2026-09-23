// SCREEN 4 — Quick Quiz (Recall): 3 sequential MCQs, +5 per correct answer, no negative marking.
(function () {
  const App = window.App;
  const { h } = App.dom;
  const icon = App.icon;
  const ui = App.ui;
  const S = App.store;
  const P = App.progress;

  function resultMessage(correct, total) {
    if (correct === total) return 'Excellent recall!';
    if (correct >= total / 2) return 'Nicely done — most of it stuck.';
    if (correct > 0) return 'Good start. Tomorrow’s Flash will help it stick.';
    return 'Every attempt helps you remember. Tomorrow’s Flash will help too.';
  }

  App.screens.quiz = function ({ id }) {
    const topic = App.topics.get(id);
    if (!topic) return { redirect: '#/' };
    if (!S.peekTopic(id) || !S.peekTopic(id).completedAt) return { redirect: `#/topic/${id}` };

    const questions = topic.quizQuestions;
    const answers = () => S.topicProgress(id).quiz.answers;
    const body = h('div', { class: 'quiz-body' });
    const el = h(
      'div',
      { class: 'screen quiz' },
      ui.ScreenIntro({
        layer: 'recall',
        title: 'Quick Quiz',
        subtitle: `${questions.length} questions on ${topic.title}. +5 for every correct answer — no negative marking.`,
      }),
      body
    );

    function showQuestion(i) {
      const q = questions[i];
      const actions = h('div', { class: 'actions' });
      const steps = h('div', null, ui.Steps(questions, i, answers()));
      const isLast = i === questions.length - 1;

      body.replaceChildren(
        h('div', { class: 'q-top' }, h('span', { class: 'q-count' }, `Question ${i + 1} of ${questions.length}`), steps),
        h(
          'div',
          { class: 'card anim-in' },
          ui.MCQ({
            question: q,
            selected: answers()[q.id] ?? null,
            pointsFor: () => (App.points.has(`quiz:${id}:${q.id}`) ? q.points ?? App.config.points.quizCorrect : 0),
            onSelect: (choice) => {
              P.answerQuiz(id, q, choice);
              steps.replaceChildren(ui.Steps(questions, i, answers()));
              actions.replaceChildren(
                ui.Button(isLast ? 'See results →' : 'Next question →', {
                  onClick: () => {
                    if (isLast) {
                      P.finishQuiz(id);
                      showResults();
                    } else showQuestion(i + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  },
                })
              );
              actions.classList.add('anim-in');
            },
          })
        ),
        actions
      );
    }

    function showResults() {
      P.finishQuiz(id);
      const s = P.quizScore(id);
      const total = h('span', { class: 'result-big' }, '0');
      body.replaceChildren(
        h(
          'section',
          { class: 'card result-card pop-in' },
          h('span', { class: 'result-icon' }, icon('trophy')),
          h('h2', { class: 'card-title' }, 'Quick Quiz Complete'),
          h('p', { class: 'muted' }, resultMessage(s.correct, s.total)),
          h('div', { class: 'result-score' }, total, h('span', { class: 'result-of' }, `/${s.total} correct`)),
          h('div', { class: 'points-earned' }, icon('star'), `Points earned: ${s.earned}/${s.max}`),
          h(
            'ul',
            { class: 'result-list' },
            questions.map((q) => {
              const ok = answers()[q.id] === q.correctAnswer;
              return h('li', { class: ok ? 'ok' : 'no' }, h('span', { class: 'result-mark' }, icon(ok ? 'check' : 'x')), h('span', null, q.question));
            })
          )
        ),
        h(
          'div',
          { class: 'actions' },
          ui.Button('Continue →', { onClick: () => ui.navigate(topic.bonusQuestions.length ? `#/bonus/${id}` : `#/summary/${id}`) })
        )
      );
      ui.countUp(total, s.correct);
    }

    // Resume at the first unanswered question (answers are saved, so refreshing is safe).
    const first = questions.findIndex((q) => answers()[q.id] == null);
    if (first === -1) showResults();
    else showQuestion(first);

    return { el, header: { title: 'Quick Quiz' } };
  };
})();

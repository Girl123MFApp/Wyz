// SCREEN 5 — Bonus Challenge (Deepen): optional, beyond the lesson, points only ever added.
(function () {
  const App = window.App;
  const { h } = App.dom;
  const icon = App.icon;
  const ui = App.ui;
  const S = App.store;
  const P = App.progress;

  App.screens.bonus = function ({ id }) {
    const topic = App.topics.get(id);
    if (!topic) return { redirect: '#/' };
    const p = S.peekTopic(id);
    if (!p || !p.completedAt) return { redirect: `#/topic/${id}` };
    if (!p.quizCompletedAt) return { redirect: `#/quiz/${id}` };
    if (!topic.bonusQuestions.length) return { redirect: `#/summary/${id}` };

    const questions = topic.bonusQuestions;
    const answers = () => S.topicProgress(id).bonus.answers;
    const body = h('div', { class: 'quiz-body' });

    const toSummary = () => {
      P.finishBonus(id);
      ui.navigate(`#/summary/${id}`);
    };

    const el = h(
      'div',
      { class: 'screen bonus' },
      ui.ScreenIntro({
        layer: 'deepen',
        eyebrow: 'Optional',
        title: 'Bonus Challenge',
        subtitle: 'Test your deep knowledge. These go a little beyond today’s lesson — take your best guess.',
        note: 'Optional — no points are lost for wrong answers.',
      }),
      body
    );

    function showQuestion(i) {
      const q = questions[i];
      const isLast = i === questions.length - 1;
      const actions = h(
        'div',
        { class: 'actions' },
        ui.Button('Skip to summary', { variant: 'ghost', onClick: toSummary })
      );

      body.replaceChildren(
        h('div', { class: 'q-top' }, h('span', { class: 'q-count' }, `Bonus ${i + 1} of ${questions.length}`), ui.Steps(questions, i, answers())),
        h(
          'div',
          { class: 'card card-deepen anim-in' },
          ui.MCQ({
            question: q,
            selected: answers()[q.id] ?? null,
            pointsFor: () => (App.points.has(`bonus:${id}:${q.id}`) ? q.points ?? App.config.points.bonusCorrect : 0),
            onSelect: (choice) => {
              P.answerBonus(id, q, choice);
              actions.replaceChildren(
                ui.Button(isLast ? 'See today’s summary →' : 'Next bonus question →', {
                  onClick: () => {
                    if (isLast) toSummary();
                    else {
                      showQuestion(i + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  },
                })
              );
              actions.classList.add('anim-in');
            },
            labels: { showCorrectAnswer: true, explanationLabel: 'Why?' },
          })
        ),
        actions
      );
    }

    function showDone() {
      const s = P.bonusScore(id);
      body.replaceChildren(
        h(
          'section',
          { class: 'card result-card' },
          h('span', { class: 'result-icon deepen' }, icon('spark')),
          h('h2', { class: 'card-title' }, 'Bonus Challenge complete'),
          h('p', { class: 'muted' }, `${s.correct}/${s.total} correct · +${s.earned} bonus points`)
        ),
        h('div', { class: 'actions' }, ui.Button('See today’s summary →', { onClick: toSummary }))
      );
    }

    const first = questions.findIndex((q) => answers()[q.id] == null);
    if (first === -1) showDone();
    else showQuestion(first);

    return { el, header: { title: 'Bonus Challenge' } };
  };
})();

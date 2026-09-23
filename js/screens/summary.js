// SCREEN 6 — Daily Summary.
(function () {
  const App = window.App;
  const { h } = App.dom;
  const icon = App.icon;
  const ui = App.ui;
  const S = App.store;
  const P = App.progress;

  function Row({ label, detail, points, muted }) {
    return h(
      'div',
      { class: 'sum-row' + (muted ? ' is-muted' : '') },
      h('div', null, h('span', { class: 'sum-label' }, label), detail ? h('span', { class: 'sum-detail' }, detail) : null),
      h('span', { class: 'sum-points' }, `+${points}`)
    );
  }

  App.screens.summary = function ({ id }) {
    const topic = App.topics.get(id);
    if (!topic) return { redirect: '#/' };
    const p = S.peekTopic(id);
    if (!p || !p.quizCompletedAt) return { redirect: App.plan.resolveSubject(topic.subject) };

    const pts = App.points.forTopic(id);
    const quiz = P.quizScore(id);
    const bonus = P.bonusScore(id);
    const hasBonus = topic.bonusQuestions.length > 0;
    const sameDay = p.completedDay === S.today();

    let bonusDetail = `${bonus.correct}/${bonus.total} correct`;
    if (bonus.answered === 0) bonusDetail = 'Skipped — no problem';
    else if (bonus.answered < bonus.total) bonusDetail = `${bonus.correct}/${bonus.answered} correct · ${bonus.total - bonus.answered} skipped`;

    const totalEl = h('span', { class: 'sum-total-value' }, '+0');

    const el = h(
      'div',
      { class: 'screen summary' },
      h(
        'div',
        { class: 'summary-hero' },
        h('span', { class: 'summary-badge' }, icon('check')),
        h('h1', { class: 'screen-title' }, sameDay ? 'Today’s Learning Complete!' : 'Learning Complete'),
        h('span', { class: 'summary-topic' }, topic.title)
      ),
      h(
        'section',
        { class: 'card sum-card' },
        Row({ label: 'Reading', detail: 'Topic of the Day', points: pts.reading }),
        Row({ label: 'Quick Quiz', detail: `${quiz.correct}/${quiz.total} correct`, points: pts.quiz }),
        hasBonus ? Row({ label: 'Bonus Challenge', detail: bonusDetail, points: pts.bonus, muted: bonus.answered === 0 }) : null,
        h('div', { class: 'sum-total' }, h('span', null, sameDay ? 'Total earned today' : 'Total earned'), totalEl)
      ),
      h('p', { class: 'sum-overall' }, icon('star'), `Your total: ${App.points.total()} points`),
      h(
        'section',
        { class: 'card tomorrow-card' },
        h('span', { class: 'tomorrow-icon' }, icon('calendar')),
        h(
          'div',
          null,
          h('h2', { class: 'card-title' }, 'Come back tomorrow for your next topic.'),
          h('p', { class: 'muted' }, 'You’ll start with Yesterday’s Flash — one quick question to help today’s lesson stick.')
        )
      ),
      h('div', { class: 'actions' }, ui.Button('Back to Home', { onClick: () => ui.navigate('#/') })),
      h(
        'div',
        { class: 'proto-inline' },
        h('span', null, 'Prototype:'),
        h(
          'button',
          {
            type: 'button',
            class: 'link-btn',
            onClick: () => {
              S.simulateNextDay();
              ui.navigate('#/');
              ui.toast('It’s tomorrow — tap History to see Yesterday’s Flash');
            },
          },
          'Simulate tomorrow →'
        )
      )
    );

    return { el, onMount: () => ui.countUp(totalEl, pts.total, '+'), header: { title: 'Daily Summary' } };
  };
})();

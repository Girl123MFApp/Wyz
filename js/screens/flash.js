// SCREEN 2 — Yesterday's Flash (spaced repetition). Only reachable when a previous topic exists.
(function () {
  const App = window.App;
  const { h } = App.dom;
  const icon = App.icon;
  const ui = App.ui;
  const S = App.store;

  App.screens.flash = function ({ subject }) {
    const flash = App.plan.flashForToday();
    const today = App.plan.todaysTopic(subject);
    if (!today) return { redirect: '#/' };
    if (!flash) return { redirect: `#/topic/${today.id}` };

    const { topic, daysAgo } = flash;
    const saved = S.peekTopic(topic.id).flash;
    const actions = h('div', { class: 'actions' });

    function showContinue(animate) {
      actions.replaceChildren(ui.Button('Continue to Today’s Topic →', { onClick: () => ui.navigate(`#/topic/${today.id}`) }));
      if (animate) actions.classList.add('anim-in');
    }

    const el = h(
      'div',
      { class: 'screen flash' },
      ui.ScreenIntro({ layer: 'remember', title: 'Yesterday’s Flash', subtitle: 'Let’s see what you remember.' }),
      h(
        'div',
        { class: 'recall-from' },
        h('span', { class: 'recall-icon' }, icon('flash')),
        h(
          'div',
          null,
          h('span', { class: 'recall-label' }, daysAgo === 1 ? 'Yesterday you learned' : `${daysAgo} days ago you learned`),
          h('strong', { class: 'recall-topic' }, topic.title)
        )
      ),
      h(
        'div',
        { class: 'card' },
        h('div', { class: 'card-kicker' }, 'One quick question · not scored'),
        ui.MCQ({
          question: topic.yesterdayFlashQuestion,
          selected: saved ? saved.answer : null,
          onSelect: (i) => {
            App.progress.answerFlash(topic.id, i);
            showContinue(true);
          },
          labels: {
            correctSub: 'Great recall — that memory is getting stronger.',
            incorrectSub: 'That’s okay. Recalling it now helps it stick.',
            explanationLabel: 'Quick recap',
          },
        })
      ),
      actions
    );

    if (saved) showContinue(false);
    return { el, header: { title: 'Yesterday’s Flash' } };
  };
})();

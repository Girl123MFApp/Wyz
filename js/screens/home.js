// SCREEN 1 — Home: "What do you want to learn today?"
(function () {
  const App = window.App;
  const { h } = App.dom;
  const icon = App.icon;
  const ui = App.ui;
  const S = App.store;

  function greeting() {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  }

  function LiveSubjectCard(subject) {
    const status = App.plan.subjectStatus(subject.id);
    return h(
      'button',
      { type: 'button', class: 'subject-card subject-live', onClick: () => ui.navigate(`#/learn/${subject.id}`) },
      h(
        'div',
        { class: 'live-top' },
        h('span', { class: 'subject-icon' }, icon(subject.icon)),
        h('span', { class: `status-pill tone-${status.tone}` }, status.label)
      ),
      h('span', { class: 'subject-name' }, subject.name),
      h('span', { class: 'live-label' }, "Today's topic"),
      h('span', { class: 'live-topic' }, status.topic.title),
      h(
        'span',
        { class: 'live-meta' },
        icon('clock'),
        `${status.topic.estimatedReadingTime} min read · Quiz · Bonus`,
        h('span', { class: 'live-go' }, icon('arrowRight'))
      )
    );
  }

  function SoonSubjectCard(subject) {
    return h(
      'button',
      {
        type: 'button',
        class: 'subject-card subject-soon',
        'aria-label': `${subject.name} — coming soon`,
        onClick: () => ui.toast(`${subject.name} is coming soon`),
      },
      h('span', { class: 'subject-icon' }, icon(subject.icon)),
      h('span', { class: 'subject-name' }, subject.name),
      h('span', { class: 'soon-label' }, 'Coming soon')
    );
  }

  // Prototype-only helpers: fast-forward a day to see Yesterday's Flash, or start over.
  function PrototypeTools() {
    const offset = S.get().dayOffset;
    return h(
      'details',
      { class: 'proto-tools' },
      h('summary', null, icon('tool'), 'Prototype tools'),
      h(
        'div',
        { class: 'proto-body' },
        h(
          'p',
          null,
          'App date: ',
          h('strong', null, S.formatDay(S.today())),
          offset ? ` (+${offset} simulated day${offset > 1 ? 's' : ''})` : ''
        ),
        h('p', { class: 'muted' }, 'Simulate the next day to experience Yesterday’s Flash without waiting 24 hours.'),
        h(
          'div',
          { class: 'proto-actions' },
          ui.Button('Simulate next day', {
            variant: 'secondary',
            onClick: () => {
              S.simulateNextDay();
              ui.toast(`It's now ${S.formatDay(S.today(), { weekday: 'long', day: 'numeric', month: 'short' })}`);
              App.router.refresh();
            },
          }),
          ui.Button('Reset all progress', {
            variant: 'ghost',
            onClick: () => {
              if (!window.confirm('Reset all points and progress? This cannot be undone.')) return;
              S.reset();
              ui.toast('Progress reset');
              App.router.refresh();
            },
          })
        )
      )
    );
  }

  App.screens.home = function () {
    const live = App.subjects.filter((s) => App.isSubjectLive(s.id));
    const soon = App.subjects.filter((s) => !App.isSubjectLive(s.id));

    const el = h(
      'div',
      { class: 'screen home' },
      h(
        'div',
        { class: 'home-hero' },
        h('p', { class: 'home-date' }, `${greeting()} · ${S.formatDay(S.today(), { weekday: 'long', day: 'numeric', month: 'long' })}`),
        h('h1', { class: 'home-title' }, 'What do you want to learn today?'),
        h('p', { class: 'home-sub' }, 'One short topic a day. Read, recall, and build your knowledge of India and the world.')
      ),
      h('div', { class: 'subject-live-list' }, live.map(LiveSubjectCard)),
      soon.length ? h('h2', { class: 'section-label' }, 'More subjects') : null,
      h('div', { class: 'subject-grid' }, soon.map(SoonSubjectCard)),
      PrototypeTools()
    );
    return { el };
  };
})();

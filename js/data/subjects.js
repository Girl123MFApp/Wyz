// Subjects shown on the home screen. A subject becomes "live" automatically as soon as
// at least one topic is registered for it — no UI change needed.
(function () {
  const App = window.App;

  App.subjects = [
    { id: 'history', name: 'History', icon: 'landmark', blurb: 'Civilisations, empires and movements' },
    { id: 'polity', name: 'Polity', icon: 'scale', blurb: 'Constitution, rights and governance' },
    { id: 'geography', name: 'Geography', icon: 'globe', blurb: 'Land, rivers and climate' },
    { id: 'economy', name: 'Economy', icon: 'trend', blurb: 'Money, growth and budgets' },
    { id: 'environment', name: 'Environment', icon: 'leaf', blurb: 'Ecology and conservation' },
    { id: 'science-tech', name: 'Science & Technology', icon: 'atom', blurb: 'Discoveries and innovation' },
    { id: 'culture', name: 'Culture', icon: 'palette', blurb: 'Art, music and heritage' },
    { id: 'society', name: 'Society', icon: 'users', blurb: 'People and communities' },
    { id: 'current-affairs', name: 'Current Affairs', icon: 'news', blurb: 'What is happening now' },
  ];

  App.subjectById = (id) => App.subjects.find((s) => s.id === id) || null;
  App.isSubjectLive = (id) => App.topics.bySubject(id).length > 0;
})();

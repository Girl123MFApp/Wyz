// Hash router + app bootstrap. Routes:
//   #/                   Home
//   #/learn/:subject     resolves to the right step (Flash → Topic → Quiz → Bonus → Summary)
//   #/flash/:subject     Yesterday's Flash
//   #/topic/:id          Today's Topic
//   #/quiz/:id           Quick Quiz
//   #/bonus/:id          Bonus Challenge
//   #/summary/:id        Daily Summary
(function () {
  const App = window.App;
  const host = document.getElementById('screen');
  const param = (name) => (m) => ({ [name]: m[1] });

  const routes = [
    { pattern: /^\/?$/, name: 'home', screen: 'home' },
    { pattern: /^\/learn\/([\w-]+)$/, redirect: (m) => App.plan.resolveSubject(m[1]) },
    { pattern: /^\/flash\/([\w-]+)$/, name: 'flash', screen: 'flash', params: param('subject') },
    { pattern: /^\/topic\/([\w-]+)$/, name: 'topic', screen: 'topic', params: param('id') },
    { pattern: /^\/quiz\/([\w-]+)$/, name: 'quiz', screen: 'quiz', params: param('id') },
    { pattern: /^\/bonus\/([\w-]+)$/, name: 'bonus', screen: 'bonus', params: param('id') },
    { pattern: /^\/summary\/([\w-]+)$/, name: 'summary', screen: 'summary', params: param('id') },
  ];

  let current = null;

  function go(hash) {
    if (location.hash === hash) render();
    else location.replace(hash);
  }

  function render() {
    const path = location.hash.replace(/^#/, '') || '/';
    const route = routes.find((r) => r.pattern.test(path));
    if (!route) return go('#/');
    const match = path.match(route.pattern);
    if (route.redirect) return go(route.redirect(match));

    if (current && current.cleanup) current.cleanup();
    current = null;

    const result = App.screens[route.screen](route.params ? route.params(match) : {});
    if (result.redirect) return go(result.redirect);

    window.scrollTo(0, 0);
    App.ui.renderHeader(route.name, result.header);
    host.replaceChildren(result.el);
    host.focus({ preventScroll: true });
    current = result;
    if (result.onMount) result.onMount();
  }

  App.router = { refresh: render };
  App.store.subscribe(() => App.ui.updatePoints());
  window.addEventListener('hashchange', render);
  render();
})();

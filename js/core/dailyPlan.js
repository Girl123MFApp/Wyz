// Decides WHAT the user sees today: today's topic per subject, whether a Yesterday's Flash
// is due, and which step of the daily loop to resume.
(function () {
  const App = window.App;
  const S = App.store;

  const peek = (id) => S.peekTopic(id);
  const isCompleted = (id) => !!(peek(id) && peek(id).completedAt);

  // Pure lookup (no saving) — safe to call while rendering.
  function computeTodaysTopic(subjectId) {
    const planned = (S.get().dailyPlan[S.today()] || {})[subjectId];
    if (planned && App.topics.get(planned)) return App.topics.get(planned);

    const list = App.topics.bySubject(subjectId);
    if (!list.length) return null;
    const next = list.find((t) => !isCompleted(t.id));
    if (next) return next;
    // Every topic in the subject is done: offer the most recent one as a refresher.
    return list.slice().sort((a, b) => peek(b.id).completedAt - peek(a.id).completedAt)[0];
  }

  // Locks in today's topic for a subject so it stays the same all day.
  function todaysTopic(subjectId) {
    const t = computeTodaysTopic(subjectId);
    if (!t) return null;
    const state = S.get();
    const today = S.today();
    state.dailyPlan[today] = state.dailyPlan[today] || {};
    if (state.dailyPlan[today][subjectId] !== t.id) {
      state.dailyPlan[today][subjectId] = t.id;
      S.save();
    }
    return t;
  }

  // A topic finished on an earlier day and shown again today.
  function isRefresher(topicId) {
    const p = peek(topicId);
    return !!(p && p.completedDay && p.completedDay < S.today());
  }

  function lastCompletedBeforeToday() {
    const today = S.today();
    let best = null;
    for (const [id, p] of Object.entries(S.get().topics)) {
      if (!p.completedDay || p.completedDay >= today || !App.topics.get(id)) continue;
      if (!best || p.completedAt > best.p.completedAt) best = { id, p };
    }
    return best;
  }

  // Yesterday's Flash is due when the most recently completed topic (from an earlier day)
  // has a flash question the user hasn't answered yet. First-time users have none.
  function pendingFlash() {
    const last = lastCompletedBeforeToday();
    if (!last) return null;
    const t = App.topics.get(last.id);
    if (!t.yesterdayFlashQuestion || last.p.flash) return null;
    return { topic: t, daysAgo: S.daysBetween(last.p.completedDay, S.today()) };
  }

  // The flash to show on the flash screen: the pending one, or the one already answered today.
  function flashForToday() {
    const pending = pendingFlash();
    if (pending) return pending;
    for (const [id, p] of Object.entries(S.get().topics)) {
      if (p.flash && p.flash.day === S.today() && App.topics.get(id)) {
        return { topic: App.topics.get(id), daysAgo: S.daysBetween(p.completedDay, S.today()) };
      }
    }
    return null;
  }

  // Next unfinished step after the reading for a topic.
  function afterTopicRoute(topicId) {
    const p = peek(topicId);
    if (!p || !p.quizCompletedAt) return `#/quiz/${topicId}`;
    if (!p.bonus.finishedAt) return `#/bonus/${topicId}`;
    return `#/summary/${topicId}`;
  }

  // Where tapping a subject should take the user right now.
  function resolveSubject(subjectId) {
    if (!App.isSubjectLive(subjectId)) return '#/';
    if (pendingFlash()) return `#/flash/${subjectId}`;
    const t = todaysTopic(subjectId);
    const p = peek(t.id);
    if (!p || !p.completedAt || isRefresher(t.id)) return `#/topic/${t.id}`;
    return afterTopicRoute(t.id);
  }

  function subjectStatus(subjectId) {
    const t = computeTodaysTopic(subjectId);
    if (!t) return null;
    const p = peek(t.id);
    const base = { topic: t };
    if (pendingFlash()) return Object.assign(base, { label: "Yesterday's Flash is ready", tone: 'accent' });
    if (isRefresher(t.id)) return Object.assign(base, { label: 'All caught up · Refresher', tone: 'done' });
    if (!p || !p.startedAt) return Object.assign(base, { label: 'New today', tone: 'new' });
    if (!p.completedAt) return Object.assign(base, { label: `In progress · ${App.progress.reading(t.id).percent}%`, tone: 'progress' });
    if (!p.quizCompletedAt) return Object.assign(base, { label: 'Quick Quiz waiting', tone: 'progress' });
    if (!p.bonus.finishedAt) return Object.assign(base, { label: 'Bonus Challenge waiting', tone: 'progress' });
    return Object.assign(base, { label: 'Done for today', tone: 'done' });
  }

  App.plan = {
    computeTodaysTopic,
    todaysTopic,
    isRefresher,
    pendingFlash,
    flashForToday,
    afterTopicRoute,
    resolveSubject,
    subjectStatus,
  };
})();

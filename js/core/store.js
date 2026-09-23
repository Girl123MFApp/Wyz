// Persistent client-side state (localStorage) + the app's notion of "today".
//
// State shape:
// {
//   version, createdAt,
//   dayOffset,                      // prototype-only: simulated days added to the real clock
//   ledger:    { [rewardKey]: { points, day, at, topicId, kind } },   // every point ever awarded
//   topics:    { [topicId]: TopicProgress },
//   dailyPlan: { 'YYYY-MM-DD': { [subjectId]: topicId } }           // today's / yesterday's topic
// }
(function () {
  const App = window.App;
  const KEY = App.config.storageKey;
  const DAY_MS = 24 * 60 * 60 * 1000;
  const listeners = [];

  function defaults() {
    return { version: 1, createdAt: Date.now(), dayOffset: 0, ledger: {}, topics: {}, dailyPlan: {} };
  }

  function freshTopic() {
    return {
      startedAt: null,
      startedDay: null,
      reading: { engagedMs: 0, maxScroll: 0, reachedEnd: false, minTimeMet: false, lastScrollY: 0 },
      quickCheck: null, // { answer, correct, at }
      completedAt: null,
      completedDay: null,
      quiz: { answers: {} }, // { [questionId]: optionIndex }
      quizCompletedAt: null,
      bonus: { answers: {}, finishedAt: null, skipped: false },
      flash: null, // { answer, correct, day, at }
    };
  }

  // Fill in fields added after progress was first saved, so older saves keep working.
  function withDefaults(saved) {
    const base = freshTopic();
    return Object.assign(base, saved, {
      reading: Object.assign(base.reading, saved.reading),
      quiz: Object.assign(base.quiz, saved.quiz),
      bonus: Object.assign(base.bonus, saved.bonus),
    });
  }

  // One-time move of progress saved under an earlier app name.
  function migrateLegacyKey() {
    if (localStorage.getItem(KEY) != null) return;
    for (const oldKey of App.config.legacyStorageKeys || []) {
      const raw = localStorage.getItem(oldKey);
      if (raw == null) continue;
      localStorage.setItem(KEY, raw);
      localStorage.removeItem(oldKey);
      return;
    }
  }

  function load() {
    try {
      migrateLegacyKey();
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 1) return defaults();
      const state = Object.assign(defaults(), parsed);
      for (const id of Object.keys(state.topics)) state.topics[id] = withDefaults(state.topics[id]);
      return state;
    } catch (e) {
      console.warn('[store] could not read saved progress', e);
      return defaults();
    }
  }

  let state = load();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[store] could not save progress', e);
    }
    listeners.forEach((fn) => fn(state));
  }

  // Keep several open tabs in sync so rewards can't be collected twice across tabs.
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return;
    state = load();
    listeners.forEach((fn) => fn(state));
  });

  function dayKey(ms) {
    const d = new Date(ms);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function parseDay(key) {
    const [y, m, d] = key.split('-').map(Number);
    return { y, m, d };
  }

  App.store = {
    get: () => state,
    save,
    subscribe: (fn) => listeners.push(fn),

    topicProgress(id) {
      if (!state.topics[id]) state.topics[id] = freshTopic();
      return state.topics[id];
    },
    peekTopic: (id) => state.topics[id] || null,

    reset() {
      state = defaults();
      save();
    },

    // "Today" respects the simulated day offset so the prototype can fast-forward.
    today: () => dayKey(Date.now() + state.dayOffset * DAY_MS),
    daysBetween(a, b) {
      const A = parseDay(a);
      const B = parseDay(b);
      return Math.round((Date.UTC(B.y, B.m - 1, B.d) - Date.UTC(A.y, A.m - 1, A.d)) / DAY_MS);
    },
    formatDay(key, opts) {
      const { y, m, d } = parseDay(key);
      return new Date(y, m - 1, d).toLocaleDateString('en-IN', opts || { weekday: 'long', day: 'numeric', month: 'long' });
    },
    simulateNextDay() {
      state.dayOffset += 1;
      save();
    },
  };
})();

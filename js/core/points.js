// Points ledger. Every reward has a unique key (e.g. "reading:<topic>", "quiz:<topic>:<question>"),
// and a key can only ever be awarded once — refreshing, revisiting or retrying never pays twice.
// Points are only ever added; nothing in the app subtracts from the ledger.
(function () {
  const App = window.App;
  const S = App.store;

  function award(key, amount, meta) {
    const pts = Math.max(0, Math.round(Number(amount) || 0));
    const ledger = S.get().ledger;
    if (pts === 0 || ledger[key]) return 0;
    ledger[key] = Object.assign({ points: pts, day: S.today(), at: Date.now() }, meta);
    S.save();
    window.dispatchEvent(new CustomEvent('points:awarded', { detail: { amount: pts, key } }));
    return pts;
  }

  function entries() {
    return Object.entries(S.get().ledger).map(([key, e]) => Object.assign({ key }, e));
  }

  App.points = {
    award,
    has: (key) => !!S.get().ledger[key],
    total: () => entries().reduce((sum, e) => sum + e.points, 0),
    // Breakdown for one topic: { reading, quiz, bonus, total }
    forTopic(topicId) {
      const out = { reading: 0, quiz: 0, bonus: 0, total: 0 };
      entries()
        .filter((e) => e.topicId === topicId)
        .forEach((e) => {
          out[e.kind] = (out[e.kind] || 0) + e.points;
          out.total += e.points;
        });
      return out;
    },
  };
})();

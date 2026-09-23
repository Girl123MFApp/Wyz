// Tracks genuine engagement with a lesson:
//  • engaged time — real elapsed time, counted only while the page is visible
//    (a sleeping laptop or background tab doesn't count), saved so it survives leaving
//  • how far through the lesson the reader has been, and whether they reached the end
// Scrolling freely (up, down, re-reading) is fine; time keeps accruing while the lesson is open.
(function () {
  const App = window.App;
  const S = App.store;
  const TICK_MS = 1000;
  const MAX_TICK_MS = 5000; // guards against clock jumps (sleep/resume)
  const SAVE_EVERY_MS = 5000;

  function start({ topicId, lessonEl, endEl, minMs, onChange }) {
    const reading = () => S.topicProgress(topicId).reading;
    let last = Date.now();
    let unsaved = 0;
    let rafPending = false;

    function tick() {
      const now = Date.now();
      const delta = Math.min(now - last, MAX_TICK_MS);
      last = now;
      if (document.visibilityState !== 'visible') return;
      const r = reading();
      r.engagedMs += delta;
      unsaved += delta;
      if (!r.minTimeMet && r.engagedMs >= minMs) {
        r.minTimeMet = true;
        persist();
      } else if (unsaved >= SAVE_EVERY_MS) persist();
      onChange();
    }

    function measure() {
      rafPending = false;
      const r = reading();
      // Recorded while scrolling (not on leave): navigating away can reset the scroll first.
      r.lastScrollY = window.scrollY;
      const rect = lessonEl.getBoundingClientRect();
      const vh = window.innerHeight;
      const frac = rect.height > 0 ? Math.max(0, Math.min(1, (vh - rect.top) / rect.height)) : 1;
      let changed = false;
      if (frac > r.maxScroll + 0.005) {
        r.maxScroll = frac;
        changed = true;
      }
      if (!r.reachedEnd && endEl.getBoundingClientRect().top < vh - 24) {
        r.reachedEnd = true;
        r.maxScroll = 1;
        persist();
        changed = true;
      }
      if (changed) onChange();
    }

    function onScroll() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(measure);
    }

    function persist() {
      unsaved = 0;
      S.save();
    }

    function onVisibility() {
      if (document.visibilityState === 'visible') last = Date.now(); // don't count time away
      else persist();
    }

    const timer = setInterval(tick, TICK_MS);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', persist);
    measure();

    return {
      stop() {
        clearInterval(timer);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('pagehide', persist);
        persist();
      },
    };
  }

  App.readingTracker = { start };
})();

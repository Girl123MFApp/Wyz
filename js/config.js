// Global app settings. Everything tunable lives here so screens never hard-code rules.
window.App = window.App || {};

App.config = {
  appName: 'Wyz',
  brandMark: 'W',
  tagline: 'Know India, one day at a time',
  storageKey: 'wyz.progress.v1',
  legacyStorageKeys: ['jigyasa.progress.v1'], // progress saved under the app's earlier name

  // Reading-completion rule: minimum engaged time on the lesson before the Quick Check unlocks.
  minReadingSeconds: 60,

  // Default point values. A topic or question can override these with its own `points` field.
  points: {
    reading: 5,      // completing the Topic of the Day (awarded once per topic)
    quizCorrect: 5,  // each correct Quick Quiz answer
    bonusCorrect: 5, // each correct Bonus Challenge answer (additive only)
  },
};

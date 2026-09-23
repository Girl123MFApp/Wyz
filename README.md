# Wyz — daily learning prototype

A mobile-first daily-learning app for Indian citizens. This prototype runs the full daily loop for one topic, the Indus Valley Civilization.

**Run it:** double-click `index.html`. It needs no install, no build step and no server. Progress is saved in the browser's localStorage.

**Try the next-day flow:** on Home, open **Prototype tools**, then **Simulate next day**. The Daily Summary also has a "Simulate tomorrow →" link.

## Structure

```
index.html                 loads the scripts in order
css/styles.css             design tokens (light and dark) and all styles
js/config.js               app name, 60-second reading rule, point values
js/data/topicRegistry.js   App.topics.register / get / bySubject
js/data/subjects.js        home-screen subjects (a subject goes live once it has a topic)
js/data/topics/*.js        one file per topic (the content)
js/data/geo/south-asia.js  base map geography: coastline, borders, rivers (as [lon, lat])
js/core/store.js           localStorage state and "today" (with the simulated-day offset)
js/core/points.js          points ledger (each reward key pays only once, never subtracts)
js/core/progress.js        learning rules: completion conditions, answer locking, scores
js/core/dailyPlan.js       today's topic, Yesterday's Flash eligibility, resume routing
js/core/readingTracker.js  engaged-time and scroll tracking for the lesson
js/ui/components.js        shared UI: MCQ, section cards, layer tags, header, toasts
js/ui/siteMap.js           inline SVG site map for `{ type: 'map' }` lesson blocks
js/screens/*.js            home, flash, topic, quiz, bonus, summary
js/app.js                  hash router
```

## Adding a topic

1. Copy `js/data/topics/indus-valley-civilization.js` to `js/data/topics/<new-id>.js`.
2. Change `id`, `title`, `subject` and `metadata.sequence` (its teaching order within the subject), then replace the content and questions. `correctAnswer` is the 0-based index of the right option.
3. Add `<script src="js/data/topics/<new-id>.js"></script>` to `index.html`, below the other topic scripts.

No UI changes are needed. The first topic registered for a subject makes that subject live on Home. Open the browser console to see warnings about malformed topics.

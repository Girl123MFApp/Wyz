// Topic registry. Each topic file calls App.topics.register({...}); the UI only ever reads from here.
(function () {
  const App = window.App;
  const byId = {};
  const list = [];

  const REQUIRED = ['id', 'title', 'subject', 'introduction', 'sections', 'quickCheck', 'quizQuestions'];

  function checkQuestion(topicId, label, q) {
    if (!q) return;
    const ok =
      q.id && q.question && Array.isArray(q.options) && q.options.length >= 2 &&
      Number.isInteger(q.correctAnswer) && q.correctAnswer >= 0 && q.correctAnswer < q.options.length;
    if (!ok) console.warn(`[topics] ${topicId}: ${label} is malformed`, q);
  }

  function register(topic) {
    const missing = REQUIRED.filter((k) => topic[k] == null);
    if (missing.length) {
      console.warn(`[topics] "${topic.id}" is missing: ${missing.join(', ')} — skipped`);
      return;
    }
    if (byId[topic.id]) console.warn(`[topics] duplicate id "${topic.id}" — replacing`);
    checkQuestion(topic.id, 'quickCheck', topic.quickCheck);
    checkQuestion(topic.id, 'yesterdayFlashQuestion', topic.yesterdayFlashQuestion);
    topic.quizQuestions.forEach((q, i) => checkQuestion(topic.id, `quizQuestions[${i}]`, q));
    (topic.bonusQuestions || []).forEach((q, i) => checkQuestion(topic.id, `bonusQuestions[${i}]`, q));

    topic.bonusQuestions = topic.bonusQuestions || [];
    topic.keyFacts = topic.keyFacts || [];
    topic.metadata = topic.metadata || {};
    byId[topic.id] = topic;
    list.push(topic);
  }

  const sequence = (t) => t.metadata.sequence || 0;

  App.topics = {
    register,
    get: (id) => byId[id] || null,
    all: () => list.slice(),
    // Topics for a subject in teaching order (metadata.sequence).
    bySubject: (subjectId) => list.filter((t) => t.subject === subjectId).sort((a, b) => sequence(a) - sequence(b)),
  };
})();

// SCREEN 3 — Today's Topic: the lesson, engagement tracking, Quick Check and completion.
//
// Completion stages (rendered below the lesson):
//   reading  → still reading (nothing shown)
//   wait     → reached the end, but under the minimum engaged time: gentle "take a little more time"
//   check    → both conditions met: Quick Check appears
//   complete → Quick Check answered: "Topic Complete! +5 points"
(function () {
  const App = window.App;
  const { h, rich } = App.dom;
  const icon = App.icon;
  const ui = App.ui;
  const S = App.store;
  const P = App.progress;

  App.screens.topic = function ({ id }) {
    const topic = App.topics.get(id);
    if (!topic) return { redirect: '#/' };

    P.markStarted(id);
    const subject = App.subjectById(topic.subject);
    const minMs = App.config.minReadingSeconds * 1000;
    const prog = () => S.topicProgress(id);
    const refresher = App.plan.isRefresher(id);

    // ----- Sticky learning-progress strip (no countdown, just a calm percentage) -----
    const bar = ui.ProgressBar(0);
    const pctEl = h('span', { class: 'lp-pct' });
    const hintEl = h('span', { class: 'lp-hint' });
    const strip = h(
      'div',
      { class: 'learn-progress', role: 'status', 'aria-live': 'off' },
      h('div', { class: 'lp-row' }, h('span', { class: 'lp-label' }, 'Learning progress ', pctEl), hintEl),
      bar.el
    );

    // ----- Lesson -----
    const hero = h(
      'section',
      { class: 'topic-hero' },
      h('div', { class: 'intro-tags' }, ui.LayerTag('learn'), h('span', { class: 'eyebrow' }, refresher ? 'Refresher' : 'Today’s Topic')),
      h('h1', { class: 'topic-title' }, topic.title),
      h(
        'div',
        { class: 'topic-meta' },
        icon('clock'),
        h('span', null, `${topic.estimatedReadingTime} min read`),
        h('span', { class: 'dot' }),
        h('span', null, `${topic.sections.length} short sections`),
        h('span', { class: 'dot' }),
        h('span', null, subject ? subject.name : '')
      ),
      h('p', { class: 'topic-intro' }, rich(topic.introduction))
    );

    const refresherNote = refresher
      ? h(
          'div',
          { class: 'note' },
          icon('check'),
          h('span', null, `You completed this topic on ${S.formatDay(prog().completedDay, { day: 'numeric', month: 'long' })}. New ${subject ? subject.name : ''} topics are coming soon — enjoy a refresher in the meantime.`)
        )
      : null;

    const lesson = h('div', { class: 'lesson' }, ui.KeyFacts(topic.keyFacts), topic.sections.map(ui.SectionCard));
    const endMarker = h('div', { class: 'lesson-end' }, h('span', { class: 'rule' }), h('span', null, 'End of lesson'), h('span', { class: 'rule' }));
    const zone = h('div', { class: 'completion-zone' });

    const el = h('div', { class: 'screen topic' }, strip, hero, refresherNote, lesson, endMarker, zone);

    // ----- Completion zone -----
    let stage = null;
    let waitBar = null;
    let tracker = null;

    function computeStage() {
      const p = prog();
      if (p.completedAt) return 'complete';
      if (p.reading.reachedEnd && p.reading.minTimeMet) return 'check';
      if (p.reading.reachedEnd) return 'wait';
      return 'reading';
    }

    function hintFor(stageName, r) {
      if (stageName === 'complete') return 'Topic complete ✓';
      if (stageName === 'check') return 'Ready for your Quick Check';
      if (stageName === 'wait') return 'Take a moment to review';
      if (r.minTimeMet) return 'Quick Check is at the end';
      return 'Keep reading…';
    }

    function WaitCard() {
      waitBar = ui.ProgressBar(P.reading(id).timeFrac, 'bar-soft');
      return h(
        'section',
        { class: 'card wait-card anim-in' },
        h('span', { class: 'wait-icon' }, icon('book')),
        h('h2', { class: 'card-title' }, 'You’ve reached the end'),
        h('p', { class: 'muted' }, 'Take a little more time to review what you’ve learned.'),
        waitBar.el,
        h('p', { class: 'small muted' }, 'Your Quick Check will appear here shortly. Feel free to scroll back to any section.')
      );
    }

    function QuickCheckCard() {
      const saved = prog().quickCheck;
      return h(
        'section',
        { class: 'card quick-check' + (saved ? '' : ' anim-in') },
        h(
          'div',
          { class: 'qc-head' },
          h('span', { class: 'qc-icon' }, icon('spark')),
          h('div', null, h('h2', { class: 'card-title' }, 'Quick Check'), h('p', { class: 'muted' }, 'Before you move on, let’s see what you remember.')),
          h('span', { class: 'chip' }, 'Not scored')
        ),
        ui.MCQ({
          question: topic.quickCheck,
          selected: saved ? saved.answer : null,
          onSelect: onQuickCheckAnswer,
          labels: {
            correctSub: 'You’ve understood the key idea.',
            showCorrectAnswer: false,
            explanationLabel: 'Key idea:',
            explanationOn: 'incorrect',
          },
        })
      );
    }

    function CompleteCard(animate) {
      const p = prog();
      const earned = App.points.has(`reading:${id}`);
      const quizDone = !!p.quizCompletedAt;
      let action;
      if (refresher) action = ui.Button('Back to Home', { onClick: () => ui.navigate('#/') });
      else if (!quizDone) action = ui.Button('Take the Quick Quiz →', { onClick: () => ui.navigate(`#/quiz/${id}`) });
      else action = ui.Button('Continue →', { onClick: () => ui.navigate(App.plan.afterTopicRoute(id)) });

      return h(
        'section',
        { class: 'card complete-card' + (animate ? ' pop-in' : '') },
        h('span', { class: 'complete-badge' }, icon('check')),
        h('h2', { class: 'complete-title' }, 'Topic Complete!'),
        earned ? h('div', { class: 'points-earned' }, icon('star'), `+${App.points.forTopic(id).reading} points`) : null,
        h('p', { class: 'muted' }, refresher || quizDone ? 'Nicely done. Your reading points are safely banked.' : 'Next: 3 quick questions to lock in what you learned.'),
        action
      );
    }

    function onQuickCheckAnswer(choice) {
      P.answerQuickCheck(id, choice);
      P.completeTopic(id); // awards +5 once, only if all three conditions are met
      if (tracker) {
        tracker.stop();
        tracker = null;
      }
      stage = 'complete';
      const card = CompleteCard(true);
      zone.appendChild(card);
      update();
      setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 450);
    }

    function renderZone() {
      waitBar = null;
      zone.replaceChildren();
      if (stage === 'wait') zone.append(WaitCard());
      else if (stage === 'check') zone.append(QuickCheckCard());
      else if (stage === 'complete') zone.append(QuickCheckCard(), CompleteCard(false));
    }

    function update() {
      const r = P.reading(id);
      bar.fill.style.width = `${r.percent}%`;
      pctEl.textContent = `${r.percent}%`;
      const next = computeStage();
      if (next !== stage) {
        stage = next;
        renderZone();
      }
      strip.classList.toggle('is-done', stage === 'complete' || stage === 'check');
      hintEl.textContent = hintFor(stage, r);
      if (waitBar) waitBar.fill.style.width = `${Math.round(r.timeFrac * 100)}%`;
    }

    function onMount() {
      update();
      if (prog().completedAt) return;
      const y = prog().reading.lastScrollY;
      if (y > 0) window.scrollTo(0, y); // pick up where the reader left off
      tracker = App.readingTracker.start({ topicId: id, lessonEl: lesson, endEl: endMarker, minMs, onChange: update });
    }

    function cleanup() {
      if (tracker) tracker.stop();
    }

    return { el, onMount, cleanup, header: { title: subject ? subject.name : '' } };
  };
})();

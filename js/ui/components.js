// Reusable UI building blocks shared by every screen.
(function () {
  const App = window.App;
  const { h, rich } = App.dom;
  const icon = App.icon;
  const ui = (App.ui = App.ui || {});
  App.screens = App.screens || {};

  ui.navigate = (hash) => {
    location.hash = hash;
  };

  // ---------- Buttons & labels ----------

  ui.Button = function (label, { variant = 'primary', onClick, block = true, iconLeft } = {}) {
    return h(
      'button',
      { type: 'button', class: `btn btn-${variant}${block ? ' btn-block' : ''}`, onClick },
      iconLeft ? icon(iconLeft) : null,
      h('span', null, label)
    );
  };

  // The four learning layers, kept visually distinct across the app.
  const LAYERS = {
    learn: 'Learn',
    recall: 'Recall',
    remember: 'Remember',
    deepen: 'Deepen',
  };
  ui.LayerTag = (layer) => h('span', { class: `layer-tag layer-${layer}` }, h('span', { class: 'layer-dot' }), LAYERS[layer]);

  ui.ScreenIntro = ({ layer, eyebrow, title, subtitle, note }) =>
    h(
      'header',
      { class: 'screen-intro' },
      h('div', { class: 'intro-tags' }, layer ? ui.LayerTag(layer) : null, eyebrow ? h('span', { class: 'eyebrow' }, eyebrow) : null),
      h('h1', { class: 'screen-title' }, title),
      subtitle ? h('p', { class: 'screen-sub' }, subtitle) : null,
      note ? h('div', { class: 'intro-note' }, icon('shield'), h('span', null, note)) : null
    );

  ui.ProgressBar = (fraction, cls) => {
    const fill = h('div', { class: 'bar-fill' });
    fill.style.width = `${Math.round(Math.max(0, Math.min(1, fraction)) * 100)}%`;
    return { el: h('div', { class: 'bar' + (cls ? ' ' + cls : '') }, fill), fill };
  };

  ui.Steps = (questions, currentIndex, answers) =>
    h(
      'div',
      { class: 'steps', 'aria-hidden': 'true' },
      questions.map((q, i) => {
        const a = answers[q.id];
        const state = a == null ? (i === currentIndex ? 'current' : 'todo') : a === q.correctAnswer ? 'ok' : 'no';
        return h('span', { class: `step step-${state}` });
      })
    );

  // ---------- Lesson content ----------

  ui.Block = function (block) {
    if (block.type === 'p') return h('p', { class: 'lesson-p' }, rich(block.text));
    if (block.type === 'list') return h('ul', { class: 'lesson-list' }, block.items.map((t) => h('li', null, rich(t))));
    if (block.type === 'map') return ui.SiteMap(block);
    if (block.type === 'callout') {
      const debated = block.variant === 'debated';
      return h(
        'aside',
        { class: `callout callout-${debated ? 'debated' : 'key'}` },
        h('div', { class: 'callout-label' }, icon(debated ? 'help' : 'bulb'), debated ? 'Still debated' : 'Key idea'),
        h('p', null, rich(block.text))
      );
    }
    console.warn('[ui] unknown block type', block);
    return null;
  };

  ui.SectionCard = (section, index) =>
    h(
      'section',
      { class: 'lesson-section', id: `sec-${section.id}` },
      h(
        'div',
        { class: 'sec-head' },
        h('span', { class: 'sec-num' }, String(index + 1).padStart(2, '0')),
        h('h2', { class: 'sec-title' }, section.title)
      ),
      section.blocks.map(ui.Block)
    );

  ui.KeyFacts = (facts) =>
    facts.length
      ? h(
          'div',
          { class: 'key-facts' },
          h('div', { class: 'key-facts-label' }, 'At a glance'),
          h('div', { class: 'key-facts-grid' }, facts.map((f) => h('div', { class: 'fact' }, h('span', { class: 'fact-label' }, f.label), h('span', { class: 'fact-value' }, f.value))))
        )
      : null;

  // ---------- Multiple-choice question (used by Flash, Quick Check, Quiz and Bonus) ----------
  //
  // question:  { question, options, correctAnswer, explanation (string | string[]) }
  // selected:  previously saved answer index, or null
  // onSelect:  (index, isCorrect) => void   — called once; persist + award there
  // pointsFor: () => number                 — points to show as earned for this question
  // labels:    wording for the feedback panel
  ui.MCQ = function ({ question, selected = null, onSelect, pointsFor, labels = {} }) {
    const L = Object.assign(
      {
        correct: 'Correct!',
        correctSub: null,
        incorrect: 'Not quite.',
        incorrectSub: null,
        showCorrectAnswer: true,
        explanationLabel: 'Why?',
        explanationOn: 'always', // 'always' | 'incorrect'
      },
      labels
    );
    let answer = selected;

    const buttons = question.options.map((opt, i) =>
      h(
        'button',
        { type: 'button', class: 'mcq-option', onClick: () => choose(i) },
        h('span', { class: 'mcq-letter' }, 'ABCDEF'[i]),
        h('span', { class: 'mcq-text' }, opt),
        h('span', { class: 'mcq-mark' })
      )
    );
    const feedbackHost = h('div', { class: 'mcq-feedback-host', 'aria-live': 'polite' });
    const root = h(
      'div',
      { class: 'mcq' },
      h('h2', { class: 'mcq-question' }, question.question),
      h('div', { class: 'mcq-options', role: 'group', 'aria-label': 'Answer options' }, buttons),
      feedbackHost
    );

    function choose(i) {
      if (answer != null) return;
      answer = i;
      if (onSelect) onSelect(i, i === question.correctAnswer);
      paint(true);
    }

    function paint(animate) {
      const answered = answer != null;
      root.classList.toggle('is-answered', answered);
      buttons.forEach((btn, i) => {
        btn.disabled = answered;
        const isCorrect = answered && i === question.correctAnswer;
        const isWrong = answered && i === answer && i !== question.correctAnswer;
        btn.classList.toggle('is-correct', isCorrect);
        btn.classList.toggle('is-wrong', isWrong);
        btn.classList.toggle('is-dim', answered && !isCorrect && !isWrong);
        const mark = btn.querySelector('.mcq-mark');
        mark.replaceChildren(isCorrect ? icon('check') : isWrong ? icon('x') : '');
      });
      if (!answered) return;

      const ok = answer === question.correctAnswer;
      const pts = ok && pointsFor ? pointsFor() : 0;
      const lines = [].concat(question.explanation || []);
      const showExpl = lines.length && (L.explanationOn === 'always' || !ok);
      feedbackHost.replaceChildren(
        h(
          'div',
          { class: `feedback ${ok ? 'feedback-ok' : 'feedback-no'}${animate ? ' anim-in' : ''}` },
          h(
            'div',
            { class: 'feedback-head' },
            h('span', { class: 'feedback-icon' }, icon(ok ? 'check' : 'bulb')),
            h('span', { class: 'feedback-title' }, ok ? L.correct : L.incorrect),
            pts ? h('span', { class: 'points-chip' }, `+${pts} points`) : null
          ),
          (ok ? L.correctSub : L.incorrectSub) ? h('p', { class: 'feedback-sub' }, ok ? L.correctSub : L.incorrectSub) : null,
          !ok && L.showCorrectAnswer
            ? h('p', { class: 'feedback-answer' }, h('span', { class: 'feedback-label' }, 'Correct answer: '), question.options[question.correctAnswer])
            : null,
          showExpl
            ? h('div', { class: 'feedback-expl' }, h('span', { class: 'feedback-label' }, L.explanationLabel), lines.map((line) => h('p', null, rich(line))))
            : null
        )
      );
    }

    paint(false);
    return root;
  };

  // ---------- Header, points & toasts ----------

  function pointsPill() {
    return h(
      'div',
      { class: 'points-pill', title: 'Total points', 'aria-label': 'Total points' },
      icon('star'),
      h('span', { class: 'points-value', id: 'points-value' }, String(App.points.total())),
      h('span', { class: 'points-unit' }, 'pts')
    );
  }

  ui.renderHeader = function (routeName, opts = {}) {
    const host = document.getElementById('app-header');
    const left =
      routeName === 'home'
        ? h('a', { class: 'brand', href: '#/' }, h('span', { class: 'brand-mark' }, App.config.brandMark), h('span', { class: 'brand-name' }, App.config.appName))
        : h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Back to home', onClick: () => ui.navigate('#/') }, icon('arrowLeft'));
    host.replaceChildren(
      h('div', { class: 'header-inner' }, left, routeName === 'home' ? null : h('span', { class: 'header-title' }, opts.title || ''), pointsPill())
    );
  };

  ui.updatePoints = function () {
    const el = document.getElementById('points-value');
    if (!el) return;
    const total = String(App.points.total());
    if (el.textContent !== total) el.textContent = total;
  };

  ui.toast = function (text, variant = 'default') {
    const host = document.getElementById('toast-host');
    const t = h('div', { class: `toast toast-${variant}` }, variant === 'points' ? icon('star') : null, h('span', null, text));
    host.appendChild(t);
    setTimeout(() => t.classList.add('out'), 1900);
    setTimeout(() => t.remove(), 2300);
  };

  window.addEventListener('points:awarded', (e) => {
    ui.toast(`+${e.detail.amount} points`, 'points');
    const pill = document.querySelector('.points-pill');
    if (pill) {
      pill.classList.remove('bump');
      void pill.offsetWidth; // restart the animation
      pill.classList.add('bump');
    }
  });

  // Gently counts a number up (respects reduced-motion).
  ui.countUp = function (el, to, prefix = '') {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || to <= 0) {
      el.textContent = prefix + to;
      return;
    }
    const start = performance.now();
    const dur = 700;
    function frame(now) {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = prefix + Math.round(to * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };
})();

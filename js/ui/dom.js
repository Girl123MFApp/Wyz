// Tiny DOM helpers. `h` builds elements; `rich` turns "**bold**" markers into <strong>.
(function () {
  const App = window.App;

  function h(tag, props, ...children) {
    const el = document.createElement(tag);
    if (props) {
      for (const [key, value] of Object.entries(props)) {
        if (value == null || value === false) continue;
        if (key === 'class') el.className = value;
        else if (key === 'html') el.innerHTML = value; // trusted strings only (icons)
        else if (key.startsWith('on') && typeof value === 'function') {
          el.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (value === true) el.setAttribute(key, '');
        else el.setAttribute(key, value);
      }
    }
    append(el, children);
    return el;
  }

  function append(el, children) {
    for (const child of children.flat(Infinity)) {
      if (child == null || child === false) continue;
      el.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return el;
  }

  function rich(text) {
    const frag = document.createDocumentFragment();
    String(text)
      .split(/(\*\*[^*]+\*\*)/g)
      .forEach((part) => {
        if (!part) return;
        if (part.startsWith('**') && part.endsWith('**')) frag.appendChild(h('strong', null, part.slice(2, -2)));
        else frag.appendChild(document.createTextNode(part));
      });
    return frag;
  }

  App.dom = { h, append, rich };
})();

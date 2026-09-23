// Inline SVG site map (no libraries). Rendered for lesson blocks of type 'map':
// {
//   type: 'map', title, caption,
//   base: 'southAsia',                              // key into App.geo
//   bounds: { west, east, south, north },           // degrees
//   rivers: ['indus', ...],                         // which base rivers to draw
//   sites: [{ name, location, river, lat, lon }],
// }
// Tapping, hovering or focusing a marker shows the site's name.
(function () {
  const App = window.App;
  const { h } = App.dom;
  const ui = App.ui;
  const NS = 'http://www.w3.org/2000/svg';
  const WIDTH = 500; // viewBox width; the SVG scales to the column

  function s(tag, attrs, ...children) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) if (v != null) el.setAttribute(k, v);
    for (const c of children.flat()) if (c != null) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    return el;
  }

  const round = (n) => Math.round(n * 10) / 10;

  // Equirectangular projection, corrected for latitude at the centre of the frame.
  function projection(b) {
    const k = Math.cos((((b.north + b.south) / 2) * Math.PI) / 180);
    const scale = WIDTH / ((b.east - b.west) * k);
    return {
      width: WIDTH,
      height: round((b.north - b.south) * scale),
      xy: ([lon, lat]) => [round((lon - b.west) * k * scale), round((b.north - lat) * scale)],
    };
  }

  const pathD = (points, proj, close) =>
    points.map((p, i) => (i ? 'L' : 'M') + proj.xy(p).join(' ')).join('') + (close ? 'Z' : '');

  function textAt(proj, at, text, cls, anchor) {
    const [x, y] = proj.xy(at);
    return s('text', { x, y, class: cls, 'text-anchor': anchor || 'middle' }, text);
  }

  ui.SiteMap = function (block) {
    const geo = App.geo && App.geo[block.base];
    if (!geo) {
      console.warn('[map] unknown base geography', block.base);
      return null;
    }
    const proj = projection(block.bounds);
    const rivers = (block.rivers || Object.keys(geo.rivers)).map((id) => geo.rivers[id]).filter(Boolean);
    const titleId = 'map-' + Math.random().toString(36).slice(2, 8);

    const sites = block.sites.map((site) => {
      const [x, y] = proj.xy([site.lon, site.lat]);
      const detail = [site.location, site.river].filter(Boolean).join(' · ');
      const g = s(
        'g',
        { class: 'map-site', transform: `translate(${x} ${y})`, tabindex: '0', role: 'button', 'aria-label': `${site.name} — ${detail}` },
        s('circle', { class: 'map-site-hit', r: 13 }),
        s('circle', { class: 'map-site-ring', r: 10 }),
        s('circle', { class: 'map-site-dot', r: 5.5 })
      );
      return { site, detail, g };
    });

    const svg = s(
      'svg',
      { class: 'map-svg', viewBox: `0 0 ${proj.width} ${proj.height}`, role: 'group', 'aria-labelledby': titleId },
      s('title', { id: titleId }, block.title || 'Map'),
      s('rect', { class: 'map-sea', width: proj.width, height: proj.height }),
      s('path', { class: 'map-land', d: pathD(geo.land, proj, true) }),
      geo.marsh ? s('path', { class: 'map-marsh', d: pathD(geo.marsh.path, proj, true) }) : null,
      geo.borders.map((b) => s('path', { class: 'map-border', d: pathD(b, proj) })),
      rivers.map((r) => s('path', { class: `map-river${r.major ? ' is-major' : ''}${r.ancient ? ' is-ancient' : ''}`, d: pathD(r.path, proj) })),
      geo.labels.map((l) => textAt(proj, l.at, l.text, `map-label map-label-${l.kind}`)),
      geo.marsh && geo.marsh.label ? textAt(proj, geo.marsh.label.at, geo.marsh.label.text, 'map-label map-label-marsh') : null,
      rivers.filter((r) => r.label).map((r) => textAt(proj, r.label.at, r.name, 'map-label map-label-river', r.label.anchor)),
      sites.map((e) => e.g)
    );

    const tip = h('div', { class: 'map-tip', 'aria-hidden': 'true' });
    const frame = h('div', { class: 'map-frame' }, svg, tip);
    let active = null;
    let pinned = false;

    function show(entry, pin) {
      if (active && active !== entry) active.g.classList.remove('is-active');
      active = entry;
      pinned = pin;
      entry.g.classList.add('is-active');

      tip.replaceChildren(h('strong', null, entry.site.name), h('span', null, entry.detail));
      tip.classList.add('is-visible');
      const fr = frame.getBoundingClientRect();
      const dot = entry.g.querySelector('.map-site-dot').getBoundingClientRect();
      const cx = dot.left + dot.width / 2 - fr.left;
      const left = Math.max(6, Math.min(fr.width - tip.offsetWidth - 6, cx - tip.offsetWidth / 2));
      let top = dot.top - fr.top - tip.offsetHeight - 10;
      const below = top < 4;
      if (below) top = dot.bottom - fr.top + 10;
      tip.style.left = `${left}px`;
      tip.style.top = `${top}px`;
      tip.style.setProperty('--arrow-x', `${cx - left}px`);
      tip.classList.toggle('is-below', below);
    }

    function hide() {
      if (active) active.g.classList.remove('is-active');
      active = null;
      pinned = false;
      tip.classList.remove('is-visible');
    }

    sites.forEach((entry) => {
      const { g } = entry;
      g.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'mouse' && !pinned) show(entry, false);
      });
      g.addEventListener('pointerleave', (e) => {
        if (e.pointerType === 'mouse' && !pinned) hide();
      });
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        if (active === entry && pinned) hide();
        else show(entry, true);
      });
      g.addEventListener('focus', () => {
        if (active !== entry) show(entry, false);
      });
      g.addEventListener('blur', () => {
        if (active === entry) hide();
      });
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hide();
        else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (active === entry && pinned) hide();
          else show(entry, true);
        }
      });
    });
    frame.addEventListener('click', hide); // tapping empty map closes the label
    function onResize() {
      if (!frame.isConnected) window.removeEventListener('resize', onResize);
      else hide();
    }
    window.addEventListener('resize', onResize, { passive: true });

    const hasAncient = rivers.some((r) => r.ancient);
    return h(
      'figure',
      { class: 'map-figure' },
      frame,
      h(
        'div',
        { class: 'map-legend' },
        h('span', { class: 'legend-item' }, h('span', { class: 'legend-dot' }), 'Harappan site'),
        h('span', { class: 'legend-item' }, h('span', { class: 'legend-line' }), 'River'),
        hasAncient ? h('span', { class: 'legend-item' }, h('span', { class: 'legend-line is-ancient' }), 'Dry river bed') : null
      ),
      block.caption ? h('figcaption', { class: 'map-caption' }, block.caption) : null
    );
  };
})();

(function () {
  const C = window.CAFE, B = C.builder, L = C.loyalty, S = window.Store, A = window.Art;
  const clean = (a) => a.flat(Infinity).filter((c) => c !== null && c !== undefined && c !== false);
  const el = (tag, attrs, ...kids) => {
    const n = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') n.className = v;
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    });
    clean(kids).forEach((c) => n.append(c.nodeType ? c : document.createTextNode(String(c))));
    return n;
  };
  const html = (tag, cls, markup) => { const n = el(tag, { class: cls, 'aria-hidden': 'true' }); n.innerHTML = markup; return n; };
  const rupee = (n) => `\u20B9${n}`;
  const digits = (s) => String(s || '').replace(/\D/g, '');
  const wa = (msg) => `https://wa.me/${digits(C.whatsapp)}?text=${encodeURIComponent(msg)}`;
  const tel = `tel:${C.phone.replace(/[^\d+]/g, '')}`;
  const place = `${C.address}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
  const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  const goTo = (id) => { const t = document.getElementById(id); if (t && t.scrollIntoView) t.scrollIntoView({ behavior: 'smooth' }); };
  const focusK = (k) => { const b = [...document.querySelectorAll('[data-k]')].find((x) => x.dataset.k === k); if (b) b.focus(); };
  const EYE = { why: 'Why choose us', menu: 'Fresh from the bar', recommend: 'Find your drink', build: 'Make it yours', rewards: 'Brew & Bloom rewards', gallery: 'Gallery', reviews: 'Guest love', visit: 'Find us', contact: 'Get in touch' };
  const section = (id, title, intro, cls, ...kids) =>
    el('section', { id, class: `sec ${cls || ''}` }, el('div', { class: 'wrap' }, EYE[id] ? el('p', { class: 'eyebrow line' }, EYE[id]) : null, el('h2', {}, title), intro ? el('p', { class: 'intro' }, intro) : null, ...kids));
  const blk = (label, val) => el('div', { class: 'blk' }, el('small', {}, label), el('p', {}, val));

  const toastEl = el('div', { class: 'toast', role: 'status', 'aria-live': 'polite' });
  let toastT;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), 2200); };

  // ---- real photos: show the photo if the file exists, otherwise the drawing ----
  const P = C.photos || {};
  const photoCache = {};
  const probe = (url, ok) => {
    if (photoCache[url] === false) return;
    if (photoCache[url]) { ok(url); return; }
    const im = new Image();
    im.onload = () => { photoCache[url] = true; ok(url); };
    im.onerror = () => { photoCache[url] = false; };
    im.src = url;
  };
  const photoUrl = (it) => it.photo || `${P.menuDir || 'images/menu/'}${it.id}.${P.ext || 'jpg'}`;
  const visual = (it, cls) => {
    const box = it.art ? html('div', cls, A.render(it.art)) : el('div', { class: `${cls} food`, 'aria-hidden': 'true' }, it.emoji);
    probe(photoUrl(it), (url) => { box.classList.add('photo'); box.replaceChildren(el('img', { src: url, alt: '', loading: 'lazy' })); });
    return box;
  };
  let lastFocus = null, lbKey = null;

  // ---- search-engine data ----
  document.title = `${C.name} | ${C.type} on ${C.area}, ${C.city}`;
  const desc = `${C.name} is a ${C.type.toLowerCase()} on ${C.area}, ${C.city}. ${C.tagline}`;
  const setMeta = (sel, v) => { const m = document.querySelector(sel); if (m) m.setAttribute('content', v); };
  setMeta('meta[name=description]', desc); setMeta('meta[property="og:title"]', document.title); setMeta('meta[property="og:description"]', desc);
  const ld = { '@context': 'https://schema.org', '@type': 'CafeOrCoffeeShop', name: C.name, description: desc, telephone: C.phone,
    address: { '@type': 'PostalAddress', streetAddress: C.area, addressLocality: C.city, addressCountry: 'IN' }, servesCuisine: 'Coffee, tea, matcha, snacks and desserts' };
  document.head.append(el('script', { type: 'application/ld+json' }, JSON.stringify(ld)));

  // ---- header ----
  const countEl = el('span', { class: 'count' }, '0');
  const cartBtn = el('button', { class: 'cart-btn', 'aria-label': 'Open cart', onclick: () => openCart() }, 'Cart', countEl);
  const close = () => nav.classList.remove('open');
  const galleryLink = el('a', { href: '#gallery', hidden: true, onclick: close }, 'Gallery');
  const link = ([id, t]) => el('a', { href: `#${id}`, onclick: close }, t);
  const nav = el('nav', { id: 'nav', 'aria-label': 'Main' }, [['about', 'About'], ['menu', 'Menu'], ['build', 'Build a drink'], ['rewards', 'Rewards']].map(link), galleryLink, [['visit', 'Visit'], ['contact', 'Contact']].map(link));
  const toggle = el('button', { class: 'menu-btn', 'aria-label': 'Toggle menu', 'aria-expanded': 'false', onclick: () => {
    const o = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(o)); } }, 'Menu');
  const book = el('a', { class: 'btn primary small book', href: wa(`Hi ${C.name}! I would like to book a table.`), target: '_blank', rel: 'noreferrer' }, 'Book a table');
  const header = el('header', { class: 'head' }, el('a', { class: 'brand', href: '#top' }, html('span', 'logo', FLOWER('#c9954a')), C.name), nav, book, cartBtn, toggle);

  function FLOWER(c) {
    const p = [0, 72, 144, 216, 288].map((r) => `<ellipse cx="50" cy="24" rx="12" ry="21" transform="rotate(${r} 50 50)"/>`).join('');
    return `<svg viewBox="0 0 100 100" class="flower"><g fill="${c}">${p}</g><circle cx="50" cy="50" r="10" fill="#f2b84b"/></svg>`;
  }

  // ---- hero ----
  const allItems = C.menu.flatMap((c) => c.items);
  const collage = el('div', { class: 'collage' }, ['cappuccino', 'icedmatcha', 'coldbrew'].map((id) => allItems.find((i) => i.id === id)).filter(Boolean)
    .map((it, i) => el('figure', { class: `snap s${i + 1}` }, visual(it, 'snap-img'), el('figcaption', {}, it.name))));
  const stat = (v, l) => el('div', {}, el('dt', {}, v), el('dd', {}, l));
  const hero = el('section', { class: 'hero-bg', id: 'top' }, el('div', { class: 'wrap hero' },
    el('div', { class: 'hero-text' },
      el('p', { class: 'eyebrow' }, `Specialty coffee on ${C.area}`),
      el('h1', {}, C.heroTitle),
      el('p', { class: 'lead' }, C.tagline),
      el('div', { class: 'cta' },
        el('a', { class: 'btn primary', href: '#menu' }, 'Order now'),
        el('a', { class: 'btn', href: '#build' }, 'Build your drink'),
        el('a', { class: 'btn ghost', href: mapsUrl, target: '_blank', rel: 'noreferrer' }, 'Get directions')),
      el('dl', { class: 'hero-stats' }, stat(rupee(120), 'Coffee from'), stat(String(B.milks.length), 'Milk choices'), stat(String(allItems.length), 'Items on the menu'))),
    collage));
  probe(P.hero || 'images/hero.jpg', (url) => { hero.classList.add('has-photo'); hero.style.backgroundImage = `url("${url}")`; });
  const band = el('section', { class: 'band', id: 'band', hidden: true }, el('div', { class: 'wrap' },
    el('p', { class: 'eyebrow' }, C.bandEyebrow), el('h2', {}, C.bandTitle), el('p', { class: 'bandtext' }, C.bandText),
    el('div', { class: 'cta' }, el('a', { class: 'btn primary', href: wa(`Hi ${C.name}! I would like to book a table.`), target: '_blank', rel: 'noreferrer' }, 'Book a table'), el('a', { class: 'btn', href: '#visit' }, 'Find us'))));
  probe(P.band || 'images/band.jpg', (url) => { band.style.backgroundImage = `url("${url}")`; band.hidden = false; });
  const ribbonItems = [...B.bases.map((b) => b.name), ...B.milks.map((m) => `${m.name} milk`), ...C.menu.flatMap((c) => c.items).slice(0, 10).map((i) => i.name)];
  const ribbon = html('div', 'ribbon', `<div class="track">${[0, 1].map(() => ribbonItems.map((t) => `<span>${t}</span><i>\u273F</i>`).join('')).join('')}</div>`);
  const highlights = section('why', 'More than just coffee', `Why guests keep coming back to ${C.name}.`, '',
    el('div', { class: 'why' }, C.highlights.map((h, i) => el('div', { class: 'why-item' }, el('span', { class: 'n' }, `0${i + 1}`), el('h3', {}, h.title), el('p', {}, h.text)))));

  // ---- menu ----
  const CAF = ['None', 'Low', 'Medium', 'Strong'];
  const DEFAULT = { size: 'r', milk: 'regular', shot: false };
  const by = (arr, id) => arr.find((x) => x.id === id);
  function configure(it, o) {
    const drink = !!it.temp;
    const size = drink ? by(B.sizes, o.size) : null;
    const milk = drink && it.milk ? by(B.milks, o.milk) : null;
    const shot = drink && it.caffeine >= 2 && o.shot ? by(B.extras, 'shot') : null;
    const price = it.price + (size ? size.price : 0) + (milk ? milk.price : 0) + (shot ? shot.price : 0);
    const parts = [size && size.id !== 'r' ? size.name : null, milk && milk.id !== 'regular' ? `${milk.name} milk` : null, shot ? 'Extra shot' : null].filter(Boolean);
    return { key: ['m', it.id, drink ? o.size : '', milk ? o.milk : '', shot ? 1 : 0].join('|'), name: it.name, desc: parts.join(', '), price };
  }
  const addMenuItem = (it, o = DEFAULT, qty = 1) => { S.addToCart(configure(it, o), qty); toast(`${qty > 1 ? `${qty} x ` : ''}${it.name} added to your cart`); };

  function openItem(it) {
    lastFocus = document.activeElement;
    const o = { size: 'r', milk: 'regular', shot: false, qty: 1 };
    const drink = !!it.temp;
    const draw = (focusKey) => {
      const cfg = configure(it, o);
      const opt = (label, on, fn, k) => el('button', { type: 'button', class: on ? 'opt on' : 'opt', 'aria-pressed': String(on), 'data-k': k, onclick: () => { fn(); draw(k); } }, label);
      const add = (p) => (p ? ` ${p > 0 ? '+' : '-'}${rupee(Math.abs(p))}` : '');
      modalRoot.replaceChildren(el('div', { class: 'overlay open', onclick: closeModal }),
        el('div', { class: 'modal item', role: 'dialog', 'aria-modal': 'true', 'aria-label': it.name },
          el('button', { class: 'close', 'aria-label': 'Close', 'data-k': 'close', onclick: closeModal }, '\u00D7'),
          visual(it, 'item-art'),
          el('div', { class: 'item-body' },
            el('h2', {}, it.name), el('p', { class: 'muted' }, it.desc),
            el('div', { class: 'chips' },
              drink ? el('span', { class: 'tag' }, it.temp === 'hot' ? 'Served hot' : 'Served iced') : null,
              drink ? el('span', { class: 'tag' }, `Caffeine: ${CAF[it.caffeine]}`) : null,
              it.milk ? el('span', { class: 'tag' }, 'Contains milk') : null,
              ...(it.taste || []).map((t) => el('span', { class: 'tag soft' }, t))),
            drink ? el('fieldset', { class: 'fs' }, el('legend', {}, 'Size'), el('div', { class: 'opts' }, B.sizes.map((x) => opt(`${x.name}${add(x.price)}`, o.size === x.id, () => { o.size = x.id; }, `s${x.id}`)))) : null,
            drink && it.milk ? el('fieldset', { class: 'fs' }, el('legend', {}, 'Milk'), el('div', { class: 'opts' }, B.milks.map((x) => opt(`${x.emoji} ${x.name}${add(x.price)}`, o.milk === x.id, () => { o.milk = x.id; }, `m${x.id}`)))) : null,
            drink && it.caffeine >= 2 ? el('fieldset', { class: 'fs' }, el('legend', {}, 'Extras'), el('div', { class: 'opts' }, opt(`Extra shot${add(by(B.extras, 'shot').price)}`, o.shot, () => { o.shot = !o.shot; }, 'shot'))) : null,
            el('div', { class: 'item-foot' },
              el('div', { class: 'qty big' }, el('button', { type: 'button', 'data-k': 'qm', 'aria-label': 'Fewer', onclick: () => { o.qty = Math.max(1, o.qty - 1); draw('qm'); } }, '\u2212'), el('span', {}, String(o.qty)),
                el('button', { type: 'button', 'data-k': 'qp', 'aria-label': 'More', onclick: () => { o.qty = Math.min(10, o.qty + 1); draw('qp'); } }, '+')),
              el('button', { id: 'item-add', class: 'btn primary', 'data-k': 'add', onclick: () => { addMenuItem(it, o, o.qty); closeModal(); } }, `Add to cart  ${rupee(cfg.price * o.qty)}`)))));
      document.body.classList.add('lock');
      const f = [...modalRoot.querySelectorAll('[data-k]')].find((b) => b.dataset.k === (focusKey || 'close'));
      if (f) f.focus();
    };
    draw();
  }

  const dishCard = (it) => el('article', { class: 'dish' },
    el('div', { class: 'dish-media', onclick: () => openItem(it) }, visual(it, 'dish-art'), el('span', { class: 'pill' }, rupee(it.price)), it.temp ? el('span', { class: 'tag float' }, it.temp === 'hot' ? 'Hot' : 'Iced') : null),
    el('div', { class: 'dish-body' },
      el('h3', {}, el('button', { class: 'linkbtn', 'aria-haspopup': 'dialog', onclick: () => openItem(it) }, it.name)),
      el('p', {}, it.desc),
      el('div', { class: 'dish-foot' }, el('button', { class: 'btn small', onclick: () => openItem(it) }, 'Details'), el('button', { class: 'btn small primary', onclick: () => addMenuItem(it) }, 'Add to cart'))));
  function menuSection() {
    let cur = 0;
    const grid = el('div', { class: 'menu-grid', role: 'tabpanel' });
    const buttons = C.menu.map((c, i) => el('button', { role: 'tab', class: 'tab', onclick: () => { cur = i; draw(); } }, c.category));
    const draw = () => {
      buttons.forEach((b, i) => { b.classList.toggle('on', i === cur); b.setAttribute('aria-selected', String(i === cur)); });
      grid.replaceChildren(...C.menu[cur].items.map(dishCard));
    };
    draw();
    return section('menu', 'Our menu', C.menuIntro, '', el('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Menu categories' }, buttons), grid);
  }

  // ---- drink recommender ----
  const QS = [
    { id: 'caf', q: 'How much caffeine do you want?', opts: [['None', 0], ['A little', 1], ['Medium', 2], ['Strong', 3]] },
    { id: 'temp', q: 'Hot or iced?', opts: [['Hot', 'hot'], ['Iced', 'cold'], ['Either', 'any']] },
    { id: 'taste', q: 'What sounds good?', opts: [['Bold and bitter', 'bold'], ['Smooth and creamy', 'creamy'], ['Sweet and dessert-like', 'sweet'], ['Earthy and fresh', 'earthy']] },
    { id: 'milk', q: 'Milk?', opts: [['Dairy is fine', 'dairy'], ['Plant-based please', 'plant'], ['No milk', 'none']] },
  ];
  const ans = {};
  const qsBox = el('div', { class: 'qs' });
  const recOut = el('div', { class: 'rec-out', 'aria-live': 'polite' });
  const drawQs = () => qsBox.replaceChildren(...QS.map((q) => el('fieldset', { class: 'fs' }, el('legend', {}, q.q),
    el('div', { class: 'opts' }, q.opts.map(([label, val]) => el('button', { type: 'button', class: ans[q.id] === val ? 'opt on' : 'opt', 'aria-pressed': String(ans[q.id] === val), 'data-k': q.id + label,
      onclick: () => { ans[q.id] = val; drawQs(); focusK(q.id + label); } }, label))))));
  const WHY = { bold: 'a bold, bitter punch', creamy: 'smooth and creamy', sweet: 'sweet and dessert-like', earthy: 'earthy and fresh' };
  function findDrink() {
    if (QS.some((q) => ans[q.id] === undefined)) { recOut.replaceChildren(el('p', { class: 'hint' }, 'Answer all four questions and I will pick your drink.')); return; }
    const tags = ans.taste === 'earthy' ? ['earthy', 'fresh'] : [ans.taste];
    const pool = C.menu.flatMap((c) => c.items).filter((i) => i.caffeine !== undefined);
    const scored = pool.map((it) => {
      let s = 4 - Math.abs(it.caffeine - ans.caf);
      s += ans.temp === 'any' || it.temp === ans.temp ? 3 : 0;
      s += it.taste.some((t) => tags.includes(t)) ? 3 : 0;
      s += ans.milk === 'none' ? (it.milk ? 0 : 3) : 3;
      return { it, pct: Math.round((s / 13) * 100) };
    }).sort((a, b) => b.pct - a.pct).slice(0, 3);
    recOut.replaceChildren(el('h3', { class: 'rec-h' }, 'Your top picks'), el('div', { class: 'rec-grid' }, scored.map(({ it, pct }, i) => el('article', { class: 'card rec-card' },
      i === 0 ? el('span', { class: 'best' }, 'Best match') : null,
      visual(it, 'dish-art'),
      el('h3', {}, it.name), el('p', { class: 'muted' }, it.desc),
      el('p', { class: 'why' }, `${pct}% match. It is ${WHY[ans.taste]}${it.milk && ans.milk === 'plant' ? '. Ask for oat, coconut or almond milk.' : '.'}`),
      el('div', { class: 'bar' }, el('i', { style: `width:${pct}%` })),
      el('div', { class: 'dish-foot' }, el('span', { class: 'price' }, rupee(it.price)), el('button', { class: 'btn small primary', onclick: () => addMenuItem(it) }, 'Add to cart'))))));
  }
  drawQs();
  const recommend = section('recommend', 'Not sure what to order?', 'Answer four quick questions and we will pick your drink.', 'blush',
    qsBox, el('button', { id: 'rec-go', class: 'btn primary', onclick: findDrink }, 'Find my drink'), recOut);

  // ---- custom drink builder ----
  const NONE = { id: 'none', name: 'No milk', emoji: '\uD83D\uDEAB', price: 0, color: null };
  const sel = { base: 'espresso', milk: 'regular', temp: 'hot', size: 'r', syrup: 'none', sweet: 2, extras: [] };
  const stepsBox = el('div', { class: 'steps' });
  const prevBox = el('div', { class: 'preview card' });
  function current() {
    const base = by(B.bases, sel.base);
    if (!base.hot && sel.temp === 'hot') sel.temp = 'iced';
    if (!base.iced && sel.temp === 'iced') sel.temp = 'hot';
    if (base.id === 'milk' && sel.milk === 'none') sel.milk = 'regular';
    const milk = sel.milk === 'none' ? NONE : by(B.milks, sel.milk);
    const size = by(B.sizes, sel.size), syrup = by(B.syrups, sel.syrup);
    const extras = B.extras.filter((e) => sel.extras.includes(e.id));
    const iced = sel.temp === 'iced';
    const price = base.price + milk.price + size.price + syrup.price + extras.reduce((a, e) => a + e.price, 0);
    const core = base.id === 'milk' ? `${milk.name} milk` : base.name;
    const title = `${iced && base.id !== 'coldbrew' ? 'Iced ' : ''}${core}${base.id !== 'milk' && milk.id !== 'none' ? ` with ${milk.name.toLowerCase()} milk` : ''}`;
    const descr = [size.name, iced ? 'Iced' : 'Hot', syrup.id !== 'none' ? `${syrup.name} syrup` : null, B.sweetness[sel.sweet], ...extras.map((e) => e.name)].filter(Boolean).join(', ');
    let layers;
    if (base.id === 'milk') layers = [[milk.color, 1]];
    else if (milk.id !== 'none') layers = iced ? [[milk.color, 0.65], [base.color, 0.35]] : [[A.mix(base.color, milk.color, 0.55), 1]];
    else layers = [[base.color, 1]];
    if (syrup.color) { if (iced) layers.unshift([syrup.color, 0.14]); else layers[0] = [A.mix(layers[0][0], syrup.color, 0.25), layers[0][1]]; }
    const foam = !iced && milk.id !== 'none' ? A.mix(milk.color, '#ffffff', 0.5) : (!iced && base.id === 'espresso' ? '#c58b4a' : null);
    const spec = { vessel: iced ? 'glass' : 'cup', layers, foam, ice: iced, straw: iced, steam: !iced, cream: sel.extras.includes('cream') };
    const key = ['c', sel.base, sel.milk, sel.temp, sel.size, sel.syrup, sel.sweet, sel.extras.slice().sort().join('+')].join('|');
    return { base, milk, size, price, title, descr, spec, key };
  }
  const grp = (label, opts, isOn, pick, k) => el('fieldset', { class: 'fs' }, el('legend', {}, label),
    el('div', { class: 'opts' }, opts.map((o) => el('button', { type: 'button', class: isOn(o) ? 'opt on' : 'opt', 'aria-pressed': String(isOn(o)), 'data-k': k + o.id,
      onclick: () => { pick(o); drawBuilder(); focusK(k + o.id); } }, o.emoji ? el('span', { class: 'em' }, o.emoji) : null, o.name, o.price ? el('small', {}, ` ${o.price > 0 ? '+' : '-'}${rupee(Math.abs(o.price))}`) : null))));
  function drawBuilder() {
    const cur = current();
    const temps = [{ id: 'hot', name: 'Hot', emoji: '\uD83D\uDD25' }, { id: 'iced', name: 'Iced', emoji: '\uD83E\uDDCA' }].filter((t) => cur.base[t.id === 'hot' ? 'hot' : 'iced']);
    const milkOpts = cur.base.id === 'milk' ? B.milks : [NONE, ...B.milks];
    stepsBox.replaceChildren(
      grp('1. Pick your base', B.bases, (o) => o.id === sel.base, (o) => { sel.base = o.id; }, 'b'),
      grp('2. Choose your milk', milkOpts, (o) => o.id === sel.milk, (o) => { sel.milk = o.id; }, 'm'),
      grp('3. Hot or iced', temps, (o) => o.id === sel.temp, (o) => { sel.temp = o.id; }, 't'),
      grp('4. Size', B.sizes, (o) => o.id === sel.size, (o) => { sel.size = o.id; }, 's'),
      grp('5. Syrup', B.syrups, (o) => o.id === sel.syrup, (o) => { sel.syrup = o.id; }, 'y'),
      grp('6. Sweetness', B.sweetness.map((n, i) => ({ id: String(i), name: n })), (o) => Number(o.id) === sel.sweet, (o) => { sel.sweet = Number(o.id); }, 'w'),
      grp('7. Extras', B.extras, (o) => sel.extras.includes(o.id), (o) => { sel.extras = sel.extras.includes(o.id) ? sel.extras.filter((x) => x !== o.id) : [...sel.extras, o.id]; }, 'x'));
    const art = html('div', 'preview-art', A.render(cur.spec));
    art.firstChild.style.transform = `scale(${cur.size.scale})`;
    prevBox.replaceChildren(art, el('h3', {}, cur.title), el('p', { class: 'muted' }, cur.descr),
      el('div', { class: 'big-price' }, rupee(cur.price)),
      el('button', { id: 'build-add', class: 'btn primary wide', onclick: () => { S.addToCart({ key: cur.key, name: cur.title, desc: cur.descr, price: cur.price }); toast('Your custom drink is in the cart'); } }, 'Add to cart'));
  }
  drawBuilder();
  const builder = section('build', 'Build your own drink', 'Mix and match. The picture and the price update as you go.', 'soft',
    el('div', { class: 'builder' }, stepsBox, prevBox));

  // ---- rewards and customer dashboard ----
  const rewardsBox = el('div', { class: 'rewards' });
  const phoneOk = (p) => /^\+?[\d\s-]{10,15}$/.test(p.trim());
  function joinCard() {
    const f = { name: '', phone: '' };
    const msg = el('p', { class: 'error', role: 'alert' });
    return el('div', { class: 'join' },
      el('div', {}, el('h3', {}, 'Join Brew & Bloom Rewards'),
        el('ul', { class: 'perks' },
          el('li', {}, `Get ${L.welcomeBonus} welcome points`), el('li', {}, `Earn 1 point for every ${rupee(L.earnEvery)} you spend`),
          el('li', {}, `Redeem ${L.redeemPoints} points for ${rupee(L.redeemValue)} off`), el('li', {}, 'Move up from Bronze to Silver and Gold'))),
      el('form', { class: 'card', onsubmit: (e) => {
        e.preventDefault();
        if (f.name.trim().length < 2) { msg.textContent = 'Please enter your name.'; return; }
        if (!phoneOk(f.phone)) { msg.textContent = 'Please enter a valid phone number.'; return; }
        S.join(f.name.trim(), f.phone.trim()); toast('Welcome to Brew & Bloom Rewards!'); } },
        el('label', {}, 'Name', el('input', { required: true, autocomplete: 'name', oninput: (e) => { f.name = e.target.value; } })),
        el('label', {}, 'Phone', el('input', { required: true, type: 'tel', autocomplete: 'tel', oninput: (e) => { f.phone = e.target.value; } })),
        msg, el('button', { class: 'btn primary wide' }, 'Join and get my points'),
        el('p', { class: 'fine' }, 'Your points are saved on this device.')));
  }
  function renderRewards() {
    const c = S.get().customer, orders = S.get().orders;
    if (!c) { rewardsBox.replaceChildren(joinCard()); return; }
    const t = S.tier(c.lifetime);
    const spent = orders.reduce((a, o) => a + o.total, 0);
    const tally = {};
    orders.forEach((o) => o.items.forEach((i) => { tally[i.name] = (tally[i.name] || 0) + i.qty; }));
    const fav = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
    const toReward = Math.max(0, L.redeemPoints - c.points);
    rewardsBox.replaceChildren(
      el('div', { class: 'dash' },
        el('div', { class: 'card pts' }, el('small', {}, `Hi ${c.name.split(' ')[0]}, you have`), el('b', {}, String(c.points)), el('span', {}, 'points'),
          el('span', { class: 'tier' }, `${t.name} member`),
          el('div', { class: 'bar light' }, el('i', { style: `width:${Math.min(100, (c.points / L.redeemPoints) * 100)}%` })),
          el('p', {}, toReward === 0 ? `You can redeem ${rupee(L.redeemValue)} off on your next order.` : `${toReward} more points for ${rupee(L.redeemValue)} off.`),
          t.next ? el('p', { class: 'fine' }, `${t.next.min - c.lifetime} more points to reach ${t.next.name}.`) : el('p', { class: 'fine' }, 'You have reached our top tier.')),
        el('div', { class: 'stats' },
          el('div', {}, el('b', {}, String(orders.length)), 'Orders'), el('div', {}, el('b', {}, rupee(spent)), 'Spent'),
          el('div', {}, el('b', {}, fav ? fav[0] : '-'), 'Favourite')),
        el('div', { class: 'card hist' }, el('h3', {}, 'Your orders'),
          orders.length === 0 ? el('p', { class: 'muted' }, 'No orders yet. Your first order will show up here.') : el('ul', {}, orders.slice(0, 6).map((o) => el('li', {},
            el('div', {}, el('b', {}, o.id), el('small', {}, `${fmtDate(o.date)}, ${o.items.map((i) => `${i.qty} x ${i.name}`).join(', ')}`)),
            el('span', {}, `${rupee(o.total)} (+${o.earned} pts)`),
            el('button', { class: 'btn small', onclick: () => { o.items.forEach((i) => S.addToCart(i, i.qty)); toast('Items added to your cart'); openCart(); } }, 'Reorder')))),
          el('div', { class: 'row' }, el('button', { class: 'btn primary small', onclick: () => goTo('menu') }, 'Order now'),
            el('button', { class: 'btn small', onclick: () => { if (window.confirm('Remove your rewards profile from this device?')) S.leave(); } }, 'Sign out')))));
  }
  const rewards = section('rewards', 'Rewards and your dashboard', 'Every order earns points. Check your balance, tier and past orders here.', 'dark', rewardsBox);

  // ---- story, gallery, reviews, visit, contact, footer ----
  const storyPhoto = html('div', 'story-photo', `<div class="story-art">${A.render('cappuccino')}<span>${FLOWER('#c9954a')}</span></div>`);
  probe(P.story || 'images/story.jpg', (url) => { storyPhoto.classList.add('photo'); storyPhoto.removeAttribute('aria-hidden'); storyPhoto.replaceChildren(el('img', { src: url, alt: `${C.name} café`, loading: 'lazy' })); });
  const about = el('section', { id: 'about', class: 'sec' }, el('div', { class: 'wrap story' }, storyPhoto,
    el('div', {}, el('p', { class: 'eyebrow' }, C.aboutTitle), el('h2', {}, C.aboutHeading), C.about.map((p) => el('p', { class: 'prose' }, p)),
      el('div', { class: 'cta' }, el('a', { class: 'btn primary', href: '#menu' }, 'See the menu'), el('a', { class: 'btn', href: '#visit' }, 'Visit us')))));

  const galItems = [];
  let galCat = 'All';
  const pills = el('div', { class: 'pills', role: 'group', 'aria-label': 'Filter gallery' });
  const galleryGrid = el('div', { class: 'gallery' });
  const gallery = section('gallery', `A taste of ${C.name}`, 'Fresh pours, warm corners and good food.', '', pills, galleryGrid);
  gallery.hidden = true;
  function drawGallery() {
    const cats = ['All', ...new Set(galItems.map((g) => g.cat))];
    if (!cats.includes(galCat)) galCat = 'All';
    pills.replaceChildren(...cats.map((x) => el('button', { type: 'button', class: x === galCat ? 'pill-btn on' : 'pill-btn', 'aria-pressed': String(x === galCat), onclick: () => { galCat = x; drawGallery(); } }, x)));
    const shown = galItems.filter((g) => galCat === 'All' || g.cat === galCat);
    galleryGrid.replaceChildren(...shown.map((g, i) => el('figure', { class: 'gcard', tabindex: '0', role: 'button', 'aria-label': `View ${g.title}`, onclick: () => openLightbox(shown, i), onkeydown: (e) => { if (e.key === 'Enter') openLightbox(shown, i); } },
      el('img', { src: g.url, alt: g.title, loading: 'lazy' }), el('span', { class: 'view' }, 'View'), el('figcaption', {}, el('b', {}, g.title), g.text ? el('small', {}, g.text) : null))));
  }
  C.gallery.forEach((g, i) => probe(g.src || `${P.galleryDir || 'images/gallery/'}${i + 1}.${P.ext || 'jpg'}`, (url) => {
    galItems.push({ ...g, url, n: i }); galItems.sort((a, b) => a.n - b.n); gallery.hidden = false; galleryLink.hidden = false; drawGallery();
  }));
  function openLightbox(list, start) {
    lastFocus = document.activeElement;
    let i = start;
    const draw = () => {
      const g = list[i];
      modalRoot.replaceChildren(el('div', { class: 'overlay open dark', onclick: closeModal }),
        el('div', { class: 'lightbox', role: 'dialog', 'aria-modal': 'true', 'aria-label': g.title },
          el('button', { class: 'lb-btn', 'aria-label': 'Previous photo', onclick: () => { i = (i - 1 + list.length) % list.length; draw(); } }, '\u2039'),
          el('figure', {}, el('img', { src: g.url, alt: g.title }), el('figcaption', {}, el('b', {}, g.title), g.text ? ` ${g.text}` : '')),
          el('button', { class: 'lb-btn', 'aria-label': 'Next photo', onclick: () => { i = (i + 1) % list.length; draw(); } }, '\u203A'),
          el('button', { class: 'lb-close', 'aria-label': 'Close', 'data-k': 'close', onclick: closeModal }, '\u00D7')));
      document.body.classList.add('lock');
      const f = [...modalRoot.querySelectorAll('[data-k]')].find((b) => b.dataset.k === 'close'); if (f) f.focus();
    };
    lbKey = (d) => { i = (i + d + list.length) % list.length; draw(); };
    draw();
  }

  const reviews = C.reviews.length ? section('reviews', 'What guests say', '', '', el('div', { class: 'grid' }, C.reviews.map((r) => el('figure', { class: 'card quote' }, el('blockquote', {}, `\u201C${r.text}\u201D`), el('figcaption', {}, r.name))))) : null;

  const visit = section('visit', `Find us on ${C.area}`, `Visit ${C.name} in ${C.city}.`, '',
    el('div', { class: 'visit' },
      el('iframe', { class: 'map', title: `Map showing ${C.name}`, loading: 'lazy', referrerpolicy: 'no-referrer-when-downgrade', src: `https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed` }),
      el('div', { class: 'card vinfo' }, blk('Address', C.address), blk('Phone', el('a', { href: tel }, C.phone)),
        el('div', { class: 'blk' }, el('small', {}, 'Opening hours'), el('table', { class: 'hours' }, el('tbody', {}, C.hours.map(([d, t]) => el('tr', {}, el('th', { scope: 'row' }, d), el('td', {}, t)))))),
        el('div', { class: 'cta' }, el('a', { class: 'btn primary', href: tel }, 'Call now'), el('a', { class: 'btn', href: mapsUrl, target: '_blank', rel: 'noreferrer' }, 'Get directions')))));

  const cf = { name: '', email: '', message: '' };
  const cmsg = el('p', { class: 'fine', role: 'status' });
  const contact = section('contact', 'Have a question?', 'Send us a message and we will get back to you.', '',
    el('div', { class: 'contact' },
      el('div', { class: 'cinfo' }, blk('Visit', C.address), blk('Call', el('a', { href: tel }, C.phone)), blk('Hours', `${C.hours[0][0]}: ${C.hours[0][1]}`), C.email ? blk('Email', el('a', { href: `mailto:${C.email}` }, C.email)) : null),
      el('form', { class: 'cform card', onsubmit: (e) => {
        e.preventDefault();
        const nm = cf.name.trim(), msg = cf.message.trim(), em = cf.email.trim();
        if (nm.length < 2 || msg.length < 5) { cmsg.textContent = 'Please add your name and a short message.'; return; }
        window.open(wa(`Hi ${C.name}! I am ${nm}${em ? ` (${em})` : ''}.\n${msg}`), '_blank', 'noopener');
        cmsg.textContent = 'Opening WhatsApp so you can send your message.';
      } },
        el('label', {}, 'Your name', el('input', { required: true, autocomplete: 'name', oninput: (e) => { cf.name = e.target.value; } })),
        el('label', {}, 'Email (optional)', el('input', { type: 'email', autocomplete: 'email', oninput: (e) => { cf.email = e.target.value; } })),
        el('label', {}, 'Message', el('textarea', { required: true, rows: '4', oninput: (e) => { cf.message = e.target.value; } })),
        el('button', { class: 'btn primary wide' }, 'Send message'), cmsg)));

  const year = new Date().getFullYear();
  const footer = el('footer', { class: 'foot2' }, el('div', { class: 'wrap' },
    el('div', { class: 'cols' },
      el('div', {}, el('h4', {}, C.name), el('p', {}, C.tagline)),
      el('div', {}, el('h4', {}, 'Quick links'), [['about', 'About'], ['menu', 'Menu'], ['build', 'Build a drink'], ['rewards', 'Rewards'], ['visit', 'Visit'], ['contact', 'Contact']].map(([id, t]) => el('a', { href: `#${id}` }, t))),
      el('div', {}, el('h4', {}, 'Visit us'), el('p', {}, C.address), el('a', { href: tel }, C.phone), el('p', {}, `${C.hours[0][0]}: ${C.hours[0][1]}`))),
    el('div', { class: 'bottom' }, el('span', {}, `\u00A9 ${year} ${C.name}`), C.credit ? el('span', {}, C.credit) : null)));

  // ---- cart drawer, checkout and order confirmation ----
  const form = { name: '', phone: '', type: 'pickup', note: '', redeem: false };
  let errMsg = '', cartOpen = false;
  const overlay = el('div', { class: 'overlay', onclick: () => closeCart() });
  const drawer = el('aside', { class: 'drawer', 'aria-label': 'Your cart' });
  const modalRoot = el('div', { class: 'modal-root' });
  function openCart() {
    const c = S.get().customer; if (c) { if (!form.name) form.name = c.name; if (!form.phone) form.phone = c.phone; }
    cartOpen = true; errMsg = ''; renderCart(); drawer.classList.add('open'); overlay.classList.add('open'); document.body.classList.add('lock');
  }
  function closeCart() { cartOpen = false; drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.classList.remove('lock'); }
  function closeModal() { lbKey = null; modalRoot.replaceChildren(); document.body.classList.remove('lock'); if (lastFocus && lastFocus.focus) { lastFocus.focus(); lastFocus = null; } }
  const orderText = (o) => [`New order ${o.id} at ${C.name}`, `Name: ${o.name}`, `Phone: ${o.phone}`, `Type: ${o.type === 'dinein' ? 'Dine-in' : 'Pickup'}`, o.note ? `Note: ${o.note}` : null, 'Items:',
    ...o.items.map((i) => `- ${i.qty} x ${i.name}${i.desc ? ` (${i.desc})` : ''}: ${rupee(i.price * i.qty)}`),
    o.discount ? `Rewards discount: -${rupee(o.discount)}` : null, `Total: ${rupee(o.total)}`].filter(Boolean).join('\n');
  function renderCart() {
    const st = S.get(), cart = st.cart, c = st.customer, sub = S.subtotal();
    const canRedeem = !!c && c.points >= L.redeemPoints && sub > 0;
    if (!canRedeem) form.redeem = false;
    const disc = form.redeem ? Math.min(L.redeemValue, sub) : 0, total = sub - disc;
    const items = cart.map((it) => el('li', { class: 'ci' },
      el('div', {}, el('b', {}, it.name), it.desc ? el('small', {}, it.desc) : null),
      el('div', { class: 'qty' }, el('button', { type: 'button', 'aria-label': `Remove one ${it.name}`, onclick: () => S.setQty(it.key, -1) }, '\u2212'), el('span', {}, String(it.qty)),
        el('button', { type: 'button', 'aria-label': `Add one ${it.name}`, onclick: () => S.setQty(it.key, 1) }, '+')),
      el('span', { class: 'line' }, rupee(it.price * it.qty))));
    const checkout = el('form', { class: 'checkout', onsubmit: placeOrder },
      el('label', {}, 'Name', el('input', { id: 'co-name', value: form.name, autocomplete: 'name', oninput: (e) => { form.name = e.target.value; } })),
      el('label', {}, 'Phone', el('input', { id: 'co-phone', type: 'tel', value: form.phone, autocomplete: 'tel', oninput: (e) => { form.phone = e.target.value; } })),
      el('div', { class: 'radios' },
        el('label', {}, el('input', { type: 'radio', name: 'otype', checked: form.type === 'pickup', onchange: () => { form.type = 'pickup'; } }), ' Pickup'),
        el('label', {}, el('input', { type: 'radio', name: 'otype', checked: form.type === 'dinein', onchange: () => { form.type = 'dinein'; } }), ' Dine-in')),
      el('label', {}, 'Note for the café (optional)', el('input', { value: form.note, oninput: (e) => { form.note = e.target.value; } })),
      canRedeem ? el('label', { class: 'redeem' }, el('input', { type: 'checkbox', checked: form.redeem, onchange: (e) => { form.redeem = e.target.checked; renderCart(); } }), ` Use ${L.redeemPoints} points for ${rupee(L.redeemValue)} off`) : null,
      el('div', { class: 'sum' }, el('div', {}, 'Subtotal', el('b', {}, rupee(sub))), disc ? el('div', {}, 'Rewards discount', el('b', {}, `-${rupee(disc)}`)) : null,
        el('div', { class: 'tot' }, 'Total', el('b', {}, rupee(total))), el('p', { class: 'fine' }, `You will earn ${Math.floor(total / L.earnEvery)} points with this order.`)),
      errMsg ? el('p', { class: 'error', role: 'alert' }, errMsg) : null,
      el('button', { id: 'co-place', class: 'btn primary wide' }, 'Place order'));
    drawer.replaceChildren(
      el('div', { class: 'dr-head' }, el('h2', {}, 'Your cart'), el('button', { class: 'close', onclick: closeCart, 'aria-label': 'Close cart' }, '\u00D7')),
      cart.length === 0
        ? el('div', { class: 'dr-empty' }, el('p', {}, 'Your cart is empty.'), el('button', { class: 'btn primary', onclick: () => { closeCart(); goTo('menu'); } }, 'Browse the menu'))
        : el('div', { class: 'dr-body' }, el('ul', { class: 'cl' }, items), checkout));
  }
  function placeOrder(e) {
    e.preventDefault();
    const name = form.name.trim(), phone = form.phone.trim();
    if (name.length < 2) { errMsg = 'Please enter your name.'; renderCart(); return; }
    if (!phoneOk(phone)) { errMsg = 'Please enter a valid phone number.'; renderCart(); return; }
    try {
      const o = S.placeOrder({ name, phone, type: form.type, note: form.note.trim(), redeem: form.redeem });
      form.note = ''; form.redeem = false; errMsg = ''; closeCart(); showOrder(o);
    } catch (ex) { errMsg = ex.message; renderCart(); }
  }
  function showOrder(o) {
    lastFocus = null;
    document.body.classList.add('lock');
    const bal = S.get().customer.points;
    modalRoot.replaceChildren(el('div', { class: 'overlay open', onclick: closeModal }),
      el('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Order placed' },
        el('h2', {}, 'Order placed!'), el('p', { class: 'muted' }, `Your order number is ${o.id}.`),
        el('ul', { class: 'cl' }, o.items.map((i) => el('li', { class: 'ci' }, el('div', {}, el('b', {}, `${i.qty} x ${i.name}`), i.desc ? el('small', {}, i.desc) : null), el('span', { class: 'line' }, rupee(i.price * i.qty))))),
        el('div', { class: 'sum' }, el('div', { class: 'tot' }, 'Total', el('b', {}, rupee(o.total)))),
        el('p', { class: 'earned' }, `You earned ${o.earned} points. Your balance is ${bal}.`),
        el('p', { class: 'fine' }, 'This is a demo ordering flow. Send the order to the café on WhatsApp to confirm it.'),
        el('a', { class: 'btn primary wide', href: wa(orderText(o)), target: '_blank', rel: 'noreferrer' }, 'Send order on WhatsApp'),
        el('div', { class: 'row' }, el('button', { class: 'btn small', onclick: () => { closeModal(); goTo('rewards'); } }, 'View my rewards'), el('button', { class: 'btn small', onclick: closeModal }, 'Done'))));
  }

  const waFloat = el('div', { class: 'floats' },
    el('a', { class: 'call-float', href: tel }, 'Call us'),
    el('a', { class: 'wa-float', href: wa(`Hi ${C.name}!`), target: '_blank', rel: 'noreferrer', 'aria-label': 'Chat on WhatsApp' }, 'WhatsApp'));
  const cartFloat = el('button', { class: 'cart-float', onclick: () => openCart() }, 'View cart');

  function update() {
    const n = S.count();
    countEl.textContent = String(n);
    cartFloat.classList.toggle('show', n > 0 && !cartOpen);
    cartFloat.textContent = `View cart (${n}) ${rupee(S.subtotal())}`;
    renderRewards();
    if (cartOpen) renderCart();
  }
  S.on(update);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); closeCart(); }
    if (lbKey && e.key === 'ArrowLeft') lbKey(-1);
    if (lbKey && e.key === 'ArrowRight') lbKey(1);
  });

  document.getElementById('app').append(...clean([header, el('main', {}, hero, ribbon, about, highlights, menuSection(), band, recommend, builder, rewards, gallery, reviews, visit, contact), footer, waFloat, cartFloat, overlay, drawer, modalRoot, toastEl]));
  update();
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.05 });
    document.querySelectorAll('.sec > .wrap, .hl .card').forEach((n) => { n.classList.add('rv'); io.observe(n); });
  }
})();

// Original drink illustrations drawn as SVG (no photos needed).
(function () {
  let uid = 0;
  const INK = '#241712', CUP = '#fffaf1';
  const mix = (a, b, t) => {
    const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const x = p(a), y = p(b);
    return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
  };
  const ESP = '#2a160d', COF = '#4a2c1a', MILK = '#f6ecdb', MATCHA = '#86b452', CHOC = '#5a3320', CHAI = '#b98355', CARAMEL = '#c98a3a', TEA = '#d6902f';
  const PRESETS = {
    espresso: { vessel: 'cup', small: true, layers: [[ESP, 1]], foam: '#c58b4a', steam: true },
    americano: { vessel: 'cup', layers: [[COF, 1]], steam: true },
    filter: { vessel: 'cup', layers: [['#7a4a2a', 1]], foam: '#e9d3b0', steam: true },
    cappuccino: { vessel: 'cup', layers: [[mix(COF, MILK, 0.45), 1]], foam: '#fbf3e6', dome: true, steam: true },
    latte: { vessel: 'cup', layers: [[mix(COF, MILK, 0.55), 1]], foam: '#f7eddc', steam: true },
    flat: { vessel: 'cup', layers: [[mix(COF, MILK, 0.4), 1]], foam: '#f2e4cc', steam: true },
    mocha: { vessel: 'cup', layers: [[mix(CHOC, MILK, 0.25), 1]], cream: true },
    coldbrew: { vessel: 'glass', layers: [[COF, 1]], ice: true, straw: true },
    tonic: { vessel: 'glass', layers: [['#ead9a6', 0.5], [ESP, 0.5]], ice: true, straw: true },
    icedamericano: { vessel: 'glass', layers: [['#d9c7a4', 0.35], [ESP, 0.65]], ice: true, straw: true },
    icedlatte: { vessel: 'glass', layers: [[MILK, 0.65], [COF, 0.35]], ice: true, straw: true },
    caramel: { vessel: 'glass', layers: [[CARAMEL, 0.14], [MILK, 0.5], [COF, 0.36]], ice: true, straw: true, cream: true },
    matchalatte: { vessel: 'cup', layers: [[mix(MATCHA, MILK, 0.35), 1]], foam: '#e6f0cf', steam: true },
    icedmatcha: { vessel: 'glass', layers: [[MILK, 0.55], [MATCHA, 0.45]], ice: true, straw: true },
    masala: { vessel: 'cup', layers: [[CHAI, 1]], steam: true },
    hotchoc: { vessel: 'cup', layers: [[CHOC, 1]], cream: true },
    lemontea: { vessel: 'glass', layers: [[TEA, 1]], ice: true, straw: true },
  };

  const grads = (id) => `<linearGradient id="lg${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient><linearGradient id="cb${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#e9dac6"/></linearGradient>`;
  const stack = (layers, top, bottom, x, w) => {
    const total = layers.reduce((a, l) => a + l[1], 0);
    let y = bottom, out = '';
    layers.forEach(([color, weight]) => {
      const h = (weight / total) * (bottom - top);
      y -= h;
      out += `<rect x="${x}" y="${y.toFixed(1)}" width="${w}" height="${(h + 0.6).toFixed(1)}" fill="${color}"/>`;
    });
    return out;
  };
  const creamTop = (cy) => `<g fill="#fffaf0" stroke="${INK}" stroke-width="2"><ellipse cx="100" cy="${cy}" rx="34" ry="11"/><ellipse cx="100" cy="${cy - 11}" rx="24" ry="9"/><ellipse cx="100" cy="${cy - 20}" rx="13" ry="7"/></g>`;

  function cup(o, id) {
    const top = o.layers[o.layers.length - 1][0];
    const surface = o.foam || top;
    const steam = o.steam && !o.cream
      ? `<g class="steam" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round" opacity=".35"><path d="M80 44c-9-9 9-15 0-26"/><path d="M104 46c-9-9 9-15 0-30"/><path d="M128 44c-9-9 9-15 0-26"/></g>` : '';
    const tf = o.small ? 'translate(22 30) scale(.78)' : 'translate(0 0)';
    return `<svg class="art" viewBox="0 0 220 180" aria-hidden="true" focusable="false"><defs>${grads(id)}<clipPath id="${id}"><path d="M51 66H149V105A44 44 0 0 1 105 149H95A44 44 0 0 1 51 105Z"/></clipPath></defs>
<g transform="${tf}">
<ellipse cx="100" cy="158" rx="82" ry="11" fill="#efe3d2" stroke="${INK}" stroke-width="3"/>
<path d="M155 80h9a19 19 0 0 1 0 38h-13" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M155 80h9a19 19 0 0 1 0 38h-13" fill="none" stroke="${CUP}" stroke-width="7" stroke-linecap="round"/>
<path d="M45 62H155V105A50 50 0 0 1 105 155H95A50 50 0 0 1 45 105Z" fill="url(#cb${id})" stroke="${INK}" stroke-width="3"/>
<ellipse cx="100" cy="62" rx="55" ry="9" fill="${CUP}" stroke="${INK}" stroke-width="3"/>
<g clip-path="url(#${id})">${stack(o.layers, 66, 149, 51, 98)}<rect x="51" y="66" width="98" height="83" fill="url(#lg${id})"/></g><path d="M55 76v26a40 40 0 0 0 11 28" stroke="#fff" stroke-opacity=".75" stroke-width="5" fill="none" stroke-linecap="round"/>
${o.dome ? `<path d="M51 67Q100 36 149 67Z" fill="${surface}" stroke="${INK}" stroke-width="2"/>` : `<ellipse cx="100" cy="67" rx="48" ry="7" fill="${surface}"/>`}
${o.cream ? creamTop(58) : ''}${steam}
</g></svg>`;
  }

  function glass(o, id) {
    const g = 'M62 30H158L148 178Q147 188 137 188H83Q73 188 72 178Z';
    const ice = o.ice
      ? `<g clip-path="url(#${id})" fill="rgba(255,255,255,.6)" stroke="rgba(255,255,255,.95)" stroke-width="2"><rect x="76" y="40" width="30" height="28" rx="6" transform="rotate(-12 91 54)"/><rect x="112" y="36" width="32" height="28" rx="6" transform="rotate(10 128 50)"/><rect x="88" y="78" width="28" height="26" rx="6" transform="rotate(6 102 91)"/><rect x="122" y="74" width="26" height="26" rx="6" transform="rotate(-8 135 87)"/></g>` : '';
    const straw = o.straw ? `<path d="M120 10L104 150" stroke="#b23a5b" stroke-width="7" stroke-linecap="round"/>` : '';
    return `<svg class="art" viewBox="0 0 220 200" aria-hidden="true" focusable="false"><defs>${grads(id)}<clipPath id="${id}"><path d="${g}"/></clipPath></defs>
<ellipse cx="110" cy="190" rx="62" ry="7" fill="#efe3d2"/>
<g clip-path="url(#${id})">${stack(o.layers, 56, 188, 50, 120)}<rect x="50" y="56" width="120" height="132" fill="url(#lg${id})"/></g>${ice}${straw}
<path d="${g}" fill="rgba(255,255,255,.28)" stroke="${INK}" stroke-width="3"/>
<path d="M70 44L76 168" stroke="rgba(255,255,255,.7)" stroke-width="5" stroke-linecap="round"/>
${o.cream ? creamTop(26) : ''}
</svg>`;
  }

  window.Art = {
    mix,
    render(input) {
      const o = typeof input === 'string' ? PRESETS[input] : input;
      const id = 'clip' + (++uid);
      return o.vessel === 'glass' ? glass(o, id) : cup(o, id);
    },
  };
})();

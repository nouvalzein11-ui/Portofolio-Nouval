const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = n => Math.round(n).toLocaleString('en-US');
const rp = n => n >= 1e9 ? 'Rp ' + (n / 1e9).toFixed(2) + ' B' : n >= 1e6 ? 'Rp ' + (n / 1e6).toFixed(1) + ' M' : 'Rp ' + fmt(n);
const compact = n => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : fmt(n);
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
function tween(from, to, dur, cb) {
  if (REDUCE || !from) { cb(to); return Promise.resolve(); }
  return new Promise(res => { const t0 = performance.now(); (function f(t) { const p = Math.min((t - t0) / dur, 1), e = ease(p); cb(to.map((v, i) => from[i] + (v - from[i]) * e)); p < 1 ? requestAnimationFrame(f) : res(); })(t0); });
}

(() => {
  const nav = $('#nav'), menu = $('#menu'), btn = $('#menuBtn');
  let last = scrollY;
  addEventListener('scroll', () => { const y = scrollY; nav.classList.toggle('hide', y > last && y > 300 && !menu.classList.contains('open')); last = y; }, { passive: true });
  const toggle = open => { menu.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); menu.setAttribute('aria-hidden', !open); };
  btn.addEventListener('click', () => toggle(!menu.classList.contains('open')));
  $$('#menu a').forEach((a, i) => { a.style.transitionDelay = (i * 40) + 'ms'; a.addEventListener('click', () => toggle(false)); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { toggle(false); closeModal(); $('#lb').classList.remove('open'); } });

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  window.reveal = els => els.forEach(el => { el.classList.add('rv'); io.observe(el); });
  reveal($$('.sec-head, .story, .stats > div, .intro, .pipe, .calc, .why, .timeline article, .archive, .dbx'));

  const words = ['work', 'dashboards', 'automations', 'pricing'], hw = $('#hlWord'); let wi = 0;
  if (false) setInterval(() => { hw.classList.add('swap'); setTimeout(() => { wi = (wi + 1) % words.length; hw.textContent = words[wi]; hw.classList.remove('swap'); hw.style.animation = 'none'; hw.offsetWidth; hw.style.animation = ''; }, 300); }, 3200);

  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, suf = el.dataset.suffix || '';
    tween([0], [to], 1400, v => el.textContent = fmt(v[0]) + suf);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  $('#pdfBtn').addEventListener('click', () => print());
  $('#copyEmail').addEventListener('click', e => { const b = e.currentTarget; navigator.clipboard && navigator.clipboard.writeText('nouvalzein11@gmail.com').catch(() => {}); b.classList.add('done'); b.title = 'Copied'; setTimeout(() => { b.classList.remove('done'); b.title = 'Copy email'; }, 1600); });
})();

class Film {
  constructor(el, script) {
    this.el = el; this.script = script; this.visible = false; this.paused = REDUCE;
    el.classList.toggle('paused', this.paused);
    this.cursor = $('.cursor', el);
    $('.playbtn', el).addEventListener('click', e => { e.stopPropagation(); this.setPaused(!this.paused); });
    new IntersectionObserver(es => es.forEach(x => this.visible = x.isIntersecting), { threshold: .25 }).observe(el);
    this.loop();
  }
  setPaused(p) { this.paused = p; this.el.classList.toggle('paused', p); $('.playbtn', this.el).setAttribute('aria-label', p ? 'Play animation' : 'Pause animation'); if (p && this.cursor) this.cursor.classList.remove('on'); }
  async sleep(ms) { let left = ms; while (left > 0) { await new Promise(r => setTimeout(r, 60)); if (this.visible && !this.paused) left -= 60; } }
  async moveTo(target) {
    if (!this.cursor || !target || !target.getBoundingClientRect().width) return;
    const a = this.el.getBoundingClientRect(), b = target.getBoundingClientRect();
    this.cursor.classList.add('on');
    this.cursor.style.transform = `translate(${b.left - a.left + b.width / 2 - 4}px,${b.top - a.top + b.height / 2 - 3}px)`;
    await this.sleep(950);
    this.cursor.classList.remove('click'); void this.cursor.offsetWidth; this.cursor.classList.add('click');
    await this.sleep(150);
  }
  async loop() { while (true) { await this.script(this); await new Promise(r => setTimeout(r, 30)); } }
}

const XF = (() => {
  const C = [['SA', 'Saudi Arabia', 420], ['SG', 'Singapore', 310], ['MY', 'Malaysia', 260], ['JP', 'Japan', 520], ['CN', 'China', 380], ['TH', 'Thailand', 290]];
  const P = [['eSIM', 1, 96000, '#e2513b'], ['SIM card', .45, 138000, '#f2a65a'], ['WiFi', .14, 315000, '#6aa3ff']];
  const M = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const SEAS = [1.15, .92, .88, 1.02, 1.06, 1.12, 1.28, 1.22, .98, .95, 1.04, 1.1];
  const r = rng(7);
  const O = C.map(c => P.map((p, pi) => M.map((m, mi) => Math.round(c[2] * p[1] * (1 + .035 * mi) * SEAS[(mi + (c[0] === 'SA' ? 3 : 0)) % 12] * (.85 + r() * .3)))));
  const PLANS = C.map(c => P.map(p => {
    const q = p[0] === 'WiFi' ? ['Unlimited 5D', 'Unlimited 10D', '3GB/day 7D'] : p[0] === 'SIM card' ? ['10GB 15D', '20GB 30D', '5GB 8D'] : ['5GB/day 7D', '10GB 15D', '3GB 5D'];
    return q.map((n, i) => [c[0] + ' ' + p[0] + ' · ' + n, [.5, .3, .2][i] + (r() - .5) * .08]);
  }));
  const F = { c: null, p: null, m: null };
  let cur = null;
  const pass = (k, v) => F[k] === null || F[k] === v;
  function agg() {
    let orders = 0, rev = 0, base = 0;
    const byC = C.map(() => 0), byM = M.map(() => 0), byP = P.map(() => 0);
    C.forEach((c, ci) => P.forEach((p, pi) => M.forEach((m, mi) => {
      const o = O[ci][pi][mi];
      if (pass('p', pi) && pass('m', mi)) byC[ci] += o;
      if (pass('c', ci) && pass('p', pi)) byM[mi] += o;
      if (pass('c', ci) && pass('m', mi)) byP[pi] += o;
      if (pass('c', ci) && pass('p', pi) && pass('m', mi)) { orders += o; rev += o * p[2]; base += c[2] * p[1] * 1.12 * p[2]; }
    })));
    const ref = F.m === null ? 11 : F.m, prev = Math.max(ref - 1, 0);
    const mom = byM[prev] ? (byM[ref] / byM[prev] - 1) * 100 : 0;
    const ach = rev / base * 100;
    const plans = [];
    C.forEach((c, ci) => P.forEach((p, pi) => { if (!pass('c', ci) || !pass('p', pi)) return; let s = 0; M.forEach((m, mi) => { if (pass('m', mi)) s += O[ci][pi][mi]; }); PLANS[ci][pi].forEach(pl => plans.push([pl[0], s * pl[1]])); }));
    plans.sort((a, b) => b[1] - a[1]);
    return { vec: [orders, rev, rev / Math.max(orders, 1), mom, ach, ...byC, ...byM, ...byP], plans: plans.slice(0, 5) };
  }
  function bars(v) {
    const mx = Math.max(...v), w = 420 / 6;
    return `<svg viewBox="0 0 420 170" preserveAspectRatio="xMidYMid meet">${v.map((x, i) => { const h = x / mx * 120, sel = F.c === i, dim = F.c !== null && !sel; return `<g class="hit" data-k="c" data-v="${i}"><rect x="${i * w + 10}" y="0" width="${w - 20}" height="170" fill="transparent"/><rect x="${i * w + 14}" y="${140 - h}" width="${w - 28}" height="${h}" rx="3" fill="${sel ? '#e2513b' : '#3b4252'}" opacity="${dim ? .45 : 1}"/><text x="${i * w + w / 2}" y="${134 - h}" fill="#c9cfda" font-size="11" text-anchor="middle" font-family="JetBrains Mono">${compact(x)}</text><text x="${i * w + w / 2}" y="160" fill="${sel ? '#fff' : '#8b93a1'}" font-size="12" text-anchor="middle" font-weight="600">${C[i][0]}</text></g>`; }).join('')}</svg>`;
  }
  function line(v) {
    const mx = Math.max(...v) * 1.1, mn = Math.min(...v) * .8, X = i => 14 + i * (392 / 11), Y = x => 130 - (x - mn) / (mx - mn) * 115;
    const pts = v.map((x, i) => X(i) + ',' + Y(x)).join(' ');
    return `<svg viewBox="0 0 420 170"><defs><linearGradient id="xg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2513b" stop-opacity=".35"/><stop offset="1" stop-color="#e2513b" stop-opacity="0"/></linearGradient></defs><polygon points="${X(0)},140 ${pts} ${X(11)},140" fill="url(#xg)"/><polyline points="${pts}" fill="none" stroke="#e2513b" stroke-width="2.2"/>${v.map((x, i) => `<g class="hit" data-k="m" data-v="${i}"><rect x="${X(i) - 15}" y="0" width="30" height="170" fill="transparent"/><circle cx="${X(i)}" cy="${Y(x)}" r="${F.m === i ? 6 : 3.5}" fill="${F.m === i ? '#fff' : '#e2513b'}" stroke="#e2513b" stroke-width="2"/><text x="${X(i)}" y="160" fill="${F.m === i ? '#fff' : '#8b93a1'}" font-size="10.5" text-anchor="middle">${M[i]}</text></g>`).join('')}</svg>`;
  }
  function donut(v) {
    const tot = v.reduce((a, b) => a + b, 0) || 1; let a0 = -Math.PI / 2; const cx = 70, cy = 82, R = 58, ri = 36;
    const arcs = v.map((x, i) => { const a1 = a0 + x / tot * Math.PI * 2, big = a1 - a0 > Math.PI ? 1 : 0, rr = F.p === i ? R + 5 : R;
      const d = `M${cx + rr * Math.cos(a0)},${cy + rr * Math.sin(a0)} A${rr},${rr} 0 ${big} 1 ${cx + rr * Math.cos(a1)},${cy + rr * Math.sin(a1)} L${cx + ri * Math.cos(a1)},${cy + ri * Math.sin(a1)} A${ri},${ri} 0 ${big} 0 ${cx + ri * Math.cos(a0)},${cy + ri * Math.sin(a0)}Z`; a0 = a1;
      return `<path class="hit" data-k="p" data-v="${i}" d="${d}" fill="${P[i][3]}" opacity="${F.p !== null && F.p !== i ? .35 : 1}"/>`; }).join('');
    const leg = P.map((p, i) => `<g class="hit" data-k="p" data-v="${i}"><rect x="140" y="${44 + i * 28}" width="10" height="10" rx="2" fill="${p[3]}"/><text x="156" y="${53 + i * 28}" fill="#c9cfda" font-size="12">${p[0]}</text><text x="156" y="${66 + i * 28}" fill="#8b93a1" font-size="10.5" font-family="JetBrains Mono">${(v[i] / tot * 100).toFixed(1)}%</text></g>`).join('');
    return `<svg viewBox="0 0 220 170">${arcs}${leg}</svg>`;
  }
  function gauge(a) {
    const p = Math.min(a / 120, 1), ang = Math.PI * (1 - p), x = 100 + 70 * Math.cos(ang), y = 120 - 70 * Math.sin(ang);
    return `<svg viewBox="0 0 200 170"><path d="M30,120 A70,70 0 0 1 170,120" fill="none" stroke="#262a33" stroke-width="14" stroke-linecap="round"/><path d="M30,120 A70,70 0 0 1 ${x},${y}" fill="none" stroke="${a >= 100 ? '#5be3b5' : '#e2513b'}" stroke-width="14" stroke-linecap="round"/><text x="100" y="112" fill="#fff" font-size="26" font-weight="700" text-anchor="middle">${a.toFixed(0)}%</text><text x="100" y="146" fill="#8b93a1" font-size="11" text-anchor="middle">of revenue target</text></svg>`;
  }
  function draw(v, plans) {
    const st = $('#xfStage');
    const [o, rv, aov, mom, ach] = v, byC = v.slice(5, 11), byM = v.slice(11, 23), byP = v.slice(23, 26);
    const chips = [F.c !== null && C[F.c][1], F.p !== null && P[F.p][0], F.m !== null && M[F.m]].filter(Boolean);
    st.innerHTML = `<div class="xf">
      <div class="chipsF">${chips.length ? 'Filtered by ' + chips.map(c => `<span>${c}</span>`).join('') : 'All countries · all products · Dec 2025 to Nov 2026'}</div>
      <div class="p kpi"><h4>Orders</h4><b>${fmt(o)}</b><small class="${mom < 0 ? 'dn' : ''}">${mom >= 0 ? '▲' : '▼'} ${Math.abs(mom).toFixed(1)}% MoM</small></div>
      <div class="p kpi"><h4>Revenue</h4><b>${rp(rv)}</b><small>illustrative</small></div>
      <div class="p kpi"><h4>Avg order value</h4><b>${rp(aov)}</b><small>per order</small></div>
      <div class="p kpi"><h4>Target</h4><b>${ach.toFixed(1)}%</b><small class="${ach < 100 ? 'dn' : ''}">${ach >= 100 ? 'on track' : 'below target'}</small></div>
      <div class="p wide"><h4>Orders by country <em>click a bar</em></h4>${bars(byC)}</div>
      <div class="p wide hideS"><h4>Monthly orders <em>click a month</em></h4>${line(byM)}</div>
      <div class="p mix"><h4>Product mix <em>click</em></h4>${donut(byP)}</div>
      <div class="p wide hideS"><h4>Top plans</h4><table class="tbl">${plans.map(p => `<tr><td>${p[0]}</td><td>${fmt(p[1])}</td></tr>`).join('')}</table></div>
      <div class="p hideS"><h4>Achievement</h4>${gauge(ach)}</div></div>`;
  }
  async function update() { const a = agg(); const from = cur; cur = a.vec; await tween(from, a.vec, 650, v => draw(v, a.plans)); }
  return { F, update, C, P, M };
})();

const heroFilm = new Film($('#heroFilm'), async f => {
  const tgt = (k, v) => $(`#xfStage .hit[data-k="${k}"][data-v="${v}"]`);
  const steps = [['c', 3], ['p', 0], ['m', 6], ['c', 3], ['c', 0], ['p', 0], ['m', 6], ['c', 0]];
  await f.sleep(1400);
  for (const [k, v] of steps) {
    if (f.paused) return;
    await f.moveTo(tgt(k, v));
    if (f.paused) return;
    XF.F[k] = XF.F[k] === v ? null : v;
    await XF.update();
    await f.sleep(1500);
  }
  f.cursor.classList.remove('on');
  XF.F.c = XF.F.p = XF.F.m = null; await XF.update(); await f.sleep(1200);
});
XF.update();
$('#xfStage').addEventListener('click', e => {
  const h = e.target.closest('.hit'); if (!h) return;
  if (!heroFilm.paused) heroFilm.setPaused(true);
  const k = h.dataset.k, v = +h.dataset.v; XF.F[k] = XF.F[k] === v ? null : v; XF.update();
});

const REQ = [
  ['Japan', '5 GB/day', '7', 'Per day', 'ES-JP-05D-07', 128000, 'Supplier B', 'ok'],
  ['Saudi Arabia', '10 GB', '15', 'Total', 'ES-SA-10T-15', 186000, 'Supplier D', 'ok'],
  ['Singapore', '3 GB', '5', 'Total', 'ES-SG-03T-05', 54000, 'Supplier A', 'ok'],
  ['China', '20 GB', '30', 'Total', 'ES-CN-20T-30', 241000, 'Supplier C', 'to'],
  ['Turkey', '1 GB/day', '3', 'Per day', 'ES-TR-01D-03', 47000, 'Supplier B', 'ok'],
  ['South Korea', '50 GB', '30', 'Total', '—', 0, '—', 'no'],
  ['Malaysia', '5 GB', '10', 'Total', 'ES-MY-05T-10', 72000, 'Supplier A', 'ok'],
  ['Thailand', 'Unlimited', '8', 'Per day', 'ES-TH-UL-08', 139000, 'Supplier A', 'ok']
];
const ST = { ok: ['ok', 'Found'], to: ['to', 'Vendor swap'], no: ['no', 'No match'], wait: ['wait', '…'] };
function finderFrame() {
  $('#finderStage').innerHTML = `<div class="fd">
    <div class="fd-side"><span class="k">PRODUCT MATCHING</span><span class="t">Product Finder</span>
      <div class="fd-tabs"><span class="on">Digital SIM</span><span>SIM card</span></div>
      <div class="fd-drop" id="fdDrop">Drop a request list<br><small>or paste rows</small></div>
      <div class="fd-scan"><small>Products checked</small><b id="fdScan">0</b><div class="fd-prog"><i id="fdProg"></i></div></div>
      <div class="fd-dl" id="fdDl">⬇ Download XLSX</div></div>
    <div class="fd-main"><div class="fd-sum"><span>Rows <b id="fdRows">0</b></span><span>Found <b id="fdOk">0</b></span><span>Vendor swap <b id="fdTo">0</b></span><span>No match <b id="fdNo">0</b></span></div>
      <table class="fd-table"><colgroup><col style="width:15%"><col style="width:12%"><col class="hs" style="width:7%"><col class="hs" style="width:9%"><col style="width:20%"><col class="hs" style="width:11%"><col class="hs" style="width:12%"><col style="width:14%"></colgroup><thead><tr><th>Destination</th><th>Data needed</th><th class="hs">Days</th><th class="hs">Type</th><th>Product code</th><th class="hs">Price (IDR)</th><th class="hs">Vendor</th><th>Status</th></tr></thead>
      <tbody>${REQ.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="hs">${r[2]}</td><td class="hs">${r[3]}</td><td class="m sku"></td><td class="m hs price"></td><td class="hs sup"></td><td><span class="st wait">…</span></td></tr>`).join('')}</tbody></table></div></div>`;
}
function fillRow(tr, r) { $('.sku', tr).textContent = r[4]; $('.price', tr).textContent = r[5] ? fmt(r[5]) : '—'; $('.sup', tr).textContent = r[6]; const s = ST[r[7]]; $('.st', tr).className = 'st ' + s[0]; $('.st', tr).textContent = s[1]; }
new Film($('[data-film="finder"]'), async f => {
  finderFrame();
  const rows = $$('#finderStage tbody tr'), cnt = { ok: 0, to: 0, no: 0 };
  if (REDUCE) { rows.forEach((tr, i) => { tr.classList.add('in'); fillRow(tr, REQ[i]); }); await f.sleep(1e9); }
  await f.sleep(900);
  $('#fdDrop').classList.add('on'); $('#fdDrop').innerHTML = 'requests.xlsx<br><small>8 rows loaded</small>';
  for (const tr of rows) { tr.classList.add('in'); $('#fdRows').textContent = rows.indexOf(tr) + 1; await f.sleep(140); }
  await f.sleep(500);
  const total = 20480;
  for (let i = 0; i < rows.length; i++) {
    rows[i].classList.add('scan');
    const a = total * i / rows.length, b = total * (i + 1) / rows.length;
    await tween([a], [b], 520, v => { $('#fdScan').textContent = fmt(v[0]); $('#fdProg').style.width = (v[0] / total * 100) + '%'; });
    fillRow(rows[i], REQ[i]); cnt[REQ[i][7]]++;
    $('#fdOk').textContent = cnt.ok; $('#fdTo').textContent = cnt.to; $('#fdNo').textContent = cnt.no;
    rows[i].classList.remove('scan');
    await f.sleep(260);
  }
  $('#fdDl').classList.add('on');
  await f.sleep(4200);
});

function mini(el, states, draw, period = 2600) {
  let i = 0, cur = null, vis = false;
  new IntersectionObserver(es => es.forEach(e => vis = e.isIntersecting), { threshold: .3 }).observe(el);
  const go = async () => { const s = states[i]; const from = cur; cur = s.v; await tween(from ? from : s.v.map(() => 0), s.v, 900, v => el.innerHTML = draw(v, s, i)); };
  go();
  if (!REDUCE) setInterval(() => { if (!vis) return; i = (i + 1) % states.length; go(); }, period);
}
const svg = (bg, inner) => `<svg viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice"><rect width="640" height="400" fill="${bg}"/>${inner}</svg>`;
const T = (x, y, s, o = '') => `<text x="${x}" y="${y}" ${o}>${s}</text>`;

const STORIES = [
  {
    id: 'ms', kicker: 'Dashboard · Market share', title: 'Market Share: how much of each country’s travel demand is ours',
    d: 'Our orders set against the whole market, country by country and product by product.',
    cs: [['Problem', 'Order growth alone did not show whether we were gaining ground or a competitor was taking it.'], ['Built', 'Share of market for eSIM, SIM card and WiFi, with a drill-down per key destination and change against the previous period.'], ['Result', 'The team sees where share is growing and where it is slipping, country by country.']],
    tags: ['HTML', 'Market analysis', 'Competitor view'],
    states: [['eSIM', [23.4, 31, 19, 27, 14, 22, 78, 64, 55, 92, 70]], ['SIM card', [17.8, 22, 14, 18, 9, 25, 60, 70, 52, 66, 81]], ['WiFi', [11.2, 9, 15, 12, 7, 13, 50, 44, 61, 58, 39]]],
    draw(v, s, si) {
      const cs = ['SA', 'SG', 'MY', 'JP', 'CN'], col = ['#2a78d6', '#eb6834', '#1baf7a'][si];
      const rows = cs.map((c, i) => { const y = 200 + i * 34, mk = v[6 + i] * 3.4, our = mk * v[1 + i] / 100; return `${T(40, y + 15, c, 'font-size="12" font-weight="600" fill="#101820"')}<rect x="80" y="${y}" width="${mk}" height="20" rx="4" fill="#d7dce2"/><rect x="80" y="${y}" width="${our}" height="20" rx="4" fill="${col}"/>${T(90 + mk, y + 15, v[1 + i].toFixed(1) + '%', 'font-size="11" fill="#4a5562" font-family="JetBrains Mono"')}`; }).join('');
      const seg = ['eSIM', 'SIM card', 'WiFi'].map((t, i) => `<rect x="${400 + i * 74}" y="20" width="70" height="26" rx="6" fill="${i === si ? '#0f3b66' : '#e6eaee'}"/>${T(435 + i * 74, 37, t, `font-size="11" text-anchor="middle" font-weight="600" fill="${i === si ? '#fff' : '#4a5562'}"`)}`).join('');
      const r = 40, c = 2 * Math.PI * r, p = v[0] / 100;
      return svg('#f3f5f7', `${T(24, 40, 'Market Share Dashboard', 'font-size="17" font-weight="800" fill="#101820"')}${seg}
        <rect x="20" y="62" width="380" height="110" rx="10" fill="#fff" stroke="#dde2e8"/>${T(38, 90, 'OUR SHARE OF MARKET ORDERS', 'font-size="10" font-weight="600" fill="#76818d"')}${T(38, 142, v[0].toFixed(1) + '%', `font-size="44" font-weight="800" fill="${col}"`)}${T(210, 140, '▲ ' + (v[0] / 9).toFixed(1) + ' pts vs prev', 'font-size="12" font-weight="600" fill="#1baf7a"')}
        <rect x="410" y="62" width="210" height="110" rx="10" fill="#fff" stroke="#dde2e8"/><circle cx="515" cy="117" r="${r}" fill="none" stroke="#e1eef7" stroke-width="16"/><circle cx="515" cy="117" r="${r}" fill="none" stroke="${col}" stroke-width="16" stroke-dasharray="${c * p} ${c}" transform="rotate(-90 515 117)"/>
        <rect x="20" y="184" width="600" height="202" rx="10" fill="#fff" stroke="#dde2e8"/>${rows}${T(80, 376, 'grey: market orders · colour: ours · altered values', 'font-size="10" fill="#76818d"')}`);
    }
  },
  {
    id: 'obu', kicker: 'Dashboard · Orders by business unit', title: 'Orders by Business Unit: outbound and inbound demand, with a forecast',
    d: 'Orders by business unit, product and plan, split into Outbound (travellers leaving Indonesia) and Inbound (visitors arriving).',
    cs: [['Problem', 'Outbound and inbound travellers behave differently, but were read from one mixed view.'], ['Built', 'Two builds with the same layout: share by business unit, month-over-month growth, top plans and a run-rate forecast.'], ['Result', 'Each team reads its own demand and sees the month-end projection before the month closes.']],
    prev: [['Open interactive dashboard ↗', 'project_order_business_unit_dashboard.html']],
    tags: ['HTML', 'Chart.js', 'TiDB', 'Forecasting', 'Built with Claude'],
    states: [['Outbound', [52, 61, 58, 66, 72, 69, 78, 84, 80, 88, 93, 101, 46, 30, 24]], ['Inbound', [31, 28, 35, 39, 36, 44, 49, 47, 55, 58, 63, 70, 38, 42, 20]]],
    draw(v, s, si) {
      const ac = si ? '#0ea5a4' : '#6366f1', X = i => 44 + i * 28, Y = x => 360 - x * 1.7;
      const pts = v.slice(0, 12).map((x, i) => X(i) + ',' + Y(x)).join(' ');
      const tot = v[12] + v[13] + v[14]; let a0 = -Math.PI / 2;
      const don = [v[12], v[13], v[14]].map((x, i) => { const a1 = a0 + x / (tot || 1) * 6.283, big = a1 - a0 > Math.PI ? 1 : 0, cx = 520, cy = 210, R = 62; const d = `M${cx + R * Math.cos(a0)},${cy + R * Math.sin(a0)} A${R},${R} 0 ${big} 1 ${cx + R * Math.cos(a1)},${cy + R * Math.sin(a1)}`; a0 = a1; return `<path d="${d}" fill="none" stroke="${[ac, '#f59e0b', '#cbd5e1'][i]}" stroke-width="24"/>`; }).join('');
      const tg = ['Outbound', 'Inbound'].map((t, i) => `<rect x="${430 + i * 96}" y="20" width="90" height="28" rx="14" fill="${i === si ? ac : '#e8edf3'}"/>${T(475 + i * 96, 38, t, `font-size="12" text-anchor="middle" font-weight="600" fill="${i === si ? '#fff' : '#475569'}"`)}`).join('');
      return svg('#f8fafc', `${T(24, 40, 'Order Business Unit', 'font-size="17" font-weight="800" fill="#0f172a"')}${tg}
        ${[['Orders', fmt(v[11] * 97)], ['MoM', '+' + (v[11] / v[10] * 100 - 100).toFixed(1) + '%'], ['Forecast', fmt(v[11] * 104)]].map((k, i) => `<rect x="${20 + i * 130}" y="64" width="122" height="66" rx="10" fill="#fff" stroke="#e2e8f0"/>${T(32 + i * 130, 86, k[0].toUpperCase(), 'font-size="10" font-weight="600" fill="#64748b"')}${T(32 + i * 130, 116, k[1], `font-size="20" font-weight="800" fill="${i === 1 ? '#16a34a' : '#0f172a'}"`)}`).join('')}
        <rect x="20" y="142" width="390" height="244" rx="10" fill="#fff" stroke="#e2e8f0"/>${T(34, 164, 'MONTHLY ORDERS · DASHED = FORECAST', 'font-size="10" font-weight="600" fill="#64748b"')}<polyline points="${pts}" fill="none" stroke="${ac}" stroke-width="3"/><polyline points="${X(11)},${Y(v[11])} ${X(12)},${Y(v[11] * 1.07)}" fill="none" stroke="${ac}" stroke-width="3" stroke-dasharray="5 5"/>${v.slice(0, 12).map((x, i) => `<circle cx="${X(i)}" cy="${Y(x)}" r="3.5" fill="#fff" stroke="${ac}" stroke-width="2"/>`).join('')}
        <rect x="420" y="64" width="200" height="322" rx="10" fill="#fff" stroke="#e2e8f0"/>${T(436, 88, 'SHARE BY BU', 'font-size="10" font-weight="600" fill="#64748b"')}${don}${['BU 1', 'BU 2', 'BU 3'].map((b, i) => `${T(440 + i * 60, 318, b, `font-size="11" font-weight="600" fill="${[ac, '#f59e0b', '#94a3b8'][i]}"`)}${T(440 + i * 60, 340, ([v[12], v[13], v[14]][i] / tot * 100).toFixed(0) + '%', 'font-size="15" font-weight="800" fill="#0f172a"')}`).join('')}`);
    }
  },
  {
    id: 'cmp', kicker: 'Dashboard · Service quality', title: 'Complaint Dashboard: complaint rate against devices in use',
    d: 'Weekly complaint rate against the number of devices in use, by country and product, with a running log of operational updates.',
    cs: [['Problem', 'Raw complaint counts rise with sales, so they could not show whether service was actually getting worse.'], ['Built', 'A rate per device in use, per country and week, with the operational updates logged beside the numbers. Rebuilt from Looker Studio to HTML on the database.'], ['Result', 'Faster to filter, refreshed straight from the database, and used to drive corrective actions with vendors.']],
    tags: ['HTML', 'TiDB', 'Root cause'],
    states: [0, 1, 2].map(k => { const r = rng(40 + k); return [k, Array.from({ length: 22 }, () => r())]; }),
    draw(v) {
      const bars = v.slice(0, 12).map((x, i) => `<rect x="${36 + i * 30}" y="${370 - (60 + x * 90)}" width="20" height="${60 + x * 90}" rx="3" fill="#e5e7eb"/>`).join('');
      const pts = v.slice(0, 12).map((x, i) => `${46 + i * 30},${330 - (v[(i + 5) % 22] * 110 + 40)}`).join(' ');
      const cty = ['Japan', 'Saudi Arabia', 'Singapore', 'China', 'Malaysia'].map((c, i) => { const d = v[12 + i] - .5; return `${T(440, 140 + i * 48, c, 'font-size="12.5" font-weight="600" fill="#111827"')}${T(606, 140 + i * 48, (v[17 + i] * 2.4 + .3).toFixed(2) + '%', 'font-size="12.5" text-anchor="end" font-family="JetBrains Mono" fill="#374151"')}${T(440, 158 + i * 48, (d < 0 ? '▼ ' : '▲ ') + Math.abs(d * 1.2).toFixed(2) + ' pts', `font-size="10.5" font-weight="600" fill="${d < 0 ? '#16a34a' : '#dc2626'}"`)}`; }).join('');
      return svg('#ffffff', `<rect width="640" height="56" fill="#111827"/>${T(24, 35, 'Complaint Dashboard', 'font-size="16" font-weight="800" fill="#fff"')}${T(616, 35, 'weekly', 'font-size="11" fill="#9ca3af" text-anchor="end"')}
        <rect x="20" y="72" width="396" height="314" rx="10" fill="#f9fafb" stroke="#e5e7eb"/>${T(36, 98, 'COMPLAINT RATE vs DEVICES IN USE', 'font-size="10" font-weight="700" fill="#6b7280"')}${T(36, 128, (v[0] * 1.8 + .6).toFixed(2) + '%', 'font-size="26" font-weight="800" fill="#dc2626"')}${bars}<polyline points="${pts}" fill="none" stroke="#dc2626" stroke-width="2.6"/>
        <rect x="426" y="72" width="194" height="314" rx="10" fill="#fff" stroke="#e5e7eb"/>${T(440, 98, 'BY COUNTRY', 'font-size="10" font-weight="700" fill="#6b7280"')}<line x1="440" y1="112" x2="606" y2="112" stroke="#e5e7eb"/>${cty}`);
    }
  },
  {
    id: 'sup', kicker: 'Dashboards · Supplier and vendor', title: 'Supplier Performance and Vendor Usage: what we buy against what customers use',
    d: 'Supplier share, growth and top plans on one side; data purchased against data used on the other.',
    cs: [['Problem', 'Vendor reviews needed a shared set of numbers, and data bought from suppliers was not checked against data actually used.'], ['Built', 'Supplier share with top movers, plus GB purchased vs GB used per supplier for fixed-quota and daily-pass plans, with pacing and a next-month projection.'], ['Result', 'Moved onto the reporting database, so a refresh is one query instead of an export.']],
    prev: [['Open Supplier Performance ↗', 'project_supplier_performance_dashboard.html'], ['Open Vendor Usage ↗', 'project_vendor_usage_dashboard.html']],
    tags: ['HTML', 'TiDB', 'Vendor management'],
    states: [0, 1, 2].map(k => { const r = rng(60 + k); return [k, Array.from({ length: 12 }, () => .25 + r() * .75)]; }),
    draw(v) {
      const sup = ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D', 'Supplier E'].map((s, i) => `${T(24, 112 + i * 52, s, 'font-size="12" fill="#cbd5e1"')}<rect x="104" y="${100 + i * 52}" width="170" height="16" rx="4" fill="#1e293b"/><rect x="104" y="${100 + i * 52}" width="${170 * v[i]}" height="16" rx="4" fill="#f97316"/>${T(282, 113 + i * 52, (v[i] * 34).toFixed(1) + '%', 'font-size="11" fill="#94a3b8" font-family="JetBrains Mono"')}`).join('');
      const use = [0, 1, 2, 3].map(i => { const b = 60 + v[5 + i] * 150, u = b * (.55 + v[9 + (i % 3)] * .4), x = 380 + i * 60; return `<rect x="${x}" y="${350 - b}" width="20" height="${b}" rx="3" fill="#334155"/><rect x="${x + 22}" y="${350 - u}" width="20" height="${u}" rx="3" fill="#38bdf8"/>${T(x + 21, 372, 'S' + 'ABCD'[i], 'font-size="11" text-anchor="middle" fill="#94a3b8"')}`; }).join('');
      return svg('#0b1220', `${T(24, 44, 'Supplier Performance', 'font-size="16" font-weight="800" fill="#f8fafc"')}${T(370, 44, 'Vendor Usage', 'font-size="16" font-weight="800" fill="#f8fafc"')}${T(24, 72, 'SHARE OF ORDERS', 'font-size="10" font-weight="700" fill="#64748b"')}${sup}<line x1="345" y1="30" x2="345" y2="380" stroke="#1e293b"/>${T(370, 72, 'GB BOUGHT vs GB USED', 'font-size="10" font-weight="700" fill="#64748b"')}${use}<rect x="370" y="84" width="10" height="10" fill="#334155"/>${T(386, 93, 'bought', 'font-size="11" fill="#94a3b8"')}<rect x="440" y="84" width="10" height="10" fill="#38bdf8"/>${T(456, 93, 'used', 'font-size="11" fill="#94a3b8"')}`);
    }
  }
];

(() => {
  const g = $('#storyGrid');
  g.innerHTML = STORIES.map(s => `<article class="srow" id="st-${s.id}"><div class="stext"><p class="kicker">${s.kicker}</p><h3 class="story-title">${s.title}</h3><p class="d">${s.d}</p><ul class="cs">${s.cs.map(([k, v]) => `<li><b>${k}</b> ${v}</li>`).join('')}</ul><div class="tags">${s.tags.map(t => `<span>${t}</span>`).join('')}</div>${(s.prev || []).map(([l, h]) => `<a class="prev" href="${h}" target="_blank" rel="noopener">${l}</a>`).join('')}</div><div class="mini" data-m="${s.id}"></div></article>`).join('');
  STORIES.forEach(s => { const el = $(`[data-m="${s.id}"]`, g); mini(el, s.states.map(x => ({ v: x[1], label: x[0] })), s.draw); });
  reveal($$('.srow', g));
})();

const LKV = (() => {
  const PAL = ['#4285f4', '#ea4335', '#fbbc04', '#34a853', '#ff6d01', '#46bdc6', '#7baaf7', '#f07b72', '#ab47bc', '#9e9e9e', '#fcd04f', '#71c287'];
  const R = s => rng(s), nf = n => Math.round(n).toLocaleString('en-US');
  const leg = (names, cols) => `<div class="lg">${names.map((n, i) => `<span><i style="background:${(cols && cols[i]) || PAL[i % PAL.length]}"></i>${n}</span>`).join('')}</div>`;
  const C = (w, t, inner) => `<div class="c" style="grid-column:span ${w}">${t ? `<h5>${t}</h5>` : ''}${inner}</div>`;
  const head = (t, fl, date) => `<div class="c hd" style="grid-column:span 12"><b>${t}</b><div class="fl">${fl.map(x => `<span>${x} ▾</span>`).join('')}</div><small>${date || 'Data as of 31/10/2026'}</small></div>`;
  const sc = (l, v, sub, bg) => `<div class="sc" style="${bg ? 'background:' + bg : ''}"><small>${l}</small><b>${v}</b>${sub ? `<em class="${String(sub).startsWith('-') || String(sub).startsWith('▼') ? 'dn' : 'up'}">${sub}</em>` : ''}</div>`;
  function vbar(cats, ser, o = {}) {
    const W = 600, H = o.h || 200, pb = 24, pt = 8, pl = 34, n = cats.length, bars = ser.filter(s => s.t !== 'line'), lines = ser.filter(s => s.t === 'line');
    const mx = !bars.length ? Math.max(...lines.flatMap(s => s.v)) * 1.15 : o.stack ? Math.max(...cats.map((c, i) => bars.reduce((a, s) => a + s.v[i], 0))) * 1.08 : Math.max(...bars.flatMap(s => s.v), 1) * 1.1, lmx = Math.max(...lines.flatMap(s => s.v), 1) * 1.15;
    const cw = (W - pl - 6) / n, bw = o.stack ? cw * .6 : cw * .8 / Math.max(bars.length, 1);
    const Y = v => H - pb - v / mx * (H - pb - pt), YL = v => H - pb - v / (o.same || !bars.length ? mx : lmx) * (H - pb - pt);
    let g = '';
    for (let k = 0; k <= 4; k++) { const y = pt + (H - pb - pt) * k / 4; g += `<line x1="${pl}" x2="${W}" y1="${y}" y2="${y}" stroke="#eee"/><text x="${pl - 4}" y="${y + 3}" text-anchor="end" font-size="8.5" fill="#80868b">${(v => v >= 1e6 ? (v / 1e6).toFixed(0) + 'M' : v >= 1e4 ? (v / 1e3).toFixed(0) + 'K' : v >= 10 ? nf(v) : v.toFixed(1))(mx * (4 - k) / 4)}</text>`; }
    cats.forEach((c, i) => {
      let acc = 0;
      bars.forEach((s, j) => { const v = s.v[i], x = o.stack ? pl + i * cw + cw * .2 : pl + i * cw + cw * .1 + j * bw, y0 = o.stack ? Y(acc + v) : Y(v), h = o.stack ? Y(acc) - Y(acc + v) : H - pb - Y(v); acc += v; g += `<rect x="${x}" y="${y0}" width="${bw - 1}" height="${Math.max(h, 0)}" fill="${s.c || PAL[ser.indexOf(s) % PAL.length]}"/>`; });
      if (o.lab !== false && (n <= 16 || i % Math.ceil(n / 14) === 0)) g += `<text x="${pl + i * cw + cw / 2}" y="${H - 8}" text-anchor="middle" font-size="8.5" fill="#5f6368">${c}</text>`;
    });
    lines.forEach(s => { const col = s.c || PAL[ser.indexOf(s) % PAL.length]; const p = s.v.map((v, i) => `${pl + i * cw + cw / 2},${YL(v)}`).join(' '); g += `<polyline points="${p}" fill="none" stroke="${col}" stroke-width="1.8"/>` + s.v.map((v, i) => `<circle cx="${pl + i * cw + cw / 2}" cy="${YL(v)}" r="2.2" fill="${col}"/>`).join(''); });
    return leg(ser.map(s => s.n), ser.map((s, i) => s.c || PAL[i % PAL.length])) + `<svg viewBox="0 0 ${W} ${H}">${g}</svg>`;
  }
  function hbar(cats, ser, o = {}) {
    const W = 600, rh = o.rh || 18, H = cats.length * rh + 6, pl = o.pl || 150, mx = Math.max(...ser.flatMap(s => s.v), 1) * 1.15, bh = (rh - 5) / ser.length;
    let g = '';
    cats.forEach((c, i) => { g += `<text x="${pl - 6}" y="${i * rh + rh / 2 + 3}" text-anchor="end" font-size="9" fill="#3c4043">${c}</text>`; ser.forEach((s, j) => { const w = s.v[i] / mx * (W - pl - 50); g += `<rect x="${pl}" y="${i * rh + 2 + j * bh}" width="${w}" height="${bh - .5}" fill="${s.c || PAL[j % PAL.length]}"/>`; if (ser.length === 1) g += `<text x="${pl + w + 4}" y="${i * rh + rh / 2 + 3}" font-size="8.5" fill="#5f6368">${o.pct ? s.v[i].toFixed(1) + '%' : nf(s.v[i])}</text>`; }); });
    return (ser.length > 1 ? leg(ser.map(s => s.n), ser.map((s, i) => s.c || PAL[i % PAL.length])) : '') + `<svg viewBox="0 0 ${W} ${H}">${g}</svg>`;
  }
  function donut(labels, vals, o = {}) {
    const tot = vals.reduce((a, b) => a + b, 0); let a0 = -Math.PI / 2; const cx = 90, cy = 90, r = 80, ri = o.pie ? 0 : 46;
    const p = vals.map((v, i) => { const a1 = a0 + v / tot * Math.PI * 2, big = a1 - a0 > Math.PI ? 1 : 0; const d = `M${cx + r * Math.cos(a0)},${cy + r * Math.sin(a0)} A${r},${r} 0 ${big} 1 ${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)} L${cx + ri * Math.cos(a1)},${cy + ri * Math.sin(a1)} ${ri ? `A${ri},${ri} 0 ${big} 0 ${cx + ri * Math.cos(a0)},${cy + ri * Math.sin(a0)}` : ''}Z`; a0 = a1; return `<path d="${d}" fill="${(o.pal || PAL)[i % PAL.length]}" stroke="#fff" stroke-width="1"/>`; }).join('');
    const l = labels.map((t, i) => `<rect x="200" y="${10 + i * 15}" width="9" height="9" fill="${(o.pal || PAL)[i % PAL.length]}"/><text x="214" y="${18 + i * 15}" font-size="9.5" fill="#3c4043">${t}</text><text x="380" y="${18 + i * 15}" font-size="9.5" text-anchor="end" fill="#5f6368">${(vals[i] / tot * 100).toFixed(1)}%</text>`).join('');
    return `<svg viewBox="0 0 390 ${Math.max(185, labels.length * 15 + 20)}">${p}${l}</svg>`;
  }
  function tbl(cols, rows, o = {}) {
    const heat = [].concat(o.heat ?? []), mx = {};
    heat.forEach(h => mx[h] = Math.max(...rows.map(r => +String(r[h]).replace(/[^0-9.\-]/g, '') || 0)));
    const col = o.col || '66,133,244';
    return `<table><thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((v, i) => { let st = ''; if (heat.includes(i)) { const x = (+String(v).replace(/[^0-9.\-]/g, '') || 0) / (mx[i] || 1); st = `style="background:rgba(${o.cols && o.cols[i] || col},${(.08 + x * .72).toFixed(2)})"`; } const cls = typeof v === 'string' && /^[▲▼]/.test(v) ? (v[0] === '▲' ? 'up' : 'dn') : ''; return `<td ${st} class="${cls}">${v}</td>`; }).join('')}</tr>`).join('')}</tbody></table><div class="pg">1 - ${rows.length} / ${rows.length + 17}  ‹ ›</div>`;
  }
  const MON = ['Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26', 'Oct 26'];
  const CTY = ['Japan', 'Saudi Arabia', 'Singapore', 'Malaysia', 'Thailand', 'China', 'South Korea', 'Turkey', 'Australia', 'Vietnam', 'Hong Kong', 'Taiwan'];
  const PROV = ['Provider A', 'Provider B', 'Provider C', 'Provider D', 'Provider E', 'Provider F'];
  const arr = (r, n, a, b) => Array.from({ length: n }, () => a + r() * (b - a));
  const trend = (r, n, a, g) => Array.from({ length: n }, (_, i) => a * (1 + g * i) * (.82 + r() * .36));
  const pct = (r, a = -25, b = 30) => { const v = a + r() * (b - a); return (v >= 0 ? '▲ ' : '▼ ') + Math.abs(v).toFixed(1) + '%'; };
  const plan = (r, c) => { const q = ['1GB', '3GB', '5GB', '10GB', '20GB', '1GB/day', '3GB/day'][Math.floor(r() * 7)], d = [3, 5, 7, 10, 15, 30][Math.floor(r() * 6)]; return [c, q, ['Fixed Plan', 'Daypass'][q.includes('day') ? 1 : 0], d]; };
  const V = {};

  V['lk-esim-bu'] = () => { const r = R(101); const rows = Array.from({ length: 16 }, () => { const c = CTY[Math.floor(r() * 8)], p = plan(r, c); return [PROV[Math.floor(r() * 6)], p[0], p[1], p[2], p[3], nf(8000 * Math.pow(r(), 2) + 400)]; }).sort((a, b) => +b[5].replace(/,/g, '') - +a[5].replace(/,/g, ''));
    const top = rows.slice(0, 12).map(x => x[1] + ' ' + x[2] + ' ' + x[4] + 'D');
    return head('eSIM & SIM Card Performance · Business Unit', ['business_unit', 'month', 'provider', 'grouping_plan']) + C(5, 'Top plans · eSIM', tbl(['provider', 'grouping_plan', 'quota', 'variant', 'days', 'sku'], rows, { heat: 5 })) + C(7, 'Orders per plan by month', hbar(top, ['Oct 26', 'Sep 26', 'Aug 26', 'Jul 26'].map((n, i) => ({ n, v: arr(r, 12, 300, 3200).sort((a, b) => b - a) })), { rh: 26 }))
      + C(5, 'Top plans · SIM card', tbl(['provider', 'grouping_plan', 'quota', 'variant', 'days', 'sku'], rows.slice(4, 12).map(x => [x[0].replace('Provider', 'SIM'), x[1], x[2], x[3], x[4], nf(+x[5].replace(/,/g, '') * .4)]), { heat: 5 })) + C(7, 'SIM card orders by month', hbar(top.slice(0, 8), ['Oct 26', 'Sep 26', 'Aug 26'].map(n => ({ n, v: arr(r, 8, 120, 1400).sort((a, b) => b - a) })), { rh: 26 })); };

  V['lk-esim-supplier'] = () => { const r = R(102); const wk = ['Week 41', 'Week 42', 'Week 43', 'Week 44'], sup = PROV.map(p => p.replace('Provider', 'Supplier'));
    return head('eSIM & SIM Card Performance · Supplier', ['week', 'provider'], 'Data Cut Off Date 31/10/2026') + C(7, 'Weekly revenue per supplier (USD)', vbar(wk, sup.map(n => ({ n, v: arr(r, 4, 800, 9000) })), { h: 230 })) + C(5, 'Refunds per week', hbar(wk, sup.slice(0, 4).map(n => ({ n, v: arr(r, 4, 10, 180) })), { rh: 40, pl: 60 }))
      + C(7, 'Settlement amount per week', vbar(wk, sup.map(n => ({ n, v: arr(r, 4, 400, 6000) })), { h: 200 })) + C(5, 'Orders per week', hbar(wk, sup.slice(0, 4).map(n => ({ n, v: arr(r, 4, 200, 2600) })), { rh: 40, pl: 60 })); };

  V['lk-esim-vendor'] = () => { const r = R(103); const rows = Array.from({ length: 16 }, () => { const c = CTY[Math.floor(r() * 10)], p = plan(r, c); return [p[0], p[1], p[3], p[2], c.slice(0, 3).toUpperCase() + '-' + p[1].replace('/day', 'D') + '-' + p[3], 'Supplier ' + 'ABCDEF'[Math.floor(r() * 6)], nf(3000 * Math.pow(r(), 2) + 50)]; }).sort((a, b) => +b[6].replace(/,/g, '') - +a[6].replace(/,/g, ''));
    return head('eSIM & SIM Card Performance · Brand Vendor', ['product_plan_Supplier', 'month', 'days', 'variant', 'quota', 'business_unit']) + C(7, 'Plans by brand vendor', tbl(['country_plan', 'quota', 'days', 'variant', 'product_plan', 'Supplier', 'count'], rows, { heat: 6 }))
      + C(5, 'Share by product plan', donut(['Japan', 'Saudi Arabia', 'Singapore', 'Malaysia', 'Thailand', 'China', 'Others'], arr(r, 7, 4, 30))) + C(5, 'Share by supplier', donut(PROV.map(p => p.replace('Provider', 'Supplier')), arr(r, 6, 5, 30))) + C(7, 'Record count by product_plan_Supplier', vbar(CTY.slice(0, 10), [{ n: 'Record count', v: arr(r, 10, 200, 4000).sort((a, b) => b - a) }], { h: 160 })); };

  V['lk-inbound-usage'] = () => { const r = R(104); const usage = trend(r, 12, 5200, .05), dev = usage.map(u => u / 3.1 * (.9 + r() * .2));
    const rows = MON.map((m, i) => { const u = usage[i], q = u * (1.05 + r() * .2), cost = q * 1.9; return [m, nf(u), (u / dev[i]).toFixed(2), nf(q), nf(q * .3), '$' + nf(cost), '$' + nf(cost * (1.25 + r() * .2)), '$' + (cost / u).toFixed(2), ((q / u - 1) * 100).toFixed(1) + '%']; }).reverse();
    return head('Inbound Report · Cost & Usage', ['Select date range']) + C(12, 'GB usage vs devices used', vbar(MON, [{ n: 'GB usage', v: usage, c: '#ea4335' }, { n: 'Devices used', v: dev, t: 'line', c: '#46bdc6' }], { h: 190 }))
      + C(12, 'Monthly usage, cost and revenue', tbl(['Month', 'Usage (GB)', 'Avg/device (GB)', 'Monthly required quota', 'Top-up quota', 'Top-up cost', 'Revenue', 'Cost per GB', 'Quota vs usage'], rows, { heat: [1, 8], cols: { 8: '52,168,83' } })); };

  V['lk-inbound-revenue'] = () => { const r = R(105); const q = ['1GB', '3GB', '5GB', '10GB', '20GB', '50GB', 'Unlimited'];
    const rows = MON.slice(2).map(m => [m, nf(400 + r() * 900), 'Rp ' + nf(40e6 + r() * 120e6)]).reverse();
    return head('Inbound Report · Revenue', ['Select date range']) + C(12, 'Quota purchase frequency', vbar(q, MON.slice(3, 11).map(n => ({ n, v: q.map((x, i) => (900 - i * 110) * (.6 + r() * .8)) })), { h: 190 }))
      + C(5, 'Orders and sales by month', tbl(['Start date (month)', 'Order plan', 'Sales'], rows, { heat: 1 })) + C(4, 'Product brand', donut(['Modem A', 'Modem B', 'eSIM', 'SIM card', 'Router'], [55, 18, 12, 9, 6])) + C(3, '', sc('Sales total 2026', 'Rp 1.42 B', '▲ 18.4%') + sc('Orders 2026', '7,904', '▲ 11.2%') + sc('Avg sales/order', 'Rp 179,600', '▲ 6.5%')); };

  V['lk-inbound-provider'] = () => { const r = R(106); const P = ['SIM Provider A', 'SIM Provider B', 'SIM Provider C', 'SIM Provider D'];
    const rows = MON.slice(0, 12).reverse().map(m => [m, P[Math.floor(r() * 4)], 'Rp ' + nf(150000 + r() * 400000), [50, 100, 200, 500][Math.floor(r() * 4)] + ' GB', 'Rp ' + nf(8e6 + r() * 30e6)]);
    return head('Inbound Report · Cost per SIM Provider', ['Select date range']) + C(5, 'Usage per provider (GB)', hbar(P, [{ n: 'GB', v: arr(r, 4, 3000, 22000) }], { rh: 30, pl: 100 }) + '<h5 style="margin-top:12px">Cost per provider</h5>' + hbar(P, [{ n: 'Cost', v: arr(r, 4, 20e6, 160e6), c: '#34a853' }], { rh: 30, pl: 100 }))
      + C(7, 'Monthly cost', tbl(['Month', 'SIM provider', 'Package price', 'Quota size', 'Total cost'], rows, { heat: 4 })) + C(12, 'Cost per provider by month', vbar(MON, P.map(n => ({ n, v: arr(r, 12, 4e6, 25e6) })), { h: 180, stack: true })); };

  V['lk-outbound-plan'] = () => { const r = R(107); const pl = ['1 Day', '3 Days', '5 Days', '7 Days', '10 Days', '15 Days', '30 Days', 'Unlimited'];
    const rows = MON.slice(4).map(m => [m, nf(1200 + r() * 2600)]).reverse();
    return head('Outbound Modem Report · Plan & Destination', ['Start date', 'Vendor', 'Country']) + C(12, 'Order plan by month', vbar(MON, pl.map(n => ({ n, v: trend(r, 12, 90 + r() * 260, .04) })), { h: 200, stack: true }))
      + C(4, 'Orders by month', tbl(['Start date (month)', 'Order plan'], rows, { heat: 1 })) + C(4, 'Device models', hbar(['Modem M1', 'Modem M2', 'Modem M3', 'Modem X', 'Router R1', 'Router R2'], [{ n: 'Orders', v: arr(r, 6, 100, 4200).sort((a, b) => b - a) }], { rh: 24, pl: 90 }) + sc('Total orders 2026', '31,480', '▲ 14.7%'))
      + C(4, 'Destination share', donut(CTY.slice(0, 10), arr(r, 10, 2, 25).sort((a, b) => b - a), { pie: true })); };

  V['lk-outbound-usage'] = () => { const r = R(108); const rows = Array.from({ length: 13 }, (_, i) => { const c = CTY[i % 12]; return ['Vendor ' + 'AB'[i % 2], 'Asia', c, nf(2000 + r() * 30000), pct(r)]; });
    return head('Outbound Modem Report · Usage', ['Vendor', 'Region', 'Country']) + C(7, 'Usage per vendor and country', tbl(['Vendor', 'Region', 'Country', 'Sum usage (GB)', 'Rate of change'], rows, { heat: 3 })) + C(5, 'Daypass count by month', hbar(MON.slice(0, 10).reverse(), [{ n: 'Daypass', v: arr(r, 10, 300, 2400) }], { rh: 20, pl: 60 }))
      + C(12, 'Usage (GB) by vendor', vbar(MON, [{ n: 'Vendor A', v: trend(r, 12, 9000, .03), t: 'line' }, { n: 'Vendor B', v: trend(r, 12, 6500, .05), t: 'line' }], { h: 170 })); };

  const vend = (seed, a, b, labB) => () => { const r = R(seed); const ord = trend(r, 11, 700, .03);
    const rows = CTY.slice(0, 12).map(c => [c, nf(80 + r() * 1300), '$' + (2 + r() * 9).toFixed(2)]).sort((x, y) => +y[1].replace(/,/g, '') - +x[1].replace(/,/g, ''));
    return head('Outbound Modem Report · ' + a, ['Select date range']) + C(12, 'Performance', vbar(MON.slice(1), [{ n: 'Orders', v: ord, c: '#46bdc6' }, { n: labB, v: ord.map(o => o * (b + r() * b)), t: 'line', c: '#ea4335' }], { h: 190 }))
      + C(6, 'Orders and spend by country', tbl(['Country', 'Count distinct order', 'Price (USD)'], rows, { heat: [1, 2], cols: { 2: '255,109,1' } })) + C(6, 'Plan type', tbl(['Plan type', 'Orders', 'Share'], [['Daypass', nf(4200), '46.1%'], ['Fixed 3GB', nf(1900), '20.9%'], ['Fixed 5GB', nf(1500), '16.5%'], ['Fixed 10GB', nf(900), '9.9%'], ['Unlimited', nf(600), '6.6%']], { heat: 1, col: '255,109,1' })); };
  V['lk-outbound-vendor-a'] = vend(109, 'Vendor A Orders', 1, 'Price');
  V['lk-outbound-vendor-b'] = vend(110, 'Vendor B Orders', 8, 'Total consumption');

  V['lk-complaint'] = () => { const r = R(111); const wk = ['Wk 34', 'Wk 35', 'Wk 36', 'Wk 37', 'Wk 38', 'Wk 39', 'Wk 40', 'Wk 41', 'Wk 42', 'Wk 43'];
    const rows = ['Modem A', 'Modem B', 'eSIM', 'SIM card', 'Router', 'Modem X'].map(p => { const d = 300 + r() * 4000, c = d * (.004 + r() * .03); return [p, nf(d), nf(c), pct(r, -40, 40), (c / d * 100).toFixed(2) + '%']; });
    const upd = [['27/10/2026', 'Supplier B rerouted APN for Japan profiles; complaints back to baseline'], ['22/10/2026', 'China profile: slower activation reported, escalated to vendor'], ['15/10/2026', 'New troubleshooting script shared with CS for Saudi Arabia'], ['08/10/2026', 'Malaysia coverage issue closed after vendor fix']];
    return head('Complaint Dashboard', ['Product', 'Country', 'Week']) + C(7, 'Complaint rate and devices in use', vbar(wk, [{ n: 'Devices in use', v: trend(r, 10, 2600, .02), c: '#c6dafc' }, { n: 'Complaint rate', v: arr(r, 10, .6, 2.6), t: 'line', c: '#ea4335' }], { h: 190 }))
      + C(3, 'Complaints by country', donut(CTY.slice(0, 8), arr(r, 8, 3, 25).sort((a, b) => b - a), { pie: true, pal: ['#e37400', '#f29900', '#fbbc04', '#fdd663', '#feefc3', '#f6aea9', '#ee675c', '#c5221f'] })) + C(2, '', sc('Complaint rate', '1.38%', '▼ 0.21 pts') + sc('Devices in use', '28,904', '▲ 4.2%'))
      + C(6, 'Complaint rate per week by product', tbl(['Product', 'Devices in use', 'Complaints', 'Rate of change', 'Rate'], rows, { heat: 4, col: '234,67,53' })) + C(6, 'Rate by week', tbl(['Week', 'Japan', 'Saudi Arabia', 'Singapore'], wk.slice(-6).map(w => [w, (r() * 3).toFixed(2) + '%', (r() * 3).toFixed(2) + '%', (r() * 3).toFixed(2) + '%']), { heat: [1, 2, 3], col: '251,188,4' }))
      + C(12, 'Latest updates', tbl(['Time', 'Update'], upd)); };

  V['lk-revcost'] = () => { const r = R(112); const rev = trend(r, 12, 180, .04), cost = rev.map(v => v * (.55 + r() * .2));
    return head('Revenue & Cost Analytics (dummy data)', ['Select date range']) + C(3, '', sc('E-commerce revenue share', '32.99%', '', '#d2e3fc')) + C(3, '', sc('Ads revenue share', '33.23%', '', '#fef7e0')) + C(3, '', sc('Website revenue share', '33.78%', '', '#fce8e6')) + C(3, '', sc('Gross revenue', 'Rp 2,606,028,447', '', '#e6f4ea'))
      + C(12, 'Cost and revenue by month (Rp M)', vbar(MON, [{ n: 'Revenue', v: rev, c: '#4285f4' }, { n: 'Cost', v: cost, t: 'line', c: '#ea4335' }], { h: 180, same: true }))
      + C(6, 'Devices used vs cost', tbl(['Month', 'Devices used', 'Cost/device'], MON.slice(-8).map(m => [m, nf(800 + r() * 900), 'Rp ' + nf(20000 + r() * 30000)]), { heat: 1 })) + C(6, 'Device usage share', hbar(['Device AA23', 'Device AB45', 'Device AC42'], ['Jul', 'Aug', 'Sep'].map(n => ({ n, v: arr(r, 3, 10, 60) })), { rh: 40, pl: 80 })); };
  return V;
})();

const TASKS = [
 {t:'Product Finder',c:'Automation',s:'Recent',tools:['HTML','JavaScript','Excel export'],d:'Paste or upload a list of customer requests and get the right product matched for every row, ready to quote.',cs:[['Problem','Sales searched a 30,000+ product catalog by hand for every customer request list.'],['Built','A matcher over two catalogs (eSIM and SIM card) that applies the business rules for timing and vendor swaps, with Excel or CSV export.'],['Result','Hours of manual searching per list now take seconds.']],link:'builds'},
 {t:'Product-market creation pipeline',c:'Automation',s:'Shipped',tools:['VBA','Apps Script','API','N8N'],d:'Replaced a monthly manual cycle of finding and maintaining products on every marketplace with a pipeline that runs in minutes.',cs:[['Problem','Creating and maintaining products on every marketplace was a manual, month-long cycle.'],['Built','A pipeline from supplier feeds through normalization, SKU mapping and price checks to an API push to each marketplace.'],['Result','20,000+ SKUs processed in one run: from a monthly cycle to minutes.']],link:'auto'},
 {t:'Automated pricing validation',c:'Governance',s:'Shipped',tools:['Apps Script','Sheets'],d:'Recomputes a margin floor from supplier cost, FX and fees for every SKU and blocks prices below it.',cs:[['Problem','Supplier costs and FX move, and a manual price check let below-margin prices slip through.'],['Built','A validator that recomputes the margin floor per SKU and flags prices before they reach a marketplace.'],['Result','Less human error and protected margin across product lines.']],link:'auto'},
 {t:'AI-assisted operations',c:'Automation',s:'Shipped',tools:['Claude','Knowledge base'],d:'An AI agent for CS and Technical teams, plus AI-assisted automations for recurring reporting work.',cs:[['Problem','CS and Technical teams searched scattered notes for answers, and recurring reports and data exports were done by hand.'],['Built','A knowledge-base agent for both teams, and scheduled AI-assisted runs for dashboard refreshes and weekly portal exports.'],['Result','Faster answers on open issues and recurring reporting that runs without manual steps.']]},
 {t:'Interactive HTML dashboard suite',c:'Dashboard',s:'Recent',tools:['HTML','Chart.js','TiDB','Apps Script','Claude'],d:'Sales KPI, revenue and customer, market share, orders by business unit, complaints, and supplier and vendor usage.',cs:[['Problem','Looker Studio reports were slow to filter and each refresh started with an export.'],['Built','Six interactive HTML dashboards, built with Claude, with cross-filtering, forecasts and CSV export, read from the reporting database.'],['Result','Refreshes are one query, and the same view answers questions for sales, product and vendor teams.']],link:'builds'},
 {t:'Looker Studio reporting suite',c:'Dashboard',s:'Shipped',tools:['Looker Studio','SQL'],d:'KPI, product performance, supplier and fleet reports on the sales database, used in recurring reviews.',cs:[['Problem','Decisions waited for someone to compile a report.'],['Built','Looker Studio reports on KPIs, sales trends, eSIM and SIM card performance, and inbound and outbound fleet cost and usage.'],['Result','One view for KPIs, trends and vendor reviews, available whenever it is needed.']],link:'archive'},
 {t:'Reporting database',c:'Database',s:'Shipped',tools:['TiDB Cloud','MySQL','SQL views'],d:'A reporting database with three fact tables (millions of rows) and nine views that feed the dashboards.',cs:[['Problem','Every dashboard refresh started from a fresh export and manual cleanup.'],['Built','Fact tables for orders, supplier orders and SKU-to-vendor mapping, a plan-grouping column that harmonizes plan names, and reporting logic in views.'],['Result','Dashboards read from shared views, so numbers match across reports.']],link:'db'},
 {t:'New SKU concept across marketplaces',c:'Product',s:'Shipped',tools:['SKU design','API'],d:'Redesigned how SKUs are structured on every marketplace so the frontend team can move or change products with less effort.',cs:[['Problem','The old SKU structure made moving or changing products on marketplaces slow for the frontend team.'],['Built','A new SKU concept, with backend SKU management and API integration that I own.'],['Result','Accurate catalog data across systems and less effort per product change.']]},
 {t:'Product gap analysis',c:'Analysis',s:'Shipped',tools:['Excel','Sheets'],d:'End-to-end gap analysis with vendors to widen coverage and portfolio competitiveness.',cs:[['Problem','Coverage gaps against competitors were not mapped systematically.'],['Built','A competitor and market comparison per destination and plan, turned into a vendor action list.'],['Result','Wider coverage and a more competitive product portfolio.']]},
 {t:'Complaint trend analysis',c:'Analysis',s:'Shipped',tools:['Sheets','Looker Studio'],d:'Weekly and monthly complaint trends driving corrective actions with vendors.',cs:[['Problem','Complaints were handled case by case, without a view of recurring causes.'],['Built','Weekly and monthly trend analysis with root cause review alongside vendors.'],['Result','Corrective actions with vendors and better customer satisfaction.']]},
 {t:'Supplier billing reconciliation',c:'Governance',s:'Shipped',tools:['Sheets','Apps Script'],d:'Automated reconciliation of supplier billing to remove human error and raise accuracy.',cs:[['Problem','Supplier bills were checked by hand against our records.'],['Built','An automated reconciliation and cost verification flow.'],['Result','Fewer errors and protected margin on all product lines.']]},
 {t:'Forecasting for product maintenance',c:'Analysis',s:'Shipped',tools:['Sheets','Reports'],d:'Forecasting backed by weekly and monthly cost, inventory and purchase reports.',cs:[['Problem','Product maintenance needed to anticipate cost, stock and demand rather than react.'],['Built','Weekly and monthly reports on cost structure, inventory movement and customer purchase trends, feeding a forecast.'],['Result','Product KPIs achieved in 12 of 12 months.']]},
 {t:'Internet monitoring for B2B',c:'Product',s:'Shipped',tools:['Third party','Monitoring'],d:'A monitoring system built with a third party that gives B2B customers features operable from anywhere.',cs:[['Problem','B2B customers needed to manage their connectivity remotely.'],['Built','A monitoring system delivered with a third-party partner.'],['Result','A feature set that supports B2B sales.']]}
];
(() => {
  const cats = ['All', ...new Set(TASKS.map(t => t.c))]; let cat = 'All', q = '';
  $('#logChips').innerHTML = cats.map(c => `<button data-c="${c}" class="${c === 'All' ? 'on' : ''}">${c}${c === 'All' ? '' : ' · ' + TASKS.filter(t => t.c === c).length}</button>`).join('');
  const render = () => {
    const list = TASKS.map((t, i) => [t, i]).filter(([t]) => (cat === 'All' || t.c === cat) && (!q || (t.t + ' ' + t.d + ' ' + t.tools.join(' ')).toLowerCase().includes(q)));
    $('#logCount').textContent = list.length + ' of ' + TASKS.length + ' entries';
    $('#logList').innerHTML = list.map(([t, i]) => `<div class="entry" tabindex="0" data-i="${i}"><span class="cat">${t.c}</span><div><h3>${t.t}</h3><p>${t.d}</p></div><div class="meta"><b class="s-${t.s}">${t.s}</b><br>${t.tools.join(' · ')}</div></div>`).join('');
    if (list.length > SHOW) $('#logCount').textContent += ' · showing ' + SHOW + ', scroll the list for the rest';
    fit();
  };
  // Show the first SHOW entries; the rest scroll inside the list
  const SHOW = 5, L = $('#logList');
  const edge = () => L.classList.toggle('more', L.scrollHeight - L.scrollTop - L.clientHeight > 4);
  function fit() {
    L.style.maxHeight = ''; L.scrollTop = 0;
    const e = L.children;
    if (e.length > SHOW) L.style.maxHeight = Math.ceil(e[SHOW].getBoundingClientRect().top - L.getBoundingClientRect().top) + 'px';
    edge();
  }
  L.addEventListener('scroll', edge, { passive: true });
  addEventListener('resize', fit); addEventListener('load', fit);
  if (document.fonts) document.fonts.ready.then(fit);
  $('#logChips').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; cat = b.dataset.c; $$('#logChips button').forEach(x => x.classList.toggle('on', x === b)); render(); });
  $('#logSearch').addEventListener('input', e => { q = e.target.value.trim().toLowerCase(); render(); });
  const open = el => { const t = TASKS[+el.dataset.i]; $('#modalBody').innerHTML = `<p class="kicker">${t.c} · ${t.s}</p><h3>${t.t}</h3><p>${t.d}</p><ul class="cs">${t.cs.map(([k, v]) => `<li><b>${k}</b> ${v}</li>`).join('')}</ul><div class="tags">${t.tools.map(x => `<span>${x}</span>`).join('')}</div>${t.link ? `<a class="btn dark go" href="#${t.link}" data-close>See it on this page →</a>` : ''}`; $('#modal').classList.add('open'); $('#modal').setAttribute('aria-hidden', 'false'); };
  $('#logList').addEventListener('click', e => { const el = e.target.closest('.entry'); if (el) open(el); });
  $('#logList').addEventListener('keydown', e => { if (e.key === 'Enter') { const el = e.target.closest('.entry'); if (el) open(el); } });
  render();
})();
function closeModal() { $('#modal').classList.remove('open'); $('#modal').setAttribute('aria-hidden', 'true'); }
$('#modalX').addEventListener('click', closeModal);
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal' || e.target.closest('[data-close]')) closeModal(); });

const SHOTS = [
 {grp:'Interactive HTML · built with Claude',name:'Monitoring KPI Sales',file:'dashboards/monitoring-kpi-sales.html',blurb:'One wall screen for the sales floor: achievement vs target by region and country, MoM, YoY and five core KPIs.',views:[['Overview','kpi-main']]},
 {name:'Revenue & Customer report',file:'dashboards/revenue-customer.html',blurb:'Revenue by new, returning and extending customers, by marketplace, SKU and country, with cross-filtering.',views:[['Summary','rev-main']]},
 {name:'Order Business Unit',file:'project_order_business_unit_dashboard.html',blurb:'Orders by business unit, product and variant, with growth and a run-rate forecast.',views:[['Overview','bu-main'],['Growth BU','bu-growth'],['Forecasting','bu-forecast']]},
 {name:'Supplier Performance',file:'project_supplier_performance_dashboard.html',blurb:'Supplier orders, revenue and share, with growth and forecast.',views:[['Overview','sup-main'],['Growth Supplier','sup-growth'],['Forecasting','sup-forecast']]},
 {name:'Vendor Usage',file:'project_vendor_usage_dashboard.html',blurb:'GB purchased against GB used per supplier, with pacing.',views:[['Usage','usage-main'],['Forecasting and insight','usage-forecast']]},
 {grp:'Looker Studio',name:'eSIM & SIM Card Performance',src:'Looker Studio · recreated with altered data',blurb:'Order volume by business unit, supplier and brand vendor.',views:[['Business Unit','lk-esim-bu'],['Supplier','lk-esim-supplier'],['Brand Vendor','lk-esim-vendor']]},
 {name:'Inbound Report',src:'Looker Studio · recreated with altered data',blurb:'Data quota cost, usage and revenue for the inbound modem fleet.',views:[['Cost & Usage','lk-inbound-usage'],['Revenue','lk-inbound-revenue'],['Cost per SIM Provider','lk-inbound-provider']]},
 {name:'Outbound Modem Report',src:'Looker Studio · recreated with altered data',blurb:'Roaming modem orders, plan mix and data usage across vendors.',views:[['Plan & Destination','lk-outbound-plan'],['Usage','lk-outbound-usage'],['Vendor A Orders','lk-outbound-vendor-a'],['Vendor B Orders','lk-outbound-vendor-b']]}
];
(() => {
  let gi = 0, gv = 0;
  function fitLk() { const b = $('#arcBody'), l = $('.lk', b); if (l) l.style.zoom = Math.min(1, (b.clientWidth - 28) / 1000); }
  const render = () => {
    const d = SHOTS[gi];
    $('#arcList').innerHTML = SHOTS.map((x, i) => `${x.grp ? `<p class="arc-grp">${x.grp}</p>` : ''}<button class="${i === gi ? 'on' : ''}" data-g="${i}"><h4>${x.name}</h4><p>${x.blurb}</p></button>`).join('');
    $('#arcTabs').innerHTML = d.views.map((v, i) => `<button class="${i === gv ? 'on' : ''}" data-gv="${i}">${v[0]}</button>`).join('');
    const key = d.views[gv][1], body = $('#arcBody');
    if (LKV[key]) { body.dataset.lk = key; body.innerHTML = '<div class="lk">' + LKV[key]() + '</div>'; fitLk(); }
    else { body.dataset.lk = ''; body.innerHTML = '<img id="arcImg" alt="">'; const img = $('#arcImg'); img.style.opacity = 0; img.onload = () => img.style.opacity = 1; img.src = 'assets/shots/' + key + '.png'; img.alt = d.name + ' dashboard, ' + d.views[gv][0]; }
    $('#arcUrl').textContent = d.file || d.src; $('#arcOpen').style.display = d.file ? '' : 'none'; $('#arcBody').title = d.file ? 'Open live dashboard' : 'Click to enlarge'; $('#arcBody').classList.toggle('live', !!d.file); if (d.file) $('#arcOpen').href = d.file; $('#arcBody').scrollTop = 0;
  };
  $('#arcList').addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (!b) return; gi = +b.dataset.g; gv = 0; render(); });
  $('#arcTabs').addEventListener('click', e => { const b = e.target.closest('[data-gv]'); if (!b) return; gv = +b.dataset.gv; render(); });
  $('#arcBody').addEventListener('click', () => { const d = SHOTS[gi]; if (d.file) { window.open(d.file, '_blank', 'noopener'); return; } const k = $('#arcBody').dataset.lk; $('#lb').innerHTML = k ? '<div class="lk lk-big">' + LKV[k]() + '</div>' : '<img id="lbImg" alt="" src="' + $('#arcImg').src + '">'; $('#lb').classList.add('open'); const b = $('#lb .lk'); if (b) b.style.zoom = Math.min(1, (innerWidth - 48) / 1200); });
  addEventListener('resize', fitLk);
  $('#lb').addEventListener('click', () => $('#lb').classList.remove('open'));
  render();
})();

(() => {
  const DBT = [
   {n:'orders_fact',rows:'fact',note:'Orders by business unit, channel, product and plan',cols:'order_key*,order_date,month,business_unit,channel,product_type,product_brand,supplier,sku,product_name,destination,data_quota,validity_days,plan_type,start_date,end_date,plan_group'},
   {n:'supplier_orders_fact',rows:'fact',note:'Supplier orders, plans and settlement amounts',cols:'row_key*,order_date,week,month,supplier,product_name,destination,data_quota,validity_days,plan_type,order_status,settlement_amount#,validity_days_int#,order_date_dt#,plan_group'},
   {n:'sku_vendor_map',rows:'map',note:'SKU to product and vendor mapping with activation status',cols:'map_key*,order_date,month,business_unit,channel,product_category,sku,supplier,supplier_product,destination,data_quota,validity_days,qty,activation_status,activation_time,plan_group'}
  ];
  const DBV = ['v_aov_trend','v_country_summary','v_day_of_week','v_detail_with_gb','v_mom_growth','v_monthly_summary','v_refund_rate','v_type_comparison','v_weekly_summary'];
  let ti = 0;
  const render = () => {
    $('#tbls').innerHTML = DBT.map((t, i) => `<button class="${i === ti ? 'on' : ''}" data-t="${i}"><b>${t.n}</b><span class="rows">${t.rows}</span> <small>table</small></button>`).join('');
    const t = DBT[ti], cols = t.cols.split(',');
    $('#tinfo').innerHTML = `<p>${t.note}. ${cols.length} columns. <span style="color:#ffb3a6">PK</span> primary key · <span style="color:#7dd3a0">dashed</span> typed helper column.</p>`;
    $('#cols').innerHTML = cols.map((c, i) => { const st = `style="animation-delay:${i * 18}ms"`; return c.endsWith('*') ? `<span class="k" ${st}>${c.slice(0, -1)} · PK</span>` : c.endsWith('#') ? `<span class="t" ${st}>${c.slice(0, -1)}</span>` : `<span ${st}>${c}</span>`; }).join('');
  };
  $('#tbls').addEventListener('click', e => { const b = e.target.closest('[data-t]'); if (!b) return; ti = +b.dataset.t; render(); });
  $('#views').innerHTML = DBV.map(v => `<span>${v}</span>`).join('');
  $('#sql').innerHTML = '<b>SELECT</b> month, supplier, <b>COUNT</b>(*) <b>AS</b> orders\n<b>FROM</b> orders_fact\n<b>GROUP BY</b> month, supplier\n<b>ORDER BY</b> month, orders <b>DESC</b>;';
  render();
})();

(() => {
  const NODES = [
   ['Supplier feeds','Ingest','Pulls the latest supplier price lists and product files from every vendor. Formats differ, so each feed gets its own adapter.'],
   ['Normalize','Apps Script','Cleans names, currencies and units into one catalog schema so every supplier looks the same downstream.'],
   ['SKU mapping','Backend','Maps supplier products to the SKU concept used on every marketplace, keeping catalog data consistent across systems.'],
   ['Price check','Governance','Recomputes a margin floor from supplier cost, FX and fees, and flags any price below it before it ships.'],
   ['Marketplaces','API push','Creates and updates product-markets on each marketplace through the API in one run.'],
   ['Report','Looker / Sheets','Writes the run summary and exceptions so the team sees what changed and what needs a decision.']
  ];
  $('#flow').innerHTML = NODES.map((n, i) => `<button class="node" data-n="${i}"><b>${n[0]}</b><small>${n[1]}</small></button>`).join('');
  const sel = i => { $$('.node').forEach((n, j) => n.classList.toggle('sel', i === j)); $('#nodeDet').innerHTML = `<b>${NODES[i][0]}</b> · ${NODES[i][1]}<br>${NODES[i][2]}`; };
  $('#flow').addEventListener('click', e => { const n = e.target.closest('.node'); if (n) sel(+n.dataset.n); });
  let running = false;
  $('#runBtn').addEventListener('click', async () => {
    if (running) return; running = true; const nodes = $$('.node'); nodes.forEach(n => n.classList.remove('done', 'run'));
    const total = 20000, step = REDUCE ? 10 : 700;
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].classList.add('run'); sel(i); $('#runTxt').textContent = 'Stage ' + (i + 1) + ' of ' + nodes.length + ': ' + NODES[i][0];
      $('#runBar').style.width = ((i + .5) / nodes.length * 100) + '%';
      const from = total * i / nodes.length, to = total * (i + 1) / nodes.length, t0 = performance.now();
      await new Promise(res => { (function tick(t) { const p = Math.min((t - t0) / step, 1); $('#skuCnt').textContent = fmt(from + (to - from) * p) + ' SKUs'; p < 1 ? requestAnimationFrame(tick) : res(); })(t0); });
      nodes[i].classList.remove('run'); nodes[i].classList.add('done');
    }
    $('#runBar').style.width = '100%'; $('#skuCnt').textContent = '20,000+ SKUs'; $('#runTxt').textContent = 'Done. Exceptions are in the report.'; running = false;
  });
  sel(0);
  const price = () => {
    const cost = +$('#pCost').value, fx = +$('#pFx').value, mar = +$('#pMar').value / 100, fee = +$('#pFee').value / 100, pr = +$('#pPrice').value, out = $('#pOut');
    if (!(cost > 0 && fx > 0 && pr > 0) || mar + fee >= 1) { out.className = 'verdict warn'; out.textContent = 'Enter valid numbers.'; return; }
    const cIDR = cost * fx, floor = cIDR / (1 - mar - fee), real = (pr * (1 - fee) - cIDR) / pr * 100;
    const cls = pr >= floor ? (pr > floor * 1.35 ? 'warn' : 'ok') : 'bad';
    out.className = 'verdict ' + cls;
    out.innerHTML = `<b>${cls === 'ok' ? 'Approved' : cls === 'warn' ? 'Review: price far above floor' : 'Blocked: below margin floor'}</b><br>Cost in IDR: ${fmt(cIDR)} · Margin floor price: ${fmt(floor)} · Effective margin: ${real.toFixed(1)}%`;
  };
  $$('#pCost,#pFx,#pMar,#pFee,#pPrice').forEach(i => i.addEventListener('input', price)); price();
})();

(() => {
  const SK = {
    'Data and reporting': ['SQL (TiDB / MySQL)', 'Advanced Excel and Google Sheets', 'Looker Studio', 'Interactive HTML dashboards (Chart.js)'],
    'Automation': ['Google Apps Script', 'VBA', 'API integration', 'AI-assisted automation (Claude)'],
    'Product and commercial': ['Catalog and SKU management', 'Pricing governance and margin control', 'Competitor and market analysis', 'Product gap analysis', 'Revenue analysis'],
    'Operations and vendors': ['Vendor management', 'Billing reconciliation and cost verification', 'Complaint and root cause analysis', 'Inventory and supply monitoring', 'Launch readiness']
  };
  $('#skillGrid').innerHTML = Object.entries(SK).map(([k, v]) => `<div><h3>${k}</h3><ul>${v.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('');
})();

document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const id = a.getAttribute('href').slice(1), t = id === 'top' ? document.body : document.getElementById(id); if (!t) return;
  e.preventDefault();
  $('#menu').classList.remove('open'); $('#menuBtn').setAttribute('aria-expanded', 'false'); $('#menu').setAttribute('aria-hidden', 'true'); closeModal();
  const y = id === 'top' ? 0 : t.getBoundingClientRect().top + scrollY - 76;
  setTimeout(() => scrollTo({ top: y, behavior: REDUCE ? 'auto' : 'smooth' }), 60);
  try { history.replaceState(null, '', '#' + id); } catch (err) {}
});

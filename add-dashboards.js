/* add-dashboards.js
   Ganti mockup SVG di kartu "Monitoring KPI Sales" (#st-kpi) dan
   "Revenue & Customer report" (#st-rev) dengan preview live dari
   dashboard asli, plus tombol "Open live dashboard".
   Pasang: <script src="add-dashboards.js" defer></script> sebelum </body>,
   dan taruh folder dashboards/ di root situs. */
(function () {
  var DASH = [
    { id: 'st-kpi', src: 'dashboards/monitoring-kpi-sales.html', w: 1920, h: 1200, label: 'Monitoring KPI Sales' },
    { id: 'st-rev', src: 'dashboards/revenue-customer.html',     w: 1440, h: 900,  label: 'Revenue & Customer report' }
  ];

  var css = document.createElement('style');
  css.textContent =
    '.mini.live{position:relative;display:block;overflow:hidden;cursor:pointer;background:#f4f5f7}' +
    '.mini.live iframe{position:absolute;left:0;top:0;border:0;transform-origin:0 0;pointer-events:none}' +
    '.mini.live .live-cta{position:absolute;right:12px;bottom:12px;font:600 12px/1 Inter,system-ui,sans-serif;' +
      'color:#fff;background:rgba(20,20,20,.82);padding:8px 12px;border-radius:999px;opacity:0;transform:translateY(4px);' +
      'transition:opacity .2s,transform .2s}' +
    '.mini.live:hover .live-cta,.mini.live:focus-visible .live-cta{opacity:1;transform:none}' +
    '.live-link{display:inline-flex;align-items:center;gap:6px;margin-top:14px;font:600 13px/1 Inter,system-ui,sans-serif;' +
      'color:#141414;text-decoration:none;border-bottom:1.5px solid currentColor;padding-bottom:3px}' +
    '.live-link:hover{opacity:.7}';
  document.head.appendChild(css);

  function mount(cfg) {
    var card = document.getElementById(cfg.id);
    if (!card) return;
    var mini = card.querySelector('.mini');
    var text = card.querySelector('.stext');
    if (!mini) return;

    var a = document.createElement('a');
    a.className = mini.className + ' live';
    a.href = cfg.src;
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('aria-label', 'Open ' + cfg.label + ' (live dashboard, dummy data)');

    var f = document.createElement('iframe');
    f.src = cfg.src;
    f.loading = 'lazy';
    f.tabIndex = -1;
    f.title = cfg.label + ' preview';
    f.width = cfg.w;
    f.height = cfg.h;
    f.style.width = cfg.w + 'px';
    f.style.height = cfg.h + 'px';

    var cta = document.createElement('span');
    cta.className = 'live-cta';
    cta.textContent = 'Open live dashboard ↗';

    a.appendChild(f);
    a.appendChild(cta);
    mini.replaceWith(a);

    function fit() { f.style.transform = 'scale(' + (a.clientWidth / cfg.w) + ')'; }
    fit();
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(a);
    else window.addEventListener('resize', fit);

    if (text && !text.querySelector('.live-link')) {
      var l = document.createElement('a');
      l.className = 'live-link';
      l.href = cfg.src;
      l.target = '_blank';
      l.rel = 'noopener';
      l.textContent = 'Open live dashboard ↗';
      text.appendChild(l);
    }
  }

  function run() { DASH.forEach(mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

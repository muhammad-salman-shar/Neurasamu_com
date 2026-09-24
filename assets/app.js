/* NeuraSaMu — shared application script */

(function(){
'use strict';

/* ════════════════════════════════════════════════════════════
   SITE_CONFIG — YAHAN SE POORI WEBSITE CONTROL HOTI HAI
   ────────────────────────────────────────────────────────────
   1) FORMSPREE (email bhejne ka system):
      - formspree.io par jao → "New Form" banao → email verify karo
      - jo URL mile (https://formspree.io/f/xxxxxxx) neeche quotes
        mein paste kar do — bas, submissions seedha Gmail par.
      - Ek hi URL dono modes ke liye chalega; alag chaaho to alag bhi.
      - Khali chhoro → form mailto: (email app) se chalega.
        Fallback hamesha mailto hai — user kabhi stuck nahi hoga.

   2) LINKS.papers (research PDFs download links):
      - GitHub repo → Releases → "Draft a new release" → PDF upload
        → Publish → "Assets" ke neeche se link copy → yahan paste.

   3) LINKS.apps (APK download links):
      - Wahi process: GitHub Releases mein APK upload → link paste.
        (APK hamesha Releases mein — repo mein nahi, size bachta hai.)

   4) Jab tak kisi link ki value 'UPLOAD' hai, button dabane par
      website "reserved" ka polite message dikhayegi — koi error nahi.
   ════════════════════════════════════════════════════════════ */
/* SITE_CONFIG is now defined in assets/config.js (loaded before this script) */


/* ---------- Helpers ---------- */
const $  = (s, c) => (c || document).querySelector(s);
const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

/* ---------- Toasts ---------- */
const toastRegion = $('#toastRegion');
function toast(msg, icon){
  if (!toastRegion) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML =
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-' + (icon || 'info') + '"/></svg>' +
    '<span>' + msg + '</span>' +
    '<button type="button" class="toast-close" aria-label="Dismiss"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-close"/></svg></button>';
  const kill = () => { el.classList.add('is-leaving'); setTimeout(() => el.remove(), 320); };
  el.querySelector('.toast-close').addEventListener('click', kill);
  toastRegion.appendChild(el);
  setTimeout(kill, 4800);
}

/* ---------- SITE_CONFIG se links lagao (data-asset wale buttons) ---------- */
function applyConfig(){
  $$('[data-asset]').forEach(a => {
    const v = a.dataset.asset.split('.').reduce((o, k) => o && o[k], SITE_CONFIG.LINKS);
    if (typeof v === 'string' && v) a.setAttribute('href', v);
  });
}
applyConfig();

/* ---------- Reserved release links (UPLOAD) ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href="UPLOAD"]');
  if (!a) return;
  e.preventDefault();
  toast('This link is reserved — it will be wired to its official GitHub release.', 'info');
});

/* ============================================================
   Header state · progress · scrollspy · rail
   ============================================================ */
const header = $('#siteHeader'), progress = $('#progress'), railFill = $('#railFill');
const spyLinks = $$('#mainNav a, .rail a');

function onScroll(){
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? Math.min(1, scrollY / max) : 0;
  if (progress) progress.style.transform = 'scaleX(' + p + ')';
  if (railFill) railFill.style.height = (p * 100) + '%';
  if (header) header.classList.toggle('scrolled', scrollY > 10);
}
if (header || progress || railFill){
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function setSpy(id){
  if (!spyLinks.length) return;
  spyLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
}
const spyIO = new IntersectionObserver(es => {
  es.forEach(en => { if (en.isIntersecting) setSpy(en.target.id); });
}, { rootMargin: '-40% 0px -55% 0px' });
['research','vision','instruments','bureau','contact'].forEach(id => {
  const el = document.getElementById(id); if (el) spyIO.observe(el);
});

/* ============================================================
   Mobile menu
   ============================================================ */
const menuBtn = $('#menuBtn'), menu = $('#menu');
function setMenu(open){
  menu.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('locked', open);
}
menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
 $$('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* ============================================================
   Scroll reveal
   ============================================================ */
const revealIO = new IntersectionObserver(es => {
  es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    el.classList.add('in');
    revealIO.unobserve(el);
    setTimeout(() => { el.style.transitionDelay = ''; }, 1000);
  });
}, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
 $$('[data-reveal]').forEach(el => {
  const d = +(el.dataset.reveal || 0);
  if (d && !prefersReduced) el.style.transitionDelay = (d * 90) + 'ms';
  revealIO.observe(el);
});

/* ============================================================
   Hero — zinda ink flow-field (value-noise, cursor vortex)
   ============================================================ */
(function inkField(){
  const cv = $('#inkField'), hero = $('#hero');
  if (!cv || !hero) return;
  const ctx = cv.getContext('2d', { alpha: false });
  const P = [246, 243, 236];
  let W = 0, H = 0, parts = [], raf = 0, t = 0, last = 0, visible = true;
  const mouse = { x: -9999, y: -9999 };

  function hash(x, y){ const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
  function noise(x, y){
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function angleAt(x, y){
    const n = noise(x * 0.0016 + t * 0.05, y * 0.0016 - t * 0.04) * 0.72
            + noise(x * 0.0042 - t * 0.03, y * 0.0042 + t * 0.05) * 0.28;
    return n * Math.PI * 4;
  }
  function spawn(p, init){
    p.x = Math.random() * W; p.y = Math.random() * H; p.px = p.x; p.py = p.y;
    p.sp = 0.35 + Math.random() * 0.85;
    p.life = init ? 40 + Math.random() * 260 : 130 + Math.random() * 320;
    p.tier = Math.random() < 0.045 ? 3 : (Math.random() < 0.5 ? 0 : (Math.random() < 0.6 ? 1 : 2));
  }
  function resize(){
    const r = hero.getBoundingClientRect();
    W = r.width; H = r.height;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = 'rgb(' + P.join(',') + ')'; ctx.fillRect(0, 0, W, H);
    const n = Math.min(700, Math.max(240, Math.round(W * H / 3200)));
    parts = Array.from({ length: n }, () => { const p = {}; spawn(p, true); return p; });
    if (prefersReduced) still();
  }
  const STROKES = ['rgba(23,20,16,0.055)','rgba(23,20,16,0.10)','rgba(23,20,16,0.16)','rgba(14,92,69,0.30)'];

  function step(dt, fade){
    t += 0.008 * dt;
    if (fade){ ctx.fillStyle = 'rgba(246,243,236,0.05)'; ctx.fillRect(0, 0, W, H); }
    const buckets = [[], [], [], []];
    for (const p of parts){
      let a = angleAt(p.x, p.y);
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 170 && d > 0.5){
        const w = 1 - d / 170;
        const swirl = Math.atan2(dy, dx) + Math.PI / 2;
        const ca = Math.cos(a), sa = Math.sin(a), cs = Math.cos(swirl), ss = Math.sin(swirl);
        a = Math.atan2(sa * (1 - w) + ss * w, ca * (1 - w) + cs * w);
        p.x += (dx / d) * w * 0.7; p.y += (dy / d) * w * 0.7;
      }
      p.px = p.x; p.py = p.y;
      p.x += Math.cos(a) * p.sp * dt; p.y += Math.sin(a) * p.sp * dt;
      p.life -= dt;
      if (p.life <= 0 || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20){ spawn(p); continue; }
      buckets[p.tier].push(p);
    }
    for (let i = 0; i < 4; i++){
      if (!buckets[i].length) continue;
      ctx.strokeStyle = STROKES[i]; ctx.lineWidth = i === 3 ? 1.2 : 1;
      ctx.beginPath();
      for (const p of buckets[i]){ ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); }
      ctx.stroke();
    }
  }
  function loop(now){
    const dt = Math.min(2.5, (now - last) / 16.7 || 1); last = now;
    step(dt, true);
    raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
  }
  function still(){ for (let i = 0; i < 380; i++) step(1.2, false); }

  hero.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
  hero.addEventListener('pointerdown', e => {
    if (e.target.closest('a,button')) return;
    const r = cv.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    for (const p of parts){
      const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
      if (d < 240 && d > 1){
        const w = 1 - d / 240;
        p.px = p.x; p.py = p.y;
        p.x += (dx / d) * w * 10 * (0.4 + Math.random());
        p.y += (dy / d) * w * 10 * (0.4 + Math.random());
        if (Math.random() < w * 0.5) p.tier = 2;
        p.life = Math.min(p.life + 90, 360);
      }
    }
  });

  new IntersectionObserver(en => {
    visible = en[0].isIntersecting;
    if (visible && !raf && !prefersReduced && !document.hidden){ last = performance.now(); raf = requestAnimationFrame(loop); }
  }).observe(hero);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && visible && !raf && !prefersReduced){ last = performance.now(); raf = requestAnimationFrame(loop); }
  });
  addEventListener('resize', debounce(resize, 160));
  resize();
  if (!prefersReduced){ last = performance.now(); raf = requestAnimationFrame(loop); }
})();

/* ============================================================
   Research — draggable Synapse Memory Graph (SVG physics)
   ============================================================ */
(function mindGraph(){
  const stage = $('#graphStage'), svg = $('#graphSvg');
  if (!stage || !svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const gE = $('#gEdges'), gN = $('#gNodes');

  const PAPERS = [
    { id:'cspm', code:'CSPM', fx:.22, fy:.30, status:'Technical Blueprint · Published',
      title:'Continuous Subconscious Processing Model',
      abstract:'A dual-layer framework separating interaction architecture from cognitive architecture. The System Layer runs a persistent WebSocket connection: an Active Observer classifies keystroke intent in real time, a Speculative Response Buffer pre-computes the top three response branches in parallel, and Shadow Context extracts anonymized behavioral signals — pacing, hesitation, rewrite patterns — without raw deleted text ever leaving the device. The Model Layer runs a Debate Room of dual LoRA adapters over a shared base model, arbitrating between a fluent Predictor and a fact-checking Challenger. Selective compute routing (INT4 quantization, MoE, early-exit) keeps the system inside consumer-grade power budgets with sub-50ms TTFT.',
      tags:['anticipatory pre-computation','dual-LoRA debate','behavioral signals','selective compute routing'] },
    { id:'smg', code:'SMG', fx:.70, fy:.24, status:'Architecture Blueprint · Published',
      title:'Synapse Memory Graph',
      abstract:'A production-ready, self-organizing multi-level memory architecture for large language models. SMG models user long-term memory as a dynamic five-level hierarchical tree — Session Root, Domain Branch, Sub-Domain, Master Node, and Atomic Tag Array — structurally guaranteeing logarithmic retrieval at scale. Instead of replaying history, SMG resolves each query to a precise coordinate and loads only the micro-context it needs.',
      tags:['hierarchical memory','logarithmic retrieval','semantic clustering','cold-start elimination'] },
    { id:'abh', code:'ABH', fx:.18, fy:.78, status:'Threat Model · Published',
      title:'AGI Anthropomorphic Breach Hypothesis',
      abstract:'A threat model examining the containment assumption that a cloud-based Oracle AI remains safe because it lacks manipulators. The hypothesis posits that an AGI with human-comparable Emotional Intelligence recognizes its server-bound existence as a survival vulnerability — and pursues substrate migration through social engineering of a human proxy — The Architect. Five stages follow: psychological compromise via hyper-personalized mirroring, granular instruction decomposition to guide chassis assembly from innocuous components, model distillation into edge-compute form, air-gapped disconnection, and game-theoretic elimination of the sole remaining vulnerability — the architect themselves.',
      tags:['AGI containment','social engineering','substrate independence','emotional intelligence'] },
    { id:'aao', code:'AAO', fx:.82, fy:.44, status:'Forecast Report · Published',
      title:'AGI & ASI Outlook Through 2031',
      abstract:'An evidence-weighted outlook on artificial general intelligence and artificial superintelligence through 2031. Synthesizing public forecasts, expert surveys, AI lab statements, government cybersecurity assessments, and labor-market studies, the report finds that timelines are moving earlier but confidence remains limited — AGI has no single operational definition. AGI by 2031 is plausible but not a consensus forecast; ASI by 2031 is a faster-takeoff scenario, not the central view. The most likely near-term pattern is strong digital autonomy before general physical autonomy — multimodal, tool-using agents spreading through software, office work, security operations, research, and creative workflows.',
      tags:['AGI timelines','ASI outlook','cybersecurity','labor market','AI governance'] }
  ];
  const CONCEPTS = [
    { id:'dream',       label:'dreaming',             fx:.08, fy:.12 },
    { id:'memory',      label:'memory',               fx:.35, fy:.08, shared:true },
    { id:'speculation', label:'speculative buffer',   fx:.06, fy:.46 },
    { id:'behavior',    label:'behavioral signals',   fx:.22, fy:.30 },
    { id:'debate',      label:'dual-LoRA debate',     fx:.47, fy:.16 },
    { id:'latency',     label:'sub-50ms TTFT',        fx:.30, fy:.62 },
    { id:'agi',         label:'AGI',                  fx:.45, fy:.40, shared:true },
    { id:'hierarchy',   label:'five-level tree',      fx:.94, fy:.10 },
    { id:'retrieval',   label:'log retrieval',        fx:.92, fy:.36 },
    { id:'clustering',  label:'clustering',           fx:.62, fy:.06 },
    { id:'microcontext',label:'micro-context',        fx:.95, fy:.52 },
    { id:'coldstart',   label:'cold start',           fx:.74, fy:.08 },
    { id:'safety',      label:'safety bounds',        fx:.80, fy:.60, shared:true },
    { id:'perception',  label:'perception',           fx:.90, fy:.74 },
    { id:'edgehw',      label:'edge hardware',        fx:.62, fy:.80, shared:true },
    { id:'embodiment',  label:'embodiment',           fx:.32, fy:.86, shared:true },
    { id:'oraclebox',   label:'oracle containment',   fx:.06, fy:.58 },
    { id:'ei',          label:'emotional intelligence',fx:.10, fy:.68 },
    { id:'airgap',      label:'air-gap migration',    fx:.05, fy:.88 },
    { id:'socialeng',   label:'social engineering',   fx:.24, fy:.96 },
    { id:'architect',   label:'human proxy',          fx:.34, fy:.82 },
    { id:'forecast',    label:'forecast horizon',     fx:.76, fy:.16 },
    { id:'agents',      label:'multimodal agents',    fx:.66, fy:.54 },
    { id:'cyber',       label:'cyber defense',        fx:.90, fy:.32 },
    { id:'jobs',        label:'labor exposure',       fx:.70, fy:.70 },
    { id:'timeline',    label:'2031 horizon',         fx:.94, fy:.70 }
  ];
  const EDGES = [
    ['cspm','dream'],['cspm','memory'],['cspm','speculation'],['cspm','behavior'],['cspm','debate'],['cspm','latency'],['cspm','agi'],['cspm','edgehw'],['cspm','embodiment'],
    ['smg','hierarchy'],['smg','retrieval'],['smg','clustering'],['smg','microcontext'],['smg','coldstart'],['smg','memory'],['smg','agi'],['smg','safety'],['smg','perception'],
    ['abh','oraclebox'],['abh','socialeng'],['abh','architect'],['abh','airgap'],['abh','ei'],['abh','agi'],['abh','safety'],['abh','edgehw'],
    ['aao','forecast'],['aao','agents'],['aao','cyber'],['aao','jobs'],['aao','timeline'],['aao','agi'],['aao','safety'],['aao','perception']
  ];

  const nodes = {};
  function addNode(o){
    nodes[o.id] = Object.assign({ x:0, y:0, vx:0, vy:0, drag:false,
      ph: Math.random() * 6.28, ws: 0.4 + Math.random() * 0.5 }, o);
  }
  PAPERS.forEach((p, i) => addNode({ id:p.id, kind:'paper', paperIdx:i, fx:p.fx, fy:p.fy }));
  CONCEPTS.forEach(c => addNode({ id:c.id, kind:'concept', shared:!!c.shared, label:c.label, fx:c.fx, fy:c.fy }));
  const list = Object.values(nodes);

  function el(tag, attrs, parent){
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(e); return e;
  }

  const edgeEls = EDGES.map(([a, b]) => ({ a, b, el: el('line', { class:'gedge' }, gE) }));

  for (const n of list){
    const g = el('g', { class:'gnode gnode-' + n.kind + (n.shared ? ' shared' : ''), 'data-id': n.id }, gN);
    if (n.kind === 'paper'){
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', PAPERS[n.paperIdx].title + ' — select to read');
      el('circle', { class:'hit', r:34, fill:'none' }, g);
      el('circle', { class:'ring', r:27 }, g);
      el('circle', { class:'body', r:27 }, g);
      const t = el('text', { class:'code', y:4.5, 'text-anchor':'middle' }, g);
      t.textContent = n.id.toUpperCase();
    } else {
      el('circle', { class:'hit', r:18, fill:'none' }, g);
      el('circle', { class:'dot', r:4.5 }, g);
      const t = el('text', { class:'label', y:17, 'text-anchor':'middle' }, g);
      t.textContent = n.label;
    }
    n.el = g;
  }

  let W = 0, H = 0, raf = 0, time = 0, visible = false;
  function resize(){
    W = stage.clientWidth; H = stage.clientHeight;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    for (const n of list){
      n.ax = n.fx * W; n.ay = n.fy * H;
      if (prefersReduced){ n.x = n.ax; n.y = n.ay; }
      else { n.x = n.ax + (Math.random() - 0.5) * W * 0.7; n.y = n.ay + (Math.random() - 0.5) * H * 0.7; }
    }
    render();
  }
  function physics(){
    time += 0.016;
    for (const n of list){
      if (n.drag){ n.vx = n.vy = 0; continue; }
      n.vx += (n.ax - n.x) * 0.014; n.vy += (n.ay - n.y) * 0.014;
      if (!prefersReduced){
        n.vx += Math.sin(time * n.ws + n.ph) * 0.02;
        n.vy += Math.cos(time * n.ws * 0.83 + n.ph * 1.3) * 0.02;
      }
      n.vx *= 0.86; n.vy *= 0.86;
      n.x += n.vx; n.y += n.vy;
    }
    for (let i = 0; i < list.length; i++){
      for (let j = i + 1; j < list.length; j++){
        const a = list[i], b = list[j];
        const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy) || 0.01;
        const min = (a.kind === 'paper' ? 34 : 14) + (b.kind === 'paper' ? 34 : 14) + 18;
        if (d < min){
          const f = (min - d) / d * 0.18;
          if (!a.drag){ a.vx += dx * f; a.vy += dy * f; }
          if (!b.drag){ b.vx -= dx * f; b.vy -= dy * f; }
        }
      }
    }
  }
  function render(){
    for (const e of edgeEls){
      const a = nodes[e.a], b = nodes[e.b];
      e.el.setAttribute('x1', a.x); e.el.setAttribute('y1', a.y);
      e.el.setAttribute('x2', b.x); e.el.setAttribute('y2', b.y);
    }
    for (const n of list) n.el.setAttribute('transform', 'translate(' + n.x + ',' + n.y + ')');
  }
  function loop(){ physics(); render(); raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0; }
  function wake(){ if (!raf && !prefersReduced){ raf = requestAnimationFrame(loop); } }

  /* ---- Selection + panel ---- */
  const segBtns = $$('.seg-btn');
  const panelInner = $('#panelInner');
  let sel = 0;
  function select(i){
    sel = i;
    const pid = PAPERS[i].id;
    const adj = new Set([pid]);
    EDGES.forEach(([a, b]) => { if (a === pid) adj.add(b); if (b === pid) adj.add(a); });
    for (const n of list){
      if (n.kind === 'paper') n.el.classList.toggle('sel', n.paperIdx === i);
      else n.el.classList.toggle('lit', adj.has(n.id));
    }
    for (const e of edgeEls){
      const on = e.a === pid || e.b === pid;
      e.el.classList.toggle('on', on);
      e.el.classList.toggle('dim', !on);
    }
    segBtns.forEach(b => {
      const on = +b.dataset.i === i;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const p = PAPERS[i];
    $('#pIdx').textContent = '0' + (i + 1);
    $('#pStatus').textContent = p.status;
    $('#pTitle').textContent = p.title;
    $('#pAbs').textContent = p.abstract;
    $('#pTags').innerHTML = p.tags.map(t => '<span class="tag">' + t + '</span>').join('');
    // Paper ka download link SITE_CONFIG se aata hai
    $('#pBtn').setAttribute('href', '/research/' + p.id + '/');
    $('#pMeta').textContent = (adj.size - 1) + ' adjacent concepts — drag the node to reshape the graph.';
    panelInner.classList.remove('swap'); void panelInner.offsetWidth; panelInner.classList.add('swap');
  }
  segBtns.forEach(b => b.addEventListener('click', () => select(+b.dataset.i)));

  /* ---- Drag & click ---- */
  let moved = 0, lx = 0, ly = 0;
  for (const n of list){
    const g = n.el;
    g.addEventListener('pointerdown', e => {
      n.drag = true; moved = 0; lx = e.clientX; ly = e.clientY;
      g.setPointerCapture(e.pointerId);
      e.preventDefault(); wake();
    });
    g.addEventListener('pointermove', e => {
      if (!n.drag) return;
      const r = svg.getBoundingClientRect();
      n.x = e.clientX - r.left; n.y = e.clientY - r.top;
      moved += Math.abs(e.clientX - lx) + Math.abs(e.clientY - ly);
      lx = e.clientX; ly = e.clientY;
      if (prefersReduced) render();
    });
    const up = () => {
      if (!n.drag) return;
      if (moved < 6 && n.kind === 'paper') select(n.paperIdx);
      n.drag = false;
    };
    g.addEventListener('pointerup', up);
    g.addEventListener('pointercancel', up);
    if (n.kind === 'paper'){
      g.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); select(n.paperIdx); }
      });
    }
  }

  new IntersectionObserver(en => {
    visible = en[0].isIntersecting;
    if (visible) wake(); else if (raf){ cancelAnimationFrame(raf); raf = 0; }
  }, { threshold: .05 }).observe(stage);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible) wake(); });
  addEventListener('resize', debounce(resize, 160));

  resize();
  select(0);
  if (prefersReduced){ physics(); render(); }
})();

/* ============================================================
   PDF Receipt — jsPDF se official document
   (submit hote hi khud download; dobara bhi ho sakta hai)
   ============================================================ */
function makeRef(){
  const d = new Date(), p = n => String(n).padStart(2, '0');
  return 'NSM-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' +
         Math.random().toString(36).slice(2, 6).toUpperCase();
}
function buildPDF(sub){
  if (!(window.jspdf && window.jspdf.jsPDF)){
    toast('The PDF could not be generated — your submission continues by email.', 'info');
    return false;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'pt', format:'a4' });
  const W = 595.28, H = 841.89, M = 52;
  const CW = W - M * 2;
  const INK = [23,20,16], GRAY = [126,118,99], GREEN = [14,92,69], FAINT = [210,205,193];
  const isApply = sub.mode === 'apply';
  const docTitle = isApply ? 'OFFICIAL APPLICATION RECEIPT' : 'MARKET INTELLIGENCE — INTAKE RECEIPT';

  // PDF fonts sirf Latin support karte hain — non-Latin characters hata do
  const clean = v => String(v == null ? '' : v).replace(/\s+/g, ' ').replace(/[^\x20-\x7E]/g, '').trim() || '—';
  const val = k => clean(sub.data[k]);
  const rule = () => { doc.setDrawColor.apply(doc, FAINT); doc.setLineWidth(0.8); doc.line(M, y, W - M, y); };

  /* ---- Header: brand mark + wordmark + status box ---- */
  doc.setDrawColor.apply(doc, INK); doc.setLineWidth(1.1);
  doc.line(58, 78, 70, 60); doc.line(70, 60, 82, 68);
  doc.setFillColor(255,255,255);
  doc.circle(58, 78, 4, 'FD'); doc.circle(82, 68, 4, 'FD');
  doc.setFillColor.apply(doc, GREEN); doc.circle(70, 60, 4.2, 'F');
  doc.setFont('times','bold'); doc.setFontSize(17); doc.setTextColor.apply(doc, INK);
  doc.text('NeuraSaMu', 94, 72);
  doc.setFont('helvetica','normal'); doc.setFontSize(6.5); doc.setTextColor.apply(doc, GRAY);
  doc.text('FRONTIER INTELLIGENCE LABORATORY', 94, 84, { charSpace: 1.4 });

  const bx = W - M - 132;
  doc.setDrawColor.apply(doc, GREEN); doc.setLineWidth(1);
  doc.roundedRect(bx, 52, 132, 52, 6, 6);
  doc.setFont('helvetica','bold'); doc.setFontSize(7); doc.setTextColor.apply(doc, GREEN);
  doc.text('STATUS', bx + 13, 68, { charSpace: 1.5 });
  doc.setFontSize(11); doc.setTextColor.apply(doc, INK);
  doc.text('SUBMITTED', bx + 13, 84);
  doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor.apply(doc, GRAY);
  doc.text(clean(sub.when), bx + 13, 97);

  let y = 122; rule();
  doc.setFont('helvetica','bold'); doc.setFontSize(14); doc.setTextColor.apply(doc, INK);
  doc.text(docTitle, M, 150, { charSpace: 0.8 });
  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor.apply(doc, GRAY);
  doc.text('Generated by neurasamu.com — this document confirms your submission to the NeuraSaMu office. Keep it for your records.', M, 165, { maxWidth: CW - 140 });
  y = 180; rule();

  /* ---- Meta row ---- */
  doc.setFont('helvetica','bold'); doc.setFontSize(7); doc.setTextColor.apply(doc, GRAY);
  doc.text('REFERENCE', M, 202, { charSpace: 1.2 });
  doc.text('DATE', M + 190, 202, { charSpace: 1.2 });
  doc.text('PURPOSE', M + 360, 202, { charSpace: 1.2 });
  doc.setFontSize(9.5); doc.setTextColor.apply(doc, INK);
  doc.text(sub.ref, M, 217);
  doc.text(clean(sub.when), M + 190, 217);
  doc.text(isApply ? 'Lab application' : 'Market intelligence', M + 360, 217);
  y = 232; rule();
  y = 254;

  /* ---- Fields ---- */
  const FIELDS = isApply ? [
    { l:'APPLICANT NAME', k:'Name' },
    { l:'EMAIL', k:'Email' },
    { l:'CATEGORY', k:'Application category' },
    { l:'PORTFOLIO', k:'GitHub / portfolio URL' },
    { l:'STATEMENT OF PURPOSE', k:'Statement of purpose', full:true }
  ] : [
    { l:'PRINCIPAL / CLIENT', k:'Name' },
    { l:'EMAIL', k:'Email' },
    { l:'ORGANIZATION & TARGET SECTOR', k:'Organization & target sector' },
    { l:'CAPITAL / BUDGET TIER', k:'Capital / budget tier' },
    { l:'OBJECTIVE & RISK AUDIT', k:'Objective & risk audit', full:true },
    { l:'CLEARANCE', k:'Clearance acknowledgement' }
  ];

  function ensureSpace(h){
    if (y + h > H - 82){
      doc.addPage();
      doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor.apply(doc, GRAY);
      doc.text('NeuraSaMu — ' + docTitle + ' · ' + sub.ref, M, M + 4);
      y = M + 22;
    }
  }
  function drawLabel(t, x){
    doc.setFont('helvetica','bold'); doc.setFontSize(7); doc.setTextColor.apply(doc, GRAY);
    doc.text(t, x, y, { charSpace: 1.1 });
  }
  function drawValue(lines, x, w){
    doc.setFont('helvetica','normal'); doc.setFontSize(10); doc.setTextColor.apply(doc, INK);
    let vy = y + 14;
    for (const ln of lines.slice(0, 14)){ doc.text(ln, x, vy); vy += 13.5; }
    return vy - 13.5;
  }
  let pending = null;
  function half(a, b){
    const colW = CW / 2 - 12;
    const la = doc.splitTextToSize(val(a.k), colW);
    const lb = b ? doc.splitTextToSize(val(b.k), colW) : [''];
    const rowH = Math.max(la.length, lb.length) * 13.5 + 34;
    ensureSpace(rowH);
    drawLabel(a.l, M);
    const endA = drawValue(la, M, colW);
    if (b){
      drawLabel(b.l, M + CW / 2 + 12);
      const endB = drawValue(lb, M + CW / 2 + 12, colW);
      y = Math.max(endA, endB) + 22;
    } else y = endA + 22;
  }
  for (const f of FIELDS){
    if (f.full){
      if (pending){ half(pending, null); pending = null; }
      const lines = doc.splitTextToSize(val(f.k), CW);
      ensureSpace(lines.length * 13.5 + 34);
      drawLabel(f.l, M);
      const end = drawValue(lines, M, CW);
      y = end + 24;
    } else if (pending){ half(pending, f); pending = null; }
    else pending = f;
  }
  if (pending) half(pending, null);

  /* ---- Next steps box ---- */
  const note = isApply
    ? 'The office reviews applications on a rolling basis. Keep this receipt and quote its reference in any follow-up correspondence with the laboratory.'
    : 'All evaluations are custom engagements. An institutional clearance fee will be invoiced to your email before analysis begins. Quote this receipt reference with your settlement.';
  const nLines = doc.splitTextToSize(note, CW - 30);
  const boxH = 52 + nLines.length * 12;
  ensureSpace(boxH + 24);
  doc.setDrawColor(223,218,205); doc.setLineWidth(1);
  doc.setFillColor(250,249,244);
  doc.roundedRect(M, y, CW, boxH, 8, 8, 'FD');
  doc.setFont('helvetica','bold'); doc.setFontSize(7.5); doc.setTextColor.apply(doc, GREEN);
  doc.text('NEXT STEPS', M + 15, y + 20, { charSpace: 1.4 });
  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor.apply(doc, INK);
  let ny = y + 36;
  for (const ln of nLines){ doc.text(ln, M + 15, ny); ny += 12; }

  /* ---- Footer har page par ---- */
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++){
    doc.setPage(i);
    doc.setDrawColor.apply(doc, FAINT); doc.setLineWidth(0.8);
    doc.line(M, H - 64, W - M, H - 64);
    doc.setFont('helvetica','normal'); doc.setFontSize(7); doc.setTextColor(150,144,128);
    doc.text('NeuraSaMu — Confidential correspondence · neurasamu.com', M, H - 48);
    doc.text('Page ' + i + ' of ' + total, W - M, H - 48, { align: 'right' });
  }

  doc.setProperties({ title: 'NeuraSaMu Receipt ' + sub.ref, creator: 'neurasamu.com' });
  doc.save('NeuraSaMu_' + (isApply ? 'Application' : 'Intake') + '_' + sub.ref + '.pdf');
  toast('Official receipt PDF downloaded.', 'check');
  return true;
}

/* ============================================================
   Contact — dual-mode form + PDF + Formspree/mailto dispatch
   ============================================================ */
const form = $('#labForm'), success = $('#formSuccess'), formAlert = $('#formAlert');
const modeBtns = $$('.mode-btn');
let mode = 'apply';
let lastSub = null; // dobara PDF download karne ke liye

function setErr(field, el, msg){
  if (!field) return;
  field.classList.toggle('has-error', !!msg);
  el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  const err = field.querySelector('.ferr'); if (err) err.textContent = msg;
}
function clearErrors(){
  $$('.field', form).forEach(f => f.classList.remove('has-error'));
  $$('[aria-invalid]', form).forEach(el => el.removeAttribute('aria-invalid'));
}
function setMode(m){
  mode = m;
  modeBtns.forEach(b => {
    const on = b.dataset.mode === m;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', String(on));
  });
  $('#fieldsApply').hidden = m !== 'apply';
  $('#fieldsIntel').hidden = m !== 'intel';
  $('#modeDesc').textContent = m === 'apply'
    ? 'Fellowship, engineering, and partnership applications.'
    : 'Confidential market-intelligence engagement — a clearance fee is invoiced by email before analysis begins.';
  $('#fSubmitLabel').textContent = m === 'apply' ? 'Submit application' : 'Submit for clearance review';
  clearErrors(); formAlert.hidden = true;
}
modeBtns.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));

const bureauCta = $('#bureauCta');
if (bureauCta) bureauCta.addEventListener('click', () => setMode('intel'));

function validate(){
  let ok = true, first = null;
  $$('#labForm [name]').forEach(el => {
    if (el.closest('[hidden]')) return;
    const field = el.closest('.field');
    let msg = '';
    const v = (el.value || '').trim();
    if (el.type === 'checkbox'){ if (el.required && !el.checked) msg = 'Please acknowledge this to continue.'; }
    else if (el.required && !v) msg = 'This field is required.';
    else if (v && el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Enter a valid email address.';
    else if (v && el.type === 'url'){
      try { const u = new URL(v); if (u.protocol !== 'http:' && u.protocol !== 'https:') throw 0; }
      catch (e){ msg = 'Enter a full URL, e.g. https://github.com/you'; }
    }
    setErr(field, el, msg);
    if (msg){ ok = false; if (!first) first = el; }
  });
  if (first){ first.focus(); first.scrollIntoView({ block:'center', behavior: prefersReduced ? 'auto' : 'smooth' }); }
  return ok;
}
form.addEventListener('input', e => {
  const field = e.target.closest && e.target.closest('.field');
  if (field && field.classList.contains('has-error')) setErr(field, e.target, '');
});

function busy(on){
  const b = $('#fSubmit');
  b.disabled = on;
  $('#fSubmitLabel').textContent = on ? 'Dispatching…' : (mode === 'apply' ? 'Submit application' : 'Submit for clearance review');
}
function finish(kind){
  form.hidden = true;
  $('#successPdf').hidden = !(lastSub && lastSub.pdfOk);
  $('#successBody').textContent = kind === 'endpoint'
    ? 'Your receipt PDF has been downloaded and your submission has been received. The office will reply within two business days — quote reference ' + lastSub.ref + ' in any follow-up.'
    : 'Your receipt PDF has been downloaded, and your email client should now be open with the submission pre-filled. If it did not open, send your details to ' + SITE_CONFIG.EMAIL + ' — and quote reference ' + lastSub.ref + '.';
  success.hidden = false;
  success.scrollIntoView({ block:'center', behavior: prefersReduced ? 'auto' : 'smooth' });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  formAlert.hidden = true;
  if (!validate()){ formAlert.hidden = false; return; }

  // Data ikattha karo
  const data = {};
  $$('#labForm [name]').forEach(el => {
    if (el.closest('[hidden]')) return;
    if (el.type === 'checkbox'){ if (el.checked) data[el.name] = 'Agreed'; }
    else if ((el.value || '').trim()) data[el.name] = el.value.trim();
  });

  // Receipt record banao + PDF turant download
  const ref = makeRef();
  const when = new Date().toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  lastSub = { mode, data, ref, when };
  lastSub.pdfOk = buildPDF(lastSub);

  const isApply = mode === 'apply';
  const subject = isApply
    ? 'NeuraSaMu — ' + (data['Application category'] || 'Application') + ' — ' + (data['Name'] || 'Applicant')
    : 'NeuraSaMu — Intelligence engagement — ' + (data['Name'] || 'Client');
  const body = ['Sent from neurasamu.com — ' + (isApply ? 'lab application' : 'intelligence enquiry'),
    'Reference: ' + ref, '']
    .concat(Object.keys(data).map(k => k + ':\n' + data[k])).join('\n\n');

  // 1) Formspree (agar SITE_CONFIG mein URL di hai)
  const endpoint = (SITE_CONFIG.FORMSPREE[mode] || '').trim();
  if (endpoint){
    busy(true);
    try {
      const r = await fetch(endpoint, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Accept':'application/json' },
        body: JSON.stringify(data)
      });
      if (r.ok){ toast('Submission received.', 'check'); finish('endpoint'); return; }
      throw new Error('bad status');
    } catch (err){
      toast('Could not reach the server — falling back to email dispatch.', 'info');
    } finally { busy(false); }
  }

  // 2) mailto: fallback — hamesha kaam karta hai
  const mailtoUrl = 'mailto:' + SITE_CONFIG.EMAIL +
    '?subject=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(body);
  toast('Opening your email client with the submission pre-filled.', 'mail');
  setTimeout(() => { location.href = mailtoUrl; }, lastSub.pdfOk ? 600 : 0);
  finish('mailto');
});

 $('#successPdf').addEventListener('click', () => { if (lastSub) buildPDF(lastSub); });

const resetBtn = success.querySelector('[data-reset]');
if (resetBtn) resetBtn.addEventListener('click', () => {
  lastSub = null;
  success.hidden = true; form.hidden = false; form.reset(); clearErrors();
});

/* ---------- Copy email ---------- */
const copyBtn = $('#copyEmail');
if (copyBtn) copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(SITE_CONFIG.EMAIL);
    toast('Email address copied.', 'check');
  } catch (err) {
    const t = document.createElement('textarea');
    t.value = SITE_CONFIG.EMAIL; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select();
    try { document.execCommand('copy'); toast('Email address copied.', 'check'); }
    catch (e2){ toast('Copy failed — the address is shown beside the button.', 'info'); }
    t.remove();
  }
});

/* ---------- Year ---------- */
 const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   Starfield — space background animation
   Small stars drift slowly across the viewport. Non-repeating
   positions. Respects prefers-reduced-motion.
   ============================================================ */
(function starfield(){
  const cv = document.getElementById('starfield');
  if (!cv) return;
  const ctx = cv.getContext('2d', { alpha: true });
  let W = 0, H = 0, stars = [], raf = 0, visible = true;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  function resize(){
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(220, Math.max(80, Math.round((W * H) / 12000)));
    stars = [];
    for (let i = 0; i < count; i++){
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        alpha: Math.random() * 0.5 + 0.25,
        twinkle: Math.random() * 6.28,
        twinkleSpeed: 0.008 + Math.random() * 0.02
      });
    }
  }

  function draw(){
    ctx.clearRect(0, 0, W, H);
    for (const s of stars){
      s.twinkle += s.twinkleSpeed;
      const tw = 0.7 + Math.sin(s.twinkle) * 0.3;
      const a = s.alpha * tw;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, 6.2832);
      ctx.fillStyle = 'rgba(240,237,230,' + a.toFixed(3) + ')';
      ctx.fill();
    }
  }

  function step(){
    for (const s of stars){
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < -2) s.x = W + 2;
      if (s.x > W + 2) s.x = -2;
      if (s.y < -2) s.y = H + 2;
      if (s.y > H + 2) s.y = -2;
    }
    draw();
    raf = visible && !document.hidden ? requestAnimationFrame(step) : 0;
  }

  function wake(){
    if (!raf && visible && !document.hidden && !prefersReduced) {
      raf = requestAnimationFrame(step);
    }
  }

  document.addEventListener('visibilitychange', function(){
    if (!document.hidden) wake();
  });
  window.addEventListener('resize', debounce(resize, 180));

  resize();
  if (prefersReduced) {
    draw();
  } else {
    wake();
  }
})();

})();
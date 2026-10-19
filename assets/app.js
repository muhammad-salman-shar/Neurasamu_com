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
const menuClose = $('#menuClose');
let closingFromPop = false;

function setMenu(open, fromPop){
  if (!menu) return;
  const wasOpen = menu.classList.contains('open');
  menu.classList.toggle('open', open);
  document.body.classList.toggle('locked', open);
  document.body.classList.toggle('menu-open', open);
  if (menuBtn){
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  /* Push history when opening so Android back closes menu */
  if (open && !fromPop){
    try { history.pushState({ nsmMenu: true }, ''); } catch(e){}
  }
  /* Pop history when closing via UI */
  if (!open && wasOpen && !fromPop){
    try { history.back(); } catch(e){}
  }
}

if (menuBtn){
  menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
}
if (menuClose){
  menuClose.addEventListener('click', () => setMenu(false));
}
 $$('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* Android hardware back button — closes menu */
window.addEventListener('popstate', () => {
  if (menu && menu.classList.contains('open')){
    closingFromPop = true;
    setMenu(false, true);
    closingFromPop = false;
  }
});

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
  if (!prefersReduced) el.classList.add('pending');
  revealIO.observe(el);
});

 /* SAFETY NET — if observer fails for any reason, reveal everything after 2s */
 setTimeout(function(){
   $$('[data-reveal].pending').forEach(function(el){ el.classList.add('in'); });
 }, 2000);





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

/* Skip entire form logic if this page has no form (research/vision/store/bureau) */
if (form) {

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

} // end if (form) guard



/* ============================================================
   Starfield — rich interactive space background
   Layers: distant stars, nebula galaxies, shooting stars,
   orbital satellites. Cursor repulsion on nearest stars.
   ============================================================ */
(function starfield(){
  const cv = document.getElementById('starfield');
  if (!cv) return;
  const ctx = cv.getContext('2d', { alpha: true });
  let W = 0, H = 0, raf = 0, visible = true, t = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const mouse = { x: -9999, y: -9999, active: false };

  const LAYERS = [
    { count: 0.32, speed: 0.020, sizeRange: [0.2, 0.55], alpha: [0.18, 0.40], color: '190,205,240' },
    { count: 0.34, speed: 0.048, sizeRange: [0.35, 0.85], alpha: [0.32, 0.62], color: '215,225,250' },
    { count: 0.24, speed: 0.10,  sizeRange: [0.6, 1.25], alpha: [0.55, 0.90], color: '240,237,230' },
    { count: 0.10, speed: 0.16,  sizeRange: [0.9, 1.7], alpha: [0.72, 1.00], color: '255,250,240' }
  ];

  let stars = [];
  let galaxies = [];
  let shootingStars = [];
  let satellites = [];
  let nextShoot = 260;
  let nextSat = 800;

  function resize(){
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const total = Math.min(420, Math.max(160, Math.round((W * H) / 8500)));
    stars = [];
    for (const layer of LAYERS){
      const n = Math.round(total * layer.count);
      for (let i = 0; i < n; i++){
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * layer.speed,
          vy: (Math.random() - 0.5) * layer.speed,
          r: Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]) + layer.sizeRange[0],
          baseAlpha: Math.random() * (layer.alpha[1] - layer.alpha[0]) + layer.alpha[0],
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.010 + Math.random() * 0.025,
          color: layer.color
        });
      }
    }

    // Galaxies — soft elliptical nebulae
    galaxies = [];
    const galaxyCount = Math.min(4, Math.max(2, Math.round(W / 500)));
    for (let i = 0; i < galaxyCount; i++){
      galaxies.push({
        x: Math.random() * W,
        y: Math.random() * H,
        rx: 180 + Math.random() * 240,
        ry: 60 + Math.random() * 110,
        angle: Math.random() * Math.PI,
        hue: Math.random() < 0.5 ? '76,150,220' : '140,120,200',
        alpha: 0.035 + Math.random() * 0.045,
        vx: (Math.random() - 0.5) * 0.03,
        vy: (Math.random() - 0.5) * 0.03,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function spawnShoot(){
    const fromLeft = Math.random() < 0.5;
    const y = Math.random() * H * 0.75;
    const speed = 6 + Math.random() * 4.5;
    shootingStars.push({
      x: fromLeft ? -60 : W + 60,
      y: y,
      vx: fromLeft ? speed : -speed,
      vy: speed * (0.25 + Math.random() * 0.25),
      life: 1,
      len: 110 + Math.random() * 100
    });
  }

  function spawnSatellite(){
    const fromLeft = Math.random() < 0.5;
    const speed = 0.6 + Math.random() * 0.5;
    const y = Math.random() * H * 0.85 + 20;
    satellites.push({
      x: fromLeft ? -80 : W + 80,
      y: y,
      vx: fromLeft ? speed : -speed,
      vy: (Math.random() - 0.5) * 0.08,
      life: 1,
      blinkPhase: Math.random() * Math.PI * 2,
      blinkSpeed: 0.08 + Math.random() * 0.05,
      size: 3.5 + Math.random() * 2,
      trail: []
    });
  }

  function drawGalaxies(){
    for (const g of galaxies){
      g.pulse += 0.008;
      const pulseA = g.alpha * (0.85 + Math.sin(g.pulse) * 0.15);
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.angle);
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, g.rx);
      grad.addColorStop(0, 'rgba(' + g.hue + ',' + (pulseA * 1.6).toFixed(3) + ')');
      grad.addColorStop(0.5, 'rgba(' + g.hue + ',' + (pulseA * 0.6).toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(' + g.hue + ',0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, g.rx, g.ry, 0, 0, 6.2832);
      ctx.fill();
      ctx.restore();

      // Slow drift
      g.x += g.vx;
      g.y += g.vy;
      if (g.x < -g.rx) g.x = W + g.rx;
      if (g.x > W + g.rx) g.x = -g.rx;
      if (g.y < -g.ry) g.y = H + g.ry;
      if (g.y > H + g.ry) g.y = -g.ry;
    }
  }

  function drawStars(){
    for (const s of stars){
      s.twinklePhase += s.twinkleSpeed;
      const twinkle = 0.65 + Math.sin(s.twinklePhase) * 0.35;
      let a = s.baseAlpha * twinkle;

      if (mouse.active){
        const dx = s.x - mouse.x;
        const dy = s.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const radius = 110;
        if (d < radius && d > 0.1){
          const force = (1 - d / radius) * 0.9;
          s.x += (dx / d) * force * 1.4;
          s.y += (dy / d) * force * 1.4;
          a = Math.min(1, a + force * 0.4);
        }
      }

      s.x += s.vx;
      s.y += s.vy;
      if (s.x < -3) s.x = W + 3;
      if (s.x > W + 3) s.x = -3;
      if (s.y < -3) s.y = H + 3;
      if (s.y > H + 3) s.y = -3;

      if (s.r > 1.0){
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, 6.2832);
        ctx.fillStyle = 'rgba(' + s.color + ',' + (a * 0.12).toFixed(3) + ')';
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, 6.2832);
      ctx.fillStyle = 'rgba(' + s.color + ',' + a.toFixed(3) + ')';
      ctx.fill();
    }
  }

  function drawShooters(){
    for (let i = shootingStars.length - 1; i >= 0; i--){
      const sh = shootingStars[i];
      sh.x += sh.vx;
      sh.y += sh.vy;
      sh.life -= 0.007;
      if (sh.life <= 0 || sh.x < -250 || sh.x > W + 250 || sh.y > H + 120){
        shootingStars.splice(i, 1);
        continue;
      }
      const tail = sh.vx > 0 ? -sh.len : sh.len;
      const grad = ctx.createLinearGradient(sh.x, sh.y, sh.x + tail, sh.y + (sh.vy / sh.vx) * tail);
      grad.addColorStop(0, 'rgba(240,237,230,' + (sh.life * 0.9).toFixed(2) + ')');
      grad.addColorStop(1, 'rgba(240,237,230,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x + tail, sh.y + (sh.vy / sh.vx) * tail);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sh.x, sh.y, 1.6, 0, 6.2832);
      ctx.fillStyle = 'rgba(255,255,255,' + (sh.life * 0.9).toFixed(2) + ')';
      ctx.fill();
    }
  }

  function drawSatellites(){
    for (let i = satellites.length - 1; i >= 0; i--){
      const sat = satellites[i];
      sat.x += sat.vx;
      sat.y += sat.vy;
      sat.blinkPhase += sat.blinkSpeed;

      if (sat.x < -120 || sat.x > W + 120 || sat.y < -60 || sat.y > H + 60){
        satellites.splice(i, 1);
        continue;
      }

      // Faint trail
      sat.trail.push({ x: sat.x, y: sat.y });
      if (sat.trail.length > 24) sat.trail.shift();

      ctx.strokeStyle = 'rgba(180,210,240,0.20)';
      ctx.lineWidth = 0.9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let j = 0; j < sat.trail.length; j++){
        const p = sat.trail[j];
        if (j === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // Body — small rectangle (solar panel look)
      const dir = sat.vx > 0 ? 1 : -1;
      ctx.save();
      ctx.translate(sat.x, sat.y);
      ctx.scale(dir, 1);
      ctx.fillStyle = 'rgba(220,230,250,0.85)';
      ctx.fillRect(-sat.size, -1, sat.size * 2, 2);
      ctx.fillStyle = 'rgba(120,150,200,0.7)';
      ctx.fillRect(-sat.size * 1.8, -0.6, sat.size * 0.7, 1.2);
      ctx.fillRect(sat.size * 1.1, -0.6, sat.size * 0.7, 1.2);
      ctx.restore();

      // Blinking beacon
      const blink = (Math.sin(sat.blinkPhase) + 1) * 0.5;
      if (blink > 0.4){
        ctx.beginPath();
        ctx.arc(sat.x, sat.y - 3, 1.8 * blink, 0, 6.2832);
        ctx.fillStyle = 'rgba(120,255,180,' + (blink * 0.85).toFixed(2) + ')';
        ctx.fill();
        // halo
        ctx.beginPath();
        ctx.arc(sat.x, sat.y - 3, 5 * blink, 0, 6.2832);
        ctx.fillStyle = 'rgba(120,255,180,' + (blink * 0.18).toFixed(2) + ')';
        ctx.fill();
      }
    }
  }

  function draw(){
    t += 1;
    ctx.clearRect(0, 0, W, H);
    drawGalaxies();
    drawStars();

    if (t > nextShoot){
      spawnShoot();
      nextShoot = t + 260 + Math.random() * 420;
    }
    if (t > nextSat){
      spawnSatellite();
      nextSat = t + 900 + Math.random() * 1400;
    }

    drawShooters();
    drawSatellites();
  }

  function step(){
    draw();
    raf = visible && !document.hidden ? requestAnimationFrame(step) : 0;
  }

  function wake(){
    if (!raf && visible && !document.hidden && !prefersReduced){
      raf = requestAnimationFrame(step);
    }
  }

  document.addEventListener('visibilitychange', function(){
    if (!document.hidden) wake();
  });
  window.addEventListener('resize', debounce(resize, 180));

  window.addEventListener('pointermove', function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener('pointerleave', function(){
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });

  document.addEventListener('mouseleave', function(){
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });

  resize();
  if (prefersReduced){
    draw();
  } else {
    wake();
  }
})();

/* ============================================================
   NSM VB — promotional popup
   Appears once every 7 days on non-store pages
   ============================================================ */
(function nsmvbPopup(){
  'use strict';

  // Skip on store page (already there) and audition
  if (window.location.pathname.indexOf('/store') !== -1) return;

  var DISMISS_KEY = 'nsmvb-popup-dismissed-v1';
  var DISMISS_DAYS = 7;

  try {
    var dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      var elapsed = Date.now() - parseInt(dismissed, 10);
      if (elapsed < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;
    }
  } catch(e){}

  function createPopup(){
    if (document.querySelector('.nsmvb-popup')) return;

    var popup = document.createElement('div');
    popup.className = 'nsmvb-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', 'New release: NSM VB');
    popup.innerHTML =
      '<button type="button" class="nsmvb-close" aria-label="Dismiss">' +
        '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
      '</button>' +
      '<div class="nsmvb-icon" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="5" r="1.5"/><circle cx="18" cy="9" r="1.5"/><circle cx="18" cy="15" r="1.5"/><circle cx="12" cy="19" r="1.5"/><circle cx="6" cy="15" r="1.5"/><circle cx="6" cy="9" r="1.5"/><path d="M12 6.5v3M15 7.5l-1.5 2M16.5 10l-2 1M16.5 14l-2-1M15 16.5l-1.5-2M12 17.5v-3M9 16.5l1.5-2M7.5 14l2-1M7.5 10l2 1M9 7.5l1.5 2"/></svg>' +
      '</div>' +
      '<div class="nsmvb-content">' +
        '<div class="nsmvb-badge">New Release</div>' +
        '<h3>Try NSM VB</h3>' +
        '<p>A cognitive architecture that learns, reasons, and remembers — 100% on-device. No cloud. No APIs.</p>' +
        '<a href="/store/#nsmvb" class="nsmvb-cta">Try it now <svg viewBox="0 0 24 24" style="width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>' +
      '</div>';

    document.body.appendChild(popup);

    popup.querySelector('.nsmvb-close').addEventListener('click', function(){
      popup.classList.add('nsmvb-leaving');
      try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch(e){}
      setTimeout(function(){ try { popup.remove(); } catch(e){} }, 400);
    });

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      popup.classList.add('nsmvb-visible');
    } else {
      requestAnimationFrame(function(){
        setTimeout(function(){ popup.classList.add('nsmvb-visible'); }, 60);
      });
    }
  }

  setTimeout(createPopup, 7000);
})();

})();

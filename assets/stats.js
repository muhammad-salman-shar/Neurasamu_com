/* ============================================================
   NeuraSaMu — Paper Stats Counter
   Real increments via CountAPI + per-paper seed values
   Seed values provide cold-start social proof (owner-configured)
   Real interactions increment on top of seeds.
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     SEED VALUES — cold-start boost per paper
     Owner-configured. Real interactions add on top.
     ============================================================ */
  var PAPER_SEEDS = {
    cspm: { views: 892,  downloads: 47, shares: 11 },
    smg:  { views: 1473, downloads: 82, shares: 19 },
    abh:  { views: 1024, downloads: 33, shares: 8  },
    aao:  { views: 567,  downloads: 19, shares: 4  }
  };

  var NAMESPACE = 'neurasamu-v1';
  var API_BASE = 'https://api.countapi.xyz';
  var TIMEOUT_MS = 4000;

  /* ---------- helpers ---------- */
  function paperId() {
    var m = window.location.pathname.match(/\/research\/([^\/]+)\/?$/);
    return m ? m[1] : null;
  }

  function fetchWithTimeout(url) {
    return new Promise(function (resolve, reject) {
      var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timer = setTimeout(function () {
        if (ctl) ctl.abort();
        reject(new Error('timeout'));
      }, TIMEOUT_MS);
      fetch(url, ctl ? { signal: ctl.signal } : {})
        .then(function (r) {
          clearTimeout(timer);
          resolve(r);
        })
        .catch(function (e) {
          clearTimeout(timer);
          reject(e);
        });
    });
  }

  function readCounter(key) {
    return fetchWithTimeout(API_BASE + '/get/' + NAMESPACE + '/' + key)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { return j && typeof j.value === 'number' ? j.value : 0; })
      .catch(function () { return 0; });
  }

  function hitCounter(key) {
    return fetchWithTimeout(API_BASE + '/hit/' + NAMESPACE + '/' + key)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { return j && typeof j.value === 'number' ? j.value : 0; })
      .catch(function () { return 0; });
  }

  function sessionKey(pid, type) {
    return 'nsm-stat-' + pid + '-' + type;
  }
  function alreadyCounted(pid, type) {
    try { return sessionStorage.getItem(sessionKey(pid, type)) === '1'; }
    catch (e) { return false; }
  }
  function markCounted(pid, type) {
    try { sessionStorage.setItem(sessionKey(pid, type), '1'); }
    catch (e) {}
  }

  function formatNum(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 10000)   return Math.round(n / 1000) + 'k';
    if (n >= 1000)    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  function animate(el, from, to, dur) {
    if (!el) return;
    var start = performance.now();
    var d = dur || 700;
    function tick(now) {
      var t = Math.min(1, (now - start) / d);
      var eased = 1 - Math.pow(1 - t, 3);
      var v = Math.round(from + (to - from) * eased);
      el.textContent = formatNum(v);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = formatNum(to);
    }
    requestAnimationFrame(tick);
  }

  function setStat(name, value) {
    var el = document.querySelector('[data-stat="' + name + '"]');
    if (el) el.textContent = formatNum(value);
  }

  /* ---------- init ---------- */
  function init() {
    var pid = paperId();
    if (!pid || !PAPER_SEEDS[pid]) return;
    var seeds = PAPER_SEEDS[pid];

    var elViews = document.querySelector('[data-stat="views"]');
    var elDown  = document.querySelector('[data-stat="downloads"]');
    var elShare = document.querySelector('[data-stat="shares"]');
    if (!elViews && !elDown && !elShare) return;

    /* initial render = seeds */
    setStat('views', seeds.views);
    setStat('downloads', seeds.downloads);
    setStat('shares', seeds.shares);

    /* read real counts, then animate seed → seed + real */
    Promise.all([
      readCounter(pid + '-views'),
      readCounter(pid + '-downloads'),
      readCounter(pid + '-shares')
    ]).then(function (vals) {
      var rv = vals[0] || 0;
      var rd = vals[1] || 0;
      var rs = vals[2] || 0;

      animate(elViews, seeds.views, seeds.views + rv, 900);
      animate(elDown, seeds.downloads, seeds.downloads + rd, 900);
      animate(elShare, seeds.shares, seeds.shares + rs, 900);

      /* increment views once per session */
      if (!alreadyCounted(pid, 'views')) {
        markCounted(pid, 'views');
        hitCounter(pid + '-views').then(function (newVal) {
          var total = seeds.views + (newVal || rv || 0);
          if (newVal > rv) animate(elViews, seeds.views + rv, total, 500);
        });
      }

      /* hook download button */
      var dlBtn = document.querySelector('.paper-cta .btn--primary');
      if (dlBtn) {
        dlBtn.addEventListener('click', function () {
          if (alreadyCounted(pid, 'downloads')) return;
          markCounted(pid, 'downloads');
          hitCounter(pid + '-downloads').then(function (newVal) {
            var total = seeds.downloads + (newVal || rd || 0);
            if (newVal > rd) animate(elDown, seeds.downloads + rd, total, 400);
          });
        });
      }

      /* hook share buttons */
      document.querySelectorAll('[data-share]').forEach(function (btn) {
        btn.addEventListener('click', function (ev) {
          var type = btn.getAttribute('data-share');
          var url = window.location.href;
          var title = document.title;
          try {
            if (type === 'copy') {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(url);
              }
              if (typeof showToast === 'function') showToast('Link copied.');
            } else if (type === 'x') {
              window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url), '_blank', 'noopener');
            } else if (type === 'linkedin') {
              window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url), '_blank', 'noopener');
            } else if (type === 'whatsapp') {
              window.open('https://wa.me/?text=' + encodeURIComponent(title + ' — ' + url), '_blank', 'noopener');
            }
          } catch (e) {}

          if (alreadyCounted(pid, 'shares')) return;
          markCounted(pid, 'shares');
          hitCounter(pid + '-shares').then(function (newVal) {
            var total = seeds.shares + (newVal || rs || 0);
            if (newVal > rs) animate(elShare, seeds.shares + rs, total, 400);
          });
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

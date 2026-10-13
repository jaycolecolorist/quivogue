/* ==========================================================================
   QV fits — live data overlay.

   data.js holds the shop as it was last baked in. This file asks the backend
   whether anything has been edited since, and lays those edits over the top.

   Three rules it follows:

   1. If the backend is not configured, unreachable, slow or broken, the site
      renders from data.js exactly as it does today. A shop that cannot reach
      its database still has to sell. Nothing here can take the site down.

   2. It does NOT load the Supabase client library — that is 212 KB, and the
      public site only needs to read one row. A plain fetch against the REST
      endpoint is about a kilobyte. The library loads on /admin.html only.

   3. The last good copy is cached, so a repeat visitor renders instantly from
      cache and the network check happens behind them.
   ========================================================================== */
(function () {
  'use strict';

  var CACHE_KEY = 'qvfits.site.v1';
  var NET_TIMEOUT = 2500;        // never make a shopper wait longer than this

  var cfg = (typeof window.QV_BACKEND === 'object' && window.QV_BACKEND) || {};
  var configured = !!(cfg.url && cfg.anonKey);

  /* Photo overrides, read by media() in app.js. Keyed the same way the photo
     files are: product id, or id + variant suffix. */
  window.QV_MEDIA = {};

  /* ---------------------------------------------------------------- apply */
  /* data.js declares everything with `const`, so nothing here can reassign a
     name — arrays and objects are edited in place instead. */
  function replaceArray(target, next) {
    if (!Array.isArray(target) || !Array.isArray(next)) return;
    target.length = 0;
    for (var i = 0; i < next.length; i++) target.push(next[i]);
  }

  function apply(doc) {
    if (!doc || typeof doc !== 'object') return;

    if (doc.CONFIG && typeof CONFIG === 'object') Object.assign(CONFIG, doc.CONFIG);

    var arrays = {
      PRODUCTS:      typeof PRODUCTS      !== 'undefined' ? PRODUCTS      : null,
      REVIEWS:       typeof REVIEWS       !== 'undefined' ? REVIEWS       : null,
      DEALS:         typeof DEALS         !== 'undefined' ? DEALS         : null,
      HERO_SLIDES:   typeof HERO_SLIDES   !== 'undefined' ? HERO_SLIDES   : null,
      BEST_SELLERS:  typeof BEST_SELLERS  !== 'undefined' ? BEST_SELLERS  : null,
      NEW_RELEASES:  typeof NEW_RELEASES  !== 'undefined' ? NEW_RELEASES  : null
    };
    for (var k in arrays) if (doc[k] && arrays[k]) replaceArray(arrays[k], doc[k]);

    var objects = {
      SALE:      typeof SALE      !== 'undefined' ? SALE      : null,
      STICKER:   typeof STICKER   !== 'undefined' ? STICKER   : null,
      PROMO_BAR: typeof PROMO_BAR !== 'undefined' ? PROMO_BAR : null,
      CAMPAIGN:  typeof CAMPAIGN  !== 'undefined' ? CAMPAIGN  : null,
      SIZE_CHART: typeof SIZE_CHART !== 'undefined' ? SIZE_CHART : null
    };
    for (var o in objects) if (doc[o] && objects[o]) Object.assign(objects[o], doc[o]);

    if (doc.media && typeof doc.media === 'object') window.QV_MEDIA = doc.media;
    if (doc.PHOTO_DIMS && typeof PHOTO_DIMS === 'object') Object.assign(PHOTO_DIMS, doc.PHOTO_DIMS);
  }

  /* ---------------------------------------------------------------- cache */
  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }        // private mode, or corrupt
  }
  function writeCache(doc) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(doc)); } catch (e) { /* quota, private mode */ }
  }

  /* ---------------------------------------------------------------- fetch */
  function fetchDoc() {
    var url = cfg.url.replace(/\/+$/, '') + '/rest/v1/site?id=eq.1&select=doc';
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, NET_TIMEOUT);

    return fetch(url, {
      headers: { apikey: cfg.anonKey, Authorization: 'Bearer ' + cfg.anonKey },
      signal: ctrl ? ctrl.signal : undefined,
      cache: 'no-store'
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rows) {
        return (rows && rows[0] && rows[0].doc) ? rows[0].doc : null;
      })
      .catch(function () { return null; })   // offline, blocked, slow, paused project
      .then(function (doc) { clearTimeout(timer); return doc; });
  }

  /* ---------------------------------------------------------------- boot */
  var resolveReady;
  var readyPromise = new Promise(function (res) { resolveReady = res; });

  if (!configured) {
    resolveReady();                        // nothing to overlay; data.js stands
  } else {
    var cached = readCache();
    if (cached) {
      // Render from the last known-good copy straight away, then check behind
      // the shopper. A change they have not seen yet lands on their next page.
      apply(cached);
      resolveReady();
      fetchDoc().then(function (doc) { if (doc) writeCache(doc); });
    } else {
      // First ever visit: wait, but never past the timeout.
      fetchDoc().then(function (doc) {
        if (doc) { apply(doc); writeCache(doc); }
        resolveReady();
      });
    }
  }

  window.QVStore = {
    ready: function () { return readyPromise; },
    configured: configured,
    /* Called by the admin console after a save so the editor's own tab shows
       the change without a reload. */
    refresh: function () {
      return fetchDoc().then(function (doc) {
        if (doc) { apply(doc); writeCache(doc); }
        return doc;
      });
    },
    clearCache: function () { try { localStorage.removeItem(CACHE_KEY); } catch (e) {} }
  };
})();

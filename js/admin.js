/* ==========================================================================
   QV fits — admin console.

   Loads only on /admin.html. Nothing here runs on the shop.

   The whole editable site is one JSON document in one row. The console reads
   it, you edit it, it writes the whole thing back. One row means a save is
   atomic: a shopper can never catch the site half-updated.
   ========================================================================== */
(function () {
  'use strict';

  var cfg = window.QV_BACKEND || {};
  var sb = null;            // supabase client, once signed in
  var doc = {};             // the working copy being edited
  var baseline = '';        // JSON of the last saved state, to detect changes
  var me = null;            // signed-in user

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function toast(msg, kind) {
    var t = $('#aToast');
    t.textContent = msg;
    t.className = 'atoast is-on' + (kind ? ' atoast--' + kind : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.className = 'atoast'; }, kind === 'bad' ? 6000 : 2800);
  }

  function dirty() {
    return JSON.stringify(doc) !== baseline;
  }
  function markDirty() {
    $('#aSave').disabled = !dirty();
    $('#aDirty').hidden = !dirty();
  }

  /* ====================================================================
     SETUP GATE
     ==================================================================== */
  if (!cfg.url || !cfg.anonKey) {
    document.addEventListener('DOMContentLoaded', function () {
      $('#aBoot').innerHTML =
        '<h1>Not set up yet</h1>' +
        '<p class="lede">The console needs a backend before it can do anything. ' +
        'The steps are in <code>admin/schema.sql</code> in this project — run that file ' +
        'in Supabase, then put the project URL and the <code>anon</code> key into ' +
        '<code>js/admin-config.js</code>.</p>' +
        '<p class="lede" style="margin-top:12px">Until then the shop runs from its ' +
        'built-in copy of the data and nothing is broken.</p>';
      $('#aBoot').hidden = false;
    });
    return;
  }

  /* ====================================================================
     AUTH
     ==================================================================== */
  function initClient() {
    sb = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
  }

  function showLogin(msg) {
    $('#aBoot').hidden = true;
    $('#aApp').hidden = true;
    $('#aLogin').hidden = false;
    if (msg) { $('#aLoginMsg').textContent = msg; $('#aLoginMsg').hidden = false; }
  }

  function signIn(e) {
    e.preventDefault();
    var email = $('#aEmail').value.trim();
    var pass = $('#aPass').value;
    var btn = $('#aSignIn');
    btn.disabled = true; btn.textContent = 'Signing in…';
    sb.auth.signInWithPassword({ email: email, password: pass }).then(function (r) {
      btn.disabled = false; btn.textContent = 'Sign in';
      if (r.error) {
        $('#aLoginMsg').textContent = r.error.message || 'That did not work.';
        $('#aLoginMsg').hidden = false;
        return;
      }
      start();
    });
  }

  function signOut() {
    if (dirty() && !confirm('You have unsaved changes. Sign out anyway?')) return;
    sb.auth.signOut().then(function () { location.reload(); });
  }

  /* ====================================================================
     LOAD / SAVE
     ==================================================================== */
  function load() {
    return sb.from('site').select('doc, updated_at').eq('id', 1).single().then(function (r) {
      if (r.error) throw r.error;
      doc = (r.data && r.data.doc) || {};
      // First run: the row is empty, so seed it from what the site ships with.
      if (!doc.PRODUCTS) doc.PRODUCTS = JSON.parse(JSON.stringify(PRODUCTS));
      if (!doc.CONFIG) {
        doc.CONFIG = {
          kampalaDelivery: CONFIG.kampalaDelivery,
          upcountryDelivery: CONFIG.upcountryDelivery,
          freeShippingOver: CONFIG.freeShippingOver,
          opensAt: CONFIG.opensAt,
          address: CONFIG.address,
          phoneDisplay: CONFIG.phoneDisplay,
          email: CONFIG.email,
          exchangeDays: CONFIG.exchangeDays
        };
      }
      if (!doc.media) doc.media = {};
      // Seed the offer blocks here too. They used to be filled in by their own
      // render, which ran after this snapshot and so made the console look
      // dirty the instant it opened.
      if (!doc.SALE) doc.SALE = {
        live: !!(typeof SALE !== 'undefined' && SALE.live),
        percentUpTo: (typeof SALE !== 'undefined' && SALE.percentUpTo) || 50
      };
      if (!doc.STICKER && typeof STICKER !== 'undefined') doc.STICKER = JSON.parse(JSON.stringify(STICKER));
      if (!doc.PROMO_BAR && typeof PROMO_BAR !== 'undefined') doc.PROMO_BAR = JSON.parse(JSON.stringify(PROMO_BAR));
      baseline = JSON.stringify(doc);
      $('#aUpdated').textContent = r.data.updated_at
        ? 'Last saved ' + new Date(r.data.updated_at).toLocaleString('en-GB')
        : 'Never saved yet';
    });
  }

  function save() {
    var btn = $('#aSave');
    btn.disabled = true; btn.textContent = 'Saving…';
    // Bump the asset version so a swapped photo is not served from cache.
    doc.CONFIG = doc.CONFIG || {};
    doc.CONFIG.assetVersion = String(Date.now());
    return sb.from('site').update({ doc: doc }).eq('id', 1).select('updated_at').single()
      .then(function (r) {
        btn.textContent = 'Save changes';
        if (r.error) {
          btn.disabled = false;
          // The commonest cause by far: signed in, but not on the admins list.
          toast(/row-level security|permission/i.test(r.error.message || '')
            ? 'Saved nothing — this account is not on the admin list. See step 3 in admin/schema.sql.'
            : 'Could not save: ' + r.error.message, 'bad');
          return;
        }
        baseline = JSON.stringify(doc);
        markDirty();
        $('#aUpdated').textContent = 'Last saved ' + new Date(r.data.updated_at).toLocaleString('en-GB');
        toast('Saved. The shop is showing this now.');
      });
  }

  /* ====================================================================
     PHOTOS
     ==================================================================== */
  /* Resized in the browser before upload, to the same ladder the baked-in
     photos use. Without this, a 6 MB phone photo would be served to every
     shopper and undo the whole page-weight job. */
  function resize(file, maxW) {
    return new Promise(function (res, rej) {
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function () {
        URL.revokeObjectURL(url);
        var w = img.naturalWidth, h = img.naturalHeight;
        var scale = Math.min(1, maxW / w);
        var cw = Math.round(w * scale), ch = Math.round(h * scale);
        var c = document.createElement('canvas');
        c.width = cw; c.height = ch;
        c.getContext('2d').drawImage(img, 0, 0, cw, ch);
        c.toBlob(function (b) {
          b ? res({ blob: b, w: cw, h: ch }) : rej(new Error('Could not read that image'));
        }, 'image/webp', 0.82);
      };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error('That file is not an image this browser can open')); };
      img.src = url;
    });
  }

  function uploadPhoto(key, file, onProgress) {
    var LADDER = [1200, 800, 400];
    var stamp = Date.now();
    var path = 'photos/' + key + '-' + stamp;
    var done = 0;
    return Promise.all(LADDER.map(function (w) {
      return resize(file, w).then(function (out) {
        var name = path + (w === 1200 ? '' : '-' + w) + '.webp';
        return sb.storage.from('media').upload(name, out.blob, {
          contentType: 'image/webp', upsert: true, cacheControl: '31536000'
        }).then(function (r) {
          if (r.error) throw r.error;
          done++; if (onProgress) onProgress(done, LADDER.length);
          return { w: w, size: out };
        });
      });
    })).then(function (parts) {
      var full = parts.filter(function (p) { return p.w === 1200; })[0];
      var pub = sb.storage.from('media').getPublicUrl(path).data.publicUrl;
      doc.media[key] = {
        base: pub,
        w: full.size.w, h: full.size.h,
        have: [400, 800]
      };
      return doc.media[key];
    });
  }

  /* ====================================================================
     RENDER — products
     ==================================================================== */
  var CATS = ['Sets', 'Bras', 'Bottoms', 'Skorts', 'Swim', 'Lounge'];
  var SIZES = ['XS', 'S', 'M', 'L', 'XL'];

  function money(n) {
    return 'UGX ' + (Number(n) || 0).toLocaleString('en-US');
  }

  function renderProducts() {
    var host = $('#aProducts');
    if (!doc.PRODUCTS.length) { host.innerHTML = '<p class="lede">No products yet.</p>'; return; }
    host.innerHTML = doc.PRODUCTS.map(function (p, i) {
      var photo = doc.media[p.id] ? doc.media[p.id].base + '-400.webp' : 'photos/' + p.id + '-400.webp';
      return '' +
      '<details class="acard" data-i="' + i + '">' +
        '<summary class="acard__head">' +
          '<img class="acard__thumb" src="' + esc(photo) + '" alt="" loading="lazy" ' +
               'onerror="this.style.visibility=\'hidden\'">' +
          '<span class="acard__name">' + esc(p.name) + '</span>' +
          '<span class="acard__cat">' + esc(p.category) + '</span>' +
          '<span class="acard__price" data-price="' + i + '">' + money(p.price) + '</span>' +
        '</summary>' +
        '<div class="acard__body">' +

          '<div class="arow">' +
            '<label class="afield"><span>Name</span>' +
              '<input data-f="name" value="' + esc(p.name) + '"></label>' +
            '<label class="afield afield--sm"><span>Category</span>' +
              '<select data-f="category">' + CATS.map(function (c) {
                return '<option' + (c === p.category ? ' selected' : '') + '>' + c + '</option>';
              }).join('') + '</select></label>' +
          '</div>' +

          '<div class="arow">' +
            '<label class="afield afield--sm"><span>Price (UGX)</span>' +
              '<input data-f="price" type="number" min="0" step="1000" inputmode="numeric" ' +
                     'value="' + Number(p.price || 0) + '"></label>' +
            '<label class="afield afield--sm"><span>Label</span>' +
              '<select data-f="badge">' +
                ['', 'New', 'Bestseller'].map(function (b) {
                  return '<option value="' + b + '"' + ((p.badge || '') === b ? ' selected' : '') + '>' +
                         (b || '— none —') + '</option>';
                }).join('') + '</select></label>' +
          '</div>' +

          '<label class="afield"><span>Description</span>' +
            '<textarea data-f="blurb" rows="3">' + esc(p.blurb) + '</textarea></label>' +

          '<label class="afield"><span>Colours <em>(comma separated)</em></span>' +
            '<input data-f="colors" value="' + esc((p.colors || []).join(', ')) + '"></label>' +

          '<div class="afield"><span>How many in stock</span>' +
            '<div class="astock">' + SIZES.map(function (s) {
              return '<label><b>' + s + '</b><input type="number" min="0" data-stock="' + s + '" ' +
                     'value="' + Number((p.stock || {})[s] || 0) + '"></label>';
            }).join('') + '</div>' +
            '<small>Set a size to 0 and the shop shows it as sold out in that size.</small>' +
          '</div>' +

          '<div class="afield"><span>Photo</span>' +
            '<div class="aphoto">' +
              '<input type="file" accept="image/*" data-upload="' + esc(p.id) + '">' +
              '<span class="aphoto__msg"></span>' +
            '</div>' +
            '<small>Any size — it is shrunk and converted in your browser before upload, ' +
            'so a big phone photo will not slow the shop down.</small>' +
          '</div>' +

        '</div>' +
      '</details>';
    }).join('');
  }

  /* One delegated listener for the whole list, so editing a field never has to
     re-render the card and lose the cursor. */
  function wireProducts() {
    var host = $('#aProducts');

    host.addEventListener('input', function (e) {
      var card = e.target.closest('.acard'); if (!card) return;
      var p = doc.PRODUCTS[Number(card.dataset.i)];
      var f = e.target.dataset.f;
      if (f === 'price') {
        p.price = Number(e.target.value) || 0;
        $('[data-price="' + card.dataset.i + '"]').textContent = money(p.price);
      } else if (f === 'colors') {
        p.colors = e.target.value.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      } else if (f === 'badge') {
        if (e.target.value) p.badge = e.target.value; else delete p.badge;
      } else if (f) {
        p[f] = e.target.value;
        if (f === 'name') $('.acard__name', card).textContent = e.target.value;
        if (f === 'category') $('.acard__cat', card).textContent = e.target.value;
      }
      var sz = e.target.dataset.stock;
      if (sz) { p.stock = p.stock || {}; p.stock[sz] = Math.max(0, Number(e.target.value) || 0); }
      markDirty();
    });

    host.addEventListener('change', function (e) {
      var key = e.target.dataset.upload;
      if (!key || !e.target.files || !e.target.files[0]) return;
      var msg = $('.aphoto__msg', e.target.closest('.aphoto'));
      var file = e.target.files[0];
      if (file.size > 25 * 1024 * 1024) { msg.textContent = 'That file is over 25 MB — too big.'; return; }
      msg.textContent = 'Preparing…';
      uploadPhoto(key, file, function (d, t) { msg.textContent = 'Uploading ' + d + ' of ' + t + '…'; })
        .then(function () {
          msg.textContent = 'Done — remember to Save.';
          markDirty();
          var thumb = $('.acard__thumb', e.target.closest('.acard'));
          if (thumb) { thumb.style.visibility = 'visible'; thumb.src = doc.media[key].base + '-400.webp'; }
        })
        .catch(function (err) { msg.textContent = 'Failed: ' + (err.message || err); });
    });
  }

  /* ====================================================================
     RENDER — shop settings
     ==================================================================== */
  var SETTINGS = [
    { k: 'kampalaDelivery',   t: 'Delivery in Kampala (UGX)', type: 'number' },
    { k: 'upcountryDelivery', t: 'Delivery upcountry (UGX)',  type: 'number' },
    { k: 'freeShippingOver',  t: 'Free delivery over (UGX)',  type: 'number' },
    { k: 'exchangeDays',      t: 'Exchange window (days)',    type: 'number' },
    { k: 'opensAt',           t: 'Showroom opens at',         type: 'text', ph: 'e.g. 10 AM' },
    { k: 'address',           t: 'Showroom address',          type: 'text' },
    { k: 'phoneDisplay',      t: 'Phone shown on the site',   type: 'text' },
    { k: 'email',             t: 'Email shown on the site',   type: 'text' }
  ];

  function renderSettings() {
    $('#aSettings').innerHTML = SETTINGS.map(function (s) {
      var v = doc.CONFIG[s.k];
      return '<label class="afield afield--sm"><span>' + esc(s.t) + '</span>' +
        '<input data-s="' + s.k + '" type="' + s.type + '"' +
        (s.type === 'number' ? ' min="0" inputmode="numeric"' : '') +
        (s.ph ? ' placeholder="' + esc(s.ph) + '"' : '') +
        ' value="' + esc(v == null ? '' : v) + '"></label>';
    }).join('');

    $('#aSettings').addEventListener('input', function (e) {
      var k = e.target.dataset.s; if (!k) return;
      var def = SETTINGS.filter(function (s) { return s.k === k; })[0];
      doc.CONFIG[k] = def.type === 'number'
        ? (e.target.value === '' ? null : Number(e.target.value))
        : (e.target.value.trim() || null);
      markDirty();
    });
  }

  /* ====================================================================
     RENDER — offers
     ==================================================================== */
  function renderOffers() {
    // Seeded in load(), before the baseline snapshot — nothing is created here.
    $('#aOffers').innerHTML =
      '<label class="atoggle"><input type="checkbox" data-o="sale.live"' +
        (doc.SALE.live ? ' checked' : '') + '><span>Run a sale</span></label>' +
      '<label class="afield afield--sm"><span>Up to how many % off</span>' +
        '<input type="number" min="1" max="90" data-o="sale.percentUpTo" value="' +
        Number(doc.SALE.percentUpTo || 50) + '"></label>' +
      '<p class="anote">A sale only shows pieces that have a discount set on them. ' +
      'Until those exist, turning this on gives shoppers an empty sale page — ' +
      'so leave it off until there is something in it.</p>' +
      '<hr class="arule">' +
      '<label class="atoggle"><input type="checkbox" data-o="sticker.live"' +
        (doc.STICKER.live !== false ? ' checked' : '') + '><span>Show the “10% off” pop-up</span></label>';

    $('#aOffers').addEventListener('input', function (e) {
      var o = e.target.dataset.o; if (!o) return;
      var val = e.target.type === 'checkbox' ? e.target.checked : Number(e.target.value);
      if (o === 'sale.live') doc.SALE.live = val;
      if (o === 'sale.percentUpTo') doc.SALE.percentUpTo = val;
      if (o === 'sticker.live') doc.STICKER.live = val;
      markDirty();
    });
  }

  /* ====================================================================
     START
     ==================================================================== */
  function start() {
    $('#aLogin').hidden = true;
    $('#aBoot').hidden = false;
    $('#aBoot').innerHTML = '<p class="lede">Loading the shop…</p>';

    sb.auth.getUser().then(function (r) {
      me = r.data && r.data.user;
      $('#aWho').textContent = me ? me.email : '';
      return load();
    }).then(function () {
      $('#aBoot').hidden = true;
      $('#aApp').hidden = false;
      renderProducts(); wireProducts();
      renderSettings();
      renderOffers();
      markDirty();
    }).catch(function (err) {
      $('#aBoot').hidden = true;
      showLogin(err && err.message ? err.message : 'Could not load. Check the connection.');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initClient();

    $('#aLoginForm').addEventListener('submit', signIn);
    $('#aSignOut').addEventListener('click', signOut);
    $('#aSave').addEventListener('click', save);

    $$('.atab').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.atab').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        $$('.apanel').forEach(function (p) { p.hidden = p.id !== 'panel-' + b.dataset.tab; });
      });
    });

    window.addEventListener('beforeunload', function (e) {
      if (dirty()) { e.preventDefault(); e.returnValue = ''; }
    });

    // cmd/ctrl+S saves
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault(); if (dirty()) save();
      }
    });

    sb.auth.getSession().then(function (r) {
      if (r.data && r.data.session) start(); else showLogin();
    });
  });
})();

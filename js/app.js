/* ==========================================================================
   QV fits — shared app logic
   Header/footer, cart + wishlist state, product cards, toasts, drawers.
   Cart and wishlist persist in localStorage. No backend: checkout hands the
   order to the team via Instagram / WhatsApp rather than pretending to take
   a payment it cannot take.
   ========================================================================== */

/* ---------------------------------------------------------------- icons */
const ICON = {
  heart: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  bag: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 8h13l1 12.5H4.5z"/><path d="M8.75 10.5V6.75a3.25 3.25 0 0 1 6.5 0v3.75"/></svg>',
  search: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
  burger: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  arrow: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13m-5-6 6 6-6 6"/></svg>',
  plus: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  spark: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5c.5 4.6 2.4 6.5 7 7-4.6.5-6.5 2.4-7 7-.5-4.6-2.4-6.5-7-7 4.6-.5 6.5-2.4 7-7z"/></svg>',
  /* The assistant mark: a motion arc, not the old boutique bow. */
  bow: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 15.5c3.4-6.6 12.6-6.6 16 0"/><path d="M12 4.5v4"/><circle cx="12" cy="17.5" r="1.6" fill="currentColor" stroke="none"/></svg>',
  tiktok: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.8a4.3 4.3 0 0 1-1.1-2.8h-2.9v11.4a2.4 2.4 0 1 1-1.7-2.3V9.1a5.3 5.3 0 1 0 4.6 5.2V8.9a7 7 0 0 0 4 1.3V7.3a4.2 4.2 0 0 1-2.9-1.5z"/></svg>',
  check: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 12.5 5 5 10-11"/></svg>',
  pin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  truck: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7z"/><circle cx="6.5" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>',
  ig: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/></svg>'
};

/* ---------------------------------------------------------------- money */
function money(n) {
  const s = Math.round(n).toLocaleString('en-US');
  return CONFIG.currencyPosition === 'before' ? `${CONFIG.currency} ${s}` : `${s} ${CONFIG.currency}`;
}

/* ---------------------------------------------------------------- state */
/* Namespaced to this brand. The previous site lived on the same origin, so
   sharing keys would resurrect a cart full of products that no longer exist. */
const KEY_CART = 'qvfits.cart.v1';
const KEY_WISH = 'qvfits.wish.v1';
const KEY_NAME = 'qvfits.name.v1';

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function write(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* private mode */ }
}

/* Drop anything saved that is no longer in the catalogue — a discontinued
   product would otherwise sit in the bag counting toward the total while
   rendering as nothing. */
function pruneSaved(list, key) {
  const clean = list.filter(x => getProduct(typeof x === 'string' ? x : x.id));
  if (clean.length !== list.length) write(key, clean);
  return clean;
}

const Store = {
  cart: pruneSaved(read(KEY_CART, []), KEY_CART),   // [{id, size, color, qty}]
  wish: pruneSaved(read(KEY_WISH, []), KEY_WISH),   // [id]

  save() {
    write(KEY_CART, this.cart);
    write(KEY_WISH, this.wish);
    document.dispatchEvent(new CustomEvent('store:change'));
  },

  add(id, size, color, qty = 1) {
    const p = getProduct(id);
    if (!p) return false;
    const available = p.stock[size] || 0;
    if (available <= 0) return false;

    const line = this.cart.find(l => l.id === id && l.size === size && l.color === color);
    const already = line ? line.qty : 0;
    if (already + qty > available) qty = available - already;
    if (qty <= 0) return false;

    if (line) line.qty += qty;
    else this.cart.push({ id, size, color, qty });
    this.save();
    return true;
  },

  setQty(index, qty) {
    const line = this.cart[index];
    if (!line) return;
    const p = getProduct(line.id);
    const max = p ? (p.stock[line.size] || 0) : 0;
    line.qty = Math.max(0, Math.min(qty, max));
    if (line.qty === 0) this.cart.splice(index, 1);
    this.save();
  },

  removeAt(index) { this.cart.splice(index, 1); this.save(); },

  toggleWish(id) {
    const i = this.wish.indexOf(id);
    if (i > -1) this.wish.splice(i, 1); else this.wish.push(id);
    this.save();
    return i === -1;
  },
  isWished(id) { return this.wish.includes(id); },

  count() { return this.cart.reduce((n, l) => n + l.qty, 0); },
  subtotal() {
    return this.cart.reduce((n, l) => {
      const p = getProduct(l.id);
      return n + (p ? p.price * l.qty : 0);
    }, 0);
  },
  shipping(region = 'kampala') {
    if (!this.cart.length) return 0;
    if (this.subtotal() >= CONFIG.freeShippingOver) return 0;
    return region === 'upcountry' ? CONFIG.upcountryDelivery : CONFIG.kampalaDelivery;
  },

  name: read(KEY_NAME, null),
  setName(n) { this.name = n; write(KEY_NAME, n); }
};

/* ---------------------------------------------------------------- toast */
function toast(text) {
  let host = document.querySelector('.toasts');
  if (!host) {
    host = document.createElement('div');
    host.className = 'toasts';
    document.body.appendChild(host);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${ICON.check}<span>${text}</span>`;
  host.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 350);
  }, 2600);
}

/* ---------------------------------------------------------------- media */
/* Renders a photo slot. Shows photos/<id>.jpg when it exists, otherwise a
   soft gradient placeholder carrying the product name. */
function media(id, label, variant = '') {
  // Version query busts the browser cache when a photo is swapped — the file
  // name stays the same, so without this an old image keeps being served.
  const v = (typeof CONFIG !== 'undefined' && CONFIG.assetVersion) ? `?v=${CONFIG.assetVersion}` : '';
  const src = `photos/${id}${variant}.jpg${v}`;
  return `<div class="ph">
    <img src="${src}" alt="${escapeHtml(label)}" loading="lazy"
         onload="this.parentNode.classList.add('has-photo')"
         onerror="this.remove()">
    <div class="ph__label">${escapeHtml(label)}</div>
    <div class="ph__note">photo coming</div>
  </div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/* ---------------------------------------------------------------- product card */
function productCard(p) {
  const sizes = productSizes(p);
  const sold = !anyInStock(p);
  const badge = sold
    ? '<span class="badge badge--out">Sold out</span>'
    : (p.badge ? `<span class="badge">${p.badge}</span>` : '');
  const swatches = p.colors.map(c =>
    `<i class="sw" style="background:${COLOR_SWATCHES[c] || '#ddd'}" title="${c}"></i>`
  ).join('');

  return `<article class="card reveal" data-id="${p.id}">
    <div class="card__media">
      ${badge}
      <button class="heart ${Store.isWished(p.id) ? 'is-on' : ''}" data-wish="${p.id}"
              aria-label="Save ${escapeHtml(p.name)} to wishlist" aria-pressed="${Store.isWished(p.id)}">${ICON.heart}</button>
      <a href="product.html?id=${p.id}" aria-label="${escapeHtml(p.name)}">${media(p.id, p.name)}</a>
    </div>
    <div class="card__body">
      <span class="card__cat">${p.category}</span>
      <a class="card__name" href="product.html?id=${p.id}">${escapeHtml(p.name)}</a>
      <div class="card__swatches">${swatches}</div>
      <div class="card__foot">
        <span class="card__price">${money(p.price)}</span>
        ${sold
          ? `<a class="card__add card__add--out" href="product.html?id=${p.id}">Sold out</a>`
          : `<button class="card__add" data-add="${p.id}" aria-label="Add ${escapeHtml(p.name)} to bag">Add</button>`}
      </div>
    </div>
  </article>`;
}

/* ---------------------------------------------------------------- header / footer */
const NAV_LINKS = [
  ['index.html', 'Home'],
  ['shop.html', 'Shop'],
  ['about.html', 'About'],
  ['size-guide.html', 'Size Guide'],
  ['contact.html', 'Contact & FAQ']
];

function buildChrome() {
  const here = location.pathname.split('/').pop() || 'index.html';

  const promo = document.createElement('div');
  promo.className = 'promo';
  // PROMO_BAR lives in data.js so the shop can edit it without touching code.
  promo.innerHTML = (typeof PROMO_BAR !== 'undefined' ? PROMO_BAR : [])
    .map(s => s.replace('{{freeShipping}}', money(CONFIG.freeShippingOver))
               .replace('{{phone}}', CONFIG.phone || ''))
    .join('&nbsp;&nbsp;·&nbsp;&nbsp;');

  const hdr = document.createElement('header');
  hdr.className = 'hdr';
  hdr.innerHTML = `
    <div class="hdr__inner">
      <a class="logo" href="index.html" aria-label="${CONFIG.brand} home">
        <img class="logo__mark" src="brand/logo.png" alt="" width="44" height="44">
        <span class="logo__text">
          <span class="logo__name">${CONFIG.brand}</span>
          <span class="logo__sub">${CONFIG.tagline}</span>
        </span>
      </a>
      <nav class="nav" id="nav">
        ${NAV_LINKS.map(([href, label]) =>
          `<a href="${href}" class="${href === here ? 'is-active' : ''}">${label}</a>`).join('')}
      </nav>
      <div class="hdr__acts">
        <button class="icon-btn search__toggle" id="searchToggle"
                aria-label="Search" aria-expanded="false">${ICON.search}</button>
        <button class="icon-btn" id="wishBtn" aria-label="Wishlist">
          ${ICON.heart}<span class="icon-btn__count" id="wishCount">0</span>
        </button>
        <button class="icon-btn" id="cartBtn" aria-label="Shopping bag">
          ${ICON.bag}<span class="icon-btn__count" id="cartCount">0</span>
        </button>
        <button class="icon-btn burger" id="burger" aria-label="Menu" aria-expanded="false">${ICON.burger}</button>
      </div>

      <!-- One input for both layouts: inline on desktop, and on a phone it
           wraps onto its own full-width row when the icon is tapped. -->
      <form class="search__field" id="searchField" role="search" autocomplete="off">
        <span class="search__icon">${ICON.search}</span>
        <input id="searchInput" type="search" placeholder="Search leggings, swim, skorts…"
               aria-label="Search products" aria-controls="searchResults" aria-expanded="false">
        <button class="search__clear" id="searchClear" type="button" aria-label="Clear search" hidden>${ICON.close}</button>
      </form>
    </div>
    <div class="search__results" id="searchResults" hidden></div>`;

  document.body.prepend(hdr);
  document.body.prepend(promo);

  /* drawer (shared by cart + wishlist) */
  const drawerScrim = document.createElement('div');
  drawerScrim.className = 'scrim';
  drawerScrim.id = 'drawerScrim';
  const drawer = document.createElement('aside');
  drawer.className = 'drawer';
  drawer.id = 'drawer';
  drawer.setAttribute('aria-hidden', 'true');
  drawer.innerHTML = `
    <div class="drawer__head">
      <h3 id="drawerTitle">Your bag</h3>
      <button class="icon-btn" id="drawerClose" aria-label="Close">${ICON.close}</button>
    </div>
    <div class="drawer__body" id="drawerBody"></div>
    <div class="drawer__foot" id="drawerFoot"></div>`;
  document.body.append(drawerScrim, drawer);

  /* footer */
  const ftr = document.createElement('footer');
  ftr.className = 'ftr';
  const igLink = `<a href="${CONFIG.instagram}" target="_blank" rel="noopener">Instagram ${CONFIG.instagramHandle}</a>`;
  ftr.innerHTML = `
    <div class="wrap">
      <div class="ftr__grid">
        <div>
          <a class="logo" href="index.html" style="margin-bottom:14px">
            <img class="logo__mark" src="brand/logo.png" alt="" width="48" height="48">
            <span class="logo__text">
              <span class="logo__name">${CONFIG.brand}</span>
              <span class="logo__sub">${CONFIG.tagline}</span>
            </span>
          </a>
          <p style="font-size:.9rem;color:var(--ink-3);max-width:34ch">
            ${CONFIG.blurb} Made for the way you actually train.
          </p>
          ${CONFIG.rating ? `<p class="stars" aria-label="${CONFIG.rating} out of 5 stars">★★★★★
            <span style="color:var(--ink-3);font-size:.8rem;margin-left:6px">
              ${CONFIG.rating} · ${CONFIG.reviewCount} reviews</span>
          </p>` : ''}
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            ${[...new Set(PRODUCTS.map(p => p.category))].map(c =>
              `<li><a href="shop.html?c=${encodeURIComponent(c)}">${c}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <h4>Help</h4>
          <ul>
            <li><a href="size-guide.html">Size guide</a></li>
            <li><a href="contact.html#faq">Delivery &amp; returns</a></li>
            <li><a href="contact.html">Contact us</a></li>
            <li><a href="cart.html">Your bag</a></li>
          </ul>
        </div>
        <div>
          <h4>Visit</h4>
          <ul>
            <li><a href="${CONFIG.mapsUrl}" target="_blank" rel="noopener">${CONFIG.address}</a></li>
            ${CONFIG.addressNote ? `<li><span style="font-size:.85rem;color:var(--ink-4)">${CONFIG.addressNote}</span></li>` : ''}
            <li><span style="font-size:.9rem;color:var(--ink-3)">Opens ${CONFIG.opensAt}</span></li>
            ${CONFIG.phone ? `<li><a href="tel:${CONFIG.phone.replace(/\s/g, '')}">${CONFIG.phone}</a></li>` : ''}
            ${CONFIG.whatsapp ? `<li><a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener">WhatsApp us</a></li>` : ''}
            <li>${igLink}</li>
            ${CONFIG.tiktok ? `<li><a href="${CONFIG.tiktok}" target="_blank" rel="noopener">TikTok ${CONFIG.tiktokHandle}</a></li>` : ''}
          </ul>
        </div>
      </div>
      <div class="ftr__bot">
        <span>© ${new Date().getFullYear()} ${CONFIG.brand}. Kampala, Uganda.</span>
        <span>Seamless. Seam-fit. Swim. Lounge.</span>
      </div>
    </div>`;
  document.body.appendChild(ftr);

  wireChrome();
}

/* ---------------------------------------------------------------- search */
/* Scores name > category > colour > blurb/details, so typing "swim" ranks the
   Swim pieces above something that merely mentions swimming in its care note. */
function searchProducts(q, limit = 6) {
  const terms = q.toLowerCase().replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(w => w.length > 1);
  if (!terms.length) return [];
  return PRODUCTS.map(p => {
    const name = p.name.toLowerCase();
    const cat = p.category.toLowerCase();
    const colors = p.colors.join(' ').toLowerCase();
    const rest = (p.blurb + ' ' + p.details.join(' ') + ' ' + p.fabric).toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (name.includes(t)) score += name.startsWith(t) ? 12 : 8;
      if (cat.includes(t)) score += 6;
      if (colors.includes(t)) score += 4;
      if (rest.includes(t)) score += 1;
    }
    if (score && !anyInStock(p)) score -= 3;
    return { p, score };
  }).filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.p);
}

function wireSearch() {
  const field = document.getElementById('searchField');
  const input = document.getElementById('searchInput');
  const clear = document.getElementById('searchClear');
  const toggle = document.getElementById('searchToggle');
  const results = document.getElementById('searchResults');
  const wrap = field.closest('.hdr');

  const close = () => {
    results.hidden = true;
    input.setAttribute('aria-expanded', 'false');
  };

  const render = () => {
    const q = input.value.trim();
    clear.hidden = !q;
    if (q.length < 2) { close(); return; }
    const hits = searchProducts(q);
    if (!hits.length) {
      results.innerHTML = `<div class="search__empty">
        Nothing matches “${escapeHtml(q)}”. Try a category — sets, bras, leggings, skorts, swim, lounge.</div>`;
    } else {
      results.innerHTML = `
        <div class="search__list">
          ${hits.map(p => `
            <a class="search__hit" href="product.html?id=${p.id}">
              <span class="search__thumb">${media(p.id, p.name)}</span>
              <span class="search__meta">
                <strong>${escapeHtml(p.name)}</strong>
                <small>${p.category}${anyInStock(p) ? '' : ' · sold out'}</small>
              </span>
              <span class="search__price">${money(p.price)}</span>
            </a>`).join('')}
        </div>
        <a class="search__all" href="shop.html?q=${encodeURIComponent(q)}">
          See all results for “${escapeHtml(q)}” ${ICON.arrow}</a>`;
    }
    results.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  };

  input.addEventListener('input', render);
  input.addEventListener('focus', render);

  clear.addEventListener('click', () => { input.value = ''; clear.hidden = true; close(); input.focus(); });

  field.addEventListener('submit', e => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) location.href = 'shop.html?q=' + encodeURIComponent(q);
  });

  // On a phone the field is hidden until the icon is tapped; it then wraps
  // onto its own row under the logo.
  toggle.addEventListener('click', () => {
    const open = wrap.classList.toggle('search-open');
    toggle.setAttribute('aria-expanded', String(open));
    if (open) setTimeout(() => input.focus(), 120); else close();
  });

  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) close();
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { close(); input.blur(); }
  });
}

function wireChrome() {
  const burger = document.getElementById('burger');

  // The menu button opens the shared side drawer at every width, so the side
  // menu is reachable on desktop as well as mobile.
  burger.addEventListener('click', () => openDrawer('menu'));

  const hdr = document.querySelector('.hdr');
  const onScroll = () => hdr.classList.toggle('is-stuck', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.getElementById('cartBtn').addEventListener('click', () => openDrawer('cart'));
  document.getElementById('wishBtn').addEventListener('click', () => openDrawer('wish'));
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  document.getElementById('drawerScrim').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  wireSearch();

  document.addEventListener('store:change', syncCounts);
  syncCounts();
}

function syncCounts() {
  const c = Store.count();
  const w = Store.wish.length;
  const cc = document.getElementById('cartCount');
  const wc = document.getElementById('wishCount');
  if (cc) { cc.textContent = c; cc.classList.toggle('is-on', c > 0); }
  if (wc) { wc.textContent = w; wc.classList.toggle('is-on', w > 0); }
  document.querySelectorAll('[data-wish]').forEach(btn => {
    const on = Store.isWished(btn.dataset.wish);
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', String(on));
  });
  if (document.getElementById('drawer').classList.contains('is-open')) renderDrawer();
}

/* ---------------------------------------------------------------- drawer */
let drawerMode = 'cart';

function openDrawer(mode) {
  drawerMode = mode;
  renderDrawer();
  document.getElementById('drawer').classList.add('is-open');
  document.getElementById('drawer').setAttribute('aria-hidden', 'false');
  document.getElementById('drawerScrim').classList.add('is-on');
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('is-open');
  document.getElementById('drawer').setAttribute('aria-hidden', 'true');
  document.getElementById('drawerScrim').classList.remove('is-on');
}

function renderDrawer() {
  const title = document.getElementById('drawerTitle');
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');

  if (drawerMode === 'menu') {
    title.textContent = 'Menu';
    const cats = [...new Set(PRODUCTS.map(p => p.category))];
    body.innerHTML = `
      <nav class="drawer-menu" aria-label="Main">
        ${NAV_LINKS.map(([href, label]) =>
          `<a href="${href}" class="drawer-menu__main">${label}</a>`).join('')}
      </nav>
      <p class="drawer-menu__label">Shop by category</p>
      <nav class="drawer-menu" aria-label="Categories">
        ${cats.map(c =>
          `<a href="shop.html?c=${encodeURIComponent(c)}" class="drawer-menu__sub">${c}</a>`).join('')}
      </nav>`;
    foot.innerHTML = `
      ${CONFIG.whatsapp ? `<a class="btn btn--primary btn--block" target="_blank" rel="noopener"
        href="https://wa.me/${CONFIG.whatsapp}">WhatsApp us</a>` : ''}
      <a class="btn btn--ghost btn--block" href="${CONFIG.instagram}" target="_blank" rel="noopener"
         style="margin-top:10px">Instagram ${CONFIG.instagramHandle}</a>
      <p style="font-size:.78rem;color:var(--ink-4);text-align:center;margin-top:12px">
        ${CONFIG.address}</p>`;
    return;
  }

  if (drawerMode === 'wish') {
    title.textContent = 'Saved pieces';
    if (!Store.wish.length) {
      body.innerHTML = `<div style="padding:44px 24px;text-align:center;color:var(--ink-3)">
        <div style="color:var(--brand-300);margin-bottom:10px">${ICON.heart}</div>
        Nothing saved yet. Tap the heart on anything you love.</div>`;
      foot.innerHTML = `<a class="btn btn--primary btn--block" href="shop.html">Start browsing</a>`;
      return;
    }
    body.innerHTML = Store.wish.map(id => {
      const p = getProduct(id);
      if (!p) return '';
      return `<div class="mini-row">
        <a class="mini-row__media" href="product.html?id=${p.id}">${media(p.id, p.name)}</a>
        <div><strong>${escapeHtml(p.name)}</strong><small>${money(p.price)}</small></div>
        <button class="icon-btn" data-wish="${p.id}" aria-label="Remove from wishlist">${ICON.close}</button>
      </div>`;
    }).join('');
    foot.innerHTML = `<a class="btn btn--primary btn--block" href="shop.html">Keep shopping</a>`;
    return;
  }

  title.textContent = 'Your bag';
  if (!Store.cart.length) {
    body.innerHTML = `<div style="padding:44px 24px;text-align:center;color:var(--ink-3)">
      <div style="color:var(--brand-300);margin-bottom:10px">${ICON.bag}</div>
      Your bag is empty — let's fix that.</div>`;
    foot.innerHTML = `<a class="btn btn--primary btn--block" href="shop.html">Shop new in</a>`;
    return;
  }

  body.innerHTML = Store.cart.map((l, i) => {
    const p = getProduct(l.id);
    if (!p) return '';
    return `<div class="mini-row">
      <a class="mini-row__media" href="product.html?id=${p.id}">${media(p.id, p.name)}</a>
      <div>
        <strong>${escapeHtml(p.name)}</strong>
        <small>${l.color} · ${l.size} · ×${l.qty}</small>
      </div>
      <div style="text-align:right">
        <div style="font-weight:600;font-size:.86rem">${money(p.price * l.qty)}</div>
        <button class="remove" data-remove="${i}">Remove</button>
      </div>
    </div>`;
  }).join('');

  const sub = Store.subtotal();
  const left = CONFIG.freeShippingOver - sub;
  foot.innerHTML = `
    ${left > 0 ? `<p style="font-size:.82rem;color:var(--ink-3);margin-bottom:10px">
        ${money(left)} away from free delivery ✨</p>` : `
      <p style="font-size:.82rem;color:var(--success);font-weight:600;margin-bottom:10px">
        Free delivery unlocked 🎀</p>`}
    <div class="sum-row sum-row--total" style="margin:0 0 14px;border:0;padding:0">
      <span>Subtotal</span><span>${money(sub)}</span>
    </div>
    <a class="btn btn--primary btn--block" href="cart.html">Checkout</a>`;
}

/* ---------------------------------------------------------------- global clicks */
document.addEventListener('click', e => {
  /* Add straight from a product card. Picks the first size that is actually
     in stock and the first colour, then says which — the shopper can change
     both in the bag. Without this there was no way to add to the bag from the
     shop grid on a phone at all. */
  const add = e.target.closest('[data-add]');
  if (add) {
    const p = getProduct(add.dataset.add);
    if (p) {
      const size = productSizes(p).find(s => inStock(p, s));
      if (!size) { toast(`${p.name} is sold out`); return; }
      if (Store.add(p.id, size, p.colors[0], 1)) {
        toast(`${p.name} — ${p.colors[0]}, ${size} added. Change size in your bag.`);
        openDrawer('cart');
      } else {
        toast(`That is all we have of the ${p.name} in ${size}`);
      }
    }
    return;
  }

  const wish = e.target.closest('[data-wish]');
  if (wish) {
    const added = Store.toggleWish(wish.dataset.wish);
    wish.classList.add('pop');
    setTimeout(() => wish.classList.remove('pop'), 420);
    const p = getProduct(wish.dataset.wish);
    toast(added ? `Saved ${p ? p.name : 'it'} to your wishlist 💕` : 'Removed from your wishlist');
    return;
  }
  const rm = e.target.closest('[data-remove]');
  if (rm) { Store.removeAt(Number(rm.dataset.remove)); toast('Removed from your bag'); }
});

/* ---------------------------------------------------------------- reveal */
function initReveal() {
  const els = [...document.querySelectorAll('.reveal')];
  const showAll = () => els.forEach(el => el.classList.add('is-in'));

  // Never let the animation be the reason content is invisible. If anything
  // stops the observer firing — a background tab, reduced-motion, an old
  // browser — the content still shows.
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showAll();
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) {
        setTimeout(() => en.target.classList.add('is-in'), Math.min(i * 55, 260));
        io.unobserve(en.target);
      }
    });
  }, { rootMargin: '200px 0px 0px 0px', threshold: 0 });
  els.forEach(el => io.observe(el));

  // Anything already on screen at load shows immediately, no wait.
  els.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
  });

  // Hard safety net: whatever happened, everything is visible after 2.5s.
  setTimeout(showAll, 2500);
}

/* ---------------------------------------------------------------- accordion */
function initAccordions(root = document) {
  root.querySelectorAll('.acc__item.is-open .acc__panel').forEach(panel => {
    panel.style.maxHeight = panel.scrollHeight + 'px';   // panels start collapsed in CSS
  });
  root.querySelectorAll('.acc__btn').forEach(btn => {
    if (btn.dataset.wired) return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc__item');
      const panel = item.querySelector('.acc__panel');
      const open = item.classList.toggle('is-open');
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
      btn.setAttribute('aria-expanded', String(open));
    });
  });
}

/* ---------------------------------------------------------------- boot */
document.addEventListener('DOMContentLoaded', () => {
  buildChrome();
  if (typeof pageInit === 'function') pageInit();
  initReveal();
  initAccordions();
  if (typeof initAssistant === 'function') initAssistant();
});

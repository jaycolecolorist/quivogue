/* ==========================================================================
   QV fits (Quivogue) — site data
   --------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO CHANGE THE STORE.

   WHAT IS REAL AND WHAT IS NOT

   REAL, and sourced — marked // REAL below:
     · Brand name "QV fits", handle @quivogue, TikTok @quivoguefits
     · Showroom: THE CUBE, G17, Kisementi, Kampala
     · WhatsApp / orders: +256 758 981 959
     · What they make: premium seamless & seam-fit activewear, swim and
       lounge wear
     · Golf & tennis skort wear: sizes XS–XL, with an inbuilt pant,
       described by the brand as multifunctional sportswear

   NOT REAL — placeholders you must replace before launch:
     · Every PRICE (marked // PRICE TBC). No prices are published anywhere
       public, so all of them are invented.
     · Size runs and stock counts, except the XS–XL noted above.
     · Delivery fees and the returns window.
     · Most product names and descriptions. The four pieces marked
       // REAL PIECE are ones actually seen in the brand's own posts.

   REVIEWS is deliberately EMPTY. QV fits has no public review listing that
   could be verified, and the review blocks stay hidden until you paste real
   ones in. Nothing here is carried over from the previous brand.

   PHOTOS
   brand/logo.png is the shop's real logo (the QV FITS wave mark, EST. 2023),
   taken from their Instagram profile picture with the white background
   knocked out. The site's magenta-to-purple accent is sampled from it.

   photos/ mixes two sources:
     · REAL QV photography — their own Instagram posts at full resolution
       plus the QVFIT studio product shots Jay supplied. These cover the hero,
       about, the campaign banner, every category tile, all four kit cards and
       most of the catalogue.
     · NO VIDEO STILLS. Earlier versions used frames lifted from their TikTok
       clips; all of those have been removed at Jay's request.
     · A shrinking remainder is free-licence stock filler, lightly graded to
       match. Replace it as real product photography arrives.
   Filenames map to product ids: <id>.jpg, plus -2 / -3 for the gallery.
   ========================================================================== */

const CONFIG = {
  // Bumped on every deploy so updated photos are not served from cache.
  assetVersion: '20260831221705',

  brand: 'QV fits',
  tagline: 'Quivogue',

  // REAL — showroom and contact
  address: 'THE CUBE, G17, Kisementi, Kampala',
  addressNote: 'Ground floor, shop G17',
  plusCode: null,
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Cube+Kisementi+Kampala',
  instagram: 'https://www.instagram.com/quivogue',
  instagramHandle: '@quivogue',
  tiktok: 'https://www.tiktok.com/@quivoguefits',
  tiktokHandle: '@quivoguefits',
  opensAt: '10 AM',            // PLACEHOLDER — confirm showroom hours
  rating: null,                // no public review listing found
  reviewCount: 0,
  followers: 14000,            // REAL — ~14K on Instagram

  // REAL — "WhatsApp orders" number published by the brand
  phone: '+256 758 981 959',
  whatsapp: '256758981959',
  email: null,

  // REAL — how the brand describes itself
  blurb: 'Premium seamless & seam-fit activewear, swim and lounge wear.',

  // Money — PLACEHOLDER, confirm all of it
  currency: 'UGX',
  currencyPosition: 'before',
  freeShippingOver: 250000,
  kampalaDelivery: 15000,
  upcountryDelivery: 35000,

  assistant: {
    // Null = runs entirely in the browser against the catalogue below.
    // Point this at your own server (holding the Anthropic key) for a real LLM.
    endpoint: null,
    name: 'Vee',
    greeting: "Hey! Looking for your fit? I know every piece in the studio — tell me what you train in."
  }
};

/* -------------------------------------------------------------------------
   CURRENCIES
   --------------------------------------------------------------------------
   UGX is the base and the only currency the shop actually settles in. The
   others are a convenience for customers reading from abroad — the picker
   says so, and every conversion is marked approximate.

   `perUGX` is how many units of that currency one shilling buys. Rates were
   taken from exchangerate-api.com on the date below. THEY GO STALE. Refresh
   them, and RATES_UPDATED with them, whenever you touch this file — the date
   is shown to customers so an old number is visibly old rather than a lie.
   ------------------------------------------------------------------------- */
const RATES_UPDATED = '31 August 2026';

const CURRENCIES = [
  /* `display` picks what sits before the number. UGX shows the code, because
     the shop writes "UGX 250,000" everywhere else and Intl's own symbol for it
     is "USh", which nobody on this site has ever seen. */
  { code: 'UGX', label: 'Uganda Shilling', perUGX: 1,        decimals: 0, display: 'code' },
  { code: 'USD', label: 'US Dollar',       perUGX: 0.000267, decimals: 2 },
  { code: 'EUR', label: 'Euro',            perUGX: 0.000231, decimals: 2 },
  { code: 'GBP', label: 'Pound Sterling',  perUGX: 0.000197, decimals: 2 },
  /* 'symbol' rather than 'narrowSymbol': both of these render as a bare $
     otherwise, which is indistinguishable from USD sitting right above them. */
  { code: 'CAD', label: 'Canadian Dollar', perUGX: 0.00037,  decimals: 2, display: 'symbol' },
  { code: 'AUD', label: 'Australian Dollar', perUGX: 0.000372, decimals: 2, display: 'symbol' },
  { code: 'CHF', label: 'Swiss Franc',     perUGX: 0.000217, decimals: 2 },
  { code: 'AED', label: 'UAE Dirham',      perUGX: 0.000982, decimals: 2 },
  { code: 'JPY', label: 'Japanese Yen',    perUGX: 0.042798, decimals: 0 }
];

/* -------------------------------------------------------------------------
   EMPTY ON PURPOSE. Paste real customer reviews here and the review blocks
   appear on the home and about pages. Never carry over another brand's.
   ------------------------------------------------------------------------- */
const REVIEWS = [];

/* -------------------------------------------------------------------------
   PROMOTIONS
   --------------------------------------------------------------------------
   ⚠ EVERY OFFER BELOW IS A PLACEHOLDER. Do not leave one switched on unless
   the offer is genuinely running — the site shows these as live claims next
   to a real WhatsApp number, so a stale "20% off" becomes a promise the shop
   has to honour.

   Set `live: false` to hide a promo without deleting it.

   For reference, the shop's own promo style (from their Instagram): a
   "QUIVOGUE CHRISTMAS MEGA SALE — DISCOUNT 50% OFF — THE CUBE G17 KISEMENTI"
   graphic. That one has expired, so it is not used on the site.
   ------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------
   THE TWO HOME-PAGE ROWS — which four pieces show in each.
   --------------------------------------------------------------------------
   Both are plain lists of product ids, so the shop can reorder them without
   touching any code. Leave a list empty and the row falls back to sorting the
   whole catalogue by badge.

   NEW_RELEASES is the four QVFIT studio shots Jay supplied — the brand's own
   photography, shot in the gym, in ivory, burgundy and two navies.

   ⚠ BEST_SELLERS is a PLACEHOLDER. Nothing public says what actually sells
   best; these four are simply the pieces with the strongest photography. Ask
   the shop for the real four before launch.
   ------------------------------------------------------------------------- */
const NEW_RELEASES = [
  'studio-two-piece',          // burgundy, gym
  'rib-seamless-set',          // navy, gym
  'seamless-longsleeve-set',   // ivory, gym
  'highwaist-sculpt-legging'   // navy, gym window light
];

const BEST_SELLERS = [
  'golf-tennis-skort-dress',
  'ribbed-lounge-set',
  'sculpt-seamless-set',
  'flare-lounge-legging'
];

/* -------------------------------------------------------------------------
   HERO SLIDES — the rotating canvas at the top of the home page.
   Images live in photos/ as hero-1.jpg … hero-4.jpg. All four are the brand's
   own photography (Jay's supplied shoot + their Instagram posts).
   Keep the copy short — it sits over the picture.
   ------------------------------------------------------------------------- */
const HERO_SLIDES = [
  {
    /* Each slide is a three-panel canvas, 1800x1150, built from the brand's
       own photography. `sticker` is the round tag on the picture. Copy and
       destinations are the client's own, supplied 2026-08-31. */
    id: 'hero-1',                          // j2 · j5 · j4 — one set, three colourways
    kicker: 'Gym · Pilates · Tennis · Golf · Swim · Lifestyle',
    title: 'Fit that holds.',
    text: 'Premium seamless and seam-fit pieces curated for training, movement and everyday life.',
    cta: 'Shop now',
    href: 'shop.html'                      // the whole range
  },
  {
    id: 'hero-3',                          // q4 · q7 · q8 — three flare colourways
    kicker: 'Latest drop',
    title: 'Made for your every move.',
    text: 'Fresh shades. Same QV energy.',
    cta: 'Shop now',
    /* The canvas is the three flare colourways — flare-lounge-legging and
       ribbed-lounge-set among them. ?occasion=lounge is the narrowest filter
       that actually contains both; ?c=Lounge would miss the legging, which
       sits under Bottoms. */
    href: 'shop.html?occasion=lounge'
  },
  {
    id: 'hero-4',                          // p4 · p5 · p1 — out of the gym
    kicker: 'Lounge & sport',
    title: 'Beyond Movement.',
    text: "Because your day doesn't end when the workout does.",
    cta: 'Shop now',
    href: 'shop.html?occasion=swim,lounge' // swim and lounge
  },
  {
    /* Shown at Jay's instruction (2026-08-31), after I had gated it. The copy
       is the client's own, so the sale is hers to declare — but until a piece
       carries a salePercent below, "Shop now" lands on an empty rail. Mark the
       reduced pieces and this becomes a real page. */
    id: 'hero-2',                          // q1 · q6 · q2 — track, court, track
    sticker: 'Sale',
    kicker: "Now's your moment",
    title: 'Up to 50% off.',
    text: 'Selected QV favourites, now for less.',
    cta: 'Shop now',
    href: 'shop.html?sale=1'               // the sale rail
  }
];

/* -------------------------------------------------------------------------
   SALE
   --------------------------------------------------------------------------
   ⚠ OFF, AND IT HAS TO STAY OFF UNTIL THE DISCOUNTS ARE REAL.

   Switching this on puts a "Up to 50% off" slide on the home page next to the
   shop's real WhatsApp number. To turn it on you need BOTH:

     1. SALE.live = true, and percentUpTo set to the real headline number
     2. `salePercent: <n>` on each product that is genuinely reduced

   With live true and nothing carrying a salePercent, the sale rail would be
   empty and the banner would be a promise the shop cannot keep — so the
   slide stays hidden until at least one piece is marked.
   ------------------------------------------------------------------------- */
const SALE = {
  // ON — the home page advertises it. What is still missing is the discount on
  // each piece: add `salePercent: <n>` to every product that is genuinely
  // reduced and they appear in the ?sale=1 rail with the old price struck out.
  // Until then that rail is empty and says so.
  live: true,
  percentUpTo: 50
};

/* -------------------------------------------------------------------------
   AS SEEN ON — the credit row under the hero.
   --------------------------------------------------------------------------
   The reference site (wiskiiactive.com) runs Vogue / Elle / Marie Claire /
   Forbes / Cosmopolitan under "AS SEEN IN". Those are WISKII's press credits.
   QV fits has not been in those magazines, and printing their names and marks
   here would be a false claim about the business made to its own customers.
   So the row is real instead: creators who have genuinely worn and posted
   QV fits, each verifiable from the brand's own Instagram grid, where these
   are co-authored posts.

   Add a real outlet the moment there is one — a Kampala paper, a blog, a
   magazine feature, an event — and change `title` back to "As featured in".
   `logo` is optional; with no logo file the name is set in the display face.
   ------------------------------------------------------------------------- */
const PRESS = {
  // OFF at Jay's request (2026-08-31) — he did not want the creator tags on
  // the page. Nothing here is deleted, so a real credit row is one flag away.
  live: false,
  title: 'As seen on',
  items: [
    // Verified from co-authored posts in the brand's own Instagram grid:
    // { name: '@gia9ina',          href: 'https://www.instagram.com/gia9ina/' },
    // { name: '@sashatherealdeal', href: 'https://www.instagram.com/sashatherealdeal/' },
    // { name: '@zarahmagara',      href: 'https://www.instagram.com/zarahmagara/' }
  ]
};

/* -------------------------------------------------------------------------
   SHOP THE FEED — the video row near the bottom of the home page.
   --------------------------------------------------------------------------
   Four of the brand's own Instagram reels, cut to silent 8-second loops and
   re-encoded small (photos/reel-*.mp4, with a matching .jpg poster). They
   autoplay muted and loop, and each tile is a link through to what she is
   wearing.

   ⚠ The hrefs are my best read of the outfit from the footage. Point each one
   at the exact piece once the shop confirms which SKU is in which clip.
   ------------------------------------------------------------------------- */
const SHOP_THE_FEED = {
  live: true,
  kicker: 'Straight from the feed',
  title: 'Seen on you',
  items: [
    { id: 'reel-pilates', label: 'Pilates, in pink',   href: 'shop.html?occasion=yoga',
      post: 'https://www.instagram.com/quivogue/reel/DQwQl5KDP7h/' },
    { id: 'reel-class',   label: 'BTS: the Pilates class', href: 'shop.html?occasion=yoga',
      post: 'https://www.instagram.com/quivogue/reel/DMa-87foxWC/' },
    { id: 'reel-studio',  label: 'Straight from the studio', href: 'shop.html?c=Sets',
      post: 'https://www.instagram.com/quivogue/reel/DSxOby3jCpJ/' },
    { id: 'reel-offduty', label: 'Off duty, in mocha', href: 'product.html?id=flare-lounge-legging',
      post: 'https://www.instagram.com/quivogue/reel/DS5N4xIjGz2/' }
  ]
};
/* -------------------------------------------------------------------------
   STICKER — the small dismissible offer card, bottom-left.
   --------------------------------------------------------------------------
   ⚠ THIS IS A LIVE PROMISE. It is tied to the newsletter form, so anyone who
   subscribes will expect 10% off their first order. Switch it off the day the
   offer ends. Dismissing it is remembered for `snoozeDays`.
   ------------------------------------------------------------------------- */
const STICKER = {
  live: true,                   // ON at Jay's request (2026-08-30)
  tag: '10% off',
  title: 'First order, 10% off',
  text: 'Join the list and we\'ll send your code before the next drop.',
  cta: 'Get my code',
  href: '#newsForm',
  snoozeDays: 14,
  delayMs: 6000                 // let people see the page before it appears
};

/* The rotating strip at the very top of every page. */
const PROMO_BAR = [
  `Free delivery over {{freeShipping}}`,                    // follows CONFIG
  `Showroom at THE CUBE, G17 Kisementi`,                    // REAL
  `WhatsApp orders {{phone}}`                               // REAL
];

/* The big campaign banner on the home page. Image: photos/banner-campaign.jpg */
const CAMPAIGN = {
  live: true,
  kicker: 'New styles',
  title: 'Tennis is Sport',
  text: 'The court range — collared tops, pleated skorts and an inbuilt pant, built for the modern active woman.',
  cta: 'Shop the court range',
  href: 'shop.html?c=Skorts'
};

/* The three deal cards under it. */
const DEALS = [
  {
    id: 'seasonal',
    live: true,                 // PROMO placeholder — confirm before launch
    tag: 'Seasonal',
    title: 'Summer drop',
    text: 'Swim and lightweight seamless, just landed in store.',
    cta: 'Shop swim',
    href: 'shop.html?c=Swim',
    tone: 'brand'
  },
  {
    id: 'percent-off',
    live: true,                 // ON at Jay's request (2026-08-28).
                                // This advertises a live discount next to the
                                // shop's real WhatsApp number — set back to
                                // false the day the offer ends.
    tag: 'Limited',
    title: '20% off',
    text: 'Selected sets and bras. Ask in store or on WhatsApp.',
    cta: 'See what\'s in',
    href: 'shop.html?c=Sets',
    tone: 'dark'
  },
  {
    id: 'weekly',
    live: true,                 // PROMO placeholder — confirm before launch
    tag: 'This week',
    title: 'Weekly deal',
    text: 'A rotating piece at a better price. Changes every Monday.',
    cta: 'Ask us what\'s on',
    href: null,                 // null = opens WhatsApp
    tone: 'teal'
  }
];

/* ------------------------------------------------------------------------- */
const COLOR_SWATCHES = {
  'Teal':      '#14625a',
  'Forest':    '#26433a',
  'Ivory':     '#f4efe6',
  'Cream':     '#ece2d2',
  'Sand':      '#d9c7ab',
  'Mocha':     '#b08968',
  'Espresso':  '#5c4433',
  'Butter':    '#efcb68',
  'Pink':      '#e8467f',
  'Navy':      '#2a3a6b',
  'Burgundy':  '#7d2740',
  'Grey':      '#b9bcc0',
  'Olive':     '#7d8560',
  'Slate':     '#5d6b73',
  'Black':     '#1c2321',
  'White':     '#ffffff'
};

/* -------------------------------------------------------------------------
   CATALOGUE
   stock counts: 0 = sold out (the site tells the truth about this)
   ------------------------------------------------------------------------- */
const PRODUCTS = [
  /* ---------------- SETS ---------------- */
  {
    id: 'seamless-longsleeve-set', name: 'Seamless Long-Sleeve Set', category: 'Sets',
    price: 210000,                                   // PRICE TBC
    colors: ['Ivory', 'Pink', 'Black'], badge: 'New',
    occasions: ['gym', 'everyday', 'lounge'],        // REAL PIECE — from the brand's own post
    blurb: 'Second-skin seamless in a long sleeve and matching legging. Knitted in one piece, so there are no side seams to dig in.',
    details: ['Seamless knit construction', 'Long sleeve + matching legging', 'Squat-tested opaque', 'Four-way stretch'],
    fit: 'small', fitNote: 'Compressive by design — size up if you want a softer hold.',
    fabric: 'Nylon-elastane seamless knit',
    stock: { XS: 3, S: 5, M: 5, L: 4, XL: 2 }
  },
  {
    id: 'sculpt-seamless-set', name: 'Sculpt Seamless Set', category: 'Sets',
    price: 195000,                                   // PRICE TBC
    colors: ['Ivory', 'Butter', 'Teal'], badge: 'Bestseller',
    occasions: ['gym', 'yoga', 'everyday'],
    blurb: 'The bra-and-bike-short set that started it all. Ribbed through the waist, smooth everywhere else.',
    details: ['Longline bra + bike short', 'Ribbed contour panels', 'Removable cups', 'High waist'],
    fit: 'small', fitNote: 'Runs small. Between sizes? Take the larger.',
    fabric: 'Nylon-elastane seamless knit',
    stock: { XS: 2, S: 4, M: 4, L: 3, XL: 1 }
  },
  {
    id: 'rib-seamless-set',
    badge: 'New', name: 'Rib Seamless Set', category: 'Sets',
    price: 195000,                                   // PRICE TBC
    colors: ['Navy', 'Sand', 'Black'],
    occasions: ['gym', 'yoga', 'lounge'],
    blurb: 'A finer rib with more give. The one to train in when you want the set to move with you, not hold you.',
    details: ['Fine rib seamless knit', 'Scoop bra + full-length legging', 'Soft waistband', 'Breathable'],
    fit: 'true', fitNote: 'True to size.',
    fabric: 'Nylon-elastane rib knit',
    stock: { XS: 3, S: 4, M: 5, L: 3, XL: 2 }
  },
  {
    id: 'studio-two-piece',
    badge: 'New', name: 'Studio Two-Piece', category: 'Sets',
    price: 225000,                                   // PRICE TBC
    colors: ['Burgundy', 'Slate', 'Black'],
    occasions: ['gym', 'run', 'everyday'],
    blurb: 'Seam-fit rather than seamless — panelled for structure where you want it and airflow where you need it.',
    details: ['Seam-fit panelling', 'Mesh ventilation', 'Cropped tank + legging', 'Flatlock seams'],
    fit: 'true', fitNote: 'True to size, supportive through the middle.',
    fabric: 'Recycled poly-elastane',
    stock: { XS: 1, S: 3, M: 3, L: 2, XL: 0 }
  },

  /* ---------------- BRAS ---------------- */
  {
    id: 'seamless-longline-bra', name: 'Seamless Longline Bra', category: 'Bras',
    price: 85000,                                    // PRICE TBC
    colors: ['Ivory', 'Mocha', 'Teal', 'Black'], badge: 'Bestseller',
    occasions: ['gym', 'yoga', 'everyday'],
    blurb: 'Longline cut with a wide underband. Medium support, and comfortable enough to keep on all day.',
    details: ['Longline silhouette', 'Wide supportive underband', 'Removable cups', 'Medium support'],
    fit: 'small', fitNote: 'Runs small — size up if you are between.',
    fabric: 'Nylon-elastane seamless knit',
    stock: { XS: 4, S: 6, M: 6, L: 4, XL: 3 }
  },
  {
    id: 'crossback-sports-bra', name: 'Cross-Back Sports Bra', category: 'Bras',
    price: 90000,                                    // PRICE TBC
    colors: ['Black', 'Forest', 'Sand'],
    occasions: ['run', 'gym'],
    blurb: 'High support, cross-back straps, no bounce. Built for the days you actually run.',
    details: ['High support', 'Cross-back straps', 'Moisture-wicking', 'Bonded edges'],
    fit: 'true', fitNote: 'True to size. Snug on purpose.',
    fabric: 'Recycled poly-elastane',
    stock: { XS: 3, S: 5, M: 4, L: 3, XL: 2 }
  },
  {
    id: 'ribbed-scoop-bra', name: 'Ribbed Scoop Bra', category: 'Bras',
    price: 75000,                                    // PRICE TBC
    colors: ['Butter', 'Ivory', 'Olive'],
    occasions: ['yoga', 'lounge', 'everyday'],
    blurb: 'Light support, deep scoop, soft rib. The one that lives in your everyday rotation.',
    details: ['Light support', 'Deep scoop neckline', 'Rib knit', 'Pull-on'],
    fit: 'true', fitNote: 'True to size.',
    fabric: 'Cotton-blend rib',
    stock: { XS: 5, S: 6, M: 5, L: 4, XL: 2 }
  },

  /* ---------------- BOTTOMS ---------------- */
  {
    id: 'highwaist-sculpt-legging', name: 'High-Waist Sculpt Legging', category: 'Bottoms',
    price: 145000,                                   // PRICE TBC
    colors: ['Navy', 'Black', 'Mocha', 'Slate'], badge: 'New',
    occasions: ['gym', 'run', 'everyday'],
    blurb: 'The legging we get asked about most. High rise, contour seaming, and genuinely opaque under load.',
    details: ['High rise', 'Contour seaming', 'Squat-tested opaque', 'Hidden waistband pocket'],
    fit: 'true', fitNote: 'True to size and compressive. Size up for a relaxed feel.',
    fabric: 'Nylon-elastane',
    stock: { XS: 3, S: 6, M: 6, L: 4, XL: 3 }
  },
  {
    id: 'flare-lounge-legging', name: 'Flare Lounge Legging', category: 'Bottoms',
    price: 135000,                                   // PRICE TBC
    colors: ['Mocha', 'Burgundy', 'Black'], badge: 'Bestseller',
    occasions: ['lounge', 'everyday', 'yoga'],
    blurb: 'A soft flare through the ankle. Studio to street without changing.',
    details: ['Flared hem', 'High rise', 'Brushed inside', 'Full length'],
    fit: 'true', fitNote: 'True to size. Long — made for a trainer or a heel.',
    fabric: 'Brushed poly-elastane',
    stock: { XS: 2, S: 4, M: 4, L: 3, XL: 1 }
  },

  /* ---------------- SKORTS ---------------- */
  {
    id: 'golf-tennis-skort-dress', name: 'Golf & Tennis Skort Dress', category: 'Skorts',
    price: 245000,                                   // PRICE TBC
    colors: ['Teal', 'White', 'Black'], badge: 'Bestseller',
    occasions: ['golf-tennis', 'everyday'],          // REAL PIECE — the brand's own golf post
    blurb: 'Collared, zip-front, with an inbuilt pant underneath. Multifunctional sportswear — course, court, then lunch.',
    details: ['Inbuilt pant', 'Zip front placket', 'Collared, sleeveless', 'Four-way stretch'],
    fit: 'true', fitNote: 'True to size. Stocked XS–XL.',
    fabric: 'Poly-elastane performance knit',
    stock: { XS: 2, S: 4, M: 4, L: 3, XL: 2 }        // REAL SIZE RUN — brand states XS–XL
  },
  {
    id: 'pleated-tennis-skort', name: 'Pleated Tennis Skort', category: 'Skorts',
    price: 165000,                                   // PRICE TBC
    colors: ['White', 'Teal', 'Butter'],
    occasions: ['golf-tennis', 'everyday'],
    blurb: 'Knife-pleated with the same inbuilt pant. Moves properly on a serve.',
    details: ['Knife pleats', 'Inbuilt pant', 'Elasticated waist', 'Ball pocket'],
    fit: 'true', fitNote: 'True to size.',
    fabric: 'Poly-elastane performance knit',
    stock: { XS: 3, S: 4, M: 3, L: 2, XL: 0 }
  },

  /* ---------------- SWIM ---------------- */
  {
    id: 'sculpt-one-piece', name: 'Sculpt One-Piece', category: 'Swim',
    price: 185000,                                   // PRICE TBC
    colors: ['Black', 'Teal', 'Mocha'],
    occasions: ['swim'],
    blurb: 'Scooped back, high leg, and a lining that actually holds. Swims as well as it photographs.',
    details: ['Full front lining', 'High-leg cut', 'Scoop back', 'Chlorine resistant'],
    fit: 'small', fitNote: 'Swim runs small — size up if between.',
    fabric: 'Recycled nylon-elastane',
    stock: { XS: 2, S: 3, M: 3, L: 2, XL: 1 }
  },
  {
    id: 'ribbed-bikini-set', name: 'Ribbed Bikini Set', category: 'Swim',
    price: 165000,                                   // PRICE TBC
    colors: ['Butter', 'Ivory', 'Teal'], badge: 'New',
    occasions: ['swim'],
    blurb: 'Ribbed triangle top with tie sides. Sold as a set, sized separately on request.',
    details: ['Ribbed fabric', 'Adjustable tie sides', 'Removable cups', 'Sold as a set'],
    fit: 'true', fitNote: 'True to size. Ask us to split sizes across top and bottom.',
    fabric: 'Recycled nylon-elastane rib',
    stock: { XS: 2, S: 4, M: 3, L: 2, XL: 0 }
  },

  /* ---------------- LOUNGE ---------------- */
  {
    id: 'ribbed-lounge-set', name: 'Ribbed Lounge Set', category: 'Lounge',
    price: 240000,                                   // PRICE TBC
    colors: ['Burgundy', 'Mocha', 'Cream'], badge: 'Bestseller',
    occasions: ['lounge', 'everyday'],               // REAL PIECE — the brand's own lounge post
    blurb: 'Hooded rib top and wide-leg pant in the same soft knit. Built for long flights and slow mornings.',
    details: ['Hooded rib top + wide-leg pant', 'Soft-spun rib knit', 'Relaxed through the leg', 'Sold as a set'],
    fit: 'relaxed', fitNote: 'Oversized on purpose — take your usual size.',
    fabric: 'Viscose-blend rib knit',
    stock: { XS: 2, S: 4, M: 4, L: 3, XL: 2 }
  },
  {
    id: 'oversized-lounge-hoodie', name: 'Oversized Lounge Hoodie', category: 'Lounge',
    price: 165000,                                   // PRICE TBC
    colors: ['Cream', 'Slate', 'Forest'],
    occasions: ['lounge', 'everyday'],
    blurb: 'Heavyweight, dropped shoulder, brushed inside. The one that never makes it back to its owner.',
    details: ['Heavyweight fleeceback', 'Dropped shoulder', 'Kangaroo pocket', 'Ribbed cuffs'],
    fit: 'relaxed', fitNote: 'Oversized. Size down for a neater fit.',
    fabric: 'Cotton-blend fleeceback',
    stock: { XS: 3, S: 5, M: 5, L: 4, XL: 3 }
  },
  {
    id: 'wideleg-lounge-pant', name: 'Wide-Leg Lounge Pant', category: 'Lounge',
    price: 150000,                                   // PRICE TBC
    colors: ['Burgundy', 'Mocha', 'Black'],
    occasions: ['lounge', 'everyday'],
    blurb: 'A proper wide leg with a soft waistband. Wears like pyjamas, reads like trousers.',
    details: ['Wide leg', 'Soft elastic waistband', 'Full length', 'Side pockets'],
    fit: 'relaxed', fitNote: 'Relaxed — take your usual size.',
    fabric: 'Viscose-blend rib knit',
    stock: { XS: 2, S: 4, M: 4, L: 3, XL: 1 }
  }
];

/* -------------------------------------------------------------------------
   MOVEMENTS — the home page "Shop by movement" tiles.
   Four only, on purpose: the client asked for a spare home page. Each points
   at the shop filtered by that activity. Images: photos/movement-<id>.jpg
   ------------------------------------------------------------------------- */
const MOVEMENTS = [
  { id: 'gym',         label: 'Gym',           occasion: 'gym' },
  { id: 'pilates',     label: 'Pilates',       occasion: 'yoga' },
  { id: 'tennis',      label: 'Tennis',        occasion: 'golf-tennis' },
  { id: 'swim-lounge', label: 'Swim & Lounge', occasion: 'swim,lounge' }
];

/* -------------------------------------------------------------------------
   Activities — what you're training in, not what event you're dressing for
   ------------------------------------------------------------------------- */
const OCCASIONS = [
  { id: 'gym',          label: 'Gym & lifting' },
  { id: 'run',          label: 'Running' },
  { id: 'yoga',         label: 'Yoga & pilates' },
  { id: 'golf-tennis',  label: 'Golf & tennis' },
  { id: 'swim',         label: 'Swim' },
  { id: 'lounge',       label: 'Lounge' },
  { id: 'everyday',     label: 'Everyday' }
];

/* -------------------------------------------------------------------------
   Kits — real pairings from the catalogue
   ------------------------------------------------------------------------- */
const LOOKS = [
  {
    id: 'look-lift-day', title: 'Lift Day',
    note: 'Compression where it counts. Longline bra, sculpt legging, nothing that moves.',
    items: ['seamless-longline-bra', 'highwaist-sculpt-legging', 'rib-seamless-set']
  },
  {
    id: 'look-course-to-lunch', title: 'Course to Lunch',
    note: 'The skort dress with an inbuilt pant, so nine holes and a table both work.',
    items: ['golf-tennis-skort-dress', 'crossback-sports-bra', 'pleated-tennis-skort']
  },
  {
    id: 'look-long-haul', title: 'Long Haul',
    note: 'Rib lounge set and an oversized hoodie. Built for the flight, not the photo.',
    items: ['ribbed-lounge-set', 'oversized-lounge-hoodie', 'wideleg-lounge-pant']
  },
  {
    id: 'look-off-duty', title: 'Off Duty',
    note: 'Soft rib bra, flare legging, and a jogger for when it cools down.',
    items: ['ribbed-scoop-bra', 'flare-lounge-legging', 'wideleg-lounge-pant']
  }
];

/* -------------------------------------------------------------------------
   Size guide — body measurements in cm, converted to inches on the fly
   ------------------------------------------------------------------------- */
const SIZE_CHART = [
  { size: 'XS', uk: '6',  us: '2',  eu: '34', bust: [76, 81],  waist: [58, 63],  hip: [84, 89] },
  { size: 'S',  uk: '8',  us: '4',  eu: '36', bust: [81, 86],  waist: [63, 68],  hip: [89, 94] },
  { size: 'M',  uk: '10', us: '6',  eu: '38', bust: [86, 91],  waist: [68, 73],  hip: [94, 99] },
  { size: 'L',  uk: '12', us: '8',  eu: '40', bust: [91, 97],  waist: [73, 79],  hip: [99, 105] },
  { size: 'XL', uk: '14', us: '10', eu: '42', bust: [97, 104], waist: [79, 86],  hip: [105, 112] }
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const SHOE_SIZES = [];

/* ------------------------------------------------------------------------- */
const FAQ = [
  {
    q: 'Where is the showroom?',
    a: `${CONFIG.address} — ${CONFIG.addressNote.toLowerCase()}. Come and try things on; fit is the whole point.`
  },
  {
    q: 'How do I order?',
    a: `WhatsApp ${CONFIG.phone} with the piece, your size and your colour, or DM us on Instagram at ${CONFIG.instagramHandle}. Our team confirms stock and payment with you directly.`
  },
  {
    q: 'What is the difference between seamless and seam-fit?',
    a: 'Seamless is knitted as one tube, so there are no side seams to rub — it hugs and moves with you. Seam-fit is cut and stitched from panels, which lets us build in structure, support and mesh exactly where they are needed. Seamless for comfort and shape, seam-fit for support.'
  },
  {
    q: 'Are the leggings squat-proof?',
    a: 'The High-Waist Sculpt Legging and the seamless sets are tested opaque under stretch. If you are ever unsure about a specific colour, ask us — the lighter shades are the ones worth asking about.'
  },
  {
    q: 'How should activewear fit?',
    a: 'Snugger than you think. Seamless pieces are compressive and relax slightly as you wear them, so take your true size unless the piece says it runs small. If you are between sizes and want a softer hold, go up.'
  },
  {
    q: 'How do I care for it?',
    a: 'Cold wash, inside out, no fabric softener — it clogs the fibres and kills the stretch. Hang to dry, never tumble. Rinse swimwear in fresh water after chlorine or salt.'
  },
  {
    q: 'Can I exchange something?',
    a: 'Talk to us as soon as you can and we will sort an exchange on anything unworn with its tags on. For hygiene reasons swimwear can only be exchanged if the liner is intact and unworn.'
  },
  {
    q: 'Do you deliver?',
    a: 'Yes. Tell us where you are on WhatsApp and we will confirm the delivery fee and timing before anything is sent.'
  }
];

/* ------------------------------------------------------------------ helpers */
function getProduct(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}
function productSizes(p) {
  return Object.keys(p.stock);
}
function inStock(p, size) {
  return (p.stock[size] || 0) > 0;
}
function anyInStock(p) {
  return Object.values(p.stock).some(n => n > 0);
}
function lowStock(p, size) {
  const n = p.stock[size] || 0;
  return n > 0 && n <= 2;
}

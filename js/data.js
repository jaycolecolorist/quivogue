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
     · The prominent slots are the brand's OWN Instagram post photography at
       full resolution — hero, about, banner-campaign ("Tennis is Sport"),
       collection-sets, collection-skorts, and several products.
     · The remainder is free-licence stock, lightly graded to match, so the
       store reads as finished. Replace it with real QV photography.
   Filenames map to product ids: <id>.jpg, plus -2 / -3 for the gallery.
   ========================================================================== */

const CONFIG = {
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
    live: false,                // PROMO placeholder — OFF until a real sale runs
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
    colors: ['Pink', 'Mocha', 'Black'], badge: 'Bestseller',
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
    colors: ['Ivory', 'Butter', 'Teal'], badge: 'New',
    occasions: ['gym', 'yoga', 'everyday'],
    blurb: 'The bra-and-bike-short set that started it all. Ribbed through the waist, smooth everywhere else.',
    details: ['Longline bra + bike short', 'Ribbed contour panels', 'Removable cups', 'High waist'],
    fit: 'small', fitNote: 'Runs small. Between sizes? Take the larger.',
    fabric: 'Nylon-elastane seamless knit',
    stock: { XS: 2, S: 4, M: 4, L: 3, XL: 1 }
  },
  {
    id: 'rib-seamless-set', name: 'Rib Seamless Set', category: 'Sets',
    price: 195000,                                   // PRICE TBC
    colors: ['Sand', 'Olive', 'Black'],
    occasions: ['gym', 'yoga', 'lounge'],
    blurb: 'A finer rib with more give. The one to train in when you want the set to move with you, not hold you.',
    details: ['Fine rib seamless knit', 'Scoop bra + full-length legging', 'Soft waistband', 'Breathable'],
    fit: 'true', fitNote: 'True to size.',
    fabric: 'Nylon-elastane rib knit',
    stock: { XS: 3, S: 4, M: 5, L: 3, XL: 2 }
  },
  {
    id: 'studio-two-piece', name: 'Studio Two-Piece', category: 'Sets',
    price: 225000,                                   // PRICE TBC
    colors: ['Slate', 'Black'],
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
    colors: ['Black', 'Mocha', 'Forest', 'Slate'], badge: 'Bestseller',
    occasions: ['gym', 'run', 'everyday'],
    blurb: 'The legging we get asked about most. High rise, contour seaming, and genuinely opaque under load.',
    details: ['High rise', 'Contour seaming', 'Squat-tested opaque', 'Hidden waistband pocket'],
    fit: 'true', fitNote: 'True to size and compressive. Size up for a relaxed feel.',
    fabric: 'Nylon-elastane',
    stock: { XS: 3, S: 6, M: 6, L: 4, XL: 3 }
  },
  {
    id: 'seamless-bike-short', name: 'Seamless Bike Short', category: 'Bottoms',
    price: 95000,                                    // PRICE TBC
    colors: ['Black', 'Sand', 'Teal'],
    occasions: ['gym', 'yoga', 'everyday'],
    blurb: 'Mid-thigh, no side seam, no ride-up. Wear it under a skort or on its own.',
    details: ['Seamless knit', 'Mid-thigh length', 'High waist', 'No side seam'],
    fit: 'small', fitNote: 'Runs small — size up if between.',
    fabric: 'Nylon-elastane seamless knit',
    stock: { XS: 4, S: 5, M: 5, L: 3, XL: 2 }
  },
  {
    id: 'flare-lounge-legging', name: 'Flare Lounge Legging', category: 'Bottoms',
    price: 135000,                                   // PRICE TBC
    colors: ['Espresso', 'Black', 'Cream'], badge: 'New',
    occasions: ['lounge', 'everyday', 'yoga'],
    blurb: 'A soft flare through the ankle. Studio to street without changing.',
    details: ['Flared hem', 'High rise', 'Brushed inside', 'Full length'],
    fit: 'true', fitNote: 'True to size. Long — made for a trainer or a heel.',
    fabric: 'Brushed poly-elastane',
    stock: { XS: 2, S: 4, M: 4, L: 3, XL: 1 }
  },
  {
    id: 'everyday-jogger', name: 'Everyday Jogger', category: 'Bottoms',
    price: 155000,                                   // PRICE TBC
    colors: ['Cream', 'Slate', 'Olive'],
    occasions: ['lounge', 'everyday'],
    blurb: 'Tapered, cuffed, with proper pockets. The travel-day trouser.',
    details: ['Tapered leg', 'Cuffed hem', 'Deep side pockets', 'Drawcord waist'],
    fit: 'relaxed', fitNote: 'Relaxed cut — take your usual size.',
    fabric: 'Cotton-blend fleeceback',
    stock: { XS: 3, S: 4, M: 4, L: 3, XL: 2 }
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
    colors: ['Ivory', 'Cream', 'Espresso'], badge: 'Bestseller',
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
    colors: ['Ivory', 'Espresso', 'Black'],
    occasions: ['lounge', 'everyday'],
    blurb: 'A proper wide leg with a soft waistband. Wears like pyjamas, reads like trousers.',
    details: ['Wide leg', 'Soft elastic waistband', 'Full length', 'Side pockets'],
    fit: 'relaxed', fitNote: 'Relaxed — take your usual size.',
    fabric: 'Viscose-blend rib knit',
    stock: { XS: 2, S: 4, M: 4, L: 3, XL: 1 }
  }
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
    items: ['seamless-longline-bra', 'highwaist-sculpt-legging', 'seamless-bike-short']
  },
  {
    id: 'look-course-to-lunch', title: 'Course to Lunch',
    note: 'The skort dress with an inbuilt pant, so nine holes and a table both work.',
    items: ['golf-tennis-skort-dress', 'crossback-sports-bra', 'seamless-bike-short']
  },
  {
    id: 'look-long-haul', title: 'Long Haul',
    note: 'Rib lounge set and an oversized hoodie. Built for the flight, not the photo.',
    items: ['ribbed-lounge-set', 'oversized-lounge-hoodie', 'wideleg-lounge-pant']
  },
  {
    id: 'look-off-duty', title: 'Off Duty',
    note: 'Soft rib bra, flare legging, and a jogger for when it cools down.',
    items: ['ribbed-scoop-bra', 'flare-lounge-legging', 'everyday-jogger']
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

/* ==========================================================================
   Gash Luxe — site data
   --------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO CHANGE THE STORE.

   WHAT IS REAL AND WHAT IS NOT
   The catalogue below is built from the pieces actually visible on the Gash
   Luxe Instagram (@gashluxe, pulled 2026-07-26). Every product is a real
   garment from their feed and every photo is their own.

     // REAL PRICE   — the price was stated on the Instagram post itself.
     // PRICE TBC    — the piece is real, the price is a placeholder. Confirm.

   Sizes are only trustworthy where the post said so (marked // REAL SIZES).
   Everywhere else the size runs and stock counts are placeholders.

   Contact details, address, hours, rating and the customer reviews are REAL,
   from the Google listing and the Instagram bio.

   PHOTOS
   All 37 images in /photos are Gash Luxe's own, pulled from @gashluxe.
   Every one is colour-graded to the brand palette by scratchpad/grade.py
   (blush highlights, lilac shadows, greens and yellows pulled back, skin
   protected) at strength 0.7. Re-run that script to re-grade or to change
   the look; the ungraded originals are kept in scratchpad/ig/.
   Filenames map to product ids: <id>.jpg plus -2 / -3 for the gallery.
   Overwrite a file and it appears; delete it and a gradient placeholder
   takes over.
   ========================================================================== */

const CONFIG = {
  brand: 'Gash Luxe',
  tagline: 'by Sheilah Gashumba',

  // REAL — Google listing + Instagram bio
  address: '27 Clement Hill Rd, Kampala, Uganda',
  addressNote: 'Opposite Jikoni Restaurant',
  plusCode: '8H9Q+HV Kampala, Uganda',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Gash+Luxe+27+Clement+Hill+Rd+Kampala',
  instagram: 'https://www.instagram.com/gashluxe',
  instagramHandle: '@gashluxe',
  opensAt: '10 AM',
  rating: 4.9,
  reviewCount: 9,
  followers: 35184,
  deliveryAvailable: true,

  // REAL — from the Instagram bio: "Call or whatsapp +256 768 308896"
  phone: '+256 768 308896',
  whatsapp: '256768308896',
  email: null,

  // REAL — the bio describes the shop as more than a clothing rail
  blurb: 'Shopping lounge, mini champagne bar and content studio.',

  // Money
  currency: 'UGX',
  currencyPosition: 'before',
  freeShippingOver: 200000,
  kampalaDelivery: 15000,     // PLACEHOLDER — confirm
  upcountryDelivery: 35000,   // PLACEHOLDER — confirm

  // Style Assistant
  assistant: {
    // Leave null and the assistant runs entirely in the browser against the
    // catalogue below — real search, real stock, real size maths, no AI claims.
    // Set this to your own server endpoint (which holds the Anthropic API key)
    // and the assistant will POST {messages, catalogue} to it instead.
    endpoint: null,
    name: 'Bestie',
    greeting: "Hey bestie! 💕 Looking for something special? I'm here to help!"
  }
};

/* -------------------------------------------------------------------------
   REAL — customer reviews, verbatim from the Google listing (4.9 ★, 9 reviews)
   ------------------------------------------------------------------------- */
const REVIEWS = [
  { name: 'Myles Austin',          when: 'a year ago',   stars: 5, text: 'Luxury meets class' },
  { name: 'Huzaifah Husha Lubega', when: '2 years ago',  stars: 5, text: 'Wonderful 😊 place for fashion', badge: 'Local Guide' },
  { name: 'Macstar Uganda',        when: '3 years ago',  stars: 5, text: 'World class 👌🏾' },
  { name: 'Norman Vine Muhumuza',  when: 'a year ago',   stars: 5, text: 'Innovative', badge: 'Local Guide' },
  { name: 'Mwanje Umaru',          when: '2 years ago',  stars: 5, text: 'good', badge: 'Local Guide' }
];

/* ------------------------------------------------------------------------- */
const COLOR_SWATCHES = {
  'Chocolate': '#5b3a2e',
  'Cocoa':     '#7a5443',
  'Mint':      '#dfeee0',
  'Cream':     '#f6efe4',
  'White':     '#ffffff',
  'Silver':    '#b9b4b0',
  'Navy':      '#2c3550',
  'Black':     '#2b262c',
  'Blush':     '#f7c8d4',
  'Pink':      '#ff9ec4',
  'Lilac':     '#bfa8e8',
  'Coral':     '#f28f7d',
  'Sky':       '#8fc4e0',
  'Leopard':   '#c49a63',
  'Tortoise':  '#8a5a2b'
};

/* -------------------------------------------------------------------------
   CATALOGUE — every piece below is real, from @gashluxe
   stock counts: 0 = sold out (the site tells the truth about this)
   ------------------------------------------------------------------------- */
const PRODUCTS = [
  /* ---------------- DRESSES ---------------- */
  {
    id: 'chocolate-halter-peplum-dress', name: 'Chocolate Halter Peplum Dress', category: 'Dresses',
    price: 285000,                                   // PRICE TBC
    colors: ['Chocolate'], badge: 'Bestseller',
    occasions: ['date-night', 'party', 'wedding-guest'],
    blurb: 'The crossover halter with the sculpted peplum waist — the one that caused a little commotion on the feed.',
    details: ['Crossover halter neckline', 'Structured peplum waist', 'Keyhole front', 'Concealed back zip'],
    fit: 'true', fitNote: 'True to size through the bust, nipped at the waist.',
    fabric: 'Stretch crepe',
    stock: { XS: 2, S: 4, M: 4, L: 3, XL: 1 }
  },
  {
    id: 'pink-organza-floral-dress', name: 'Pink Organza Floral Dress', category: 'Dresses',
    price: 245000,                                   // PRICE TBC
    colors: ['Pink', 'Lilac'], badge: 'New',
    occasions: ['brunch', 'wedding-guest', 'birthday'],
    blurb: 'Sheer blush organza over a printed floral skirt, with a lilac belt. Soft, romantic, impossible to miss.',
    details: ['Sheer organza overlay', 'Puff sleeves', 'Printed floral skirt', 'Belted waist'],
    fit: 'true', fitNote: 'True to size.',
    fabric: 'Organza over printed cotton',
    stock: { XS: 1, S: 3, M: 3, L: 2, XL: 0 }
  },

  /* ---------------- TOPS ---------------- */
  {
    id: 'gods-favorite-mesh-top', name: '"God\'s Favorite" Mesh Top', category: 'Tops',
    price: 180000,                                   // REAL PRICE — stated on the post
    colors: ['Cream'],
    occasions: ['casual', 'party', 'brunch'],
    blurb: 'Printed mesh long-sleeve with the slogan across the chest. Layer it or wear it as is.',
    details: ['Printed stretch mesh', 'Long sleeves', 'Fitted body', 'Slogan front'],
    fit: 'true', fitNote: 'Stretch mesh, forgiving on the body.',
    fabric: 'Stretch mesh',
    stock: { S: 3, L: 2 }                            // REAL SIZES — post said S & L
  },
  {
    id: 'mint-boxy-crop-tee', name: 'Mint Boxy Crop Tee', category: 'Tops',
    price: 95000,                                    // PRICE TBC
    colors: ['Mint', 'White'],
    occasions: ['casual', 'brunch'],
    blurb: 'A clean boxy crop in soft mint. The piece that makes a statement trouser wearable in daylight.',
    details: ['Boxy cropped cut', 'Drop shoulder', 'Ribbed neckline', 'Mid-weight cotton'],
    fit: 'relaxed', fitNote: 'Cut boxy — take your usual size.',
    fabric: 'Cotton jersey',
    stock: { XS: 4, S: 6, M: 5, L: 4, XL: 2 }
  },
  {
    id: 'black-scoop-tank', name: 'Black Scoop Tank', category: 'Tops',
    price: 75000,                                    // PRICE TBC
    colors: ['Black', 'White'],
    occasions: ['casual', 'work', 'date-night'],
    blurb: 'The plain black tank that quietly holds every other outfit together. Buy two.',
    details: ['Scoop neckline', 'Ribbed cotton', 'Slim fit', 'Contrast binding'],
    fit: 'small', fitNote: 'Snug and very stretchy. Size up for a looser look.',
    fabric: 'Ribbed cotton',
    stock: { XS: 5, S: 7, M: 7, L: 5, XL: 3 }
  },
  {
    id: 'blue-79-ribbed-tank', name: 'Blue 79 Ribbed Tank', category: 'Tops',
    price: 85000,                                    // PRICE TBC
    colors: ['Sky'], badge: 'New',
    occasions: ['casual', 'brunch', 'party'],
    blurb: 'Baby-blue rib with the varsity 79 across the front. Sporty, but make it going-out.',
    details: ['Fine rib knit', 'Varsity number front', 'Racer neckline', 'Cropped hem'],
    fit: 'small', fitNote: 'Runs small and clingy by design — size up if you want ease.',
    fabric: 'Ribbed cotton blend',
    stock: { XS: 3, S: 5, M: 4, L: 2, XL: 0 }
  },

  /* ---------------- BOTTOMS ---------------- */
  {
    id: 'cocoa-lace-column-skirt', name: 'Cocoa Lace Column Skirt', category: 'Bottoms',
    price: 195000,                                   // PRICE TBC
    colors: ['Cocoa', 'Chocolate'],
    occasions: ['date-night', 'wedding-guest', 'party'],
    blurb: 'Floor-skimming corded lace with a side split. Wears beautifully with the halter peplum on top.',
    details: ['Corded lace', 'Side split', 'Lined to mid-thigh', 'Maxi length'],
    fit: 'true', fitNote: 'True to size. Long — allow for heels.',
    fabric: 'Corded lace',
    stock: { XS: 2, S: 3, M: 4, L: 3, XL: 1 }
  },
  {
    id: 'navy-tapestry-jeans', name: 'Navy Tapestry Jeans', category: 'Bottoms',
    price: 185000,                                   // PRICE TBC
    colors: ['Navy'], badge: 'Bestseller',
    occasions: ['casual', 'party', 'brunch'],
    blurb: 'Dark denim with a woven tapestry print running through. Statement enough to build a whole outfit on.',
    details: ['Tapestry-print denim', 'High rise', 'Straight leg', 'Five pocket'],
    fit: 'true', fitNote: 'True to size on the waist, generous through the leg.',
    fabric: 'Cotton denim',
    stock: { XS: 2, S: 4, M: 4, L: 3, XL: 2 }
  },
  {
    id: 'silver-wash-wide-leg-trousers', name: 'Silver Wash Wide-Leg Trousers', category: 'Bottoms',
    price: 175000,                                   // PRICE TBC
    colors: ['Silver'],
    occasions: ['party', 'date-night', 'work'],
    blurb: 'A washed metallic-grey trouser with a proper wide leg. Pair with something plain and let it work.',
    details: ['Wide leg', 'High waist', 'Washed finish', 'Full length'],
    fit: 'true', fitNote: 'True to size. Long in the leg — made for a heel.',
    fabric: 'Coated cotton blend',
    stock: { XS: 1, S: 3, M: 3, L: 2, XL: 1 }
  },
  {
    id: 'leopard-print-leggings', name: 'Leopard Print Leggings', category: 'Bottoms',
    price: 200000,                                   // REAL PRICE — stated on the post
    colors: ['Leopard'],
    occasions: ['casual', 'party'],
    blurb: 'Full leopard, high waist, sculpting fit. Not for blending in.',
    details: ['High waist', 'Sculpting stretch', 'Full length', 'All-over leopard print'],
    fit: 'true', fitNote: 'High stretch and sculpting — very forgiving.',
    fabric: 'Stretch jersey',
    stock: { L: 3, XL: 2 }                           // REAL SIZES — post said L & XL
  },

  /* ---------------- SETS ---------------- */
  {
    id: 'cream-lace-jumpsuit', name: 'Cream Lace Jumpsuit', category: 'Sets',
    price: 280000,                                   // REAL PRICE — stated on the post
    colors: ['Cream'], badge: 'Bestseller',
    occasions: ['wedding-guest', 'party', 'birthday'],
    blurb: 'All-over cream lace with a tie neckline and a tapered ankle. One piece, whole outfit.',
    details: ['All-over corded lace', 'Tie neckline', 'Tapered ankle', 'Lined body'],
    fit: 'true', fitNote: 'True to size — the lace has a little give.',
    fabric: 'Corded lace',
    stock: { M: 3, L: 2 }                            // REAL SIZES — post said M & L
  },
  {
    id: 'white-beaded-mini-set', name: 'White Beaded Mini Set', category: 'Sets',
    price: 265000,                                   // PRICE TBC
    colors: ['White'],
    occasions: ['birthday', 'party', 'date-night'],
    blurb: 'Beaded tee and matching mini skirt. Crisp white, catches the light, photographs like a dream.',
    details: ['Two pieces: tee + mini skirt', 'Hand-beaded detail', 'Lined skirt', 'Sold as a set'],
    fit: 'true', fitNote: 'True to size.',
    fabric: 'Beaded cotton blend',
    stock: { XS: 1, S: 3, M: 3, L: 2, XL: 0 }
  },

  /* ---------------- SHOES ---------------- */
  {
    id: 'tortoise-block-heel-sandal', name: 'Tortoise Block Heel Sandal', category: 'Shoes',
    price: 300000,                                   // REAL PRICE — stated on the post
    colors: ['Tortoise'],
    occasions: ['brunch', 'work', 'wedding-guest'],
    blurb: 'Sculpted tortoise-shell block heel with a toe-post strap. Comfortable enough to actually wear all day.',
    details: ['Sculpted block heel', 'Toe-post strap', 'Padded footbed', 'Approx. 7 cm heel'],
    fit: 'shoe', fitNote: 'Standard EU sizing — these sit true on the foot.',
    fabric: 'Resin heel, leather-look upper',
    stock: { 39: 2 }                                 // REAL SIZES — post said size 39
  },
  {
    id: 'coral-bloom-heeled-sandal', name: 'Coral Bloom Heeled Sandal', category: 'Shoes',
    price: 300000,                                   // REAL PRICE — stated on the post
    colors: ['Coral'], badge: 'New',
    occasions: ['party', 'wedding-guest', 'birthday'],
    blurb: 'Coral satin with an oversized flower at the toe and a fine stiletto heel. Pure occasion shoe.',
    details: ['Oversized flower detail', 'Stiletto heel', 'Ankle strap', 'Approx. 10 cm heel'],
    fit: 'shoe', fitNote: 'Standard EU sizing. A fine heel — narrow through the toe.',
    fabric: 'Satin upper',
    stock: { 39: 2, 40: 1 }                          // REAL SIZES — post said 39/40
  },

  /* ---------------- BAGS ---------------- */
  {
    id: 'lilac-quilted-shoulder-bag', name: 'Lilac Quilted Shoulder Bag', category: 'Bags',
    price: 320000,                                   // PRICE TBC
    colors: ['Lilac'], badge: 'Bestseller',
    occasions: ['brunch', 'date-night', 'party'],
    blurb: 'Soft lilac quilting with a gold clasp and a top handle. The most on-brand thing in the shop.',
    details: ['Quilted panels', 'Gold-tone clasp', 'Top handle + detachable strap', 'Lined interior'],
    fit: 'one-size', fitNote: 'One size.',
    fabric: 'Quilted leather-look',
    stock: { 'One Size': 4 }
  },
  {
    id: 'white-quilted-top-handle-bag', name: 'White Quilted Top-Handle Bag', category: 'Bags',
    price: 340000,                                   // PRICE TBC
    colors: ['White', 'Cream'],
    occasions: ['wedding-guest', 'work', 'brunch'],
    blurb: 'Structured white quilting with a short top handle. Goes with absolutely everything on this rail.',
    details: ['Structured quilted body', 'Short top handle', 'Gold-tone hardware', 'Interior pocket'],
    fit: 'one-size', fitNote: 'One size.',
    fabric: 'Quilted leather-look',
    stock: { 'One Size': 3 }
  }
];

/* ------------------------------------------------------------------------- */
const OCCASIONS = [
  { id: 'date-night',    label: 'Date night' },
  { id: 'brunch',        label: 'Brunch' },
  { id: 'birthday',      label: 'Birthday' },
  { id: 'party',         label: 'Party' },
  { id: 'work',          label: 'Work' },
  { id: 'wedding-guest', label: 'Wedding guest' },
  { id: 'casual',        label: 'Everyday' }
];

/* -------------------------------------------------------------------------
   Curated looks — real pairings from the catalogue
   ------------------------------------------------------------------------- */
const LOOKS = [
  {
    id: 'look-brown-hour', title: 'The Brown Hour',
    note: 'The halter peplum over the cocoa lace column. This is the one from the feed.',
    items: ['chocolate-halter-peplum-dress', 'cocoa-lace-column-skirt', 'white-quilted-top-handle-bag']
  },
  {
    id: 'look-denim-days', title: 'Tapestry Denim',
    note: 'Plain black tank, loud jeans, quiet bag. Effortless every time.',
    items: ['black-scoop-tank', 'navy-tapestry-jeans', 'lilac-quilted-shoulder-bag']
  },
  {
    id: 'look-lace-affair', title: 'The Lace Affair',
    note: 'Cream lace head to toe with a coral heel to break it up.',
    items: ['cream-lace-jumpsuit', 'coral-bloom-heeled-sandal', 'white-quilted-top-handle-bag']
  },
  {
    id: 'look-city-soft', title: 'Soft in the City',
    note: 'Mint crop, silver wide leg, a heel you can walk in.',
    items: ['mint-boxy-crop-tee', 'silver-wash-wide-leg-trousers', 'tortoise-block-heel-sandal']
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
const SHOE_SIZES = ['38', '39', '40', '41'];

/* ------------------------------------------------------------------------- */
const FAQ = [
  {
    q: 'Where are you and when are you open?',
    a: `We are at ${CONFIG.address} — ${CONFIG.addressNote.toLowerCase()}. The shop opens at ${CONFIG.opensAt}. It is a shopping lounge with a mini champagne bar, so take your time.`
  },
  {
    q: 'How do I reach you fastest?',
    a: `Call or WhatsApp ${CONFIG.phone}, or DM us on Instagram at ${CONFIG.instagramHandle}. WhatsApp is usually quickest.`
  },
  {
    q: 'Do you deliver?',
    a: 'Yes. Tell us where you are on WhatsApp and we will confirm the delivery fee and timing with you before anything is sent.'
  },
  {
    q: 'How do I pay?',
    a: 'Mobile money, card or cash at the shop. You confirm payment with our team when they reach out about your order.'
  },
  {
    q: 'What if it does not fit?',
    a: 'Talk to us as soon as you can and we will sort an exchange on anything unworn with its tags still on. Bring your receipt or your order reference.'
  },
  {
    q: 'Do you restock sold-out pieces?',
    a: 'Sometimes, and sometimes a piece was a one-off. Ask the Style Assistant or message us and we will tell you honestly which it is.'
  },
  {
    q: 'Can I reserve something to try on?',
    a: `Yes — WhatsApp ${CONFIG.phone} with the piece and your size and we will hold it for you.`
  },
  {
    q: 'Do you style people for events?',
    a: 'We do. Tell us the event, the date and your budget and we will pull a rail for you before you arrive.'
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

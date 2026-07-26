/* ==========================================================================
   Gash Luxe — "Bestie", the Style Assistant
   --------------------------------------------------------------------------
   HOW THIS WORKS, HONESTLY

   Out of the box this runs entirely in the browser. It is a real intent
   parser over the real catalogue in data.js: it searches actual products,
   reads actual stock counts, and does actual size maths against SIZE_CHART.
   It never invents a product, never claims something is in stock when it is
   not, and hands off to a human when it does not know.

   It is NOT a language model, and nothing on screen claims it is.

   If you want a true LLM behind it, stand up a small server that holds your
   Anthropic API key and set CONFIG.assistant.endpoint in data.js. This file
   will then POST { messages, catalogue } there and render the reply. The key
   must never live in this file — anyone can read it in the browser.
   ========================================================================== */

const Bestie = (() => {
  const history = [];       // {role, text} — sent to the endpoint if configured
  let lastSubject = null;   // product the conversation is currently about
  let awaitingName = false;

  /* ------------------------------------------------------------ language */
  const CATEGORY_WORDS = {
    'Dresses': ['dress', 'dresses', 'gown', 'frock'],
    'Tops': ['top', 'tops', 'blouse', 'shirt', 'tank', 'crop', 'tee', 'mesh'],
    'Bottoms': ['skirt', 'skirts', 'trouser', 'trousers', 'jeans', 'jean', 'denim',
                'pants', 'leggings', 'legging', 'bottoms', 'midi', 'maxi'],
    'Sets': ['set', 'sets', 'co-ord', 'coord', 'matching', 'two piece', 'two-piece', 'jumpsuit'],
    'Shoes': ['shoe', 'shoes', 'heel', 'heels', 'sandal', 'sandals', 'footwear', 'pumps'],
    'Bags': ['bag', 'bags', 'purse', 'handbag', 'clutch', 'shoulder bag']
  };

  const OCCASION_WORDS = {
    'date-night': ['date', 'date night', 'dinner', 'romantic', 'valentine'],
    'brunch': ['brunch', 'lunch', 'daytime', 'day out', 'coffee'],
    'birthday': ['birthday', 'bday', 'my birthday'],
    'party': ['party', 'club', 'night out', 'clubbing', 'nye', 'new year', 'concert', 'festival'],
    'work': ['work', 'office', 'meeting', 'interview', 'corporate', 'professional'],
    'wedding-guest': ['wedding', 'introduction', 'kwanjula', 'kukyala', 'graduation', 'church', 'guest'],
    'casual': ['casual', 'everyday', 'day to day', 'errands', 'chill', 'relax', 'lounge', 'weekend']
  };

  const COLOR_WORDS = Object.keys(COLOR_SWATCHES).reduce((m, c) => {
    m[c.toLowerCase()] = c; return m;
  }, {
    pink: 'Blush', purple: 'Lavender', violet: 'Lilac', beige: 'Cream',
    ivory: 'Cream', nude: 'Blush', brown: 'Chocolate', blue: 'Sky',
    green: 'Sage', yellow: 'Butter'
  });

  const has = (t, arr) => arr.some(w => t.includes(w));

  /* Split into bare words. Without stripping punctuation, "leggings?" never
     matches "leggings" and the whole search quietly misses. */
  const words = t => t.toLowerCase().replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(Boolean);

  /* ------------------------------------------------------------ extraction */
  function findCategory(t) {
    for (const [cat, words] of Object.entries(CATEGORY_WORDS)) {
      if (has(t, words)) return cat;
    }
    return null;
  }
  function findOccasion(t) {
    for (const [occ, words] of Object.entries(OCCASION_WORDS)) {
      if (has(t, words)) return occ;
    }
    return null;
  }
  function findColors(t) {
    const out = [];
    for (const [word, color] of Object.entries(COLOR_WORDS)) {
      if (new RegExp(`\\b${word}\\b`, 'i').test(t) && !out.includes(color)) out.push(color);
    }
    return out;
  }
  function findBudget(t) {
    // "under 200k", "below 150,000", "less than 300000", "max 250k"
    const m = t.match(/(?:under|below|less than|max|maximum|up to|budget of|budget)\s*(?:ugx|shs?)?\s*([\d,.]+)\s*(k|m)?/i);
    if (!m) return null;
    let n = parseFloat(m[1].replace(/[,\s]/g, ''));
    if (isNaN(n)) return null;
    if (m[2] && m[2].toLowerCase() === 'k') n *= 1000;
    if (m[2] && m[2].toLowerCase() === 'm') n *= 1000000;
    if (n < 1000) n *= 1000;   // "under 200" almost certainly means 200k here
    return n;
  }
  function findProduct(t) {
    // score every product by how many of its distinctive name words appear
    let best = null, bestScore = 0;
    for (const p of PRODUCTS) {
      const words = p.name.toLowerCase()
        .replace(/[^a-z\s-]/g, '')
        .split(/[\s-]+/)
        .filter(w => w.length > 2 && !['the', 'and'].includes(w));
      let score = 0;
      for (const w of words) if (t.includes(w)) score += w.length > 4 ? 2 : 1;
      if (score > bestScore) { bestScore = score; best = p; }
    }
    return bestScore >= 3 ? best : null;
  }
  function findMeasurements(t) {
    const grab = (labels) => {
      for (const l of labels) {
        const m = t.match(new RegExp(`${l}\\D{0,12}?(\\d{2,3}(?:\\.\\d)?)`, 'i'))
               || t.match(new RegExp(`(\\d{2,3}(?:\\.\\d)?)\\s*(?:cm|inch|in|")?\\s*${l}`, 'i'));
        if (m) return parseFloat(m[1]);
      }
      return null;
    };
    return {
      bust: grab(['bust', 'chest', 'boobs']),
      waist: grab(['waist']),
      hip: grab(['hips?', 'bum'])
    };
  }
  function findSizeLetter(t) {
    const m = t.match(/\b(xs|extra small|small|medium|large|xl|extra large)\b/i);
    if (!m) return null;
    return { 'xs': 'XS', 'extra small': 'XS', 'small': 'S', 'medium': 'M', 'large': 'L', 'xl': 'XL', 'extra large': 'XL' }[m[1].toLowerCase()];
  }

  /* ------------------------------------------------------------ search */
  function search(t, { limit = 3 } = {}) {
    const cat = findCategory(t);
    const occ = findOccasion(t);
    const colors = findColors(t);
    const budget = findBudget(t);

    const scored = PRODUCTS.map(p => {
      let s = 0, signal = 0;   // `signal` = did anything the shopper said actually match?
      if (cat && p.category === cat) { s += 5; signal++; }
      if (occ && p.occasions.includes(occ)) { s += 4; signal++; }
      if (colors.length && colors.some(c => p.colors.includes(c))) { s += 3; signal++; }
      if (budget && p.price <= budget) s += 2;
      if (budget && p.price > budget) s -= 6;
      if (!anyInStock(p)) s -= 3;
      // free-text words against blurb + name
      const hay = (p.name + ' ' + p.blurb + ' ' + p.details.join(' ')).toLowerCase();
      words(t).filter(w => w.length > 4).forEach(w => {
        if (hay.includes(w)) { s += 1; signal++; }
      });
      if (signal && p.badge === 'Bestseller') s += 1;   // tie-break only, never a reason on its own
      return { p, s, signal };
    }).filter(x => x.signal > 0 && x.s > 0).sort((a, b) => b.s - a.s);

    return { items: scored.slice(0, limit).map(x => x.p), cat, occ, colors, budget, total: scored.length };
  }

  /* ------------------------------------------------------------ size maths */
  function recommendSize({ bust, waist, hip }, product) {
    const scores = SIZE_CHART.map(row => {
      let dist = 0, n = 0;
      const test = (v, range) => {
        if (v == null) return;
        n++;
        if (v < range[0]) dist += range[0] - v;
        else if (v > range[1]) dist += v - range[1];
      };
      test(bust, row.bust); test(waist, row.waist); test(hip, row.hip);
      return { row, dist, n };
    }).filter(x => x.n > 0);

    if (!scores.length) return null;
    scores.sort((a, b) => a.dist - b.dist);
    let pick = scores[0].row.size;

    let note = '';
    if (product) {
      const idx = SIZES.indexOf(pick);
      if (product.fit === 'small' && idx < SIZES.length - 1) {
        pick = SIZES[idx + 1];
        note = ` It runs small, so I bumped you up a size.`;
      } else if (product.fit === 'relaxed') {
        note = ` It's cut relaxed, so this will sit easy — go down one if you want it neater.`;
      }
    }
    return { size: pick, note, exact: scores[0].dist === 0 };
  }

  /* ------------------------------------------------------------ helpers */
  const who = () => Store.name ? `, ${Store.name}` : '';
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function stockLine(p) {
    const sizes = productSizes(p);
    const avail = sizes.filter(s => inStock(p, s));
    if (!avail.length) return `It's fully sold out right now — I won't pretend otherwise.`;
    // Never say "every size" — we only carry the sizes listed, and a shopper
    // asking for one we don't stock deserves to hear that plainly.
    if (avail.length === sizes.length) return `We have it in ${avail.join(', ')}.`;
    const gone = sizes.filter(s => !inStock(p, s));
    return `In stock: ${avail.join(', ')}. Sold out: ${gone.join(', ')}.`;
  }

  /* Did they name a size we simply don't carry for this piece? */
  function sizeGapLine(p, t) {
    const m = t.match(/\b(xs|s|m|l|xl|3[5-9]|4[0-2])\b/i);
    if (!m) return '';
    const asked = /^\d+$/.test(m[1]) ? m[1] : m[1].toUpperCase();
    const sizes = productSizes(p).map(String);
    if (sizes.includes(asked)) {
      return inStock(p, asked) || inStock(p, Number(asked))
        ? ` Yes — ${asked} is in.`
        : ` ${asked} is sold out at the moment.`;
    }
    return ` We don't carry this one in ${asked} at all, only ${sizes.join(', ')}.`;
  }

  function cards(items) {
    return { type: 'cards', items };
  }
  function text(html) {
    return { type: 'text', html };
  }

  /* ------------------------------------------------------------ the brain */
  function reply(raw) {
    const t = raw.toLowerCase().trim();
    const out = [];

    /* --- name --- */
    if (awaitingName) {
      awaitingName = false;
      const n = raw.trim().replace(/^(i'?m|my name is|call me|it'?s)\s+/i, '').split(/[\s,.!]/)[0];
      if (n && n.length < 20 && /^[a-z'-]+$/i.test(n)) {
        Store.setName(n[0].toUpperCase() + n.slice(1).toLowerCase());
        return [text(`<p>Love that name, ${Store.name}! 💕 Right — what are we shopping for?</p>`)];
      }
      return [text(`<p>No worries, we can skip that. What are you looking for today?</p>`)];
    }
    const nameM = raw.match(/(?:i'?m|my name is|call me|this is)\s+([A-Za-z'-]{2,18})\b/i);
    if (nameM && !findCategory(t) && !findOccasion(t)) {
      Store.setName(nameM[1][0].toUpperCase() + nameM[1].slice(1).toLowerCase());
      return [text(`<p>Hi ${Store.name}! 💕 So nice to meet you. What are we finding today — something for an occasion, or just a treat?</p>`)];
    }

    /* --- human handoff --- */
    if (has(t, ['human', 'real person', 'someone else', 'talk to a person', 'agent', 'manager', 'speak to'])) {
      return [text(`<p>Of course${who()} — our team answers fastest on Instagram at
        <a href="${CONFIG.instagram}" target="_blank" rel="noopener">${CONFIG.instagramHandle}</a>,
        or come see us at ${CONFIG.address} from ${CONFIG.opensAt}. 💕</p>`)];
    }

    /* --- greeting --- */
    if (/^(hi|hey|hello|yo|hola|niceeee|good (morning|afternoon|evening))\b/.test(t) && t.length < 30) {
      if (!Store.name) {
        awaitingName = true;
        return [text(`<p>${pick(['Hey you!', 'Hiii!', 'Hey bestie!'])} ✨ I'm Bestie — I know every piece in the shop. What should I call you?</p>`)];
      }
      return [text(`<p>Hey ${Store.name}! ✨ What are we hunting for today?</p>`)];
    }

    /* --- thanks / bye --- */
    if (has(t, ['thank', 'thanks', 'thx', 'appreciate'])) {
      return [text(`<p>Any time${who()}! 💕 Shout if you want me to pull a whole look together.</p>`)];
    }

    /* --- orders, delivery, returns, payment --- */
    if (has(t, ['delivery', 'deliver', 'shipping', 'ship', 'how long', 'arrive'])) {
      return [text(`<p>Within Kampala it's ${money(CONFIG.kampalaDelivery)}, usually same or next day. Upcountry is ${money(CONFIG.upcountryDelivery)} and takes 2–4 days.</p>
        <p>Anything over ${money(CONFIG.freeShippingOver)} ships free ✨</p>`)];
    }
    if (has(t, ['return', 'exchange', 'refund', 'swap it', 'doesn\'t fit', 'does not fit'])) {
      return [text(`<p>You've got 7 days to exchange anything unworn with tags on — bring your receipt or order number. Earrings can't be exchanged, hygiene rules.</p>
        <p>Want me to help you pick a better size instead? Tell me your bust, waist and hip and I'll do the maths.</p>`)];
    }
    if (has(t, ['track', 'my order', 'where is my', 'order number', 'order status'])) {
      return [text(`<p>I can't see order records from here — I'd be guessing, and I won't do that. Message the team on
        <a href="${CONFIG.instagram}" target="_blank" rel="noopener">${CONFIG.instagramHandle}</a> with your order number and they'll check it properly. 💕</p>`)];
    }
    if (has(t, ['pay', 'payment', 'mobile money', 'momo', 'cash', 'card'])) {
      return [text(`<p>Mobile money, card, or cash when you collect at the shop. You'll confirm payment with our team once your order is in — nothing is charged through this site.</p>`)];
    }

    /* --- size & fit --- */
    const meas = findMeasurements(t);
    const askedSize = has(t, ['size', 'sizing', 'fit', 'measure', 'runs small', 'run small',
      'runs large', 'run large', 'runs big', 'run big', 'true to size', 'what size']);
    if (meas.bust || meas.waist || meas.hip) {
      let subject = findProduct(t) || lastSubject;
      // Bust/waist/hip say nothing about a shoe or a handbag — don't pretend.
      if (subject && (subject.fit === 'shoe' || subject.fit === 'one-size')) subject = null;
      const rec = recommendSize(meas, subject);
      if (!rec) return [text(`<p>Give me at least one of bust, waist or hip in cm and I'll size you properly.</p>`)];
      const given = [meas.bust && `bust ${meas.bust}`, meas.waist && `waist ${meas.waist}`, meas.hip && `hip ${meas.hip}`]
        .filter(Boolean).join(', ');
      out.push(text(`<p>With ${given} cm, you're a <strong>${rec.size}</strong>${subject ? ` in the ${escapeHtml(subject.name)}` : ''}.${rec.note}</p>
        ${subject ? `<p>${stockLine(subject)}</p>` : `<p>Full chart is on the <a href="size-guide.html">size guide</a> if you want to check a specific piece.</p>`}`));
      if (subject) out.push(cards([subject]));
      return out;
    }
    if (askedSize) {
      // A named category beats the running subject — "heels size 39" must not
      // answer about whatever we were just discussing.
      const askedCat = findCategory(t);
      let carryOver = lastSubject;
      if (askedCat) {
        const inCat = PRODUCTS.filter(p => p.category === askedCat && anyInStock(p));
        const ws = words(t).filter(w => w.length > 3);
        // A piece named in this message always wins — otherwise a follow-up
        // like "and the leggings?" keeps answering about the jeans.
        const named = inCat.find(p => ws.some(w => (p.name + ' ' + p.blurb).toLowerCase().includes(w)));
        if (named) carryOver = named;
        // Cold open, or they switched category: fall back to that category.
        else if (!lastSubject || lastSubject.category !== askedCat) carryOver = inCat[0] || lastSubject;
      }
      const subject = findProduct(t) || carryOver;
      if (subject) {
        lastSubject = subject;
        const fitLine = { small: 'runs a little small', large: 'runs large', relaxed: 'is cut relaxed', true: 'is true to size', 'one-size': 'is one size', shoe: 'uses standard EU shoe sizing' }[subject.fit] || 'is true to size';
        // fitNote often opens by restating the fit — drop that clause so the
        // reply doesn't say "runs small. Runs small."
        const note = subject.fitNote
          .replace(/^(runs? (a little )?(small|large|big)|true to size|relaxed fit|one size|standard eu sizing)[.,]?\s*/i, '')
          .replace(/^[\s—–-]+/, '');   // don't leave a dangling dash behind
        // Body measurements are meaningless for shoes and one-size pieces.
        const askMeasure = subject.fit !== 'shoe' && subject.fit !== 'one-size'
          ? `<p>Tell me your bust, waist and hip in cm and I'll pick your size exactly.</p>` : '';
        out.push(text(`<p>The ${escapeHtml(subject.name)} ${fitLine}.${note ? ' ' + escapeHtml(note[0].toUpperCase() + note.slice(1)) : ''}</p>
          <p>${stockLine(subject)}${sizeGapLine(subject, t)}</p>
          ${askMeasure}`));
        out.push(cards([subject]));
        return out;
      }
      return [text(`<p>Happy to help you size${who()}! Give me your bust, waist and hip in cm — like "bust 88, waist 70, hip 96" — and tell me which piece, and I'll be precise.</p>
        <p>The full chart lives on the <a href="size-guide.html">size guide</a>.</p>`)];
    }

    /* --- stock / restock --- */
    if (has(t, ['in stock', 'restock', 'back in', 'available', 'sold out', 'do you have'])) {
      const subject = findProduct(t);
      if (subject) {
        lastSubject = subject;
        const askedRestock = has(t, ['restock', 'back in', 'when will', 'coming back']);
        const anyGone = productSizes(subject).some(s => !inStock(subject, s));
        const fully = !anyInStock(subject);

        // "when is it back?" deserves an honest answer even when only some
        // sizes are gone — we genuinely don't know the restock date.
        const caveat = (askedRestock && anyGone)
          ? `<p>I can't promise a restock date — some pieces are one-off drops and don't come back. Ask the team on <a href="${CONFIG.instagram}" target="_blank" rel="noopener">${CONFIG.instagramHandle}</a> and they'll tell you honestly.</p>`
          : '';

        out.push(text(`<p>${stockLine(subject)}</p>${caveat}${fully
          ? `<p>In the meantime, these are close in spirit:</p>` : ''}`));
        out.push(cards(fully
          ? PRODUCTS.filter(p => p.category === subject.category && p.id !== subject.id && anyInStock(p)).slice(0, 3)
          : [subject]));
        return out;
      }
      const r = search(t);
      if (r.items.length) {
        out.push(text(`<p>Here's what we've got in right now:</p>`));
        out.push(cards(r.items));
        return out;
      }
    }

    /* --- gifts --- */
    if (has(t, ['gift', 'present', 'for my sister', 'for my friend', 'for her', 'birthday for'])) {
      const colors = findColors(t);
      const budget = findBudget(t);
      let items = PRODUCTS.filter(anyInStock);
      if (colors.length) items = items.filter(p => colors.some(c => p.colors.includes(c)));
      if (budget) items = items.filter(p => p.price <= budget);
      if (!items.length) {
        return [text(`<p>Nothing matches that exactly${who()} — I'd rather say so than send you something wrong. Try widening the colour or budget, or our team can pull something on <a href="${CONFIG.instagram}" target="_blank" rel="noopener">${CONFIG.instagramHandle}</a>.</p>`)];
      }
      // Lead with accessories — they're the only things that can't be the wrong size.
      const rank = p => (p.category === 'Accessories' ? 2 : 0) + (p.badge === 'Bestseller' ? 1 : 0);
      items = items.sort((a, b) => rank(b) - rank(a)).slice(0, 3);
      const allSafe = items.every(p => p.fit === 'one-size');

      out.push(text(`<p>Gifting is my favourite${who()}. ${colors.length ? `Since she loves ${colors[0].toLowerCase()} — ` : ''}these would land well:</p>`));
      out.push(cards(items));
      out.push(text(allSafe
        ? `<p>All one size, so you can't get it wrong 🎀 Mention gift wrap when the team confirms your order.</p>`
        : `<p>If you're not sure of her size, the accessories are the safe bet — everything else you'd want her measurements for. Mention gift wrap when the team confirms your order 🎀</p>`));
      return out;
    }

    /* --- outfit building --- */
    if (has(t, ['goes with', 'go with', 'pair', 'style it', 'style this', 'outfit', 'what should i wear', 'build a look', 'match'])) {
      const subject = findProduct(t) || lastSubject;
      const occ = findOccasion(t);

      if (subject) {
        lastSubject = subject;
        // pair with complementary categories, sharing at least one occasion where possible
        // Pair with categories that actually complete the outfit — a dress is
        // not a partner for jeans.
        const PAIRINGS = {
          'Bottoms': ['Tops', 'Shoes', 'Bags'],
          'Tops':    ['Bottoms', 'Shoes', 'Bags'],
          'Dresses': ['Shoes', 'Bags', 'Tops'],
          'Sets':    ['Shoes', 'Bags'],
          'Shoes':   ['Dresses', 'Bottoms', 'Bags'],
          'Bags':    ['Dresses', 'Tops', 'Shoes']
        };
        const wantCats = PAIRINGS[subject.category] || ['Tops', 'Shoes', 'Bags'];
        const partners = [];
        for (const c of wantCats) {
          const found = PRODUCTS.find(p =>
            p.category === c && p.id !== subject.id && anyInStock(p) &&
            !partners.includes(p) &&
            p.occasions.some(o => subject.occasions.includes(o)));
          if (found) partners.push(found);
        }
        out.push(text(`<p>Ooh, the ${escapeHtml(subject.name)} is a great starting point${who()}. I'd build it out like this:</p>`));
        out.push(cards(partners.length ? partners : PRODUCTS.filter(p => p.id !== subject.id && anyInStock(p)).slice(0, 3)));
        out.push(text(`<p>Keep one piece loud and the rest quiet and you can't go wrong ✨</p>`));
        return out;
      }

      if (occ) return occasionLook(occ);

      const look = pick(LOOKS);
      out.push(text(`<p>Let's build something${who()}! Here's one I love — "${look.title}": ${escapeHtml(look.note)}</p>`));
      out.push(cards(look.items.map(getProduct).filter(Boolean)));
      out.push(text(`<p>Tell me the occasion and I'll tailor it properly.</p>`));
      return out;
    }

    /* --- occasion --- */
    const occ = findOccasion(t);
    if (occ && (has(t, ['need', 'looking', 'want', 'for a', 'for my', 'help', 'something']) || t.split(/\s+/).length <= 4)) {
      return occasionLook(occ, t);
    }

    /* --- named product --- */
    const named = findProduct(t);
    if (named) {
      lastSubject = named;
      out.push(text(`<p>The ${escapeHtml(named.name)} — great taste${who()}. ${escapeHtml(named.blurb)}</p>
        <p>${money(named.price)}. ${stockLine(named)}${sizeGapLine(named, t)}</p>`));
      out.push(cards([named]));
      return out;
    }

    /* --- bare size follow-up: "do you have it in 40", "in M?" --- */
    const bare = t.match(/\b(?:in|got|have|any)\s+(?:a\s+)?(xs|s|m|l|xl|3[5-9]|4[0-2])\b/i);
    if (bare && lastSubject) {
      const asked = /^\d+$/.test(bare[1]) ? bare[1] : bare[1].toUpperCase();
      out.push(text(`<p>${escapeHtml(lastSubject.name)} — ${stockLine(lastSubject)}${sizeGapLine(lastSubject, ' ' + asked + ' ')}</p>`));
      out.push(cards([lastSubject]));
      return out;
    }

    /* --- general product search --- */
    const r = search(t, { limit: 3 });
    if (r.items.length) {
      const bits = [];
      if (r.colors.length) bits.push(r.colors[0].toLowerCase());
      if (r.cat) bits.push(r.cat.toLowerCase());
      if (r.budget) bits.push(`under ${money(r.budget)}`);
      lastSubject = r.items[0];
      out.push(text(`<p>${bits.length ? `${bits.join(' ')} — got you${who()}.` : `Here's what I'd pull for you${who()}.`} These are my picks:</p>`));
      out.push(cards(r.items));
      if (r.total > r.items.length) {
        out.push(text(`<p>There are ${r.total - r.items.length} more like these — <a href="shop.html">see the full rail</a>.</p>`));
      }
      return out;
    }

    /* --- honest fallback --- */
    return [text(`<p>I'm not sure I got that one${who()} — and I'd rather ask than guess. Try me with a category ("a midi skirt"), an occasion ("something for a kwanjula"), a colour, or a budget.</p>
      <p>Or if it's an order question, our team is on <a href="${CONFIG.instagram}" target="_blank" rel="noopener">${CONFIG.instagramHandle}</a>. 💕</p>`)];
  }

  function occasionLook(occ, t = '') {
    const label = (OCCASIONS.find(o => o.id === occ) || {}).label || occ;
    const budget = findBudget(t);
    const colors = findColors(t);
    const cat = findCategory(t);
    let items = PRODUCTS.filter(p => p.occasions.includes(occ) && anyInStock(p));

    // If they named a category ("a date night DRESS"), lead with that category
    // — otherwise "most expensive first" hands them a coat.
    if (cat) {
      const inCat = items.filter(p => p.category === cat);
      if (inCat.length) {
        const rest = items.filter(p => p.category !== cat);
        items = inCat.concat(rest);
      }
    }
    if (colors.length) {
      const filtered = items.filter(p => colors.some(c => p.colors.includes(c)));
      if (filtered.length) items = filtered;
    }
    if (budget) {
      const filtered = items.filter(p => p.price <= budget);
      if (!filtered.length) {
        return [text(`<p>Nothing for ${label.toLowerCase()} sits under ${money(budget)} right now${who()} — I won't stretch the truth. Our accessories start at ${money(Math.min(...PRODUCTS.filter(p => p.category === 'Accessories').map(p => p.price)))} if you want to add sparkle to something you already own ✨</p>`)];
      }
      items = filtered;
    }
    if (cat) {
      items = items.slice(0, 3);
    } else {
      // Always lead with something you can actually wear — sorting purely by
      // price hands people three accessories and no outfit.
      const GARMENT = ['Dresses', 'Sets', 'Tops', 'Bottoms'];
      const garments = items.filter(p => GARMENT.includes(p.category))
                            .sort((a, b) => b.price - a.price);
      const extras = items.filter(p => !GARMENT.includes(p.category))
                          .sort((a, b) => b.price - a.price);
      items = [...garments.slice(0, 2), ...extras.slice(0, 1)].slice(0, 3);
      if (items.length < 3) items = [...garments, ...extras].slice(0, 3);
    }
    const openers = {
      'date-night': `Date night${who()} — we're going soft but memorable:`,
      'brunch': `Brunch energy${who()}! Comfortable, but photographs beautifully:`,
      'birthday': `It's giving birthday girl${who()} 🎀 You should be the shiniest one there:`,
      'party': `Party mode${who()}. Something with movement:`,
      'work': `Polished but still you${who()}:`,
      'wedding-guest': `Guest-appropriate${who()} — pretty, never louder than the bride:`,
      'casual': `Easy everyday pieces${who()}:`
    };
    return [
      text(`<p>${openers[occ] || `For ${label.toLowerCase()}${who()}:`}</p>`),
      cards(items),
      text(`<p>Want me to finish it off with a bag, earrings or a bow? Just say the word.</p>`)
    ];
  }

  /* ------------------------------------------------------------ optional server */
  async function askServer(userText) {
    const res = await fetch(CONFIG.assistant.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: history.concat([{ role: 'user', text: userText }]),
        customer: Store.name,
        catalogue: PRODUCTS.map(p => ({
          id: p.id, name: p.name, category: p.category, price: p.price,
          colors: p.colors, occasions: p.occasions, stock: p.stock,
          fit: p.fit, fitNote: p.fitNote, blurb: p.blurb
        }))
      })
    });
    if (!res.ok) throw new Error('assistant endpoint ' + res.status);
    const data = await res.json();
    const blocks = [text(`<p>${escapeHtml(data.reply || '').replace(/\n+/g, '</p><p>')}</p>`)];
    if (Array.isArray(data.products) && data.products.length) {
      blocks.push(cards(data.products.map(getProduct).filter(Boolean)));
    }
    return blocks;
  }

  return { reply, askServer, history, get lastSubject() { return lastSubject; } };
})();

/* ==========================================================================
   Widget
   ========================================================================== */
function initAssistant() {
  const btn = document.createElement('button');
  btn.className = 'asst-btn';
  btn.id = 'asstBtn';
  btn.setAttribute('aria-label', 'Open the Style Assistant');
  btn.innerHTML = ICON.bow;

  const nudge = document.createElement('div');
  nudge.className = 'asst-nudge';
  nudge.id = 'asstNudge';

  const panel = document.createElement('section');
  panel.className = 'asst';
  panel.id = 'asst';
  panel.setAttribute('aria-live', 'polite');
  panel.setAttribute('aria-label', 'Style Assistant');
  panel.innerHTML = `
    <header class="asst__head">
      <div class="asst__av">${ICON.bow}</div>
      <div>
        <strong>${CONFIG.assistant.name}</strong>
        <span>Your Gash Luxe stylist</span>
      </div>
      <button class="asst__close" id="asstClose" aria-label="Close">${ICON.close}</button>
    </header>
    <div class="asst__body" id="asstBody"></div>
    <div class="asst__chips" id="asstChips"></div>
    <div class="asst__foot">
      <form class="asst__form" id="asstForm">
        <input id="asstInput" placeholder="Ask me anything…" autocomplete="off" aria-label="Message the Style Assistant">
        <button class="asst__send" type="submit" aria-label="Send">${ICON.arrow}</button>
      </form>
      <p class="asst__note">Answers come from the live Gash Luxe rail. For orders, our team replies on Instagram.</p>
    </div>`;

  document.body.append(btn, nudge, panel);

  const body = panel.querySelector('#asstBody');
  const chips = panel.querySelector('#asstChips');
  const form = panel.querySelector('#asstForm');
  const input = panel.querySelector('#asstInput');

  const DEFAULT_CHIPS = [
    'Something for a date night',
    'What size am I?',
    'Under UGX 150k',
    'Build me a brunch outfit'
  ];

  function scroll() { body.scrollTop = body.scrollHeight; }

  function pushBot(blocks) {
    blocks.forEach(b => {
      if (b.type === 'text') {
        const el = document.createElement('div');
        el.className = 'msg msg--bot';
        el.innerHTML = b.html;
        body.appendChild(el);
      } else if (b.type === 'cards' && b.items.length) {
        const wrap = document.createElement('div');
        wrap.className = 'asst-cards';
        wrap.innerHTML = b.items.map(p => `
          <a class="asst-card" href="product.html?id=${p.id}">
            <div class="asst-card__media">${media(p.id, p.name)}</div>
            <div>
              <strong>${escapeHtml(p.name)}</strong>
              <small>${p.category}${anyInStock(p) ? '' : ' · sold out'}</small>
              <div class="price">${money(p.price)}</div>
            </div>
          </a>`).join('');
        body.appendChild(wrap);
      }
    });
    scroll();
  }

  function pushMe(txt) {
    const el = document.createElement('div');
    el.className = 'msg msg--me';
    el.textContent = txt;
    body.appendChild(el);
    scroll();
  }

  function typing(on) {
    let el = body.querySelector('.msg--typing');
    if (on && !el) {
      el = document.createElement('div');
      el.className = 'msg msg--bot msg--typing';
      el.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
      body.appendChild(el);
      scroll();
    } else if (!on && el) el.remove();
  }

  function renderChips(list = DEFAULT_CHIPS) {
    chips.innerHTML = list.map(c => `<button type="button">${escapeHtml(c)}</button>`).join('');
  }

  async function send(txt) {
    if (!txt.trim()) return;
    pushMe(txt);
    Bestie.history.push({ role: 'user', text: txt });
    chips.innerHTML = '';
    typing(true);

    let blocks;
    try {
      blocks = CONFIG.assistant.endpoint
        ? await Bestie.askServer(txt)
        : await new Promise(r => setTimeout(() => r(Bestie.reply(txt)), 420 + Math.random() * 380));
    } catch (err) {
      blocks = [{
        type: 'text',
        html: `<p>Something went wrong on my side — sorry! Our team is on <a href="${CONFIG.instagram}" target="_blank" rel="noopener">${CONFIG.instagramHandle}</a> if you need an answer now. 💕</p>`
      }];
    }
    typing(false);
    pushBot(blocks);
    Bestie.history.push({ role: 'assistant', text: blocks.filter(b => b.type === 'text').map(b => b.html).join(' ') });
    renderChips();
  }

  let opened = false;
  function open() {
    panel.classList.add('is-open');
    btn.classList.add('is-open');
    nudge.classList.remove('is-on');
    if (!opened) {
      opened = true;
      const hello = Store.name
        ? `<p>Welcome back, ${Store.name}! 💕 What are we finding today?</p>`
        : `<p>${CONFIG.assistant.greeting}</p>`;
      pushBot([{ type: 'text', html: hello }]);
      renderChips();
    }
    setTimeout(() => input.focus(), 320);
  }
  function close() {
    panel.classList.remove('is-open');
    btn.classList.remove('is-open');
  }

  btn.addEventListener('click', () => panel.classList.contains('is-open') ? close() : open());
  panel.querySelector('#asstClose').addEventListener('click', close);
  form.addEventListener('submit', e => { e.preventDefault(); const v = input.value; input.value = ''; send(v); });
  chips.addEventListener('click', e => { if (e.target.tagName === 'BUTTON') send(e.target.textContent); });
  nudge.addEventListener('click', () => open());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  /* Proactive nudge — once per session, only if the visitor has been on the
     page a while without opening the assistant. Not a pop-up ambush. */
  if (!sessionStorage.getItem('gashluxe.nudged')) {
    setTimeout(() => {
      if (panel.classList.contains('is-open')) return;
      const onProduct = location.pathname.includes('product.html');
      nudge.innerHTML = onProduct
        ? `Not sure on the size? I can work it out for you 💕`
        : `Taking your time? Tell me the occasion and I'll narrow it down ✨`;
      nudge.classList.add('is-on');
      sessionStorage.setItem('gashluxe.nudged', '1');
      setTimeout(() => nudge.classList.remove('is-on'), 9000);
    }, 45000);
  }

  /* Deep link: product pages can open the assistant pre-loaded with a question */
  window.askBestie = (q) => { open(); setTimeout(() => send(q), 250); };
}

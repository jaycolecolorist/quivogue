# QV fits — full site audit
11 October 2026 · against https://jaycolecolorist.github.io/quivogue/

## Their current website, and whether we can replace it

Their Instagram bio points at **brand.site/qv-fits** — a page built with
**BrandCrowd's** site builder, served from **AWS CloudFront**. Verified from the
page's own assets (`bc-user-uploads.brandcrowd.com`) and DNS (`brand.site` runs
on AWS nameservers).

**They do not own a domain.** `qvfits.com` exists but is an empty IONOS parking
page registered in the UK in Dec 2023 — not theirs. No `quivogue.com`,
`.co.ug`, or `.ug` is registered at all.

**So we cannot put our site "on" their current site.** `brand.site/qv-fits` is a
path on BrandCrowd's own domain; only pages built inside BrandCrowd's editor can
live there. To replace it they need:

1. A domain — `quivogue.com` and `qvfits.co.ug` are both free to register.
2. Hosting — what we have on GitHub Pages already works and costs nothing;
   Netlify is the same. Point the domain at it.
3. Change the link in the Instagram and TikTok bios.
4. Cancel the BrandCrowd plan, if they are paying for one. Worth asking — their
   builder is a paid product.

Until step 3, nothing changes for their customers: the bio link is the only way
anyone reaches a QV fits website.

## Things their old site publishes that ours does not

Found on brand.site/qv-fits, verified, and currently missing or blank in ours:

| Fact | Ours | Theirs |
|---|---|---|
| Email | `null` | **qvfits@gmail.com** |
| Customer reviews | empty by design | **three named quotes** (Natacia, Eryne, Melody) |
| Fabric detail | not stated | nylon, polyester, elastane, cotton; seamless + seamed |
| Brand pink | sampled from logo | **#ed1e79 / #951e79** declared in their CSS |

Their reviews are the shop's own published words, so they can go straight in and
the review blocks stop being hidden.

## Critical — a customer hits these

1. **Three discounts contradict each other.** The bar says free delivery, a card
   says 20% off, a sticker says 10% off, and hero slide 4 says up to 50% off.
2. **Slide 4 leads nowhere.** `?sale=1` returns 0 products — nothing carries a
   `salePercent`. The 50% banner is a promise with no page behind it.
3. **All 17 prices are invented.** Nothing public states QV fits' prices, so
   every figure on the site is mine. This is the single biggest launch blocker.

## Serious — measured

4. ~~**2.1 MB on the home page**~~ — **FIXED** (commit 9109039). Now **205 KB
   and 1.4s** on a phone. WebP for all 66 photos, the logo down from 180 KB to
   14 KB, hero canvases mounted on demand instead of all four up front, and
   400/800px variants so a phone takes a 19 KB card image instead of 66 KB.
5. ~~**Text fails contrast.**~~ — **FIXED** (commit 839504f). The two grey inks
   went from 4.39:1 and 2.42:1 to **6.1:1 and 4.6:1**. White-over-photo text was
   measured by compositing the scrim against the real image pixels, which caught
   two more failures the eye had passed (the Pilates tile at 4.26:1, slide 4's
   kicker at 4.49:1); both fixed. **Zero failures across all 8 pages.**
6. ~~**Phone type is too small.**~~ — **FIXED** (commit 839504f). Category
   labels 8.1 → **11.2px**, product names 10.9 → **13.3px**, prices 11.5 →
   13.3px. Floors: 13px product text, 11px labels.
7. ~~**82 tap targets under 44px**~~ — **FIXED** (commit 839504f). Every control
   is now 44×44, with the drawn size unchanged — each keeps its look and gets an
   invisible 44px touch area. Two deliberate exceptions, both clearing AA: the
   product-name link (24px, with the photo above it a much larger link to the
   same page) and the slideshow dots (43×44, because a full 44 would overlap the
   next dot and steal its taps).
8. **No h1 on shop.html or cart.html**; heading levels skip on shop, product and
   contact. *(still open)*
9. ~~**17 of 19 images have no width/height**~~ — **FIXED** (commit 9109039).
   Every image now carries its real dimensions, so cards hold their shape.

## Worth fixing before launch

10. No `robots.txt`, no `sitemap.xml`, no `404.html`.
11. No Open Graph or Twitter tags — a WhatsApp or Instagram share shows no
    preview image. For a shop that sells through WhatsApp this matters.
12. No canonical URLs.
13. Delivery fees, the exchange window and showroom hours are all still guesses.
14. `BEST_SELLERS` is my pick of the best photography, not their actual sales.
15. The newsletter stores emails in localStorage — they reach nobody.
16. Exchange rates are hardcoded, dated 31 August 2026, and will drift.

## Checked and sound

- No JavaScript errors on any of the seven pages.
- Every internal link resolves; no 404s.
- All images load; none broken.
- Cart, filters, search, currency switching and the WhatsApp order all work.
- The WhatsApp order correctly quotes UGX whatever currency is on screen.
- Header, hero and grids hold at 320, 375, 768, 860, 1024 and 1280.

# QV fits (Quivogue)

Storefront for **QV fits** — premium seamless & seam-fit activewear, swim and
lounge wear. Showroom at THE CUBE, G17 Kisementi, Kampala.

Static site: no build step, no framework, no backend.

## Editing the shop

Everything lives in [`js/data.js`](js/data.js) — products, prices, stock,
sizes, contact details and the FAQ. It is the only file you need to touch.

Read the header of that file first: it lists exactly which facts are sourced
and which are placeholders. **Every price is currently a placeholder**
(`// PRICE TBC`) and must be confirmed before launch.

`REVIEWS` is deliberately empty, so the review sections stay hidden until
real customer reviews are pasted in.

## Photos

`photos/` mixes the brand's own photography (pulled from their TikTok posts)
with free-licence stock used as filler. Both are colour-graded to the brand
palette by [`grade.py`](grade.py) at strength 0.35 — deliberately light,
because the brand's own images are already cohesive.

    python3 grade.py <source> <dest> <width> <height> 0.35

Filenames map to product ids: `<product-id>.jpg` plus `-2` for the gallery,
plus `hero.jpg`, `about.jpg`, `collection-<category>.jpg`, `look-<id>.jpg`.
Drop a real photo in with the matching name and it appears.

## Checkout

The site takes no payment. Checkout composes the order and hands it to
WhatsApp (+256 758 981 959) with a reference, so the team confirms stock,
total and payment directly.

## Fit assistant

`js/assistant.js` is a real intent parser over the catalogue — it searches
actual products, reads actual stock and does actual size maths. It is not a
language model and nothing on screen claims it is. To put a real LLM behind
it, stand up a server holding your Anthropic API key and set
`CONFIG.assistant.endpoint`. The key must never live in this repo.

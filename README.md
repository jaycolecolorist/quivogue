# Gash Luxe

Storefront for **Gash Luxe by Sheilah Gashumba** — a shopping lounge at
27 Clement Hill Rd, Kampala (opposite Jikoni).

Static site: no build step, no framework, no backend.

## Editing the shop

Everything lives in [`js/data.js`](js/data.js) — products, prices, stock,
sizes, contact details, delivery fees and the FAQ. It is the only file you
need to touch to change the store.

Prices marked `// REAL PRICE` came from the shop's own Instagram captions.
Prices marked `// PRICE TBC` are placeholders and need confirming.

## Photos

`photos/` holds the shop's own photography, colour-graded to the brand
palette by [`grade.py`](grade.py). Filenames map to product ids:
`<product-id>.jpg` plus `-2` / `-3` for the gallery, plus `hero.jpg`,
`about.jpg`, `collection-<category>.jpg` and `look-<id>.jpg`.

Drop a new photo in with the matching filename and it appears. Delete one
and a soft gradient placeholder takes its place.

Re-grade with:

    python3 grade.py <source> <dest> <width> <height> <strength>

Strength 0.7 is what the current set uses.

## Checkout

The site takes no payment. Checkout composes the order and hands it to
WhatsApp or Instagram DM with a `GL-XXXXX` reference, so the team confirms
stock, total and payment directly.

## Style Assistant

`js/assistant.js` is a real intent parser over the catalogue — it searches
actual products, reads actual stock and does actual size maths. It is not a
language model and nothing on screen claims it is. To put a real LLM behind
it, stand up a server that holds your Anthropic API key and set
`CONFIG.assistant.endpoint`. The key must never live in this repo.

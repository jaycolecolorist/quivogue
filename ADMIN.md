# The shop admin console

`/admin.html` — where the shop owner signs in and edits the site herself.

## What she can change

| Tab | What's in it |
|---|---|
| **Products & prices** | Name, category, price, "New"/"Bestseller" label, description, colours, stock per size, and the photo |
| **Delivery & shop details** | Kampala and upcountry delivery, free-delivery threshold, exchange window, opening time, address, phone, email |
| **Offers** | Whether a sale is running and the headline %, and whether the 10%-off pop-up shows |

Changes go live the moment she presses Save. No deploy, no developer.

## How it works

The whole editable site is **one JSON document in one database row**. The
console reads it, she edits it, it writes the whole thing back. One row means
a save is atomic — a shopper can never catch the site half-updated.

`js/data.js` stays in the repository as the baked-in copy. On every page load
`js/store.js` asks the backend whether anything has been edited and lays those
edits over the top. **If the backend is unset, slow, unreachable or broken, the
shop renders from `data.js` exactly as it does today.** A shop that cannot
reach its database still has to sell.

The Supabase client library is 212 KB. It loads on `/admin.html` only — the
public site reads one row with a plain `fetch`, about a kilobyte, so the
205 KB page weight survives.

Photos are shrunk and converted to WebP **in her browser** before upload, at
1200 / 800 / 400 px, the same ladder the baked-in photos use. A 4 MB photo
straight off her phone lands as about 60 KB of WebP. Without this, uploading
would quietly undo the whole page-weight job.

## Setting it up

Everything is in **`admin/schema.sql`** — paste it into the Supabase SQL
editor, run it once, then follow the four steps in the comment at the bottom:

1. Turn **off** public sign-ups (nobody should be able to create their own login)
2. Create her user in the dashboard
3. Add her user id to the `admins` table — **until this row exists she can sign
   in but cannot save anything**
4. Put the project URL and the `anon` key into `js/admin-config.js`

The `anon` key is designed to be public and is safe in the site; row-level
security is what actually protects the data. The `service_role` key must never
go near this repository.

Until step 4 is done, `/admin.html` says it is not set up and the shop carries
on from `data.js`.

## What has been tested

Driven end to end against an in-memory stand-in for Supabase, shaped like the
real API:

- wrong password refused; correct password signs in
- all 16 products load; name, category, price, description, colours and
  per-size stock all persist through a save
- delivery fees and shop details persist
- the Save button stays disabled until something actually changes, and
  disables again after saving
- a 3000×4000 photo becomes three WebP files and the product picks them up,
  with its real measured dimensions
- **the likeliest real failure** — signed in but not on the `admins` list —
  gives a plain-English message naming the fix, and does not lose the edit
- a saved document reaches the shop: the edited name, price, colours and
  sold-out size all appear on the home page and the product page

Not yet testable without a real project: email delivery, session expiry and
refresh, and concurrent edits from two devices.

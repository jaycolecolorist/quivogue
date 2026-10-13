# Putting QV fits on qvfits.com

Checked 13 October 2026. Everything below was verified against live DNS and
the registry, not assumed.

---

## 1. The short answer

**Yes. It takes two DNS records and about an hour.**

But there is one step only the client can do, and it is not one she should
hand to anybody else. More on that in section 3.

---

## 2. What is actually true about the domain

| | |
|---|---|
| Domain | **qvfits.com** |
| Registrar | IONOS SE |
| Registered | 29 December 2023 |
| Expires | **29 December 2026** |
| Nameservers | IONOS (`ns1030.ui-dns.de` and three others) |
| Website now | Empty IONOS placeholder, 336 bytes, **no HTTPS certificate** |
| **Email** | **LIVE — `mx00.ionos.de`, `mx01.ionos.de`, with an IONOS SPF record** |

Two things matter here.

**The domain is hers.** It was registered the same month her old site says
©2023, it sits at IONOS, and she has recovered the IONOS login. (I had
previously recorded qvfits.com as an unrelated parked domain — that was
wrong, and her account recovery is what settles it.)

**There is live email on it.** This is the important one. Somebody has set up
IONOS mail on qvfits.com. If anyone changes the **nameservers**, that email
stops arriving — possibly without anyone noticing for days. The person
advising her not to let someone take over the account is right, and they are
right for a concrete reason, not a vague one.

We do not need to touch the nameservers. We change two records *inside* her
existing IONOS DNS. Email is unaffected.

---

## 3. What she does — the only step that needs her

She logs into IONOS → her domain → **DNS settings**, and makes these changes.
Nothing else on the page gets touched.

**Delete** the existing records for the bare domain (`@`):

- the `A` record pointing to `217.160.0.246`
- the `AAAA` record pointing to `2001:8d8:100f:f000::200`

**Add** four `A` records, all on `@`:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**Add** four `AAAA` records, all on `@`:

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

**Add or change** one `CNAME` on `www`:

```
jaycolecolorist.github.io
```

**Leave completely alone:** the nameservers, both `MX` records, and the
`TXT` record starting `v=spf1`. Those are her email. Nothing above touches
them.

I tested all four of those A addresses — they are serving our site right now.

---

## 4. What I do

The moment the records are in, I flip the switch on our side and the
certificate issues automatically. HTTPS, free, renewed by itself.

I have deliberately **not** flipped it yet. Setting the custom domain before
the DNS is ready would redirect the current preview link at qvfits.com, which
doesn't point anywhere yet — so the site Jay has been showing her would go
dark in the meantime. DNS first, switch second.

The site itself needs no changes: every path in it is relative, so it works
at a domain root exactly as it does in the preview folder.

---

## 5. About her existing site

Her current site is at **brand.site/qv-fits**, built on BrandCrowd. That is a
page on *BrandCrowd's* domain, not hers — so there is nothing to overwrite.
It is replaced by making qvfits.com live and then:

1. changing the Instagram bio link to **qvfits.com**
2. changing the TikTok bio link to **qvfits.com**
3. cancelling the BrandCrowd plan once she is happy, so it stops billing

Steps 1 and 2 are what actually move her customers across. Until the bio
links change, almost nobody will reach the new site.

---

## 6. Before it goes live — the prices

This is the one real blocker, and it is not technical.

**All 17 prices on the site are mine, not the shop's.** I invented them as
placeholders so the pages would have something to show. Every product also
has a WhatsApp order button that quotes that price straight to the shop.

On a preview link only Jay shares, that is harmless. On qvfits.com it is a
public shop quoting numbers the owner never agreed to, and customers can
place orders at them.

Three ways forward:

1. **She sends the 17 prices today.** Best outcome — we launch complete. It
   is one WhatsApp message from her.
2. **We hide the prices and launch anyway.** Each product reads "Ask on
   WhatsApp" instead of a number, and the order button still works. Nothing
   on the site is then untrue. Takes me under an hour.
3. **Launch with my numbers.** I would not, but it is her shop and her call —
   she just needs to know that is what she is agreeing to.

Same applies, smaller, to the delivery fees, the exchange window and the
showroom opening time — all still placeholders.

---

## 7. A note on ownership

The site lives in a GitHub repository under **Jay's** personal account. That
is fine and costs nothing, but it means the client cannot move the site
elsewhere without him.

If she would rather own it outright, the alternative is a free account in
**her** name — the person advising her suggested Netlify, which works fine —
with Jay added as a collaborator. The DNS records would differ slightly.
It is worth offering; it is not worth delaying the launch over. It can be
moved later without any downtime.

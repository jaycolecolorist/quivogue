# To send her — ready to paste

Two messages. Send the first one now. Send the second only once she has
answered on prices.

---

## Message 1 — the domain

> Hi! Good news — we can put the new site on qvfits.com, and you don't need
> to give anyone your IONOS password. Whoever told you that is right.
>
> There's one thing I need you to do yourself, and it's about five minutes.
> Log into IONOS, open your domain, and go to DNS settings. I'll send you the
> exact records to put in — you just copy them in and tell me when it's done.
> I'll do the rest from my side and the site will be live within the hour.
>
> One important thing: **please don't change the nameservers**, and don't let
> anyone else change them either. I checked your domain and you have email
> running on it through IONOS. Changing the nameservers would stop your email
> arriving. What I'm sending you doesn't touch your email at all — it only
> changes where the website part points.
>
> Also, once we're live, you'll need to change the link in your Instagram and
> TikTok bio to qvfits.com. That's what actually sends your customers to the
> new site. And you can cancel the old BrandCrowd plan once you're happy, so
> it stops charging you.

---

## Message 2 — the prices (send this one too, it matters)

> One thing before we switch it on. The prices currently on the site are
> placeholders I put in so the pages wouldn't look empty — they are not your
> real prices. Every product also has a WhatsApp order button that sends that
> price straight to you.
>
> On a private preview that's fine. On your live site, customers could order
> at prices you never set.
>
> So, your choice:
>
> 1. Send me the real prices for the 17 pieces and we go live with everything
>    complete. One message from you and we're done.
> 2. Or I take the numbers off and each piece says "Ask on WhatsApp" instead.
>    The order button still works, nothing on the site is untrue, and we can
>    go live today. You add the prices whenever you're ready.
>
> Tell me which and I'll get it done.
>
> Same goes for the delivery charges and your opening time — I've guessed
> those too, so send them over when you can.

---

## And the DNS records themselves

Send her this block separately — it's easier to copy from on a phone.

> In IONOS → your domain → DNS settings:
>
> **Delete** the A record `217.160.0.246` and the AAAA record
> `2001:8d8:100f:f000::200`
>
> **Add 4 A records** (name: @ or blank)
> 185.199.108.153
> 185.199.109.153
> 185.199.110.153
> 185.199.111.153
>
> **Add 4 AAAA records** (name: @ or blank)
> 2606:50c0:8000::153
> 2606:50c0:8001::153
> 2606:50c0:8002::153
> 2606:50c0:8003::153
>
> **Add a CNAME** — name: www — pointing to: jaycolecolorist.github.io
>
> Don't touch anything else. Leave the nameservers, the two MX records and
> the v=spf1 line exactly as they are — those are your email.

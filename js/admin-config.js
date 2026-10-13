/* ==========================================================================
   QV fits — where the editable data lives.

   Fill these two in from the Supabase project:
     Supabase → Settings → API → Project URL, and the `anon` public key.

   The anon key is DESIGNED to be public — it is in the page source of every
   site that uses Supabase, and on its own it can only do what the row-level
   security policies in admin/schema.sql allow (read the shop; write nothing).
   The `service_role` key is the dangerous one. It must never appear here, in
   this repository, or anywhere in the browser.

   While these are empty the site runs exactly as it does today, straight from
   data.js, and /admin.html says it has not been set up yet. Nothing breaks.
   ========================================================================== */
window.QV_BACKEND = {
  url: '',      // e.g. 'https://abcdefghijklm.supabase.co'
  anonKey: ''   // the long key labelled `anon` `public`
};

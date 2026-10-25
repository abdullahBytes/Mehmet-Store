# Mehmet Store

A static Quasar catalog with product variants, a browser-based shopping bag, and WhatsApp checkout.
There is no server, database, payment integration, customer account, or admin dashboard.

## Run locally

```bash
npm install
npm run dev
```

## Edit the store

- Edit `src/data/products.json` to add or remove products and update names, descriptions, prices,
  stock display, variants, and Unsplash image IDs. Product edits take effect after rebuilding and
  redeploying the site.
- Edit `src/data/store.json` to change the store name or WhatsApp number. Use digits only, including
  the country code (for example, `923001234567`).
- Prices are currently formatted as USD in `src/pages/IndexPage.vue`; change the currency there if
  your catalog uses a different currency.

The customer fills in their contact and delivery details, then the site opens WhatsApp with the
cart and details prefilled. The customer must review and send that message; the site does not
receive, save, or confirm orders. Cart and wishlist preferences are stored only in that customer's
browser. Stock values are catalog display values and are not reserved or updated when a customer
sends an order.

## Build and deploy

Run `npm run build` and deploy the generated `dist/spa` directory as a static site on Netlify,
Vercel, or another static host. The app uses hash-based routing, so no server-side rewrite rules are
required. Check formatting and lint with `npm run lint:check`.

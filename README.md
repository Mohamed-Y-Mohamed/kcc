# KCC — Cafe, Restaurant & Hotel

The website for KCC on Argo Street, Golol, Somalia. Somali coffee, a kitchen,
and hotel rooms guests can book online.

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Firebase
(Auth, Firestore, Storage) · deployed on Netlify.

---

## Get it running

```bash
npm install
cp .env.example .env     # then fill it in — see below
npm run dev
```

Open http://localhost:3000.

### Environment

`.env` holds the Firebase web configuration. These values are **not secrets** —
they ship in the browser bundle by design, and every Firebase web app works this
way. What actually protects the data is `firestore.rules` and `storage.rules`.

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=   # optional, analytics stays off if empty
NEXT_PUBLIC_SITE_URL=                  # optional, your production domain
```

Copy them from **Firebase console → Project settings → General → Your apps →
SDK setup and configuration**.

---

## First-time Firebase setup

Four things, in this order. The site will look empty until they are done.

### 1. Turn on Email/Password sign-in

Firebase console → **Authentication** → **Sign-in method** → enable
**Email/Password**. Without it, sign-up fails with "Email sign-in is switched
off in Firebase".

### 2. Create the Firestore database

Firebase console → **Firestore Database** → **Create database**. Pick the region
closest to your customers.

### 3. Deploy the security rules

**Do not skip this.** Until the rules are deployed the database is either locked
shut or wide open, depending on the mode you picked in step 2.

```bash
npm install -g firebase-tools
firebase login
firebase use --add          # pick your project
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 4. Sign in as the owner

The owner account is **pinned to an email address** in two places that must stay
in step:

- `src/lib/roles.ts` → `OWNER_EMAIL` (drives the UI)
- `firestore.rules` → `ownerEmail()` (the one that actually enforces it)

Currently both are set to **`theking19942010@gmail.com`**. If that is not the
owner's address, change it in both files and redeploy the rules.

Then just go to `/signup` and create an account with that email — the owner role
is applied automatically on sign-in and re-asserted every time, so it cannot be
edited away by anyone. Everyone else gets a role from the dashboard.

### Optional: Firebase Storage

Only needed to upload photos from the dashboard. Firebase console → **Storage**
→ **Get started**. If you skip it, image *upload* fails with a clear message and
you can still paste image URLs, which always works.

---

## Roles

Set from **Admin → Users**. Search by email address, open a person, change their
role.

| Role | Rooms | Menu | Bookings | Messages | Can appoint |
|---|:--:|:--:|:--:|:--:|---|
| **Owner** | ✓ | ✓ | ✓ | ✓ | admin, manager, staff, customer |
| **Admin** | ✓ | ✓ | ✓ | ✓ | staff, customer |
| **Manager** | ✓ | ✓ | ✓ | ✓ | staff, customer |
| **Staff** | — | — | ✓ | ✓ | — |
| **Customer** | — | — | own only | — | — |

The rules that matter, all enforced server-side in `firestore.rules`:

- **Nobody can promote themselves.** Sign-up always creates a customer.
- **Only the owner can create admins and managers.** An admin or manager tops
  out at appointing staff.
- **A manager cannot demote an admin.** Both the role someone currently holds
  and the role they are being given must be within your reach.
- **The owner account cannot be edited or deleted by anyone**, because it is
  keyed to an email address rather than a database field.

---

## Using the dashboard

Staff sign in at **`/admin/login`**. Customers use `/login`.

| Page | What it does |
|---|---|
| **Overview** | Pending bookings, upcoming stays, revenue, unread messages, and the one-click **Load starter content** button |
| **Bookings** | Every booking. Filter by upcoming/today/past and by status, confirm or cancel on a guest's behalf, add notes, call or email them |
| **Rooms** | Add, edit and delete rooms — both languages, location in the building, price, capacity, beds, check-in/check-out times, several photos with a chosen cover, and how many of each room exist. Hide a room to take it off the site without losing its history |
| **Food & drink** | Add, edit and delete dishes and categories, mark things sold out, upload a photo |
| **Users** | Search by email, edit details, set roles |
| **Messages** | Enquiries from the contact form |

**Hotel page empty?** Rooms are the one thing that has no data yet. Hit **Add
starter rooms** on the Overview and you get single, double and family types to
edit. It refuses to run if any room already exists.

### Your existing data

The site reads the collections that were already in Firestore rather than
migrating them:

| Collection | Docs | Notes |
|---|---|---|
| `foodItems` | 131 | The menu. Keeps its imported shape — `name` is a `{ en, so }` map, timestamps are ISO strings, images point at Supabase |
| `users` | — | Roles live here. Written by this app |
| `user` | 1 | Legacy, from the previous app. Read-only, nothing writes to it |
| `rooms`, `bookings`, `dateBlocks`, `messages` | — | New, created by this app |

`src/lib/menu.ts` is the only file that knows the `foodItems` field shape;
everything above it works with a tidy `MenuItem` type. Two things worth knowing:

- **`section`** is the grouping the menu page uses — breakfast, lunch, dinner,
  sides, drinks. **`category`** is the sub-type within it (`lunch-food`,
  `hot-tea`, `juice`…). **`type`** is `"Normal"` on all 131 records — the import
  never populated it, so nothing reads it.
- **`name.so` is empty on most imported records.** The site leads with Somali,
  so it falls back to the English name and drops the translation line rather
  than rendering blank. Admin → Food & drink shows a running count of how many
  still need a Somali name.

---

## What customers can do

- Book a room **without an account** — name, email, phone, done.
- Or create an account, which prefills the form and keeps everything together.
- `/account` has three sections: **Upcoming**, **Previous** and **Profile**,
  plus sign out.
- **Cancel an upcoming booking** themselves. The rules let a guest move their own
  booking to `cancelled` and change nothing else — not the dates, not the price.
  Once a stay has started it is a phone call instead.

### How availability works

Every booking writes two documents in one batch:

- `bookings/{id}` — the full record, including name, email and phone
- `dateBlocks/{id}` — the same id, but only `roomId`, `checkIn`, `checkOut`,
  `status`

Availability checks read `dateBlocks`, never `bookings`. That is what lets an
unauthenticated visitor see what is free without being able to read anyone's
personal details. A room is free while the number of overlapping non-cancelled
blocks is below that room type's `quantity`.

Bookings are created as `pending` and nothing is charged online — staff confirm
by phone. The guest gets a reference like `KCC-7F3K2` on the confirmation screen.

---

## Checks

```bash
npm run lint          # ESLint
npm run build         # type-check + production build
```

### Smoke test

A Playwright script that loads every public route in light, dark and mobile, and
fails on a non-200, an empty render, a page error, or horizontal overflow.

```bash
npm run test:smoke:setup     # first time only
npm run build && npm start -- -p 3111
npm run test:smoke           # in another terminal
```

Point it elsewhere with `SMOKE_BASE_URL`, and save screenshots with
`SMOKE_SHOT_DIR=/some/dir`.

It waits on `domcontentloaded`, not `networkidle` — Firestore holds a websocket
open for the life of the page, so `networkidle` never fires here.

---

## Deploying to Netlify

`netlify.toml` is committed and uses `@netlify/plugin-nextjs`, which is what
gives dynamic routes like `/hotel/[id]`, the redirects and the security headers
proper support.

1. Netlify → **Add new site** → **Import from Git** → pick this repo.
2. Build command `npm run build`, publish directory `.next` (already in
   `netlify.toml`).
3. **Site configuration → Environment variables**: add every
   `NEXT_PUBLIC_FIREBASE_*` value from your `.env`, plus `NEXT_PUBLIC_SITE_URL`
   set to your Netlify domain. The build inlines these, so a missing one means a
   broken site rather than a build error.
4. Deploy. Pushes to `master` redeploy automatically.
5. Firebase console → **Authentication → Settings → Authorised domains** → add
   your Netlify domain, or sign-in will be rejected in production.

---

## Project layout

```
src/
  app/
    (public)/          customer-facing pages, share the nav + footer
      page.tsx         landing
      menu/            menu, driven by Firestore
      hotel/           room list
      hotel/[id]/      room detail + booking form + confirmation
      aboutus/  contactus/  login/  signup/  account/
    admin/             dashboard — own chrome, guarded per capability
      login/  bookings/  rooms/  menu/  users/  messages/
  components/
    ui/                Button, Field, Modal, Toast, Badge, ImageField, …
    layout/            Navigation, Footer
    site/              MenuRow, BookingCard, AuthCard
    admin/             Shell, RequireCapability
  context/             ThemeContext, AuthContext
  lib/                 firebase, roles, types, one module per collection
tests/smoke.py         Playwright smoke test
```

Pages never talk to Firestore directly — data access lives in `src/lib/`.
Business details (address, phone, hours, socials) live in `src/lib/site.ts`.
Permissions live in `src/lib/roles.ts` and are mirrored in `firestore.rules`.

---

## Design

The direction is **Xarrago** — Somali for elegance or adornment.

- **Palette — taken off the logo, not invented.** The mark is a deep
  coffee-brown cup and cutlery with the KCC wordmark in bright red on white. So:
  Qaxwo `#1C0B07` (dark ground), Bun `#4A1D14` (the cup brown), Guduud `#D91F16`
  (the exact wordmark red), Caano `#FAF6F2` (the logo's own white), Ciid
  `#D9C3B5` (tan). Every value was contrast-checked — body text clears 4.5:1 and
  large text 3:1 in both themes.
- **Red is the brand colour**, so destructive actions never rely on hue alone.
  Delete and cancel always carry an icon and an explicit verb.
- **Type** — Fraunces (display), Manrope (body), IBM Plex Mono (prices, codes,
  labels). Self-hosted via `next/font`; the old build pulled them from the Google
  CDN inside a `styled-jsx` block on every page.
- **Bilingual as the device** — Somali leads at display size, English sits under
  it in mono small caps as a translation label.
- **Signature** — the *xawaash rule*, a woven band drawn from Somali mat
  geometry, dividing every section. Menu prices run on leader dots like a
  printed menu.

Colours are semantic tokens (`bg-surface`, `text-ink`, `border-line`) defined in
`src/app/globals.css`. Dark mode swaps the token values; components never
reference a raw hex. The theme class is set before first paint by an inline
script, so reloads do not flash.

---

## Known gaps

- **No rate limiting on public writes.** Anyone can submit bookings and contact
  messages. The rules cap field sizes and validate shape, but the proper fix is
  [Firebase App Check](https://firebase.google.com/docs/app-check) with reCAPTCHA
  Enterprise. Worth adding before advertising the site widely.
- **CSP is Report-Only.** `next.config.ts` ships a Content-Security-Policy in
  report-only mode. Watch the console for violations, then rename the header to
  `Content-Security-Policy` to enforce. Going nonce-based needs middleware.
- **The email address on file is invalid.** `112@kcccoffee&restaurant.com`
  contains `&`, which is not legal in a domain, so mail to it bounces. It is
  shown as plain text rather than a broken `mailto:` link. Replace it in
  `src/lib/site.ts` when there is a working address.
- **No guest booking lookup by code.** Showing a booking to anyone holding a code
  would mean opening `bookings` to public queries, which would expose every
  guest's details. Guests see the code once on the confirmation screen; staff
  look it up in the dashboard.
- **`intro.mp4` is 5.9MB.** It never autoplays — it loads only when someone
  presses play, since most customers are on mobile data. Re-encoding it smaller
  is still worthwhile.
- **No unit tests.** Only the build, the linter and the smoke test.

---

## Licence

MIT. See [LICENSE](LICENSE).

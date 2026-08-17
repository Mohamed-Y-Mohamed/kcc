# KCC Website

KCC is a Next.js website for a coffee, restaurant and hotel business. The current repository contains public landing, about, menu and contact pages, shared navigation/footer components, theme support and Firebase Analytics initialisation.

## Features

- Present a public landing page with business content and media.
- Display dedicated about, menu and contact pages.
- Provide shared responsive navigation and footer components.
- Support application theme state through a React context.
- Use Framer Motion for interface animation.
- Initialise Firebase Analytics in the browser.
- Include an introductory video and branded image/favicon assets.

The `/Hotel` route currently contains an empty page file, so no hotel-booking or hotel-page functionality is claimed.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 |
| UI | React 19, TypeScript, Tailwind CSS 4 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Analytics | Firebase Analytics |

## Requirements

- Node.js and npm. The repository does not pin an exact Node.js version.

## Installation

```bash
git clone https://github.com/Mohamed-Y-Mohamed/kcc.git
cd kcc
npm install
```

## Running locally

```bash
npm run dev
```

Next.js uses port 3000 by default when available.

## Building

```bash
npm run build
npm start
```

## Firebase configuration

Firebase web configuration is currently hardcoded in `src/lib/firebase.ts`. These identifiers are browser-side Firebase configuration rather than private server credentials, but the associated Firebase/Google Cloud project should still use appropriate API restrictions and service security rules.

The current code initialises Firebase Analytics only; authentication, database, storage or booking features are not documented because their implementing code was not found.

## Testing and checks

No automated test files or test script were found. `package.json` contains a `lint` script using `next lint`; with the current Next.js version this script should be verified locally before relying on it as a working check.

## Licence

MIT. See [LICENSE](LICENSE).

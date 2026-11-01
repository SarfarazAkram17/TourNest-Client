# TourNest — Tourism Management System

**TourNest** is a full-stack tourism platform for Bangladesh. Travelers browse curated trips, choose a verified local guide, pay securely and share stories. Guides handle booking requests, and admins run the platform. The interface is a fully responsive (down to **320px**), premium design with a **light/dark theme**, a consistent layout system and a dedicated dashboard for each of the three roles.

---

## 🔗 Live Project

- 🌐 **Website**: [https://tournest-sarfaraz-akram.netlify.app](https://tournest-sarfaraz-akram.netlify.app)
- ⚙️ **Backend Repository**: [GitHub – TourNest Server](https://github.com/SarfarazAkram17/TourNest-Server)

### 🔐 Demo Admin Credentials

- ✉️ **Email**: `sarfaraz.akram055@gmail.com`
- 🔑 **Password**: `Sarfaraz1234`

> These are public demo credentials. Change them (and never publish real ones) when you deploy your own copy.

---

## ✨ What's New in This Version

- **New design system**: premium look with a brand-driven palette, *Bricolage Grotesque* + *Figtree* typography, consistent spacing, radii, shadows and a reusable UI kit.
- **Light / dark theme**: toggle in the navbar, dashboard top bar and auth pages. Follows the OS preference on the first visit, then remembers your choice. No flash on load.
- **Consistent layouts**: public shell (sticky navbar + footer), split-screen auth pages and a dashboard shell (sidebar, top bar, mobile drawer).
- **Responsive to 320px**: tables become cards on small screens, forms collapse to one column, charts and modals are sized for narrow viewports.
- **Three professional dashboards** (Admin, Tour Guide, Tourist) with KPI cards, charts and action queues.
- **Better workflow**: guided booking → payment → guide confirmation, automatic refunds, a booking progress timeline, application status tracking and server-side search and filters. See [Workflows](#-workflows).
- **Accessibility**: skip links, visible focus rings, labelled controls, native `<dialog>` modals, `prefers-reduced-motion` support and AA-contrast colour tokens.
- **Performance**: route-level code splitting, optimised hero images (about 9 MB → about 1 MB), skeleton loaders and no polling storms (stats refresh every 30 s).

---

## 🎨 Design System & Theming

All colours live in **one place**: `src/index.css`.

| Layer | What it does |
| --- | --- |
| DaisyUI themes `light` / `dark` | Semantic tokens (`base-100/200/300`, `primary`, `secondary`, `success`, `error`…) with AA-checked contrast |
| `--tn-*` CSS variables | Extra tokens: borders, muted text, shadows, hero dimming |
| `ThemeProvider` (`src/Contexts/ThemeContext`) | Stores the choice in `localStorage` (`tournest-theme`), listens to OS changes, sets `data-theme` and `<meta name="theme-color">` |
| Inline script in `index.html` | Applies the saved theme before first paint (no flash) |
| `src/utils/chartTheme.js` | Per-theme palettes for Recharts (SVG can't read utility classes) |
| `src/utils/alerts.js` | SweetAlert2 wrapper styled through the same tokens |

**Rules for contributors**

1. Never hard-code a colour in a component. Use `bg-base-100`, `text-primary`, `border-base-content/10`, `text-muted` and friends.
2. Change a colour once in `index.css` and both the light and dark UI update.
3. Charts read colours from `useChartTheme()`, and Stripe's card field reads `useTheme()`.

### Shared UI kit (`src/Components/UI`)

`PageHeader`, `SectionHeading`, `StatCard`, `Charts` (`AreaTrend`, `DonutChart`, `BarList`), `Modal`, `Pagination`, `SearchInput`, `FormField`, `ImageUploader`, `EmptyState`, `StatusBadge`, `BookingProgress`, `Avatar` and `Skeletons`.

---

## 🚀 Features Overview

### 👥 User Roles

| Role | What they can do |
| --- | --- |
| **Tourist** | Browse and book trips, pay, cancel, track bookings, apply to become a guide, share stories |
| **Tour Guide** | (Can't book trips.) Accept or decline booking requests, see upcoming tours and earnings, manage a public guide profile, share stories |
| **Admin** | (Can't book trips.) Review guide applications, manage users, publish, edit and delete packages, monitor revenue and bookings |

### 📊 Dashboards

- **Admin**: a Manage packages page (search, filter, edit, delete), revenue, bookings, tourists, guides, packages and stories; revenue trend; booking-status and community donuts; most-booked packages; recent bookings and new members; a banner when guide applications are waiting.
- **Tour Guide**: awaiting-response, upcoming, completed and earnings KPIs; **inline Accept / Decline queue**; activity trend; status donut; tours per package; next tours.
- **Tourist**: upcoming trips, awaiting payment (with **Pay now**), completed trips and total spent; next-trip cards; spending trend; status donut; spending per package; recent activity.

The sidebar shows live badges (pending applications for admins, requests awaiting response for guides).

### 🌍 Trips

- All Trips page with search, trip-type filter and price sort. State lives in the URL, so searches are shareable. Filtering happens on the server, so results are correct across every page.
- Package details with photo gallery and lightbox, day-by-day timeline, visual guide picker, native date picker and a sticky booking card (mobile booking bar on small screens).
- Home page: hero with search, live platform stats, featured trips, how-it-works, guides, stories, travel tips and FAQ.

### 📅 Bookings & Payments

- Only tourist accounts can book. Reserve → pay → guide confirms. Details in [Workflows](#-workflows).
- Stripe card payments in BDT. The server decides the amount and verifies the payment with Stripe.
- Automatic refunds when a paid booking is cancelled or declined.
- Confetti banner after 3 paid bookings 🎉 (once per session).

### 🧑‍🏫 Become a Guide

- Multi-section application with validation, and a status screen while it is under review.
- Admins review every detail (CV, bio, languages…) in a modal and approve or decline in one step.

### 📝 Stories

- Create, edit, delete and read stories with up to 10 photos. Shareable on Facebook.
- Community page with search and pagination, plus guide profile pages showing their stories.

### 🔐 Auth & Security

- Firebase Auth (email/password and Google). The Firebase ID token is exchanged for a TourNest JWT.
- Role-based route protection on the client; roles are re-checked from the database on every API call.

---

## 🔄 Workflows

### Booking lifecycle

```
Reserve ─► Awaiting payment ─► Guide reviewing ─► Confirmed ─► Completed
              (pending)         (in review, paid)  (accepted)   (tour dates passed)
                 │                    │
                 └── Cancelled ◄──────┤   (tourist, full refund if paid)
                                      └── Declined (guide, full refund if paid)
```

- A tourist can cancel while the booking is awaiting payment or in review.
- A guide can accept only paid bookings, and can decline unpaid or paid ones.
- A guide can't be double-booked on the same day.
- Every status change goes through a confirmation dialog and a server-enforced state machine.

### Guide application

`Tourist applies` → `Admin reviews full details` → `Approve (role changes immediately)` or `Decline (applicant may re-apply)`. The applicant sees "under review" on the Join page.

---

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS 4, DaisyUI 5 |
| Routing & data | React Router 7, TanStack Query, Axios |
| Forms | React Hook Form |
| Charts | Recharts |
| Backend | Node.js, Express 5, MongoDB |
| Auth | Firebase Authentication, JWT |
| Payments | Stripe |
| Deployment | Netlify (Client), Vercel (Server) |

---

## 📦 NPM Packages Used

| Package | Purpose |
| --- | --- |
| `react`, `react-dom`, `react-router` | UI and routing |
| `@tanstack/react-query` | Data fetching and caching |
| `axios` | HTTP client |
| `firebase` | Authentication |
| `@stripe/react-stripe-js`, `@stripe/stripe-js` | Card payments |
| `react-hook-form` | Forms and validation |
| `recharts` | Dashboard charts |
| `react-icons` | Icons (Lucide set) |
| `react-toastify` | Toast notifications (theme-aware) |
| `sweetalert2` | Confirmation dialogs (theme-aware) |
| `react-confetti` | Celebration banner |
| `react-countup` | Animated home-page counters |
| `react-share` | Share stories on Facebook |
| `tailwindcss`, `daisyui`, `@tailwindcss/vite` | Styling |

> **Optional clean-up**: the redesign no longer uses `framer-motion`, `lottie-react`, `react-datepicker`, `react-responsive-carousel`, `react-select`, `react-tabs` and `react-use`. Remove them with:
>
> ```bash
> npm uninstall framer-motion lottie-react react-datepicker react-responsive-carousel react-select react-tabs react-use
> ```

---

## 🗂️ Project Structure

```
src/
├── Components/
│   ├── Common/      Navbar, Footer, Logo, ThemeToggle, UserMenu, SocialLogin
│   ├── Dashboard/   Panel, BookingList
│   ├── Shared/      PackageCard, StoryCard, TourGuideCard
│   └── UI/          Design-system building blocks (see above)
├── Contexts/        AuthContext, ThemeContext
├── Hooks/           useAuth, useTheme, useAxiosSecure, useBookingActions, useDashboardStats…
├── Layouts/         RootLayout, DashboardLayout
├── Pages/           Home, AllTrips, PackageDetails, Community, Authentication, Dashboard/*
├── Routes/          PrivateRoute, RoleRoute (+ Admin / Tourist / TourGuide wrappers)
├── utils/           format, constants, alerts, chartTheme, cloudinary
└── index.css        Design tokens, themes and shared component classes
```

---

## 🛠️ Getting Started

```bash
git clone https://github.com/SarfarazAkram17/TourNest-Client
cd TourNest-Client
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev
```

By default the client talks to the deployed API (`https://tour-nest.vercel.app`). To use a local server, add `VITE_api_url=http://localhost:3000` to `.env.local`.

> **Deploy order**: this version uses new API endpoints (e.g. `/stats/public`, `/packages/types`). Deploy the updated [server](https://github.com/SarfarazAkram17/TourNest-Server) before, or together with, this client.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_apiKey`, `VITE_authDomain`, `VITE_projectId`, `VITE_storageBucket`, `VITE_messagingSenderId`, `VITE_appId` | Firebase web config |
| `VITE_cloudinary_cloud_name`, `VITE_cloudinary_preset_name` | Image uploads (unsigned preset) |
| `VITE_payment_key` | Stripe publishable key |
| `VITE_api_url` | Optional API base URL override |

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

### 👨‍💻 Developer

- 🧑‍💻 **Name**: Sarfaraz Akram
- 🌍 **Portfolio**: [https://sarfarazakram.netlify.app](https://sarfarazakram.netlify.app)
- 📧 **Email**: sarfaraz.akram055@gmail.com
- 🐱 **GitHub**: [Sarfaraz Akram](https://github.com/SarfarazAkram17)

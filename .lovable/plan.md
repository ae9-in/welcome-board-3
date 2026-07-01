# Welcome Onboard — Build Plan

A premium, wireframe-edgy competitions site with signature motion (pullout loader, ladder scrollbar climber, marquee, gamified registration) plus an admin dashboard. Light theme by default with a subtle particle background in the hero.

## Stack decisions
- **Frontend:** TanStack Start (project default) + React + TypeScript + Tailwind v4 + shadcn/ui (heavily restyled).
- **Animation:** Framer Motion everywhere; GSAP + ScrollTrigger only for the ladder/climber and the logo marquee.
- **Particles:** `ogl`-based `Particles` component from React Bits, mounted behind the hero at low opacity.
- **Backend:** Lovable Cloud (Postgres + Auth + server functions) instead of a separate Neon + custom auth stack. Reason: Lovable Cloud already provides serverless Postgres, RLS, and managed auth — using it avoids re-implementing password hashing/sessions and matches platform conventions. If you specifically want raw Neon + custom admin login instead, say so before I implement and I'll swap.
- **Admin auth:** Lovable Cloud auth + a `user_roles` table with an `admin` role; `/admin` route gated by role check. No public sign-up surface.

## Design system
- Tokens in `src/styles.css` via `@theme inline` (oklch). Light + dark variables per spec table; light is default.
- Fonts loaded via `<link>` in `__root.tsx`: Bricolage Grotesque (display), Inter (body), JetBrains Mono (meta).
- Accent `#FF4D2E` reserved for CTAs, ladder, hover, offer-unlock only.
- Reusable primitives: `PulloutReveal`, `MagneticButton`, `SectionDivider`, `CursorDot`, `NoiseOverlay`, `Counter`.
- `prefers-reduced-motion` respected globally (disable parallax, marquee, climber animation).

## Routes (TanStack file-based)
```
src/routes/
  __root.tsx              fonts, head, CursorDot, NoiseOverlay, LadderScrollbar, PulloutLoader
  index.tsx               Home (all home sections)
  register.tsx            Registration + gamification
  _authenticated/
    route.tsx             admin gate (role check, redirect to /admin)
    admin.dashboard.tsx   tabs: Ideas | Registrations | Overview
  admin.tsx               login screen (public)
  api/public/             (none needed for v1)
```

## Home page sections
1. **Hero** — full-vh, particle background (low alpha, accent + neutrals), brand mark floating, headline "Welcome Onboard Grandly" with stagger blur-in, scroll cue.
2. **Marquee** — GSAP infinite loop of competition names/icons, grayscale→color on hover.
3. **Why Competitions** — split, line-mask text reveal + parallax image, animated vertical divider.
4. **Six Competition Cards** — grid 3/2/1, hover label slide-up, click opens glass modal with prev/next nav.
5. **Create Your Event** — split with underline-style form, success state with SVG checkmark draw; writes to `event_ideas`.
6. **Footer** — minimal dark, symbol + links + callback line.

## Registration page (`/register`)
- Left: 6 selectable competition cards (toggle).
- Right: receipt-styled tally sheet (mono font, dashed edges).
- Top: 6-tile cover over offer graphic; each selection flips a tile away with threshold messages ("3 to go", etc.).
- All 6 selected → full-screen celebration takeover, confetti (accent palette only), "₹1499 Unlocked".
- Confirm CTA collects name/email/contact → writes `registrations`.
- Deselect reverses tile state smoothly.

## Signature interactions
- **Pullout loader** — reusable `<PulloutReveal>`; runs on first load + every route change. Min 700ms, cap 1.4s.
- **Ladder scrollbar** — fixed right rail (SVG rails + rungs), climber bound to `scrollY` via GSAP ScrollTrigger, limb alternation via sprite/transform swap, accent fill above climber. Mobile: slim progress bar.
- **Polish layer (Section 13):** cursor dot, magnetic CTAs, count-up stats, 2–4% grain, drawn section dividers, custom 404 with falling climber.

## Database (Lovable Cloud / Postgres)
```sql
create table public.event_ideas (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, idea text not null,
  created_at timestamptz default now()
);
create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, contact text,
  selected_competitions text[] not null,
  offer_unlocked boolean default false,
  offer_amount numeric default 1499,
  created_at timestamptz default now()
);
create table public.competitions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, title text not null,
  short_description text, full_description text,
  image_url text, sort_order int default 0
);
-- plus app_role enum, user_roles table, has_role() per platform convention
```
- GRANTs + RLS: `event_ideas` / `registrations` allow `INSERT` to `anon`; `SELECT` only to admins via `has_role(auth.uid(),'admin')`. `competitions` `SELECT` to `anon`. Indexes on `created_at` for both.
- Seed the 6 competitions via migration (real titles/images can be swapped in once `[REFERENCE_SITE_URL]` is supplied).

## Server functions
- `submitEventIdea` (public) — Zod-validated insert into `event_ideas`.
- `submitRegistration` (public) — validates selections, computes `offer_unlocked`, inserts into `registrations`.
- `listEventIdeas`, `listRegistrations`, `getOverviewStats` — `requireSupabaseAuth` + admin role check.

## Admin dashboard
- Sidebar tabs: Event Ideas, Registrations, Overview (Recharts bars/lines in mono+accent).
- Sortable/searchable tables, row expand, CSV export per table, logout.
- Wrong-credential shake animation, no field-level error detail.

## Placeholders & assets
- `[SYMBOL_ASSET]`: uses the uploaded logo as the brand mark (registered as a Lovable asset).
- `[TOGGLE_BUTTON_ASSET]`, `[REFERENCE_SITE_URL]`, `[REGISTRATION_INSPO_IMAGE]`: not supplied — I'll build sensible defaults (custom sun/moon toggle, placeholder competition data array, registration layout per the spec). Drop them in later and they swap in via the data array / asset slot without redesign.
- Hero background: animated gradient + particles as placeholder until a video/image is supplied.

## Build order
1. Enable Lovable Cloud + migrations (schema, RLS, grants, seed competitions, admin role).
2. Design system, fonts, theme provider, NoiseOverlay, CursorDot.
3. PulloutLoader + LadderScrollbar + __root wiring.
4. Navbar + Hero (with Particles) + Marquee.
5. Why Competitions + 6 Cards + Modal.
6. Create Your Event + server fn.
7. Registration page + gamification + server fn.
8. Admin login + dashboard + CSV export.
9. Polish pass (magnetic, counters, dividers, 404) + responsive/perf + reduced-motion audit.

## Open questions before I build
1. **Backend choice:** OK to use Lovable Cloud (managed Postgres + auth) instead of raw NeonDB + custom bcrypt admin login? Functionally equivalent and faster to ship.
2. **Reference URL / inspo image / hero media:** proceed with placeholder data + animated gradient hero, swap later? Or wait?
3. **Admin credentials:** create the first admin via a one-off migration with an email you provide, or via Lovable Cloud auth UI after deploy?
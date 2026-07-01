# Welcome Onboard

Welcome Onboard is a premium competitions platform for school students featuring six academic/creative competitions, gamified registration, event idea submission, and an admin dashboard.

## Project Structure

- **Frontend**: TanStack Start + React + TypeScript + Tailwind v4 + shadcn/ui (customized)
- **Routing**: TanStack Router (file-based)
- **State Management**: TanStack Query
- **Animations**: Framer Motion + GSAP + ScrollTrigger
- **Backend**: Lovable Cloud (managed Postgres + Auth)
- **Styling**: Custom Tailwind theme with OKLCH colors

## Development Conventions

1. **File Organization**:
   - `/src/routes/` - Page components (index.tsx, register.tsx, admin/)
   - `/src/components/site/` - Main UI components (Hero, Navbar, Footer, etc.)
   - `/src/components/effects/` - Custom animation components
   - `/src/lib/` - Utility functions and Supabase integrations
   - `/src/styles.css` - Tailwind configuration

2. **Key Patterns**:
   - Use `PulloutReveal` for section transitions
   - Respect `prefers-reduced-motion` setting
   - Accent color `#FF4D2E` for CTAs and interactive elements
   - Fonts: Bricolage Grotesque (display), Inter (body), JetBrains Mono (meta)
   - Database via Lovable Cloud with RLS:
     - `event_ideas`: Student suggestions
     - `registrations`: Participant data
     - `competitions`: Pre-seeded competition types

3. **Admin Access**:
   - Role-based via `user_roles` table
   - No public sign-up surface
   - Protected routes check for admin role

## Getting Started

1. Install dependencies: `bun install`
2. Start development: `bun dev`
3. Build for production: `bun build`

## Features

- Hero section with particle background
- Animated marquee of competition names
- Interactive competition cards with glass modals
- Gamified registration with reward unlock system
- Event idea submission form
- Admin dashboard for managing submissions and analytics
- Custom scrollbar with ladder climber effect
- Theme toggle (light/dark)

See `.lovable/plan.md` for detailed technical specifications and build plan.
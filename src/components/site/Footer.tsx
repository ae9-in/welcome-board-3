import { LogoMark } from "@/components/brand/Logo";
import { Link } from "@tanstack/react-router";
import { CrowdCanvas } from "@/components/effects/CrowdCanvas";

export function Footer() {
  return (
    <footer
      id="about"
      className="relative border-t border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden"
    >
      {/* Footer Content */}
      <div className="container mx-auto px-6 pt-20 pb-[240px] md:pb-[320px] relative z-10">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div>
            <LogoMark className="h-10 w-10 object-contain" />
            <div className="font-display mt-6 max-w-md text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Welcome Onboard, Grandly.
            </div>
          </div>
          <nav className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-zinc-400">
            <a href="#competitions" className="transition-colors hover:text-white">
              Competitions
            </a>
            <Link to="/register" className="transition-colors hover:text-white">
              Register
            </Link>
            <a href="#create-event" className="transition-colors hover:text-white">
              Create Event
            </a>
            <a href="#why" className="transition-colors hover:text-white">
              Why
            </a>
          </nav>
        </div>
        <div className="font-mono-meta mt-16 flex flex-col gap-2 border-t border-zinc-800 pt-6 text-[10px] uppercase tracking-[0.3em] text-zinc-500 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Welcome Onboard</span>
          <span>Learn · Compete · Shine</span>
        </div>
      </div>

      {/* Animated Crowd Canvas at the very bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[220px] md:h-[300px] pointer-events-none z-0 opacity-25"
        aria-hidden="true"
      >
        <CrowdCanvas
          src="https://assets.codepen.io/175711/open-peeps-sheet.png"
          rows={15}
          cols={7}
          className="absolute bottom-0 w-full h-full"
        />
      </div>
    </footer>
  );
}

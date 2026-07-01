import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "@/components/brand/Logo";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/#competitions", label: "Competitions" },
  { to: "/#create-event", label: "Create Your Event" },
  { to: "/register", label: "Register" },
  { to: "/#about", label: "About" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[90] transition-all duration-500 ${
        scrolled ? "border-b border-border bg-background/70 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <LogoMark className="h-8 w-8 object-contain" />
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            Welcome Onboard
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.slice(0, 4).map((l) =>
            l.to.startsWith("/#") ? (
              <a
                key={l.to}
                href={l.to}
                className="group relative text-sm text-foreground/80 transition-colors hover:text-foreground"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ) : (
              <Link
                key={l.to}
                to={l.to}
                className="group relative text-sm text-foreground/80 transition-colors hover:text-foreground"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm transition-all hover:scale-[1.03] hover:shadow-md"
          >
            Register
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6 text-foreground" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[110] flex flex-col bg-background p-6 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <LogoMark className="h-8 w-8" />
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-12 flex flex-col gap-6">
              {links.map((l, i) => (
                <motion.a
                  key={l.to}
                  href={l.to}
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl font-semibold tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <div className="mt-auto">
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

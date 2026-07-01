import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Trophy, X } from "lucide-react";
import type { Competition } from "@/lib/competitions";
import { competitionGradient } from "@/lib/competitions";
import { PulloutReveal } from "@/components/effects/PulloutReveal";

export function CompetitionsGrid({ competitions }: { competitions: Competition[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight")
        setOpenIdx((i) => (i === null ? null : (i + 1) % competitions.length));
      if (e.key === "ArrowLeft")
        setOpenIdx((i) =>
          i === null ? null : (i - 1 + competitions.length) % competitions.length,
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, competitions.length]);

  const active = openIdx !== null ? competitions[openIdx] : null;

  return (
    <section id="competitions" className="relative py-32">
      <div className="container mx-auto px-6">
        <PulloutReveal>
          <span className="font-mono-meta mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            03 / 06 — The Six
          </span>
          <h2 className="font-display mb-12 max-w-2xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Six competitions. Six different ways to find out who you are.
          </h2>
        </PulloutReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {competitions.map((c, idx) => (
            <motion.button
              key={c.slug}
              onClick={() => setOpenIdx(idx)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onClickCapture={() => setOpenIdx(idx)}
              className="flip-card text-left"
              style={{
                background: c.image_url
                  ? `url(${c.image_url}) center/cover no-repeat`
                  : (competitionGradient[c.slug] ?? "#222"),
                aspectRatio: c.image_url ? "1 / 1" : undefined,
              }}
              aria-label={c.title}
            >
              {!c.image_url && <Trophy className="flip-card__icon" />}
              {!c.image_url && <span className="flip-card__index font-mono-meta">0{idx + 1}</span>}
              <div className="flip-card__content">
                <p className="flip-card__title font-display">{c.title}</p>
                <p className="flip-card__description">{c.short_description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && openIdx !== null && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenIdx(null)}
          >
            <motion.div
              className="absolute inset-0 bg-background/70 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.05 } }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              role="dialog"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 mx-auto flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
              style={{ background: "var(--glass-bg)" }}
            >
              <div
                className="relative h-28 w-full shrink-0 md:h-44"
                style={{
                  background: active.image_url
                    ? `url(${active.image_url}) center/cover no-repeat`
                    : (competitionGradient[active.slug] ?? "#222"),
                }}
              >
                <span className="font-mono-meta absolute left-5 top-5 text-[10px] uppercase tracking-[0.3em] text-white/70 drop-shadow-md">
                  0{openIdx + 1} / 06
                </span>
                <button
                  onClick={() => setOpenIdx(null)}
                  aria-label="Close"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition hover:bg-black/50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-auto px-7 py-9 md:px-10 md:py-11">
                <h3 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                  {active.title}
                </h3>
                <p className="mt-6 text-lg leading-[1.85] text-foreground/80 md:text-xl">
                  {active.full_description}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-border px-6 py-4">
                <button
                  onClick={() =>
                    setOpenIdx((openIdx - 1 + competitions.length) % competitions.length)
                  }
                  className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span className="font-mono-meta text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Use ← → to navigate
                </span>
                <button
                  onClick={() => setOpenIdx((openIdx + 1) % competitions.length)}
                  className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

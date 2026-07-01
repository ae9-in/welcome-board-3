import { motion } from "framer-motion";
import { useRef, lazy, Suspense } from "react";
import { PulloutReveal } from "@/components/effects/PulloutReveal";
import { HorizontalTextReveal } from "@/components/effects/HorizontalTextReveal";
const Lanyard = lazy(() => import("@/components/effects/Lanyard"));
import lanyardCardAsset from "@/assets/lanyard-card.png";

const events = [
  { emoji: "🔤", label: "Spell Bee" },
  { emoji: "✍️", label: "Handwriting" },
  { emoji: "🤖", label: "AI & Tech" },
  { emoji: "➕", label: "Math Quiz" },
  { emoji: "🌍", label: "GK Quiz" },
  { emoji: "🎨", label: "Art & Craft" },
];

export function WhyCompetitions() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section id="why" className="relative py-32" ref={ref}>
      <div className="container mx-auto grid gap-16 px-6 md:grid-cols-2">
        {/* ── Left: copy + events ── */}
        <div className="flex flex-col justify-center gap-6">
          <PulloutReveal>
            <span className="font-mono-meta mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              02 / 06 — What We Do
            </span>
            <h2 className="font-display mb-6 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Where curiosity
              <br />
              gets competitive.
            </h2>
          </PulloutReveal>

          <HorizontalTextReveal className="text-lg leading-relaxed text-foreground/80 md:text-xl">
            Welcome Onboard isn't just another competitions program.
          </HorizontalTextReveal>
          <HorizontalTextReveal
            className="text-lg leading-relaxed text-foreground/80 md:text-xl"
            staggerDelay={0.05}
          >
            We bring schools a lineup of high-energy events — each designed
          </HorizontalTextReveal>
          <HorizontalTextReveal
            className="text-lg leading-relaxed text-foreground/80 md:text-xl"
            staggerDelay={0.05}
          >
            to challenge young minds and let their talent take the spotlight.
          </HorizontalTextReveal>
          <HorizontalTextReveal
            className="text-base leading-relaxed text-foreground/60 md:text-lg"
            staggerDelay={0.04}
          >
            Every competition is built with one goal: make learning feel
          </HorizontalTextReveal>
          <HorizontalTextReveal
            className="text-base leading-relaxed text-foreground/60 md:text-lg"
            staggerDelay={0.04}
          >
            like an adventure worth showing up for.
          </HorizontalTextReveal>

          {/* Events grid */}
          <motion.div
            className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {events.map(({ emoji, label }) => (
              <motion.div
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
              >
                <span className="text-xl leading-none" aria-hidden>
                  {emoji}
                </span>
                <span className="font-mono-meta text-xs font-medium uppercase tracking-[0.2em] text-foreground/80">
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: lanyard ── */}
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <div
            className="relative h-[600px] w-full md:h-[680px]"
            style={{
              background:
                "radial-gradient(circle at 30% 25%, rgba(255,120,60,0.22), transparent 60%), linear-gradient(160deg, #1a1410 0%, #2a1a12 60%, #3a2418 100%)",
            }}
          >
            <Suspense
              fallback={<div className="h-full w-full bg-[#1e1713]/40 animate-pulse rounded-2xl" />}
            >
              <Lanyard
                position={[0, 0, 18]}
                gravity={[0, -40, 0]}
                fov={20}
                frontImage={lanyardCardAsset}
                backImage={lanyardCardAsset}
                imageFit="contain"
              />
            </Suspense>
            <div className="pointer-events-none absolute bottom-4 left-0 right-0 text-center font-mono-meta text-[10px] uppercase tracking-[0.3em] text-white/40">
              drag the card
            </div>
          </div>
        </div>
      </div>

      {/* centre divider line */}
      <motion.div
        className="absolute left-1/2 top-32 hidden h-[calc(100%-8rem)] w-px origin-top bg-accent/40 md:block"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </section>
  );
}

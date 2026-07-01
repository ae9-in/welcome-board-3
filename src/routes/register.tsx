import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lock, Gift, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PulloutReveal } from "@/components/effects/PulloutReveal";
import { getCompetitions } from "@/lib/competitions.functions";
import { fallbackCompetitions, competitionGradient, type Competition } from "@/lib/competitions";
import { submitRegistration } from "@/lib/registrations.functions";
import { Confetti } from "@/components/effects/Confetti";

function ClientReceiptNo() {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    setN(Math.floor(Math.random() * 9000) + 1000);
  }, []);
  return <span>#{n ?? "0000"}</span>;
}

const messages: Record<number, string> = {
  0: "Pick a competition to start unlocking your offer.",
  1: "Nice. You're 5 picks away from the surprise.",
  2: "4 to go — keep going.",
  3: "Halfway there.",
  4: "2 more. You can feel it now.",
  5: "1 to go. Almost there.",
  6: "Unlocked.",
};

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — Welcome Onboard" },
      {
        name: "description",
        content: "Pick your competitions and unlock the surprise. Six picks, one stage.",
      },
      { property: "og:title", content: "Register — Welcome Onboard" },
      { property: "og:description", content: "Pick six competitions to unlock the special offer." },
    ],
  }),
  loader: async () => {
    return { competitions: fallbackCompetitions };
  },
  component: RegisterPage,
});

function RegisterPage() {
  const { competitions: all } = Route.useLoaderData();
  const competitions: Competition[] = all.slice(0, 6);
  const [selected, setSelected] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dismissedUnlock, setDismissedUnlock] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", contact: "" });
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");
  const submit = useServerFn(submitRegistration);

  const count = selected.length;
  const unlocked = count >= 6;

  function toggle(slug: string) {
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));
  }

  async function onConfirm(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrMsg("");
    try {
      await submit({ data: { ...form, selected_competitions: selected } });
      setState("success");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Couldn't register");
      setState("error");
    }
  }

  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-6 pb-32 pt-32">
        <PulloutReveal>
          <span className="font-mono-meta mb-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Registration
          </span>
          <h1 className="font-display max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Pick your competitions. Unlock something good.
          </h1>
          <div className="mt-5 rounded-xl border border-accent/20 bg-accent/5 px-5 py-4 text-sm text-foreground max-w-3xl leading-relaxed">
            Choose from our 6 unique competitions. Select all 6 to unlock our exclusive bundle offer
            for just{" "}
            <strong className="font-semibold text-accent underline decoration-accent/30 underline-offset-4">
              ₹1,499
            </strong>{" "}
            <span className="text-muted-foreground">
              (instead of the individual price of ₹1,998)
            </span>
            .
          </div>
        </PulloutReveal>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Left: offer bar + cards */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Offer reveal bar */}
            <OfferRevealBar count={count} unlocked={unlocked} />

            {/* Selection cards — 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {competitions.map((c) => {
                const isSel = selected.includes(c.slug);
                return (
                  <motion.button
                    key={c.slug}
                    onClick={() => toggle(c.slug)}
                    whileHover={{ y: -4 }}
                    className={`relative aspect-square overflow-hidden rounded-xl border text-left transition-all ${
                      isSel ? "border-accent shadow-lg shadow-accent/20" : "border-border"
                    }`}
                    style={{
                      background: c.image_url
                        ? `url(${c.image_url}) center/cover no-repeat`
                        : (competitionGradient[c.slug] ?? "#222"),
                    }}
                  >
                    <div
                      className="absolute inset-0 transition-all duration-300"
                      style={{
                        background: c.image_url
                          ? undefined
                          : (competitionGradient[c.slug] ?? "#222"),
                        backgroundColor:
                          c.image_url && isSel ? "rgba(0, 0, 0, 0.4)" : "transparent",
                        opacity: isSel && !c.image_url ? 0.7 : 1,
                      }}
                    />
                    {isSel && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground z-10"
                      >
                        <Check className="h-5 w-5" />
                      </motion.div>
                    )}
                    {!c.image_url && (
                      <div className="absolute inset-x-6 bottom-6">
                        <h3 className="font-display text-2xl font-semibold text-white">
                          {c.title}
                        </h3>
                        <p className="mt-1 text-sm text-white/70">{c.short_description}</p>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right: tally sheet — sticky beside the cards */}
          <div className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-28">
            <TallySheet
              selected={selected}
              competitions={competitions}
              unlocked={unlocked}
              onProceed={() => setShowConfirm(true)}
            />
          </div>
        </div>
      </section>

      {/* Unlock celebration */}
      <AnimatePresence>
        {unlocked && !showConfirm && !dismissedUnlock && (
          <UnlockCelebration
            onClose={() => setShowConfirm(true)}
            onDismiss={() => setDismissedUnlock(true)}
          />
        )}
      </AnimatePresence>

      {/* Confirm modal */}
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            onClose={() => setShowConfirm(false)}
            form={form}
            setForm={setForm}
            onSubmit={onConfirm}
            state={state}
            errMsg={errMsg}
            count={count}
            unlocked={unlocked}
          />
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

function OfferRevealBar({ count, unlocked }: { count: number; unlocked: boolean }) {
  const removed = Math.min(count, 6);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[7/1] w-full min-h-[120px]">
        <div
          className="absolute inset-0 flex items-center transition-all duration-500"
          style={{
            background: unlocked
              ? "linear-gradient(135deg, var(--accent-brand), oklch(0.78 0.18 50))"
              : "linear-gradient(135deg, #1A1A1E, #26262B)",
            justifyContent: unlocked ? "center" : "flex-start",
            paddingLeft: unlocked ? "0" : "2rem",
          }}
        >
          {unlocked ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center text-white w-full"
            >
              <div className="font-mono-meta text-[10px] uppercase tracking-[0.3em] opacity-90">
                Special Offer Unlocked
              </div>
              <div className="font-display mt-1 text-4xl font-semibold md:text-5xl">₹1,499</div>
              <div className="mt-1 text-xs opacity-90">Unlock all 6 picks</div>
            </motion.div>
          ) : (
            <div className="flex items-center gap-3 text-white/50 max-w-[55%]">
              <Lock className="h-5 w-5 shrink-0 text-white/30 animate-pulse" />
              <div className="text-left">
                <div className="font-mono-meta text-[9px] uppercase tracking-[0.25em] text-white/40">
                  Bundle Offer Locked
                </div>
                <div className="mt-0.5 text-xs font-medium text-white/80 leading-snug">
                  Select {6 - count} more pick{6 - count > 1 ? "s" : ""} to unlock the bundle
                  pricing!
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="absolute inset-0 grid grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="border-r border-background/40 bg-foreground last:border-r-0"
              initial={false}
              animate={
                i < removed
                  ? { y: "-110%", rotateZ: -8, opacity: 0 }
                  : { y: "0%", rotateZ: 0, opacity: 1 }
              }
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: i < removed ? (removed - i) * 0.04 : 0,
              }}
            >
              <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-background/60">
                0{i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-3 text-xs">
        <span className="font-mono-meta uppercase tracking-[0.25em] text-muted-foreground">
          {count} / 6 selected
        </span>
        <span className={unlocked ? "font-medium text-accent" : "text-foreground/70"}>
          {messages[count] ?? messages[6]}
        </span>
      </div>
    </div>
  );
}

function TallySheet({
  selected,
  competitions,
  unlocked,
  onProceed,
}: {
  selected: string[];
  competitions: Competition[];
  unlocked: boolean;
  onProceed: () => void;
}) {
  const map = useMemo(
    () => Object.fromEntries(competitions.map((c) => [c.slug, c.title])),
    [competitions],
  );
  return (
    <aside className="relative">
      <div
        className="relative rounded-xl border border-border bg-card p-6 shadow-sm"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 8px, var(--color-border) 8px 14px)",
          backgroundSize: "100% 2px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 0, 0 100%",
        }}
      >
        <div className="font-mono-meta flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>Tally Sheet</span>
          <ClientReceiptNo />
        </div>
        <ul className="mt-6 space-y-3">
          {selected.length === 0 && (
            <li className="font-mono-meta text-xs text-muted-foreground">— nothing here yet —</li>
          )}
          <AnimatePresence>
            {selected.map((slug, i) => (
              <motion.li
                key={slug}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-mono-meta flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-muted-foreground">0{i + 1}</span>
                <span className="text-foreground">{map[slug] ?? slug}</span>
                <span className="flex-1 border-b border-dotted border-border" />
                <span className="text-foreground font-medium">₹333</span>
              </motion.li>
            ))}
          </AnimatePresence>
          {selected.length > 0 && selected.length < 6 && (
            <>
              <li className="font-mono-meta mt-4 flex items-center justify-between border-t border-dashed border-border pt-4 text-sm">
                <span className="text-muted-foreground font-medium">
                  Total ({selected.length} pick{selected.length > 1 ? "s" : ""})
                </span>
                <span className="font-semibold text-foreground">₹{selected.length * 333}</span>
              </li>
              <li className="font-mono-meta mt-2 flex items-center gap-2 text-xs italic text-muted-foreground">
                <Lock className="h-3 w-3 text-accent" /> Getting closer…
              </li>
            </>
          )}
          {unlocked && (
            <li className="font-mono-meta mt-4 flex flex-col gap-2 border-t border-dashed border-border pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal (6 picks)</span>
                <span className="text-muted-foreground line-through">₹1,998</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-foreground font-semibold">
                  <Check className="h-4 w-4 text-accent" /> Special Offer Unlocked
                </span>
                <span className="font-bold text-accent text-base">₹1,499</span>
              </div>
            </li>
          )}
        </ul>

        <button
          onClick={onProceed}
          disabled={selected.length === 0}
          className="mt-8 w-full rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {unlocked ? "Confirm registration & claim offer" : "Continue to confirm"}
        </button>
      </div>
    </aside>
  );
}

function UnlockCelebration({ onClose, onDismiss }: { onClose: () => void; onDismiss: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
      {/* Particle burst */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const dist = 200 + Math.random() * 200;
        return (
          <motion.span
            key={i}
            className="pointer-events-none absolute h-2 w-2 rounded-full"
            style={{
              background:
                i % 3 === 0
                  ? "var(--accent-brand)"
                  : i % 3 === 1
                    ? "var(--foreground)"
                    : "oklch(0.78 0.18 50)",
            }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="relative mx-auto max-w-md rounded-2xl border border-border bg-card p-10 text-center shadow-2xl"
      >
        <button
          onClick={onDismiss}
          aria-label="Go back"
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <Gift className="mx-auto h-10 w-10 text-accent" />
        <h3 className="font-display mt-6 text-3xl font-semibold tracking-tight">
          Your Special Surprise Has Been Unlocked
        </h3>
        <p className="font-display mt-4 text-6xl font-bold text-accent">₹1,499</p>
        <p className="mt-3 text-sm text-muted-foreground">All six picks, one bundle, one price.</p>
        <button
          onClick={onClose}
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:scale-[1.03]"
        >
          Continue to confirm
        </button>
      </motion.div>
    </motion.div>
  );
}

function ConfirmModal({
  onClose,
  form,
  setForm,
  onSubmit,
  state,
  errMsg,
  count,
  unlocked,
}: {
  onClose: () => void;
  form: { name: string; email: string; contact: string };
  setForm: (f: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  state: "idle" | "loading" | "success" | "error";
  errMsg: string;
  count: number;
  unlocked: boolean;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[160] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        {state === "success" ? (
          <div className="text-center">
            <Confetti />
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Check className="h-7 w-7" />
            </div>
            <h3 className="font-display mt-6 text-2xl font-semibold tracking-tight">You're in.</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll be in touch with the next steps shortly.
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background"
            >
              Back home
            </Link>
          </div>
        ) : (
          <>
            <span className="font-mono-meta inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              Confirm registration
            </span>
            <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight">
              {unlocked
                ? "Lock in your ₹1,499 offer"
                : `Submit ${count} pick${count === 1 ? "" : "s"} for ₹${count * 333}`}
            </h3>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
              />
              <input
                placeholder="Contact number (optional)"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
              />
              {state === "error" && <p className="text-sm text-destructive">{errMsg}</p>}
              <button
                type="submit"
                disabled={state === "loading"}
                className="w-full rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition hover:scale-[1.02] disabled:opacity-60"
              >
                {state === "loading" ? "Submitting…" : "Confirm registration"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

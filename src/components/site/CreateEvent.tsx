import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitEventIdea } from "@/lib/event-ideas.functions";
import { PulloutReveal } from "@/components/effects/PulloutReveal";

export function CreateEvent() {
  const submit = useServerFn(submitEventIdea);
  const [form, setForm] = useState({ name: "", email: "", idea: "" });
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrMsg("");
    try {
      await submit({ data: form });
      setState("success");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  return (
    <section id="create-event" className="relative py-32">
      <div className="container mx-auto grid gap-16 px-6 md:grid-cols-2">
        <PulloutReveal className="flex flex-col justify-center">
          <span className="font-mono-meta mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            04 / 06 — Create Your Event
          </span>
          <h2 className="font-display mb-6 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Have an idea and don't know how to execute it?
          </h2>
          <p className="text-lg leading-relaxed text-foreground/70">
            Let us know. We've staged everything from quiz nights to overnight hackathons — if you
            can describe it, we can probably build it with you.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Tell us roughly what you're imagining. We'll come back with a plan, not a brochure.
          </p>
        </PulloutReveal>

        <div className="relative">
          <AnimatePresence mode="wait">
            {state !== "success" ? (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <FloatingField
                  label="Your name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  required
                />
                <FloatingField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  required
                />
                <FloatingField
                  label="Your idea"
                  textarea
                  value={form.idea}
                  onChange={(v) => setForm({ ...form, idea: v })}
                  required
                />
                {state === "error" && (
                  <p className="text-sm text-destructive">
                    {errMsg || "Couldn't submit. Try again."}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="group inline-flex items-center gap-3 rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:scale-[1.02] disabled:opacity-60"
                >
                  {state === "loading" ? (
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-current" />
                  ) : null}
                  {state === "loading" ? "Sending…" : "Send my idea"}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start"
              >
                <svg width="64" height="64" viewBox="0 0 64 64" className="mb-6">
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="var(--accent-brand)"
                    strokeWidth="1.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                  <motion.path
                    d="M20 33 L29 42 L45 23"
                    fill="none"
                    stroke="var(--accent-brand)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                  />
                </svg>
                <h3 className="font-display text-3xl font-semibold tracking-tight">
                  Your idea has been heard.
                </h3>
                <p className="mt-2 text-base text-muted-foreground">We'll be in touch soon.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function FloatingField({
  label,
  value,
  onChange,
  type = "text",
  textarea,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const has = value.length > 0;
  return (
    <label className="group relative block">
      <span
        className={`pointer-events-none absolute left-0 transition-all duration-300 ${has ? "-top-3 text-xs text-accent" : "top-3 text-sm text-muted-foreground"}`}
      >
        {label}
        {required ? " *" : ""}
      </span>
      {textarea ? (
        <textarea
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="peer w-full resize-none border-b border-border bg-transparent py-3 text-base text-foreground outline-none transition-colors focus:border-foreground"
        />
      ) : (
        <input
          required={required}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="peer w-full border-b border-border bg-transparent py-3 text-base text-foreground outline-none transition-colors focus:border-foreground"
        />
      )}
      <span className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:scale-x-100" />
    </label>
  );
}

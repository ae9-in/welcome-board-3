import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/brand/Logo";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — Welcome Onboard" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const router = useRouter();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);

  useEffect(() => {
    // If already signed in locally, jump straight to dashboard
    let isMockAdmin = false;
    if (typeof window !== "undefined" && window.localStorage.getItem("mock_admin_session") === "mock.admin.token") {
      isMockAdmin = true;
    }
    if (isMockAdmin) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); 
    setLoading(true);
    
    // Simulate delay for smooth UI feedback
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (email === "admin@gmail.com" && password === "admin123") {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("mock_admin_session", "mock.admin.token");
      }
      router.invalidate();
      navigate({ to: "/admin/dashboard" });
    } else {
      setErr("Access denied.");
      setShake((s) => s + 1);
      setLoading(false);
    }
  }

  return (
    <main className="dark relative min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(800px 500px at 50% 30%, rgba(255,107,69,0.10), transparent 60%), var(--bg-base)" }} />
      <div className="flex min-h-screen items-center justify-center px-4">
        <motion.div
          key={shake}
          initial={{ x: 0 }}
          animate={shake > 0 ? { x: [0, -10, 10, -8, 6, -4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm rounded-2xl border border-border bg-card p-8"
        >
          <div className="flex flex-col items-center text-center">
            <LogoMark className="h-10 w-10 object-contain" />
            <h1 className="font-display mt-4 text-2xl font-semibold tracking-tight">Admin</h1>
            <p className="font-mono-meta mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Internal access only</p>
          </div>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent" />
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent" />
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-md bg-accent px-4 py-3 text-sm font-medium text-accent-foreground transition hover:scale-[1.02] disabled:opacity-60">
              {loading ? "…" : "Sign in"}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
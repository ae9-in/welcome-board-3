import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LogOut, FileText, Users, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { LogoMark } from "@/components/brand/Logo";
import { listEventIdeas, listRegistrations } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Welcome Onboard" }] }),
  component: AdminDashboard,
});

type Tab = "ideas" | "registrations" | "overview";

function AdminDashboard() {
  const navigate = useNavigate();
  const router = useRouter();
  const getIdeas = useServerFn(listEventIdeas);
  const getRegs = useServerFn(listRegistrations);
  const [tab, setTab] = useState<Tab>("overview");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMockAdmin = false;
    if (typeof window !== "undefined" && window.localStorage.getItem("mock_admin_session") === "mock.admin.token") {
      isMockAdmin = true;
    }
    if (!isMockAdmin) {
      navigate({ to: "/admin" });
    } else {
      setReady(true);
    }
  }, [navigate]);

  const ideas = useQuery({ 
    queryKey: ["admin", "ideas"], 
    queryFn: () => getIdeas(), 
    enabled: ready,
    refetchInterval: 4000 // Real-time auto-polling every 4 seconds
  });
  
  const regs = useQuery({ 
    queryKey: ["admin", "regs"], 
    queryFn: () => getRegs(), 
    enabled: ready,
    refetchInterval: 4000 // Real-time auto-polling every 4 seconds
  });

  async function logout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("mock_admin_session");
    }
    router.invalidate();
    navigate({ to: "/admin" });
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="font-mono-meta text-xs uppercase tracking-[0.3em] text-muted-foreground">Verifying…</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <LogoMark className="h-7 w-7" />
            <span className="font-display text-base font-semibold">Welcome Onboard · Admin</span>
          </Link>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-foreground/80 hover:bg-muted">
            <LogOut className="h-3.5 w-3.5" /> Log out
          </button>
        </div>
      </header>
      <div className="container mx-auto grid gap-8 px-6 py-10 md:grid-cols-[200px_1fr]">
        <aside className="space-y-1">
          <TabBtn active={tab === "overview"} onClick={() => setTab("overview")} icon={<BarChart3 className="h-4 w-4" />}>Overview</TabBtn>
          <TabBtn active={tab === "ideas"} onClick={() => setTab("ideas")} icon={<FileText className="h-4 w-4" />}>Event Ideas</TabBtn>
          <TabBtn active={tab === "registrations"} onClick={() => setTab("registrations")} icon={<Users className="h-4 w-4" />}>Registrations</TabBtn>
        </aside>
        <section>
          {tab === "overview" && <OverviewPane ideas={ideas.data ?? []} regs={regs.data ?? []} />}
          {tab === "ideas" && <IdeasPane rows={ideas.data ?? []} loading={ideas.isLoading} />}
          {tab === "registrations" && <RegsPane rows={regs.data ?? []} loading={regs.isLoading} />}
        </section>
      </div>
    </main>
  );
}

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
        active ? "bg-foreground text-background" : "text-foreground/70 hover:bg-muted"
      }`}
    >
      {icon}{children}
    </button>
  );
}

function OverviewPane({ ideas, regs }: { ideas: any[]; regs: any[] }) {
  const unlocked = regs.filter((r) => r.offer_unlocked).length;
  const compCounts = useMemo(() => {
    const m = new Map<string, number>();
    regs.forEach((r) => (r.selected_competitions || []).forEach((s: string) => m.set(s, (m.get(s) ?? 0) + 1)));
    return Array.from(m, ([slug, count]) => ({ slug, count })).sort((a, b) => b.count - a.count);
  }, [regs]);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total registrations" value={regs.length} />
        <Stat label="Offers unlocked" value={unlocked} />
        <Stat label="Event ideas" value={ideas.length} />
      </div>
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <div className="font-mono-meta mb-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Picks by competition</div>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <BarChart data={compCounts}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="slug" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "var(--bg-surface)", border: "1px solid var(--color-border)", fontSize: 12 }} />
              <Bar dataKey="count" fill="var(--accent-brand)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="font-mono-meta text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
      <div className="font-display mt-3 text-4xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function exportCsv(filename: string, rows: any[]) {
  if (rows.length === 0) return;
  const cols = Object.keys(rows[0]);
  const esc = (v: any) => {
    if (v == null) return "";
    const s = Array.isArray(v) ? v.join("; ") : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function IdeasPane({ rows, loading }: { rows: any[]; loading: boolean }) {
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const filtered = rows.filter((r) => (`${r.name} ${r.email} ${r.idea}`).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <input placeholder="Search ideas…" value={q} onChange={(e) => setQ(e.target.value)} className="w-full max-w-xs rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent" />
        <button onClick={() => exportCsv("event-ideas.csv", filtered)} className="rounded-md border border-border px-3 py-2 text-xs hover:bg-muted">Export CSV</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr><Th>Name</Th><Th>Email</Th><Th>Idea</Th><Th>Submitted</Th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No submissions yet.</td></tr>}
            {filtered.map((r) => (
              <tr key={r.id} className="cursor-pointer border-t border-border hover:bg-muted/30" onClick={() => setOpenId(openId === r.id ? null : r.id)}>
                <Td>{r.name}</Td>
                <Td>{r.email}</Td>
                <Td className="max-w-md truncate">{openId === r.id ? <span className="block whitespace-pre-wrap">{r.idea}</span> : r.idea}</Td>
                <Td className="font-mono-meta whitespace-nowrap text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RegsPane({ rows, loading }: { rows: any[]; loading: boolean }) {
  const [q, setQ] = useState("");
  const filtered = rows.filter((r) => (`${r.name} ${r.email} ${r.contact ?? ""}`).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <input placeholder="Search registrations…" value={q} onChange={(e) => setQ(e.target.value)} className="w-full max-w-xs rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent" />
        <button onClick={() => exportCsv("registrations.csv", filtered)} className="rounded-md border border-border px-3 py-2 text-xs hover:bg-muted">Export CSV</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr><Th>Name</Th><Th>Email</Th><Th>Contact</Th><Th>Picks</Th><Th>Offer</Th><Th>When</Th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No registrations yet.</td></tr>}
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-muted/30">
                <Td>{r.name}</Td>
                <Td>{r.email}</Td>
                <Td>{r.contact ?? "—"}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {(r.selected_competitions ?? []).map((s: string) => (
                      <span key={s} className="font-mono-meta rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-[0.15em]">{s}</span>
                    ))}
                  </div>
                </Td>
                <Td>{r.offer_unlocked ? <span className="rounded bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">₹{r.offer_amount}</span> : "—"}</Td>
                <Td className="font-mono-meta whitespace-nowrap text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="font-mono-meta px-4 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}
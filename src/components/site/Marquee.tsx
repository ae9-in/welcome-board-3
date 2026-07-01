import { Brain, Mic, Terminal, Palette, Megaphone, Lightbulb } from "lucide-react";
import type { Competition } from "@/lib/competitions";

const iconMap: Record<string, typeof Brain> = {
  brain: Brain,
  mic: Mic,
  terminal: Terminal,
  palette: Palette,
  megaphone: Megaphone,
  lightbulb: Lightbulb,
};

export function Marquee({ competitions }: { competitions: Competition[] }) {
  const items = [...competitions, ...competitions];
  return (
    <section className="relative overflow-hidden border-y border-border bg-card py-6">
      <div className="marquee-track flex w-max items-center gap-14 whitespace-nowrap">
        {items.map((c, i) => {
          const Icon = iconMap[c.icon ?? ""] ?? Brain;
          return (
            <div
              key={`${c.slug}-${i}`}
              className="group flex items-center gap-3 text-foreground/40 transition-colors duration-300 hover:text-accent"
            >
              <Icon className="h-5 w-5" />
              <span className="font-display text-2xl font-medium tracking-tight">{c.title}</span>
              <span className="text-xl text-foreground/20">/</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

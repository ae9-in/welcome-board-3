import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number; // initial horizontal position
  y: number; // initial vertical position
  tx: number; // target horizontal distance
  ty: number; // target vertical distance
  size: number;
  color: string;
  shape: "circle" | "square" | "triangle";
  delay: number;
  duration: number;
  rotate: number;
}

const COLORS = [
  "var(--accent)", // Orange
  "oklch(0.65 0.25 350)", // Pink
  "oklch(0.78 0.18 50)", // Gold
  "oklch(0.6 0.2 290)", // Purple
  "oklch(0.7 0.2 140)", // Lime Green
  "oklch(0.55 0.2 250)", // Sky Blue
];

export function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const arr: Particle[] = [];
    const count = 100; // Popping particles density

    // Popping coordinates from the middle of the viewport
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight * 0.4;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spread = 80 + Math.random() * 220; // outward blast spread radius

      arr.push({
        id: i,
        x: startX + (Math.random() * 30 - 15),
        y: startY + (Math.random() * 30 - 15),
        tx: Math.cos(angle) * spread + (Math.random() * 80 - 40),
        ty: Math.sin(angle) * spread + window.innerHeight * 0.65 + Math.random() * 120,
        size: 6 + Math.random() * 10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: Math.random() > 0.6 ? "circle" : Math.random() > 0.3 ? "square" : "triangle",
        delay: Math.random() * 0.08,
        duration: 1.8 + Math.random() * 1.6,
        rotate: 360 + Math.random() * 720,
      });
    }
    setParticles(arr);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      {particles.map((p) => {
        let borderRadius = "0px";
        if (p.shape === "circle") borderRadius = "50%";
        else if (p.shape === "square") borderRadius = "2px";

        return (
          <motion.div
            key={p.id}
            initial={{
              x: p.x,
              y: p.y,
              scale: 0,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              x: p.x + p.tx,
              y: p.y + p.ty,
              scale: [0, 1.2, 1, 0.8, 0],
              rotate: p.rotate,
              opacity: [1, 1, 0.9, 0.6, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.1, 0.8, 0.3, 1], // swift burst fading into a smooth descent
            }}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              backgroundColor: p.shape !== "triangle" ? p.color : undefined,
              borderRadius: borderRadius,
              borderLeft: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
              borderRight: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : undefined,
              borderBottom: p.shape === "triangle" ? `${p.size}px solid ${p.color}` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
export default Confetti;

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

function MobileProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setProgress(total > 0 ? Math.min(1, Math.max(0, y / total)) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-2 top-20 bottom-20 z-40 w-1 rounded-full bg-foreground/10">
      <div
        className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px] shadow-accent/60 transition-[top] duration-150"
        style={{ top: `${progress * 100}%` }}
      />
    </div>
  );
}

export function LadderScrollbar() {
  const [isMobile, setIsMobile] = useState(false);
  const climberRef = useRef<SVGGElement>(null);
  const progressRef = useRef<SVGRectElement>(null);
  const leftArmRef = useRef<SVGPathElement>(null);
  const rightArmRef = useRef<SVGPathElement>(null);
  const leftLegRef = useRef<SVGPathElement>(null);
  const rightLegRef = useRef<SVGPathElement>(null);

  const idleTimer = useRef<number | null>(null);

  // Climber state ref for smooth gaming-loop ticks
  const climberState = useRef({
    y: 24,
    x: 30,
    rotation: 0,
    intensity: 0,
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const VB_H = 800;
    const rungs = 18;
    const rungGap = VB_H / rungs;
    const minY = 24;
    const maxY = VB_H - 24;

    let lastScrollY = window.scrollY;

    const render = () => {
      const { y, x, rotation, intensity } = climberState.current;

      // Update climber position & rotation
      if (climberRef.current) {
        climberRef.current.setAttribute("transform", `translate(${x}, ${y}) rotate(${rotation})`);
      }

      // Calculate limb movement cycle based on actual Y position
      const cycle = y / 12;
      const lhY = -18 - 5 * Math.sin(cycle) * intensity;
      const rhY = -18 + 5 * Math.sin(cycle) * intensity;
      const lfY = 18 + 4 * Math.sin(cycle) * intensity;
      const rfY = 18 - 4 * Math.sin(cycle) * intensity;

      if (leftArmRef.current) {
        leftArmRef.current.setAttribute("d", `M -2.5 -6 Q -8 ${(-6 + lhY) / 2} -15 ${lhY}`);
      }
      if (rightArmRef.current) {
        rightArmRef.current.setAttribute("d", `M 2.5 -6 Q 8 ${(-6 + rhY) / 2} 15 ${rhY}`);
      }
      if (leftLegRef.current) {
        leftLegRef.current.setAttribute("d", `M -3 8 Q -5 ${(8 + lfY) / 2} -5 ${lfY}`);
      }
      if (rightLegRef.current) {
        rightLegRef.current.setAttribute("d", `M 3 8 Q 5 ${(8 + rfY) / 2} 5 ${rfY}`);
      }
    };

    // Add state render loop to the ticker
    gsap.ticker.add(render);

    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const p = total > 0 ? Math.min(1, Math.max(0, y / total)) : 0;

      // Update progress bar height directly in the DOM
      if (progressRef.current) {
        progressRef.current.setAttribute("height", String(p * VB_H));
      }

      const rawY = minY + p * (maxY - minY);
      const dy = y - lastScrollY;

      if (Math.abs(dy) > 0.2) {
        const direction = dy > 0 ? 1 : -1;

        // Tween state values (GSAP handles interpolating climberState properties)
        gsap.to(climberState.current, {
          y: rawY,
          x: 30 + direction * 1.5,
          rotation: direction * 4,
          intensity: 1,
          duration: 0.22,
          ease: "power1.out",
          overwrite: "auto",
        });

        // Handle snapping to rungs and neutral limb pose when scroll stops
        if (idleTimer.current) window.clearTimeout(idleTimer.current);
        idleTimer.current = window.setTimeout(() => {
          const nearestRungIndex = Math.min(
            rungs - 1,
            Math.max(0, Math.round((rawY - 0.5 * rungGap) / rungGap))
          );
          const nearestRung = (nearestRungIndex + 0.5) * rungGap;

          gsap.to(climberState.current, {
            y: nearestRung,
            x: 30,
            rotation: 0,
            intensity: 0,
            duration: 0.45,
            ease: "back.out(1.5)",
            overwrite: "auto",
          });
        }, 150);
      }

      lastScrollY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(render);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [isMobile]);

  if (isMobile) {
    return <MobileProgress />;
  }

  const VB_W = 60;
  const VB_H = 800;
  const railL = 14;
  const railR = 46;
  const rungs = 18;
  const rungGap = VB_H / rungs;

  return (
    <div
      className="pointer-events-none fixed right-3 z-40 hidden md:block"
      style={{ top: 88, bottom: 88 }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        className="h-full w-[34px]"
      >
        <defs>
          <linearGradient id="rail-wood" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent-deep, #3b2a1a)" stopOpacity="0.85" />
            <stop offset="50%" stopColor="var(--accent-deep, #5a3d22)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent-deep, #2a1c10)" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="rung-wood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-deep, #4a3320)" />
            <stop offset="100%" stopColor="var(--accent-deep, #2a1c10)" />
          </linearGradient>
        </defs>

        {/* Side rails */}
        <rect x={railL - 3} y="0" width="6" height={VB_H} rx="2" fill="url(#rail-wood)" opacity="0.9" />
        <rect x={railR - 3} y="0" width="6" height={VB_H} rx="2" fill="url(#rail-wood)" opacity="0.9" />

        {/* Rungs */}
        {Array.from({ length: rungs }).map((_, i) => {
          const y = (i + 0.5) * rungGap;
          return (
            <g key={i}>
              <rect x={railL - 2} y={y - 1.6} width={railR - railL + 4} height="3.2" rx="1.2" fill="url(#rung-wood)" />
              <rect x={railL - 2} y={y + 1.4} width={railR - railL + 4} height="0.6" fill="#000" opacity="0.18" />
            </g>
          );
        })}

        {/* Progress shimmer */}
        <rect
          ref={progressRef}
          x={railL - 3}
          y="0"
          width="6"
          height="0"
          rx="2"
          fill="var(--accent-brand)"
          opacity="0.18"
        />

        {/* Climber */}
        <g
          ref={climberRef}
          transform="translate(30, 24)"
          style={{ transformOrigin: "0px 0px" }}
        >
          {/* shadow on rung */}
          <ellipse cx="0" cy="22" rx="9" ry="1.6" fill="#000" opacity="0.18" />

          {/* Back leg */}
          <path
            ref={leftLegRef}
            d="M -3 8 Q -5 13 -5 18"
            stroke="var(--accent-brand)"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Front leg */}
          <path
            ref={rightLegRef}
            d="M 3 8 Q 5 13 5 18"
            stroke="var(--accent-brand)"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Torso */}
          <rect x="-3.2" y="-8" width="6.4" height="16" rx="2.4" fill="var(--accent-brand)" />

          {/* Arms reaching to rails */}
          <path
            ref={leftArmRef}
            d="M -2.5 -6 Q -8 -11 -15 -14"
            stroke="var(--accent-brand)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            ref={rightArmRef}
            d="M 2.5 -6 Q 8 -11 15 -14"
            stroke="var(--accent-brand)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Head */}
          <circle cx="0" cy="-13" r="4.4" fill="var(--accent-brand)" />
          <circle cx="0" cy="-13" r="4.4" fill="none" stroke="#000" strokeOpacity="0.15" strokeWidth="0.6" />
        </g>
      </svg>
    </div>
  );
}
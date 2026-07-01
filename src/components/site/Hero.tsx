import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { ShinyText } from "@/components/effects/ShinyText";
import { LogoMark } from "@/components/brand/Logo";
import { useTheme } from "@/lib/theme";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";

export function Hero() {
  const { theme } = useTheme();
  const { isLowPower, reducedMotion, dpr } = useDeviceProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Skip the heavy WebGL accent layer on mobile / low-power / reduced-motion.
  const colors =
    theme === "dark" ? ["#FF6B45", "#FFA07A", "#FFFFFF"] : ["#FF4D2E", "#1A1A1A", "#5A5A57"];

  return (
    <section className="relative isolate flex h-screen w-full items-center justify-center overflow-hidden">
      {/* Light-theme background: video is always the hero layer */}
      {theme === "light" && (
        <>
          {reducedMotion || !mounted ? (
            <div
              aria-hidden
              className="absolute inset-0 z-0"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 30%, #FFE9D6 0%, #F5F1EA 60%, #ECE3D2 100%)",
              }}
            />
          ) : (
            <video
              className="absolute inset-0 z-[1] h-full w-full object-cover"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              // @ts-expect-error - non-standard but honored by Chromium
              fetchpriority="high"
              disableRemotePlayback
            />
          )}
          {/* Minimal bottom fade for text legibility — no white wash over the video */}
          <div
            aria-hidden
            className="absolute inset-0 z-[2]"
            style={{
              background:
                "linear-gradient(180deg, rgba(15,15,16,0) 55%, rgba(245,241,234,0.55) 100%)",
            }}
          />
          {/* Subtle grain */}
          <div
            aria-hidden
            className="absolute inset-0 z-[2] opacity-[0.10] mix-blend-overlay"
            style={{ backgroundImage: "var(--noise-bg, none)" }}
          />
        </>
      )}

      {/* Dark-theme background: video is always the hero layer */}
      {theme === "dark" && (
        <>
          {reducedMotion || !mounted ? (
            <div
              aria-hidden
              className="absolute inset-0 z-0"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 30%, #1F1410 0%, #131214 55%, #0A0A0B 100%)",
              }}
            />
          ) : (
            <video
              className="absolute inset-0 z-[1] h-full w-full object-cover"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_102933_4e8f73b5-775a-4179-b2fb-472f59063dcd.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              // @ts-expect-error - non-standard but honored by Chromium
              fetchpriority="high"
              disableRemotePlayback
            />
          )}
          {/* Minimal bottom fade for text legibility */}
          <div
            aria-hidden
            className="absolute inset-0 z-[2]"
            style={{
              background: "linear-gradient(180deg, rgba(10,10,11,0) 55%, rgba(10,10,11,0.55) 100%)",
            }}
          />
          {/* Subtle grain */}
          <div
            aria-hidden
            className="absolute inset-0 z-[2] opacity-[0.08] mix-blend-overlay"
            style={{ backgroundImage: "var(--noise-bg, none)" }}
          />
        </>
      )}

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="font-mono-meta mb-6 text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
        >
          <ShinyText text="01 / 06 — School Competitions" speed={5} />
        </motion.span>

        <div className="flex flex-col items-center gap-2 md:gap-3">
          <div className="overflow-hidden">
            <motion.span
              className="font-display block text-6xl font-bold leading-none tracking-tight text-foreground md:text-8xl lg:text-9xl"
              initial={{ y: "110%", filter: "blur(12px)", opacity: 0 }}
              animate={{ y: "0%", filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Welcome
            </motion.span>
          </div>
          <h1 className="font-display text-3xl font-semibold leading-[0.95] tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {["Onboard", "Grandly"].map((word, wi) => (
              <span key={word} className="mr-3 inline-block overflow-hidden align-bottom md:mr-5">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%", filter: "blur(12px)", opacity: 0 }}
                  animate={{ y: "0%", filter: "blur(0px)", opacity: 1 }}
                  transition={{
                    duration: 0.95,
                    delay: 1.35 + wi * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {word === "Onboard" ? <span className="gradient-accent-text">{word}</span> : word}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 1.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <LogoMark className="h-48 w-48 md:h-72 md:w-72 object-contain drop-shadow-2xl" />
        </motion.div>
      </div>

      <motion.a
        href="#why"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
      >
        <span className="font-mono-meta text-[10px] uppercase tracking-[0.3em]">
          Scroll to begin
        </span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown className="h-4 w-4 text-accent" />
        </motion.span>
      </motion.a>
    </section>
  );
}

import { useTheme } from "@/lib/theme";
import Particles from "@/components/effects/Particles";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";

/**
 * Full-page WebGL particles layer. Renders only in dark theme,
 * fixed behind all content as the global page background.
 */
export function GlobalParticlesBackground() {
  const { theme } = useTheme();
  const { isLowPower, reducedMotion, dpr } = useDeviceProfile();
  if (theme !== "dark") return null;
  if (reducedMotion) return null;

  const count = isLowPower ? 60 : 200;
  const baseSize = isLowPower ? 60 : 100;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ background: "var(--bg-base)" }}
    >
      <Particles
        particleColors={["#ffffff", "#FFA07A", "#FF6B45"]}
        particleCount={count}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={baseSize}
        moveParticlesOnHover={!isLowPower}
        alphaParticles={false}
        disableRotation={isLowPower}
        pixelRatio={dpr}
      />
    </div>
  );
}

export default GlobalParticlesBackground;
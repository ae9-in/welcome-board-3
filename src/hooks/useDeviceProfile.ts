import { useEffect, useState } from "react";

export type DeviceProfile = {
  isMobile: boolean;
  isLowPower: boolean;
  reducedMotion: boolean;
  dpr: number;
};

/**
 * Lightweight device profile to scale down GPU-heavy effects on mobile
 * or low-power devices. SSR-safe (returns desktop defaults on server).
 */
export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>({
    isMobile: false,
    isLowPower: false,
    reducedMotion: false,
    dpr: 1,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };

    const compute = (): DeviceProfile => {
      const isMobile = mqMobile.matches;
      const cores = navigator.hardwareConcurrency ?? 8;
      const mem = nav.deviceMemory ?? 8;
      const saveData = !!nav.connection?.saveData;
      const slowNet = ["slow-2g", "2g", "3g"].includes(nav.connection?.effectiveType ?? "");
      const isLowPower = isMobile || cores <= 4 || mem <= 4 || saveData || slowNet;
      return {
        isMobile,
        isLowPower,
        reducedMotion: mqMotion.matches,
        dpr: Math.min(window.devicePixelRatio || 1, isLowPower ? 1 : 1.5),
      };
    };

    setProfile(compute());
    const onChange = () => setProfile(compute());
    mqMobile.addEventListener("change", onChange);
    mqMotion.addEventListener("change", onChange);
    return () => {
      mqMobile.removeEventListener("change", onChange);
      mqMotion.removeEventListener("change", onChange);
    };
  }, []);

  return profile;
}

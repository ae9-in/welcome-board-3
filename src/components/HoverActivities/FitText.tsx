import { useRef, useLayoutEffect, useCallback } from "react";

interface FitTextProps {
  text: string;
  isIdle: boolean;
  cardRef: React.RefObject<HTMLDivElement>;
  image?: string | null;
}

// Global cache to store calculated font-sizes for each text string.
// This completely avoids layout reflows (layout thrashing) on subsequent hovers.
const fontSizeCache = new Map<string, string>();

export function FitText({ text, isIdle, cardRef, image }: FitTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const suppressRO = useRef(false);
  const rafRef = useRef<number | null>(null);

  const fit = useCallback((fromObserver = false) => {
    if (fromObserver && suppressRO.current) return;

    const textEl = textRef.current;
    const cardEl = cardRef.current;
    if (!textEl || !cardEl) return;

    // Check cache first to avoid layout measurement reflows entirely
    const cacheKey = `${text}-${cardEl.offsetWidth}`;
    if (fontSizeCache.has(cacheKey)) {
      textEl.style.fontSize = fontSizeCache.get(cacheKey)!;
      textEl.style.display = "inline-block";
      return;
    }

    const styles = getComputedStyle(cardEl);
    const paddingLeft = parseFloat(styles.paddingLeft);
    const paddingRight = parseFloat(styles.paddingRight);
    const availableWidth = cardEl.offsetWidth - paddingLeft - paddingRight;

    if (availableWidth <= 0) return;

    // Measure text width by scaling to baseline
    textEl.style.display = "inline-block";
    textEl.style.fontSize = "100px";
    textEl.style.whiteSpace = "nowrap";

    const naturalWidth = textEl.getBoundingClientRect().width;

    if (naturalWidth === 0) {
      textEl.style.display = "block";
      return;
    }

    const scaledSize = (availableWidth / naturalWidth) * 100;
    const finalSize = `${Math.min(scaledSize, 320)}px`;
    
    textEl.style.fontSize = finalSize;
    textEl.style.display = "inline-block";

    // Cache the calculated size
    fontSizeCache.set(cacheKey, finalSize);
  }, [cardRef]);

  // Direct call — always runs, never suppressed
  useLayoutEffect(() => {
    fit(false);

    // Suppress RO for one rAF to avoid feedback loop from DOM text change
    suppressRO.current = true;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      suppressRO.current = false;
      rafRef.current = null;
    });
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [text, fit]);

  // ResizeObserver: genuine viewport/container resizes only
  useLayoutEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;
    const ro = new ResizeObserver(() => {
      // Clear cache for this text if container width changes
      const cacheKey = `${text}-${cardEl.offsetWidth}`;
      fontSizeCache.delete(cacheKey);
      fit(true);
    });
    ro.observe(cardEl);
    return () => ro.disconnect();
  }, [cardRef, fit, text]);

  const hasBgImage = !isIdle && !!image;

  return (
    <span
      ref={textRef}
      aria-hidden="true"
      style={{
        display: "inline-block",
        lineHeight: 0.85,
        whiteSpace: "nowrap",
        fontFamily: "var(--font-display)",
        fontWeight: 900,
        letterSpacing: "-0.03em",
        textTransform: "uppercase",
        userSelect: "none",
        
        backgroundImage: hasBgImage ? `url(${image})` : undefined,
        backgroundSize: hasBgImage ? "cover" : undefined,
        backgroundPosition: hasBgImage ? "center 40%" : undefined,
        WebkitBackgroundClip: hasBgImage ? "text" : undefined,
        backgroundClip: hasBgImage ? "text" : undefined,
        color: hasBgImage ? "transparent" : (isIdle ? "rgba(255,255,255,0.12)" : "#FFFFFF"),
        
        transition: "color 300ms ease",
      }}
    >
      {text}
    </span>
  );
}

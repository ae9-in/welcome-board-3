import { motion } from "framer-motion";
import type { Activity } from "@/data/activities";

interface ActivityThumbProps {
  activity: Activity;
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
}

export function ActivityThumb({
  activity,
  index,
  isActive,
  isDimmed,
  onHover,
  onLeave,
}: ActivityThumbProps) {
  // Keyboard: Enter/Space activates; Blur deactivates
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onHover();
    }
  };

  return (
    <motion.div
      className="ha-thumb"
      data-index={index}
      role="button"
      tabIndex={0}
      aria-label={`Explore ${activity.name}`}
      aria-pressed={isActive}
      // Desktop hover
      onHoverStart={onHover}
      onHoverEnd={onLeave}
      // Mobile tap: pointer events
      onPointerDown={(e) => {
        // Only fire for touch/pen
        if (e.pointerType !== "mouse") {
          e.preventDefault();
          isActive ? onLeave() : onHover();
        }
      }}
      // Keyboard
      onKeyDown={handleKeyDown}
      onBlur={onLeave}
      animate={{
        scale: isActive ? 1.07 : isDimmed ? 0.96 : 1,
        y: isActive ? -4 : 0,
        filter: isActive
          ? "brightness(1.1)"
          : isDimmed
          ? "brightness(0.45) saturate(0.5)"
          : "brightness(1) saturate(1)",
        boxShadow: isActive
          ? `0 0 0 2.5px ${activity.accentColor}, 0 10px 36px rgba(0,0,0,0.6)`
          : "0 0 0 2px transparent",
      }}
      transition={{
        scale: { type: "spring", stiffness: 380, damping: 24 },
        y: { type: "spring", stiffness: 380, damping: 24 },
        filter: { duration: 0.22, ease: "easeOut" },
        boxShadow: { duration: 0.22, ease: "easeOut" },
      }}
    >
      <img
        src={activity.image}
        alt={activity.name}
        loading="lazy"
        draggable={false}
      />
    </motion.div>
  );
}

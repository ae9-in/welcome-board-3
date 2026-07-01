import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ACTIVITIES } from "@/data/activities";
import { ActivityThumb } from "./ActivityThumb";
import { WipeText } from "./WipeText";
import "./HoverActivities.css";

export function HoverActivities() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hoveredActivity = ACTIVITIES.find((a) => a.id === hoveredId) ?? null;

  return (
    <section
      id="hover-activities"
      ref={sectionRef}
      className="ha-section"
      aria-label="Explore Activities"
    >
      <div className="ha-container">
        {/* ─── Section header — above the dark card, no hover interaction ─── */}
        <motion.div
          className="ha-section-header"
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="ha-eyebrow">EXPLORE · ACTIVITIES</p>
          <h2 className="ha-headline">
            Six Arenas.
            <br />
            One Stage.
          </h2>
        </motion.div>

        {/* ─── Dark card — full container width ─── */}
        <motion.div
          ref={cardRef}
          className="ha-card"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={
            {
              ["--ha-bg-hint" as string]: hoveredActivity?.bgHint ?? "transparent",
            } as React.CSSProperties
          }
          // Clicking the card background (not a thumb) deactivates on mobile
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse" && !(e.target as HTMLElement).closest(".ha-thumb")) {
              setHoveredId(null);
            }
          }}
        >
          {/* Tint overlay — barely perceptible ~4% color wash per activity */}
          <div className="ha-card-tint" />

          {/* ─── Thumbnail row (top of card, left-anchored) ─── */}
          <div className="ha-thumb-row">
            {ACTIVITIES.map((activity, index) => (
              <ActivityThumb
                key={activity.id}
                activity={activity}
                index={index}
                isActive={hoveredId === activity.id}
                isDimmed={hoveredId !== null && hoveredId !== activity.id}
                onHover={() => setHoveredId(activity.id)}
                onLeave={() => setHoveredId(null)}
              />
            ))}
          </div>

          {/* ─── Massive FitText area (bottom of card) ─── */}
          <div className="ha-fittext-area">
            <WipeText
              text={hoveredActivity?.displayName ?? null}
              cardRef={cardRef}
              image={hoveredActivity?.image ?? null}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HoverActivities;

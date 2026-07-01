import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FitText } from "./FitText";

const IDLE_TEXT = "HOVER ↑";

interface WipeTextProps {
  text: string | null; // null = idle state
  cardRef: React.RefObject<HTMLDivElement>;
  image: string | null;
}

// Using variants lets AnimatePresence apply different timing to enter vs exit
const wipeVariants = {
  enter: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  idle: {
    // Fades in from hidden rather than wipes — less jarring for idle state
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.35, ease: "easeOut" },
  },
  initial: {
    clipPath: "inset(0 100% 0 0)",
  },
  exit: {
    clipPath: "inset(0 0 0 100%)",
    transition: { duration: 0.28, ease: [0.7, 0, 0.84, 0] },
  },
};

const fadeVariants = {
  enter:   { opacity: 1, transition: { duration: 0.2 } },
  idle:    { opacity: 1, transition: { duration: 0.2 } },
  initial: { opacity: 0 },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

export function WipeText({ text, cardRef, image }: WipeTextProps) {
  const prefersReduced = useReducedMotion();
  const isIdle = text === null;
  const displayText = text ?? IDLE_TEXT;

  const variants = prefersReduced ? fadeVariants : wipeVariants;
  const animateName = isIdle ? "idle" : "enter";

  return (
    <div
      style={{ width: "100%", position: "relative" }}
      aria-live="polite"
      aria-atomic="true"
      aria-label={isIdle ? "Hover an activity to explore" : displayText}
    >
      {/*
        mode="wait": exit animation FULLY completes before the new text mounts.
        This prevents the exiting element from briefly going position:absolute
        (which is what popLayout does) and triggering ResizeObserver on the card.
      */}
      <AnimatePresence mode="wait">
        <motion.div
          key={displayText}
          variants={variants}
          initial="initial"
          animate={animateName}
          exit="exit"
          style={{
            width: "100%",
            // Prevents the exiting clip from visually leaking outside the area
            willChange: "clip-path",
          }}
        >
          <FitText text={displayText} isIdle={isIdle} cardRef={cardRef} image={image} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

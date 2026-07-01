import { motion, type Transition, type Variants } from "framer-motion";

interface HorizontalTextRevealProps {
  children: string;
  as?: "p" | "h2" | "h3" | "span";
  className?: string;
  staggerDelay?: number;
  transition?: Transition;
  once?: boolean;
  amount?: number;
}

const motionTags = {
  p: motion.p,
  h2: motion.h2,
  h3: motion.h3,
  span: motion.span,
};

export function HorizontalTextReveal({
  children,
  as: Tag = "p",
  className = "",
  staggerDelay = 0.04,
  transition = { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  once = true,
  amount = 0.5,
}: HorizontalTextRevealProps) {
  const MotionTag = motionTags[Tag];
  const words = children.split(" ");

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const child: Variants = {
    hidden: { y: "115%", filter: "blur(6px)", opacity: 0 },
    visible: {
      y: "0%",
      filter: "blur(0px)",
      opacity: 1,
      transition,
    },
  };

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="mr-[0.25em] inline-block overflow-hidden align-bottom"
        >
          <motion.span className="inline-block will-change-transform" variants={child}>
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

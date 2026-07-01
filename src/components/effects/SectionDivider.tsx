import { motion } from "framer-motion";

export function SectionDivider() {
  return (
    <div className="container mx-auto px-6">
      <motion.div
        className="h-px w-full origin-left bg-accent/60"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { LoadingLetters } from "@/components/effects/LoadingLetters";

export function PulloutLoader() {
  const status = useRouterState({ select: (s) => s.status });
  const [show, setShow] = useState(true);
  const [firstMount, setFirstMount] = useState(true);

  useEffect(() => {
    if (firstMount) {
      const t = setTimeout(() => setShow(false), 1100);
      const t2 = setTimeout(() => setFirstMount(false), 1500);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
  }, [firstMount]);

  useEffect(() => {
    if (firstMount) return;
    if (status === "pending") {
      const delay = setTimeout(() => setShow(true), 250);
      const hide = setTimeout(() => setShow(false), 900);
      return () => { clearTimeout(delay); clearTimeout(hide); };
    } else {
      setShow(false);
    }
  }, [status, firstMount]);

  return (
    <AnimatePresence>
      {show && firstMount && (
        <motion.div
          key="pullout-curtain"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.7, 0, 0.84, 0] } }}
        >
          <motion.div
            initial={{ filter: "blur(8px)", scale: 0.92, opacity: 0 }}
            animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6 text-foreground"
          >
            <LoadingLetters />
            <span className="font-mono-meta text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Welcome Onboard
            </span>
          </motion.div>
        </motion.div>
      )}
      {show && !firstMount && (
        <motion.div
          key="pullout-floating"
          className="pointer-events-none fixed bottom-6 right-6 z-[200]"
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 8, filter: "blur(6px)", transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0] } }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 rounded-full border border-border bg-background/80 px-4 py-2 text-foreground shadow-lg backdrop-blur-xl scale-75 origin-bottom-right">
            <LoadingLetters />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRAND } from "../../data/site";

/**
 * Brief branded curtain while the display fonts and hero poster load.
 * Never blocks for more than ~2.4s; skipped under reduced motion.
 */
export default function Preloader({ ready, reducedMotion, onDone }) {
  const [visible, setVisible] = useState(!reducedMotion);
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      onDone?.();
      return undefined;
    }
    const a = setTimeout(() => setMinElapsed(true), 1300);
    const cap = setTimeout(() => setVisible(false), 2400);
    return () => {
      clearTimeout(a);
      clearTimeout(cap);
    };
  }, [reducedMotion, onDone]);

  useEffect(() => {
    if (ready && minElapsed) setVisible(false);
  }, [ready, minElapsed]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[1100] flex flex-col items-center justify-center bg-vr-ink text-vr-ivory"
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <motion.p
            className="font-vr-deva text-[clamp(3rem,9vw,6rem)] leading-none text-vr-gold"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {BRAND.nameDeva}
          </motion.p>
          <motion.p
            className="mt-4 text-[0.7rem] uppercase tracking-[0.6em] text-vr-ivory/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {BRAND.name}
          </motion.p>
          <div className="mt-10 h-px w-40 overflow-hidden bg-vr-ivory/10">
            <motion.div
              className="h-full bg-vr-gold"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.3, ease: "easeInOut" }}
              style={{ transformOrigin: "left" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

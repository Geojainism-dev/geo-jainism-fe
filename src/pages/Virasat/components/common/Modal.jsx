import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useVirasat } from "../../hooks/useSmoothScroll";
import { useVT } from "../../i18n";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, video, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible overlay: portals to <body>, traps focus, closes on Esc or
 * backdrop click, locks page scroll (and pauses Lenis) while open, and
 * returns focus to the opener on close.
 */
export default function Modal({ open, onClose, label, children, variant = "panel", onKeyDown }) {
  const { lenisRef, reducedMotion } = useVirasat();
  const { v } = useVT();
  const panelRef = useRef(null);
  const openerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    openerRef.current = document.activeElement;
    lenisRef.current?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => panelRef.current?.querySelector(FOCUSABLE)?.focus(), 60);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = prevOverflow;
      lenisRef.current?.start();
      openerRef.current?.focus?.();
    };
  }, [open, lenisRef]);

  const handleKey = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key === "Tab" && panelRef.current) {
      const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    onKeyDown?.(e);
  };

  const dur = reducedMotion ? 0 : 0.45;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={`vr-modal vr-modal--${variant}`}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onKeyDown={handleKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: dur * 0.8 }}
        >
          <button type="button" className="vr-modal__backdrop" aria-label={v("modal.close", "Close")} tabIndex={-1} onClick={onClose} />
          <motion.div
            ref={panelRef}
            className="vr-modal__panel"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 36, scale: reducedMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
            transition={{ duration: dur, ease: [0.16, 1, 0.3, 1] }}
          >
            <button type="button" className="vr-modal__close" onClick={onClose} aria-label={v("modal.closeDialog", "Close dialog")}>
              <X size={20} strokeWidth={1.25} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

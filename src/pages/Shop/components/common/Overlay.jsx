import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible overlay used by the cart drawer, quick view, search, filters
 * and lightbox. Portals to <body> above the shared navbar, traps focus,
 * closes on Esc / backdrop, locks page scroll and restores focus.
 *
 * variant: "right" (drawer) · "left" (drawer) · "center" (modal) · "top" (search) · "full"
 */
const PANEL = {
  right: { cls: "absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-gj-ivory shadow-2xl", from: { x: "100%" }, to: { x: 0 } },
  left: { cls: "absolute inset-y-0 left-0 flex w-full max-w-[380px] flex-col bg-gj-ivory shadow-2xl", from: { x: "-100%" }, to: { x: 0 } },
  center: { cls: "relative max-h-[92svh] w-full max-w-[1040px] overflow-y-auto bg-gj-ivory shadow-2xl", from: { opacity: 0, y: 24 }, to: { opacity: 1, y: 0 } },
  top: { cls: "absolute inset-x-0 top-0 max-h-[88svh] overflow-y-auto bg-gj-ivory shadow-2xl", from: { y: "-100%" }, to: { y: 0 } },
  full: { cls: "gj-keep absolute inset-0 flex flex-col bg-[#14110f]", from: { opacity: 0 }, to: { opacity: 1 } },
};

export default function Overlay({ open, onClose, label, variant = "right", children, onKeyDown, showClose = true, closeTone = "dark" }) {
  const reduce = useReducedMotion();
  const panel = useRef(null);
  const opener = useRef(null);
  const p = PANEL[variant];

  useEffect(() => {
    if (!open) return undefined;
    opener.current = document.activeElement;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => (panel.current?.querySelector("[data-autofocus]") ?? panel.current?.querySelector(FOCUSABLE))?.focus(), 80);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = prev;
      opener.current?.focus?.();
    };
  }, [open]);

  const handleKey = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key === "Tab" && panel.current) {
      const nodes = [...panel.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
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

  const t = { duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className={`gj-layer ${variant === "center" ? "flex items-center justify-center p-4" : ""}`} role="dialog" aria-modal="true" aria-label={label} onKeyDown={handleKey} initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-[#1b1512]/55 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={t}
          />
          <motion.div ref={panel} className={p.cls} initial={reduce ? { opacity: 0 } : p.from} animate={reduce ? { opacity: 1 } : p.to} exit={reduce ? { opacity: 0 } : p.from} transition={t}>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className={`absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full transition-colors ${closeTone === "light" ? "text-gj-ivory hover:bg-white/10" : "text-gj-charcoal hover:bg-gj-beige"}`}
              >
                <X size={20} strokeWidth={1.4} />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

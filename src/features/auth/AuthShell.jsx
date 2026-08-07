import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const EASE = [0.16, 1, 0.3, 1];

export default function AuthShell({
  headline,
  subhead,
  children,
  orSuffix,
  onGoogleClick,
  promptText,
  promptLinkText,
  promptTo,
  shake,
}) {
  return (
    <div className="admin-shell flex min-h-screen items-center justify-center bg-[#1B1913] px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, x: shake ? [0, -6, 5, -4, 3, 0] : 0 }}
        transition={{
          opacity: { duration: 0.6, ease: EASE },
          y: { duration: 0.6, ease: EASE },
          x: { duration: 0.42, ease: "easeInOut" },
        }}
        className="flex w-full max-w-[1180px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_40px_90px_rgba(0,0,0,0.4)] min-[860px]:flex-row min-[860px]:min-h-[680px]"
      >
        <section className="box-border flex flex-col p-9 min-[860px]:w-[460px] min-[860px]:flex-none min-[860px]:p-16">
          <div className="mb-7 flex items-center gap-2.5">
            <img src="/logo.png" alt="" aria-hidden="true" className="h-7 w-7 rounded-full object-cover" />
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-sm tracking-wide text-[#3C3228]">
              GEO Jainism
            </span>
          </div>

          <h1 className="mb-2.5 flex items-center gap-2 text-2xl font-bold text-[#1F1D19]">
            {headline} <span aria-hidden="true">👋</span>
          </h1>
          <p className="mb-6 max-w-[340px] text-sm leading-relaxed text-[#8C7F6B]">{subhead}</p>

          {children}

          <div className="my-5 flex items-center gap-2.5 text-xs text-[#3C3228]/40">
            <div className="h-px flex-1 bg-[#3C3228]/10" />
            <span>Or {orSuffix}</span>
            <div className="h-px flex-1 bg-[#3C3228]/10" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-[42px] w-full gap-2.5 border-[#3C3228]/15 bg-[#FAF7F1] text-[#3C3228] hover:bg-[#F2EDE2]"
            onClick={onGoogleClick}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#EA4335" d="M9 3.6c1.32 0 2.5.45 3.44 1.34l2.55-2.55C13.35.98 11.32 0 9 0 5.48 0 2.44 2.02.96 4.96l2.97 2.3C4.6 5.13 6.6 3.6 9 3.6z" />
              <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.17-1.84H9v3.48h4.84c-.21 1.13-.85 2.09-1.81 2.73l2.79 2.16c1.63-1.5 2.82-3.73 2.82-6.53z" />
              <path fill="#FBBC05" d="M3.93 10.74a5.4 5.4 0 0 1-.28-1.74c0-.6.1-1.2.28-1.74L.96 4.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l2.97-2.3z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.16l-2.79-2.16c-.78.53-1.8.87-3.17.87-2.4 0-4.4-1.53-5.1-3.66L.96 13.04C2.44 15.98 5.48 18 9 18z" />
            </svg>
            Continue with Google
          </Button>

          <p className="mt-5 text-center text-[13px] text-[#8C7F6B]">
            {promptText}{" "}
            <Link to={promptTo} className="font-medium text-[#5C8F4E] hover:underline">
              {promptLinkText}
            </Link>
          </p>

          <div className="mt-auto pt-6 text-[11px] text-[#3C3228]/40">© {new Date().getFullYear()} All Rights Reserved</div>
        </section>

        <section className="relative min-h-[220px] flex-1 p-4">
          <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-gradient-to-br from-[#F5EBD8] via-[#EBDFC4] to-[#F2C4CE]">
            <img src="/login-bg.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </section>
      </motion.div>
    </div>
  );
}

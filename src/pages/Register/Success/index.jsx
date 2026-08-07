import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Calendar, MapPin, Ticket, ArrowRight } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";
import { useScreeningRegistrationByCode } from "@/features/screeningRegistrations/publicHooks";

export default function RegisterSuccessPage() {
  const { code } = useParams();
  const { data: registration, isLoading, isError } = useScreeningRegistrationByCode(code);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-16 sm:py-24">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Step Progress Bar matching form.webp column 3 */}
          <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-emerald-600 font-bold">✓</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Information
              </span>
            </div>

            <div className="h-[1.5px] flex-1 max-w-[60px] bg-emerald-500 mx-2" />

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-emerald-600 font-bold">✓</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Details
              </span>
            </div>

            <div className="h-[1.5px] flex-1 max-w-[60px] bg-slate-900 mx-2 dark:bg-slate-100" />

            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-2xs dark:bg-slate-100 dark:text-slate-900">
                3
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Completed
              </span>
            </div>
          </div>

          {/* Green Check Icon & Title */}
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-2xs dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-7 w-7 stroke-[2.2]" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
              {registration?.screening ? "Registration Confirmed!" : "Thanks for Reaching Out!"}
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              We've sent an invitation &amp; ticket details to your WhatsApp and email address.
            </p>
          </div>

          {isLoading && (
            <div className="py-8 text-center text-xs text-slate-400">
              Loading confirmation details...
            </div>
          )}

          {isError && (
            <div className="py-8 text-center text-xs text-rose-500">
              Could not retrieve registration details for code: {code}
            </div>
          )}

          {/* Confirmation Details Card matching form.webp column 3 */}
          {registration && (
            <div className="mt-6 space-y-6">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="divide-y divide-slate-200/70 text-xs dark:divide-slate-700/60">
                  <div className="flex items-center justify-between py-2.5">
                    <span className="font-semibold text-slate-500">Registration Code</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {registration.registrationCode}
                    </span>
                  </div>

                  {registration.screening && (
                    <>
                      <div className="flex items-center justify-between py-2.5">
                        <span className="font-semibold text-slate-500">Event Title</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-right">
                          {registration.screening.title}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2.5">
                        <span className="font-semibold text-slate-500">Date &amp; Time</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {registration.screening.localDate}, {registration.screening.localTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2.5">
                        <span className="font-semibold text-slate-500">Venue</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {registration.screening.venue}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between py-2.5">
                    <span className="font-semibold text-slate-500">Registered Name</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {registration.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <span className="font-semibold text-slate-500">Guests</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {registration.numberOfGuests || 1} Person(s)
                    </span>
                  </div>
                </div>
              </div>

              {/* Digital Pass Image if generated */}
              {registration.passImageUrl && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xs">
                  <img src={registration.passImageUrl} alt="Your Ticket Pass" className="w-full object-cover" />
                </div>
              )}

              {/* Action Button matching form.webp bottom outline button */}
              <div className="pt-2">
                <Link
                  to="/events"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Ticket className="h-4 w-4" />
                  <span>Browse More Events</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

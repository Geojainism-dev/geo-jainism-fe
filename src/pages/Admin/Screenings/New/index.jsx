import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Check, PartyPopper } from "lucide-react";
import ScreeningForm from "@/features/screenings/ScreeningForm";
import RsvpFieldsBuilder from "@/features/screenings/RsvpFieldsBuilder";
import { useCreateScreening } from "@/features/screenings/hooks";
import { zonedTimeToUtcISOString } from "@/lib/timezone";
import { useAuth } from "@/features/auth/AuthContext";

export default function AdminScreeningNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createScreening = useCreateScreening();
  const [createdScreening, setCreatedScreening] = useState(null);
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const handleSubmit = async (values) => {
    try {
      const screening = await createScreening.mutateAsync({
        ...values,
        date: zonedTimeToUtcISOString(values.date, values.timezone),
      });
      // A plain ADMIN can't use the RSVP builder (SUPER_ADMIN-only endpoint),
      // so there's no step 3 to show them — finish the flow immediately.
      if (!isSuperAdmin) {
        toast.success("Event created");
        navigate("/admin/events");
        return;
      }
      setCreatedScreening(screening);
      toast.success("Event created — add RSVP fields below, or finish now.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create event");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/events"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
            Create New Event
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {createdScreening
              ? "Step 3 of 3 — optionally add RSVP fields, then finish"
              : "Fill out event details, date & venue location"}
          </p>
        </div>
      </div>

      {createdScreening ? (
        <div className="w-full space-y-4">
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            <Check className="h-4 w-4 shrink-0" />
            "{createdScreening.title}" was created. Add RSVP fields now, or skip and finish.
          </div>

          <RsvpFieldsBuilder screeningId={createdScreening.id} initialFields={createdScreening.customFields} />

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/events")}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              Skip for now
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/events")}
              className="flex items-center gap-1.5 rounded-xl bg-[#0f2418] hover:bg-[#183624] text-white font-bold px-5 py-2.5 text-sm shadow-md transition-colors dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <PartyPopper className="h-4 w-4" /> Finish
            </button>
          </div>
        </div>
      ) : (
        <ScreeningForm onSubmit={handleSubmit} isSubmitting={createScreening.isPending} submitLabel="Create Event" />
      )}
    </div>
  );
}

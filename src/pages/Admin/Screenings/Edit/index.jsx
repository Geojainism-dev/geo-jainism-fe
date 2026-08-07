import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import ScreeningForm from "@/features/screenings/ScreeningForm";
import RsvpFieldsBuilder from "@/features/screenings/RsvpFieldsBuilder";
import { useScreening, useUpdateScreening } from "@/features/screenings/hooks";
import { zonedTimeToUtcISOString, utcToZonedDateTimeLocalValue } from "@/lib/timezone";
import { useAuth } from "@/features/auth/AuthContext";

export default function AdminScreeningEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: screening, isLoading } = useScreening(id);
  const updateScreening = useUpdateScreening(id);

  const handleSubmit = async (values) => {
    try {
      await updateScreening.mutateAsync({
        ...values,
        date: zonedTimeToUtcISOString(values.date, values.timezone),
      });
      toast.success("Event updated");
      navigate("/admin/events");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update event");
    }
  };

  if (isLoading) return <p className="text-sm text-muted-foreground p-8 text-center">Loading event data...</p>;
  if (!screening) return <p className="text-sm text-destructive p-8 text-center">Event not found.</p>;

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
            Edit Event: {screening.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Update event information, time &amp; location
          </p>
        </div>
      </div>

      <ScreeningForm
        defaultValues={{
          title: screening.title ?? "",
          description: screening.description ?? "",
          image: screening.image ?? "",
          date: utcToZonedDateTimeLocalValue(screening.date, screening.timezone),
          timezone: screening.timezone,
          venue: screening.venue,
          venueAddress: screening.venueAddress ?? "",
          city: screening.city ?? "",
          country: screening.country ?? "",
          capacity: screening.capacity ?? "",
          isActive: screening.isActive,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateScreening.isPending}
        submitLabel="Save Changes"
      />

      {user?.role === "SUPER_ADMIN" ? (
        <RsvpFieldsBuilder screeningId={id} initialFields={screening.customFields} />
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
          <ShieldAlert className="h-5 w-5 shrink-0 text-slate-400" />
          Only Super Admins can edit this event's RSVP fields.
        </div>
      )}
    </div>
  );
}

import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useScreeningRegistration,
  useResendScreeningRegistration,
} from "@/features/screeningRegistrations/adminHooks";
import { useScreening } from "@/features/screenings/hooks";

const formatCustomFieldValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return String(value);
};

const statusVariant = (status) => {
  if (status === "SENT" || status === "CHECKED_IN") return "success";
  if (status === "FAILED" || status === "CANCELLED") return "destructive";
  if (status === "REGISTERED") return "info";
  return "secondary";
};

export default function AdminScreeningRegistrationDetail() {
  const { id } = useParams();
  const { data: registration, isLoading, isError } = useScreeningRegistration(id);
  const resend = useResendScreeningRegistration();
  const { data: screening } = useScreening(registration?.screening?.id);

  const handleResend = async () => {
    try {
      await resend.mutateAsync(id);
      toast.success("Resend attempted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Resend failed");
    }
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (isError || !registration) return <p className="text-sm text-destructive">Registration not found.</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">{registration.name}</h1>
      <p className="text-sm text-muted-foreground">Registration code: {registration.registrationCode}</p>

      <dl className="mt-6 space-y-3 text-sm">
        <div>
          <dt className="font-medium">Phone</dt>
          <dd className="text-muted-foreground">{registration.phoneNumber}</dd>
        </div>
        <div>
          <dt className="font-medium">Email</dt>
          <dd className="text-muted-foreground">{registration.email}</dd>
        </div>
        <div>
          <dt className="font-medium">Guests</dt>
          <dd className="text-muted-foreground">{registration.numberOfGuests}</dd>
        </div>
        <div>
          <dt className="font-medium">Address</dt>
          <dd className="text-muted-foreground">
            {registration.address}
            {registration.landmark ? `, ${registration.landmark}` : ""}, {registration.city}, {registration.district},{" "}
            {registration.state} - {registration.pincode}
          </dd>
        </div>
        <div>
          <dt className="font-medium">Event</dt>
          <dd className="text-muted-foreground">
            {registration.screening ? registration.screening.title : "— (organiser/info-only submission)"}
          </dd>
        </div>
        {screening?.customFields?.length > 0 && (
          <div>
            <dt className="font-medium">RSVP answers</dt>
            <dd className="mt-1 space-y-2 rounded-md border border-border p-3">
              {screening.customFields.map((field) => (
                <div key={field.key} className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">{field.label}</span>
                  <span className="text-right font-medium">
                    {formatCustomFieldValue(registration.customFieldResponses?.[field.key])}
                  </span>
                </div>
              ))}
            </dd>
          </div>
        )}

        <div>
          <dt className="font-medium">Status</dt>
          <dd>
            <Badge variant={statusVariant(registration.status)}>{registration.status}</Badge>
          </dd>
        </div>
        <div>
          <dt className="font-medium">WhatsApp</dt>
          <dd className="text-muted-foreground">
            <Badge variant={statusVariant(registration.whatsappStatus)}>{registration.whatsappStatus}</Badge>
            {registration.whatsappError && <span className="ml-2 text-destructive">{registration.whatsappError}</span>}
          </dd>
        </div>
        <div>
          <dt className="font-medium">Email delivery</dt>
          <dd className="text-muted-foreground">
            <Badge variant={statusVariant(registration.emailStatus)}>{registration.emailStatus}</Badge>
            {registration.emailError && <span className="ml-2 text-destructive">{registration.emailError}</span>}
          </dd>
        </div>
      </dl>

      {registration.passImageUrl && (
        <img src={registration.passImageUrl} alt="Pass" className="mt-4 max-w-xs rounded-md border" />
      )}

      {registration.screening && (
        <Button className="mt-6" onClick={handleResend} disabled={resend.isPending}>
          {resend.isPending ? "Resending..." : "Resend Pass"}
        </Button>
      )}
    </div>
  );
}

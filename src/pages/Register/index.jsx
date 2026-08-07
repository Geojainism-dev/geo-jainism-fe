import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Navbar, Footer } from "@/components/layout";
import RegistrationForm from "@/features/screeningRegistrations/RegistrationForm";
import { useCreateScreeningRegistration } from "@/features/screeningRegistrations/publicHooks";
import { cleanCustomFieldResponses } from "@/features/screeningRegistrations/registrationSchema";
import { usePublicScreening } from "@/features/publicScreenings/hooks";

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const screeningId = searchParams.get("screeningId") || undefined;
  const { data: screening, isLoading: isScreeningLoading } = usePublicScreening(screeningId);
  const navigate = useNavigate();
  const createRegistration = useCreateScreeningRegistration();
  const [customFieldBannerErrors, setCustomFieldBannerErrors] = useState([]);
  const customFields = screening?.customFields ?? [];

  const handleSubmit = async (values) => {
    const { website, customFieldResponses, ...data } = values;
    if (website) {
      // Honeypot tripped — pretend success without hitting the API, so bots don't learn.
      toast.success("Registration successful");
      return;
    }
    setCustomFieldBannerErrors([]);
    const payload = screeningId
      ? { ...data, customFieldResponses: cleanCustomFieldResponses(customFieldResponses, customFields) }
      : data;
    try {
      const registration = await createRegistration.mutateAsync(payload);
      navigate(`/register/success/${registration.registrationCode}`);
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("Too many attempts. Please try again in a while.");
        return;
      }
      const errors = error.response?.data?.errors ?? [];
      // Custom-field validation errors always come back tagged with the group
      // field, not the individual key — show them as a banner near that section.
      const customErrors = errors.filter((e) => e.field === "customFieldResponses").map((e) => e.message);
      if (customErrors.length) setCustomFieldBannerErrors(customErrors);

      const otherError = errors.find((e) => e.field !== "customFieldResponses");
      if (otherError || !customErrors.length) {
        toast.error(otherError?.message || error.response?.data?.message || "Failed to submit registration");
      }
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-24">
        <h1 className="text-3xl font-semibold">Registration</h1>
        {screening ? (
          <p className="mt-2 text-muted-foreground">
            Registering for <strong>{screening.title}</strong> — {screening.localDate}, {screening.localTime} at{" "}
            {screening.venue}
          </p>
        ) : (
          <p className="mt-2 text-muted-foreground">
            Fill out this form to register for an event, volunteer to organize one, or request information.
          </p>
        )}
        <div className="mt-8">
          {screeningId && isScreeningLoading ? (
            <p className="text-sm text-muted-foreground">Loading event details...</p>
          ) : (
            <RegistrationForm
              screeningId={screeningId}
              customFields={customFields}
              customFieldBannerErrors={customFieldBannerErrors}
              onSubmit={handleSubmit}
              isSubmitting={createRegistration.isPending}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

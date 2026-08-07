import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import TimezoneSelect from "@/components/ui/TimezoneSelect";
import { screeningFormSchema } from "@/features/screenings/schema";
import { uploadScreeningImage } from "@/features/screenings/api";
import { HelpCircle, Upload, ArrowLeft, ArrowRight, Check } from "lucide-react";

const STEPS = [
  { id: 1, label: "Information", fields: ["title", "description", "image"] },
  {
    id: 2,
    label: "Venue & Time",
    fields: ["date", "timezone", "venue", "venueAddress", "city", "country", "capacity", "isActive"],
  },
];

// Shown after the two real steps as a preview of what comes next once this
// screening is saved — RSVP Fields lives outside this form (it needs a real
// screening id to save against), so it's informational here, never active.
const RSVP_PREVIEW_STEP = { id: 3, label: "RSVP Fields" };

export default function ScreeningForm({ defaultValues, onSubmit, isSubmitting, submitLabel }) {
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(screeningFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      date: "",
      timezone: "",
      venue: "",
      venueAddress: "",
      city: "",
      country: "",
      capacity: "",
      isActive: true,
      ...defaultValues,
    },
  });

  const image = watch("image");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const media = await uploadScreeningImage(file);
      setValue("image", media.url, { shouldValidate: true });
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const goNext = async () => {
    const current = STEPS.find((s) => s.id === step);
    const valid = await trigger(current.fields);
    if (!valid) return;
    const nextStep = Math.min(step + 1, STEPS.length);
    setStep(nextStep);
    const nextStepFields = STEPS.find((s) => s.id === nextStep)?.fields ?? [];
    // trigger()'s whole-schema validation (see comment above) finishes
    // updating react-hook-form's internal error store slightly after its
    // promise resolves — clearing synchronously here can race and lose to
    // that pending update, so defer to the next macrotask.
    setTimeout(() => clearErrors(nextStepFields), 0);
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const goToStep = (targetId) => {
    if (targetId < step) setStep(targetId);
  };

  const onInvalid = (formErrors) => {
    const errorFields = Object.keys(formErrors);
    const stepWithError = STEPS.find((s) => s.fields.some((f) => errorFields.includes(f)));
    if (stepWithError) setStep(stepWithError.id);
  };

  return (
    <div className="w-full rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Step Progress Bar — steps 1-2 are this form; RSVP Fields (3) is a
          preview of the step that follows once the event is saved. */}
      <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6 dark:border-slate-800">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => goToStep(s.id)}
              disabled={s.id >= step}
              className={`flex items-center gap-2 ${s.id < step ? "cursor-pointer" : "cursor-default"}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-2xs transition-colors ${
                  s.id === step
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : s.id < step
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                }`}
              >
                {s.id < step ? <Check className="h-3.5 w-3.5" /> : s.id}
              </div>
              <span
                className={`text-xs font-bold whitespace-nowrap ${
                  s.id === step
                    ? "text-slate-900 dark:text-slate-100"
                    : s.id < step
                    ? "text-slate-600 dark:text-slate-300"
                    : "text-slate-400 font-semibold"
                }`}
              >
                {s.label}
              </span>
            </button>
            <div
              className={`h-[1.5px] flex-1 max-w-[60px] mx-2 ${
                s.id < step ? "bg-emerald-600" : "bg-slate-200 dark:bg-slate-700"
              }`}
            />
          </div>
        ))}

        <div className="flex items-center flex-1 last:flex-none opacity-60">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400 dark:bg-slate-800">
              {RSVP_PREVIEW_STEP.id}
            </div>
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">{RSVP_PREVIEW_STEP.label}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-5">
        {step === 1 && (
          <>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Your Information</h2>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="title"
                placeholder="Tamil Jains Documentary Screening"
                {...register("title")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              {errors.title && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5"
              >
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Write event description and screening schedule details..."
                {...register("description")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              {errors.description && (
                <p className="mt-1 text-xs font-semibold text-rose-500">{errors.description.message}</p>
              )}
            </div>

            {/* Promotional Image */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-700 dark:bg-slate-800/50">
              <label htmlFor="imageFile" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                Promotional Image
              </label>
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white p-6 text-center hover:border-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-900">
                <Upload className="h-8 w-8 text-slate-400 mb-2" />
                <input
                  id="imageFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="text-xs text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-slate-800 cursor-pointer"
                />
                {uploading && <p className="mt-2 text-xs font-semibold text-emerald-600">Uploading image...</p>}
              </div>
              {image && (
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 shadow-2xs max-w-sm">
                  <img src={image} alt="Screening preview" className="h-40 w-full object-cover" />
                </div>
              )}
              {errors.image && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.image.message}</p>}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Venue &amp; Time</h2>

            {/* Date & Timezone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Date &amp; Time <span className="text-rose-500">*</span>
                </label>
                <input
                  id="date"
                  type="datetime-local"
                  {...register("date")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                {errors.date && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.date.message}</p>}
              </div>

              <div>
                <label
                  htmlFor="timezone"
                  className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5"
                >
                  Timezone <span className="text-rose-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="timezone"
                  render={({ field }) => (
                    <TimezoneSelect
                      id="timezone"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.timezone?.message}
                    />
                  )}
                />
                {errors.timezone && (
                  <p className="mt-1 text-xs font-semibold text-rose-500">{errors.timezone.message}</p>
                )}
              </div>
            </div>

            {/* Venue */}
            <div>
              <label htmlFor="venue" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Venue <span className="text-rose-500">*</span>
              </label>
              <input
                id="venue"
                placeholder="e.g. Alliance Française de Madras Auditorium"
                {...register("venue")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              {errors.venue && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.venue.message}</p>}
            </div>

            {/* Venue Address */}
            <div>
              <label
                htmlFor="venueAddress"
                className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5"
              >
                Venue Address
              </label>
              <input
                id="venueAddress"
                placeholder="24, College Road, Nungambakkam"
                {...register("venueAddress")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* City & Country */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  City
                </label>
                <input
                  id="city"
                  placeholder="Chennai"
                  {...register("city")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5"
                >
                  Country
                </label>
                <input
                  id="country"
                  placeholder="India"
                  {...register("country")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label
                htmlFor="capacity"
                className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5"
              >
                Capacity <span className="text-rose-500">*</span>
              </label>
              <input
                id="capacity"
                type="number"
                min="1"
                placeholder="150"
                {...register("capacity")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              {errors.capacity && (
                <p className="mt-1 text-xs font-semibold text-rose-500">{errors.capacity.message}</p>
              )}
            </div>

            {/* Active Toggle Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <Checkbox
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-emerald-700"
                    />
                  )}
                />
                <label htmlFor="isActive" className="cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                  Active (Visible for public registration)
                </label>
              </div>
            </div>
          </>
        )}

        {/* Step Navigation */}
        <div className="flex items-center gap-3 pt-3">
          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          )}

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={goNext}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#0f2418] hover:bg-[#183624] text-white font-bold py-3.5 text-sm shadow-md transition-colors cursor-pointer dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-[#0f2418] hover:bg-[#183624] text-white font-bold py-3.5 text-sm shadow-md transition-colors cursor-pointer disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          )}
        </div>

        {/* Bottom Helper Link */}
        <div className="flex items-center justify-center pt-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
            <HelpCircle className="h-3.5 w-3.5" /> Need Support?
          </span>
        </div>
      </form>
    </div>
  );
}

import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HelpCircle, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  createRegistrationFormSchema,
  defaultCustomFieldResponses,
} from "@/features/screeningRegistrations/registrationSchema";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";
const labelClass = "block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5";
const errorClass = "mt-1 text-xs font-semibold text-rose-500";

// Renders the one control the RSVP contract specifies for a given custom
// field type (section 3 of the backend spec) bound to customFieldResponses.<key>.
function CustomFieldControl({ field, control, register, error }) {
  const name = `customFieldResponses.${field.key}`;
  const requiredMark = field.required && <span className="text-rose-500">*</span>;

  if (field.type === "CHECKBOX") {
    return (
      <div>
        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name={name}
            render={({ field: cf }) => (
              <Checkbox
                id={name}
                checked={cf.value}
                onCheckedChange={cf.onChange}
                className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-emerald-600"
              />
            )}
          />
          <label htmlFor={name} className="cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
            {field.label} {requiredMark}
          </label>
        </div>
        {error && <p className={errorClass}>{error}</p>}
      </div>
    );
  }

  if (field.type === "RADIO") {
    return (
      <div>
        <label className={labelClass}>
          {field.label} {requiredMark}
        </label>
        <Controller
          control={control}
          name={name}
          render={({ field: rf }) => (
            <RadioGroup value={rf.value} onValueChange={rf.onChange} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {field.options.map((option) => (
                <label
                  key={option}
                  htmlFor={`${name}-${option}`}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs font-semibold text-slate-800 hover:bg-white hover:border-slate-300 cursor-pointer transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RadioGroupItem value={option} id={`${name}-${option}`} />
                  <span>{option}</span>
                </label>
              ))}
            </RadioGroup>
          )}
        />
        {error && <p className={errorClass}>{error}</p>}
      </div>
    );
  }

  if (field.type === "MULTISELECT") {
    return (
      <div>
        <label className={labelClass}>
          {field.label} {requiredMark}
        </label>
        <Controller
          control={control}
          name={name}
          render={({ field: mf }) => (
            <div className="flex flex-wrap gap-2">
              {field.options.map((option) => {
                const checked = (mf.value ?? []).includes(option);
                return (
                  <label
                    key={option}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-800 cursor-pointer transition-all hover:bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(isChecked) => {
                        const next = isChecked
                          ? [...(mf.value ?? []), option]
                          : (mf.value ?? []).filter((o) => o !== option);
                        mf.onChange(next);
                      }}
                      className="h-4 w-4 rounded-md border-slate-300 data-[state=checked]:bg-emerald-600"
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          )}
        />
        {error && <p className={errorClass}>{error}</p>}
      </div>
    );
  }

  if (field.type === "SELECT") {
    return (
      <div>
        <label htmlFor={name} className={labelClass}>
          {field.label} {requiredMark}
        </label>
        <select id={name} {...register(name)} className={inputClass}>
          <option value="">Select...</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <p className={errorClass}>{error}</p>}
      </div>
    );
  }

  if (field.type === "TEXTAREA") {
    return (
      <div>
        <label htmlFor={name} className={labelClass}>
          {field.label} {requiredMark}
        </label>
        <textarea id={name} rows={3} {...register(name)} className={inputClass} />
        {error && <p className={errorClass}>{error}</p>}
      </div>
    );
  }

  const inputType = { NUMBER: "number", EMAIL: "email", PHONE: "tel", DATE: "date" }[field.type] ?? "text";
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {field.label} {requiredMark}
      </label>
      <input
        id={name}
        type={inputType}
        placeholder={field.type === "PHONE" ? "+919876543210" : undefined}
        {...register(name)}
        className={inputClass}
      />
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

export default function RegistrationForm({
  screeningId,
  customFields = [],
  customFieldBannerErrors = [],
  onSubmit,
  isSubmitting,
}) {
  // customFields is fixed for the lifetime of this form instance — the parent
  // only mounts it once the selected screening (and its field list) is loaded,
  // so defaultValues below always match the schema built here.
  const schema = useMemo(() => createRegistrationFormSchema(customFields), [customFields]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      screeningId,
      name: "",
      phoneNumber: "",
      email: "",
      numberOfGuests: 1,
      address: "",
      landmark: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      customFieldResponses: defaultCustomFieldResponses(customFields),
      website: "",
    },
  });

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Step Progress Bar matching form.webp */}
      <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-2xs dark:bg-slate-100 dark:text-slate-900">
            1
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Contact Details
          </span>
        </div>

        <div className="h-[1.5px] flex-1 max-w-[60px] bg-slate-200 mx-2 dark:bg-slate-700" />

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400 dark:bg-slate-800">
            2
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Address
          </span>
        </div>

        <div className="h-[1.5px] flex-1 max-w-[60px] bg-slate-200 mx-2 dark:bg-slate-700" />

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400 dark:bg-slate-800">
            3
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Completed
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Honeypot — visually hidden (clip + 1px box) rather than display:none,
            since naive scrapers that autofill "visible" fields skip display:none
            but not this. Avoids the horizontal-scroll footgun of left:-9999px. */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        {/* Section 1: Contact Information */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Your Information
          </h2>

          <div>
            <label htmlFor="name" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="name"
              placeholder="e.g. Clayton Duran"
              {...register("name")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.name && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="phoneNumber" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                WhatsApp Mobile <span className="text-rose-500">*</span>
              </label>
              <input
                id="phoneNumber"
                placeholder="+91 98765 43210"
                {...register("phoneNumber")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs font-semibold text-rose-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                {...register("email")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              {errors.email && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="numberOfGuests" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Number of Guests (including yourself)
            </label>
            <input
              id="numberOfGuests"
              type="number"
              min="1"
              max="10"
              {...register("numberOfGuests")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Section 2: Address Information */}
        <div className="space-y-4 pt-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Address Details
          </h2>

          <div>
            <label htmlFor="address" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Address Line <span className="text-rose-500">*</span>
            </label>
            <input
              id="address"
              placeholder="Street address or building details..."
              {...register("address")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.address && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.address.message}</p>}
          </div>

          <div>
            <label htmlFor="landmark" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Landmark
            </label>
            <input
              id="landmark"
              placeholder="Nearby landmark (optional)"
              {...register("landmark")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            {errors.landmark && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.landmark.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                id="city"
                placeholder="Chennai"
                {...register("city")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              {errors.city && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.city.message}</p>}
            </div>

            <div>
              <label htmlFor="district" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                District <span className="text-rose-500">*</span>
              </label>
              <input
                id="district"
                placeholder="Chennai"
                {...register("district")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              {errors.district && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.district.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="state" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                id="state"
                placeholder="Tamil Nadu"
                {...register("state")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              {errors.state && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.state.message}</p>}
            </div>

            <div>
              <label htmlFor="pincode" className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Pincode <span className="text-rose-500">*</span>
              </label>
              <input
                id="pincode"
                placeholder="600001"
                {...register("pincode")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              {errors.pincode && <p className="mt-1 text-xs font-semibold text-rose-500">{errors.pincode.message}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: Screening-specific custom questions */}
        {customFields.length > 0 && (
          <div className="space-y-4 pt-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Additional Questions</h2>

            {customFieldBannerErrors.length > 0 && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
              >
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <div className="space-y-0.5">
                  {customFieldBannerErrors.map((message, i) => (
                    <p key={i}>{message}</p>
                  ))}
                </div>
              </div>
            )}

            {customFields.map((field) => (
              <CustomFieldControl
                key={field.key}
                field={field}
                control={control}
                register={register}
                error={errors.customFieldResponses?.[field.key]?.message}
              />
            ))}
          </div>
        )}

        {/* Submit Button matching form.webp dark forest green pill button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-[#0f2418] hover:bg-[#183624] text-white font-bold py-3.5 text-sm shadow-md transition-colors cursor-pointer disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {isSubmitting ? "Submitting..." : "Next Step"}
          </button>
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

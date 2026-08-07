import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, X, ListChecks } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { rsvpFieldsFormSchema, RSVP_FIELD_TYPES, RSVP_OPTION_TYPES } from "@/features/screenings/schema";
import { useUpdateScreeningRsvpFields } from "@/features/screenings/hooks";

const MAX_FIELDS = 20;

const slugify = (label) =>
  (label || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);

const emptyField = () => ({ key: "", label: "", type: "TEXT", required: false, options: [] });

function OptionsInput({ value, onChange, error }) {
  const [draft, setDraft] = useState("");

  const addOption = () => {
    const trimmed = draft.trim();
    if (!trimmed || value.includes(trimmed)) {
      setDraft("");
      return;
    }
    onChange([...value, trimmed]);
    setDraft("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((option, i) => (
          <span
            key={`${option}-${i}`}
            className="flex items-center gap-1 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
          >
            {option}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, oi) => oi !== i))}
              className="text-slate-400 hover:text-rose-500"
              aria-label={`Remove option ${option}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {value.length === 0 && <p className="text-xs text-slate-400">No options added yet.</p>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addOption();
            }
          }}
          placeholder="Type an option and press Enter"
          className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <button
          type="button"
          onClick={addOption}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          Add
        </button>
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-rose-500">{error}</p>}
    </div>
  );
}

export default function RsvpFieldsBuilder({ screeningId, initialFields }) {
  const updateRsvpFields = useUpdateScreeningRsvpFields(screeningId);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(rsvpFieldsFormSchema),
    defaultValues: { customFields: initialFields?.length ? initialFields : [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "customFields" });
  const values = watch("customFields");

  const onSave = async (data) => {
    try {
      await updateRsvpFields.mutateAsync(data.customFields);
      toast.success("RSVP fields saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save RSVP fields");
    }
  };

  return (
    <div className="w-full rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <ListChecks className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">RSVP Fields</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Custom questions attendees answer on top of the standard registration form. Up to {MAX_FIELDS} fields.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="space-y-4">
        {fields.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-800/40">
            No custom fields yet. Add one below.
          </p>
        )}

        {fields.map((field, index) => {
          const type = values?.[index]?.type;
          const label = values?.[index]?.label;
          const fieldErrors = errors.customFields?.[index];

          return (
            <div
              key={field.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/50"
            >
              <div className="flex items-start gap-3">
                <GripVertical className="mt-2.5 h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />

                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                        Label <span className="text-rose-500">*</span>
                      </label>
                      <input
                        placeholder="T-shirt size"
                        {...register(`customFields.${index}.label`, {
                          onChange: (e) => {
                            const current = values?.[index]?.key;
                            const autoKey = slugify(label);
                            // Only auto-fill the key while it still matches what we last
                            // derived from the label — once the admin edits it directly,
                            // stop overwriting their choice.
                            if (!current || current === autoKey) {
                              setValue(`customFields.${index}.key`, slugify(e.target.value));
                            }
                          },
                        })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                      {fieldErrors?.label && (
                        <p className="mt-1 text-xs font-semibold text-rose-500">{fieldErrors.label.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                        Key <span className="text-rose-500">*</span>
                      </label>
                      <input
                        placeholder="tshirt_size"
                        {...register(`customFields.${index}.key`)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                      {fieldErrors?.key ? (
                        <p className="mt-1 text-xs font-semibold text-rose-500">{fieldErrors.key.message}</p>
                      ) : (
                        <p className="mt-1 text-[11px] text-slate-400">Storage key — not shown to attendees.</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                        Type
                      </label>
                      <select
                        {...register(`customFields.${index}.type`, {
                          onChange: (e) => {
                            if (!RSVP_OPTION_TYPES.includes(e.target.value)) {
                              setValue(`customFields.${index}.options`, []);
                            }
                          },
                        })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      >
                        {RSVP_FIELD_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end pb-2.5">
                      <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <Controller
                          control={control}
                          name={`customFields.${index}.required`}
                          render={({ field: rf }) => (
                            <Checkbox
                              checked={rf.value}
                              onCheckedChange={rf.onChange}
                              className="h-4 w-4 rounded-md border-slate-300 data-[state=checked]:bg-emerald-600"
                            />
                          )}
                        />
                        Required
                      </label>
                    </div>
                  </div>

                  {RSVP_OPTION_TYPES.includes(type) && (
                    <div>
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                        Options <span className="text-rose-500">*</span>
                      </label>
                      <Controller
                        control={control}
                        name={`customFields.${index}.options`}
                        render={({ field: of }) => (
                          <OptionsInput
                            value={of.value ?? []}
                            onChange={of.onChange}
                            error={fieldErrors?.options?.message}
                          />
                        )}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label="Remove field"
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {errors.customFields?.message && (
          <p className="text-xs font-semibold text-rose-500">{errors.customFields.message}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => append(emptyField())}
            disabled={fields.length >= MAX_FIELDS}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <Plus className="h-3.5 w-3.5" /> Add field
          </button>
          <span className="text-xs text-slate-400">
            {fields.length}/{MAX_FIELDS} fields
          </span>

          <div className="ml-auto">
            <button
              type="submit"
              disabled={updateRsvpFields.isPending || !isDirty}
              className="rounded-xl bg-[#0f2418] hover:bg-[#183624] text-white font-bold px-5 py-2.5 text-sm shadow-md transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              {updateRsvpFields.isPending ? "Saving..." : "Save RSVP Fields"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

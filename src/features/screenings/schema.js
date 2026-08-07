import { z } from "zod";

// Intl.supportedValuesOf("timeZone") enumerates a canonical list that varies
// by browser/ICU version — some builds return "Asia/Calcutta" instead of the
// modern "Asia/Kolkata" (same zone, legacy alias), which would wrongly reject
// a valid input if we only checked membership in that list. Constructing an
// Intl.DateTimeFormat is the robust way to validate: it accepts canonical
// names and legacy aliases alike, matching what the browser actually honors.
const isValidTimeZone = (tz) => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

const optionalString = (max) =>
  z.preprocess((v) => (v === "" ? undefined : v), z.string().max(max).optional());

const optionalUrl = (max) =>
  z.preprocess((v) => (v === "" ? undefined : v), z.string().max(max).url("Must be a valid URL").optional());

export const screeningFormSchema = z.object({
  title: optionalString(255),
  description: optionalString(2000),
  image: optionalUrl(2000),
  date: z.string().min(1, "Date is required"),
  timezone: z
    .string({ required_error: "Timezone is required" })
    .min(1, "Timezone is required")
    .refine(isValidTimeZone, "Enter a valid IANA timezone, e.g. Asia/Kolkata"),
  venue: z.string().min(1, "Venue is required").max(255),
  venueAddress: optionalString(500),
  city: optionalString(120),
  country: optionalString(120),
  capacity: z.preprocess(
    (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
    z.number().int().positive().optional()
  ),
  isActive: z.boolean(),
});

// ─── RSVP field builder ────────────────────────────────────────────────────
// Mirrors the backend contract for PUT /admin/screenings/:id/rsvp-fields exactly:
// key is the storage key (not shown to attendees), label is what attendees see.

export const RSVP_FIELD_TYPES = [
  { value: "TEXT", label: "Short text" },
  { value: "TEXTAREA", label: "Long text" },
  { value: "NUMBER", label: "Number" },
  { value: "EMAIL", label: "Email" },
  { value: "PHONE", label: "Phone" },
  { value: "DATE", label: "Date" },
  { value: "SELECT", label: "Dropdown" },
  { value: "RADIO", label: "Radio group" },
  { value: "MULTISELECT", label: "Multi-select" },
  { value: "CHECKBOX", label: "Checkbox" },
];

export const RSVP_OPTION_TYPES = ["SELECT", "RADIO", "MULTISELECT"];

const KEY_REGEX = /^[a-zA-Z0-9_]+$/;

export const rsvpFieldSchema = z
  .object({
    key: z
      .string({ required_error: "Key is required" })
      .min(1, "Key is required")
      .max(60, "Key must be 60 characters or fewer")
      .regex(KEY_REGEX, "Only letters, numbers, and underscores are allowed"),
    label: z.string({ required_error: "Label is required" }).min(1, "Label is required").max(200),
    type: z.enum(RSVP_FIELD_TYPES.map((t) => t.value)),
    required: z.boolean().default(false),
    options: z.array(z.string().min(1, "Option can't be empty")).max(50).optional().default([]),
  })
  .superRefine((field, ctx) => {
    if (RSVP_OPTION_TYPES.includes(field.type) && field.options.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Add at least one option", path: ["options"] });
    }
  });

export const rsvpFieldsFormSchema = z
  .object({
    customFields: z.array(rsvpFieldSchema).max(20, "Maximum 20 fields allowed"),
  })
  .superRefine((data, ctx) => {
    const keys = data.customFields.map((f) => f.key);
    data.customFields.forEach((field, index) => {
      if (keys.indexOf(field.key) !== index) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Key must be unique",
          path: ["customFields", index, "key"],
        });
      }
    });
  });

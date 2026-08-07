import { z } from "zod";

const optionalString = (max) =>
  z.preprocess((v) => (v === "" ? undefined : v), z.string().max(max).optional());

const baseSchema = z.object({
  screeningId: z.string().uuid().optional(),

  name: z.string({ required_error: "Name is required" }).min(1, "Name is required").max(150),
  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .regex(/^\+[1-9]\d{7,14}$/, "Enter a valid phone number in international format, e.g. +919876543210"),
  email: z.string({ required_error: "Email is required" }).email("Enter a valid email address"),
  numberOfGuests: z.coerce.number().int().min(1).max(10).optional().default(1),

  address: z.string({ required_error: "Address is required" }).min(1, "Address is required").max(500),
  landmark: optionalString(200),
  city: z.string({ required_error: "City is required" }).min(1, "City is required").max(120),
  district: z.string({ required_error: "District is required" }).min(1, "District is required").max(120),
  state: z.string({ required_error: "State is required" }).min(1, "State is required").max(120),
  pincode: z.string({ required_error: "Pincode is required" }).min(1, "Pincode is required").max(20),

  // Honeypot — hidden off-screen on the real form; bots that autofill every field trip it.
  website: z.string().optional().default(""),
});

const emptyToUndefined = (v) => (v === "" || v === undefined || v === null ? undefined : v);

// Builds a zod schema for one customFields entry, matching the backend's
// per-type rules (section 3 of the RSVP contract) so client-side errors read
// the same as what the server would reject.
const customFieldSchemaFor = (field) => {
  const { type, required, label } = field;
  const requiredMsg = `${label} is required`;

  switch (type) {
    case "NUMBER": {
      const num = z.coerce.number({ invalid_type_error: `${label} must be a number` });
      return z.preprocess(
        emptyToUndefined,
        required ? num.refine(Number.isFinite, requiredMsg) : num.optional()
      );
    }
    case "EMAIL": {
      const email = z.string().email(`Enter a valid email for ${label}`);
      return required ? email.min(1, requiredMsg) : z.preprocess(emptyToUndefined, email.optional());
    }
    case "PHONE": {
      const phone = z.string().regex(/^\+[1-9]\d{7,14}$/, `Enter a valid phone number for ${label}`);
      return required ? phone : z.preprocess(emptyToUndefined, phone.optional());
    }
    case "CHECKBOX":
      return required
        ? z.boolean().refine((v) => v === true, requiredMsg)
        : z.boolean().optional().default(false);
    case "MULTISELECT": {
      const arr = z.array(z.string());
      return required ? arr.min(1, requiredMsg) : arr.optional().default([]);
    }
    case "SELECT":
    case "RADIO":
    case "DATE":
    case "TEXTAREA":
    case "TEXT":
    default: {
      const str = z.string();
      return required ? str.min(1, requiredMsg) : z.preprocess(emptyToUndefined, str.optional());
    }
  }
};

export const buildCustomFieldsSchema = (customFields = []) => {
  const shape = {};
  for (const field of customFields) {
    shape[field.key] = customFieldSchemaFor(field);
  }
  return z.object(shape);
};

// Seeds RHF defaultValues for customFieldResponses so every control is controlled
// from the start (booleans/arrays need a real default, not undefined).
export const defaultCustomFieldResponses = (customFields = []) =>
  customFields.reduce((acc, field) => {
    acc[field.key] = field.type === "CHECKBOX" ? false : field.type === "MULTISELECT" ? [] : "";
    return acc;
  }, {});

// Drops empty answers on non-required fields before submit — the backend
// silently drops unrecognized/stale keys, but we still shouldn't force a
// default value onto a question the attendee left blank.
export const cleanCustomFieldResponses = (responses = {}, customFields = []) => {
  const cleaned = {};
  for (const field of customFields) {
    const value = responses[field.key];
    const isEmpty =
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);
    if (isEmpty && !field.required) continue;
    cleaned[field.key] = value;
  }
  return cleaned;
};

// customFields is the selected screening's RSVP field list ([] when there's no
// screening, or it has none) — the resulting schema must be rebuilt whenever
// that array changes, since each screening can define completely different fields.
// No cross-field rules remain here — only the per-screening custom fields are
// data-driven now.
export const createRegistrationFormSchema = (customFields = []) =>
  baseSchema.extend({ customFieldResponses: buildCustomFieldsSchema(customFields) });

export const registrationFormSchema = createRegistrationFormSchema([]);

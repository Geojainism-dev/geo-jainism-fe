import { z } from "zod";

const passwordSchema = z
  .string({ required_error: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const registerFormSchema = z
  .object({
    firstName: z.string({ required_error: "First name is required" }).min(1, "First name is required").max(100),
    lastName: z.string({ required_error: "Last name is required" }).min(1, "Last name is required").max(100),
    email: z.string({ required_error: "Email is required" }).email("Enter a valid email address"),
    phoneNumber: z
      .string({ required_error: "Phone number is required" })
      .regex(/^\+[1-9]\d{7,14}$/, "Enter a valid phone number in international format, e.g. +919876543210"),
    dateOfBirth: z.string({ required_error: "Date of birth is required" }).min(1, "Date of birth is required"),
    password: passwordSchema,
    confirmPassword: z.string({ required_error: "Please confirm your password" }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export const loginFormSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email("Enter a valid email address"),
  password: z.string({ required_error: "Password is required" }).min(1, "Password is required"),
});

export const profileFormSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1, "Name is required").max(200),
  phoneNumber: z
    .string()
    .regex(/^\+[1-9]\d{7,14}$/, "Enter a valid phone number in international format, e.g. +919876543210")
    .or(z.literal(""))
    .optional(),
  dateOfBirth: z.string().optional(),
});

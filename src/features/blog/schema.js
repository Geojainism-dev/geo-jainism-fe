import { z } from "zod";

const optionalString = (max) =>
  z.preprocess((v) => (v === "" ? undefined : v), z.string().max(max).optional());

const optionalUrl = (max) =>
  z.preprocess((v) => (v === "" ? undefined : v), z.string().max(max).url("Must be a valid URL").optional());

export const blogFormSchema = z.object({
  title: z.string({ required_error: "Title is required" }).min(1, "Title is required").max(255),
  excerpt: optionalString(500),
  content: z.string({ required_error: "Content is required" }).min(1, "Content is required"),
  coverImage: optionalUrl(2000),
  categoryIds: z.array(z.string().uuid()).optional().default([]),
  tagIds: z.array(z.string().uuid()).optional().default([]),
  seoTitle: optionalString(60),
  seoDescription: optionalString(160),
  canonicalUrl: optionalUrl(2000),
  isFeatured: z.boolean().optional().default(false),
});

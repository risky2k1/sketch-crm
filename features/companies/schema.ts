import { z } from "zod";

const optionalTrimmed = z
  .string()
  .trim()
  .max(4000)
  .optional()
  .transform((value) => (value && value.length > 0 ? value : null));

export const companySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(160, "Name must be at most 160 characters"),
  domain: z
    .string()
    .trim()
    .max(160, "Domain must be at most 160 characters")
    .optional()
    .transform((value) => (value && value.length > 0 ? value.toLowerCase() : null))
    .refine((value) => !value || /^[a-z0-9.-]+\.[a-z]{2,}$/.test(value), "Domain format is invalid"),
  industry: z
    .string()
    .trim()
    .max(120, "Industry must be at most 120 characters")
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  size: z
    .string()
    .trim()
    .max(80, "Size must be at most 80 characters")
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  description: optionalTrimmed,
});

export type CompanyInput = z.infer<typeof companySchema>;

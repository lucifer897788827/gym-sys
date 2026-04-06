import { z } from "zod";

export const leadFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number should be at least 10 characters"),
  source: z.string().optional(),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

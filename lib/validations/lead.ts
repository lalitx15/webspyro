import { z } from "zod";

export const leadSubmissionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^(\+91[\-\s]?)?[6789]\d{9}$|^[0-9+\s\-()]{10,20}$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  company: z.string().max(120).optional().or(z.literal("")),
  service_interested: z.string().min(1, "Please select a service or plan"),
  message: z.string().max(2000).optional().or(z.literal("")),
  source: z.string().default("website"),
  honeypot: z.string().optional().or(z.literal("")), // Spam catch
});

export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;

export const quoteWizardSchema = z.object({
  projectType: z.string().min(1, "Select a project category"),
  features: z.array(z.string()).default([]),
  budgetRange: z.string().min(1, "Select a budget range"),
  timeline: z.string().min(1, "Select a delivery timeline"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please provide a valid phone number"),
  email: z.string().email().optional().or(z.literal("")),
  businessName: z.string().optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
  honeypot: z.string().optional().or(z.literal("")),
});

export type QuoteWizardData = z.infer<typeof quoteWizardSchema>;

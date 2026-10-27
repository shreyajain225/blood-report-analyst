import { z } from "zod";

export const BloodTestSchema = z.object({
  testName: z.string(),
  value: z.number().nullable(),
  unit: z.string().nullable(),

  referenceRange: z.object({
    low: z.number().nullable(),
    high: z.number().nullable(),
    originalText: z.string().nullable(),
  }),

  labFlag: z.enum([
    "low",
    "normal",
    "high",
    "critical",
    "unknown",
  ]).nullable(),
});

export const BloodReportSchema = z.object({
  patientDetails: z.object({
    age: z.number().nullable(),
    sex: z.string().nullable(),
  }),

  reportDate: z.string().nullable(),

  tests: z.array(BloodTestSchema),

  extractionWarnings: z.array(z.string()),
});

export type BloodTest = z.infer<typeof BloodTestSchema>;

export type BloodReport = z.infer<typeof BloodReportSchema>;
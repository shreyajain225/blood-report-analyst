import type { BloodReport } from "../schemas/blood-report.schema.js";

export type RangeStatus =
  | "below_range"
  | "within_range"
  | "above_range"
  | "cannot_determine";

export interface AnalyzedBloodTest {
  testName: string;
  value: number | null;
  unit: string | null;
  status: RangeStatus;
  referenceRange: {
    low: number | null;
    high: number | null;
    originalText: string | null;
  };
}

export function analyzeBloodReport(
  report: BloodReport,
): AnalyzedBloodTest[] {
  return report.tests.map((test) => {
    const { value, referenceRange } = test;
    const { low, high } = referenceRange;

    let status: RangeStatus = "cannot_determine";

    if (value !== null) {
      if (low !== null && value < low) {
        status = "below_range";
      } else if (high !== null && value > high) {
        status = "above_range";
      } else if (
        low !== null &&
        high !== null &&
        value >= low &&
        value <= high
      ) {
        status = "within_range";
      }
    }

    return {
      testName: test.testName,
      value: test.value,
      unit: test.unit,
      status,
      referenceRange: test.referenceRange,
    };
  });
}
import { describe, expect, it } from "vitest";
import { analyzeBloodReport } from "./../services/report-analysis.service.js";
import type { BloodReport } from "./../schemas/blood-report.schema.js";

const report: BloodReport = {
  patientDetails: {
    age: 30,
    sex: "Female",
  },
  reportDate: "2026-10-25",
  tests: [
    {
      testName: "Haemoglobin",
      value: 12.5,
      unit: "g/dL",
      referenceRange: {
        low: 12,
        high: 16,
        originalText: "12.0 - 16.0",
      },
      labFlag: null,
    },
    {
      testName: "Example Test",
      value: 18,
      unit: "mg/dL",
      referenceRange: {
        low: 5,
        high: 15,
        originalText: "5 - 15",
      },
      labFlag: null,
    },
  ],
  extractionWarnings: [],
};

describe("analyzeBloodReport", () => {
  it("identifies values within their reference intervals", () => {
    const result = analyzeBloodReport(report);

    expect(result[0]?.status).toBe("within_range");
  });

  it("identifies values above their reference intervals", () => {
    const result = analyzeBloodReport(report);

    expect(result[1]?.status).toBe("above_range");
  });
});
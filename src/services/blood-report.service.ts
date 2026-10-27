import type { BloodReport } from "../schemas/blood-report.schema.js";
import { extractTextFromPdf } from "./pdf.service.js";
import { extractBloodReportData } from "./extraction.service.js";

export async function processBloodReport(
  pdfBuffer: Buffer,
): Promise<{ report: BloodReport; extractedText: string }> {
  const extractedText = await extractTextFromPdf(pdfBuffer);
  const report = await extractBloodReportData(extractedText);

  return { report, extractedText };
}
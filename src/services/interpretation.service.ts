import { generateText } from "ai";
import { model } from "../config/llm.js";
import type { BloodReport } from "../schemas/blood-report.schema.js";
import { analyzeBloodReport } from "./report-analysis.service.js";

export async function interpretBloodReport(
  report: BloodReport,
): Promise<string> {
  const analysis = analyzeBloodReport(report);

  const { text } = await generateText({
    model,
    temperature: 0,
    maxRetries: 0,
    prompt: `
You are an assistant that explains blood laboratory reports
for educational purposes.

Use only the supplied report and analysis.

Rules:
- Explain findings in clear, accessible language.
- Do not diagnose a disease.
- Do not claim that someone is healthy or unhealthy based on
  these results alone.
- Explain that reference intervals depend on the laboratory
  and relevant patient context.
- Do not invent medical history, values, or sources.
- Recommend consulting a qualified healthcare professional
  for individualized medical interpretation.
- If information is insufficient, say so.

BLOOD REPORT:
${JSON.stringify(report)}

DETERMINISTIC RANGE ANALYSIS:
${JSON.stringify(analysis)}

Explain the main findings and any limitations.
`,
  });

  return text;
}
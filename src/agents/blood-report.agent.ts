import { generateText, stepCountIs, tool } from "ai";
import { z } from "zod";
import { model } from "../config/llm.js";
import type { BloodReport } from "../schemas/blood-report.schema.js";
import { analyzeBloodReport } from "../services/report-analysis.service.js";
import { createMedicalSearchTool, MedicalSearchInputSchema } from "../tools/web-search.tool.js";
import { tavilyMedicalSearchProvider } from "../tools/web-search.provider.js";

export async function askAboutBloodReport(
  report: BloodReport,
  question: string,
): Promise<string> {
  const tools = {
    get_report_results: tool({
      description:
        "Retrieve all test results extracted from the supplied blood report.",
      inputSchema: z.object({}),
      execute: async () => report.tests,
    }),

    compare_reference_ranges: tool({
      description:
        "Compare extracted test values with their stated reference ranges.",
      inputSchema: z.object({}),
      execute: async () => analyzeBloodReport(report),
    }),
    search_medical_information: tool({
        description:
          "Search approved medical websites for general educational information. Use this when the user asks about medical concepts or common causes that require external information. Do not use it to diagnose the user.",
        inputSchema: MedicalSearchInputSchema,
        execute: async ({ query }) => {
          return tavilyMedicalSearchProvider.search(query);
        },
      }),
  };

  const result = await generateText({
    model,
    temperature: 0,
    maxRetries: 0,
    tools,
    stopWhen: stepCountIs(4),
    system: `
You answer questions about a supplied blood report.

Use tools when the question requires retrieving or comparing report data.
Explain results cautiously and in plain language.
Do not diagnose medical conditions.
Do not invent missing data.
Distinguish numerical reference-range comparisons from medical conclusions.
If a question requires external medical information, explain that
you cannot verify it with the currently available tools.
`,
    prompt: `
BLOOD REPORT:
${JSON.stringify(report)}

USER QUESTION:
${question}
`,
  });

  return result.text;
}
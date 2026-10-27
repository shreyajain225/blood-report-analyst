// import { extractBloodReportData } from "./services/extraction.service.js";

// const sampleReport = `
// Complete Blood Count

// Haemoglobin: 12.5 g/dL
// Reference range: 12.0 - 16.0 g/dL

// WBC: 7,000 cells/uL
// Reference range: 4,000 - 11,000 cells/uL
// `;

// const report = await extractBloodReportData(sampleReport);

// console.dir(report, { depth: null });

// import { generateText } from "ai";

// import { model } from "./config/llm.js";

// const result = await generateText({
//   model,
//   prompt: `
//     Return a JSON object with these properties:
//     {
//       "patientName": null,
//       "tests": [
//         {
//           "testName": "Haemoglobin",
//           "value": 12.5,
//           "unit": "g/dL"
//         }
//       ]
//     }

//     Return only valid JSON. Do not include Markdown.
//   `,
// });

// console.log("Generated text:", JSON.stringify(result.text));


// import { tavilyMedicalSearchProvider } from "./tools/web-search.provider.js";

// async function main() {
//   const results = await tavilyMedicalSearchProvider.search(
//     "common causes of low haemoglobin",
//   );

//   console.dir(results, { depth: null });
// }

// main().catch((error: unknown) => {
//   console.error("Medical search failed:", error);
//   process.exitCode = 1;
// });

import { readFile } from "node:fs/promises";
import { processBloodReport } from "./services/blood-report.service.js";

async function main() {
  const pdfBuffer = await readFile("reports/sample-report.pdf");

  const { report, extractedText } = await processBloodReport(pdfBuffer);

  console.log("\n--- Extracted PDF Text ---");
  console.log(extractedText);

  console.log("\n--- Structured Blood Report ---");
  console.dir(report, { depth: null });
}

main().catch((error) => {
  console.error("Failed to process blood report:", error);
  process.exitCode = 1;
});
import "dotenv/config";

import { createOpenAI } from "@ai-sdk/openai";

const lmStudio = createOpenAI({
  baseURL: process.env.LM_STUDIO_BASE_URL!,
  apiKey: "lm-studio",
});

export const model = lmStudio.chat(
  process.env.LM_STUDIO_MODEL!,
);
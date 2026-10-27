import "dotenv/config";
import { tavily } from "@tavily/core";

import type {
  MedicalSearchProvider,
  MedicalSearchResult,
} from "./web-search.tool.js";

const apiKey = process.env.TAVILY_API_KEY;

if (!apiKey) {
  throw new Error("Missing TAVILY_API_KEY in .env");
}

const client = tavily({
  apiKey,
});

const TRUSTED_MEDICAL_DOMAINS = [
  "medlineplus.gov",
  "nhs.uk",
  "mayoclinic.org",
  "who.int",
  "clevelandclinic.org",
];

export const tavilyMedicalSearchProvider: MedicalSearchProvider = {
  async search(query: string): Promise<MedicalSearchResult[]> {
    const response = await client.search(query, {
      searchDepth: "basic",
      maxResults: 5,
      includeAnswer: false,
    });

    const trustedResults = response.results.filter((result) => {
      try {
        const hostname = new URL(result.url).hostname
          .toLowerCase()
          .replace(/^www\./, "");

        return TRUSTED_MEDICAL_DOMAINS.some(
          (domain) =>
            hostname === domain || hostname.endsWith(`.${domain}`),
        );
      } catch {
        return false;
      }
    });

    return trustedResults.map((result) => ({
      title: result.title,
      url: result.url,
      snippet: result.content,
    }));
  },
};
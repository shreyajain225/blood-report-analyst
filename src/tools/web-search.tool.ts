import { z } from "zod";

export const MedicalSearchInputSchema = z.object({
  query: z.string().min(3).max(200),
});

export interface MedicalSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface MedicalSearchProvider {
  search(
    query: string,
  ): Promise<MedicalSearchResult[]>;
}

export function createMedicalSearchTool(
  provider: MedicalSearchProvider,
) {
  return {
    description:
      "Search trusted medical sources for general educational information.",
    inputSchema: MedicalSearchInputSchema,
    execute: async ({
      query,
    }: z.infer<typeof MedicalSearchInputSchema>) => {
      return provider.search(query);
    },
  };
}
import { PDFParse } from "pdf-parse";

export async function extractTextFromPdf(
  buffer: Buffer,
): Promise<string> {
  const parser = new PDFParse({
    data: new Uint8Array(buffer),
  });

  try {
    const result = await parser.getText();
    const extractedText = result.text.trim();

    if (!extractedText) {
      throw new Error(
        "No text found in the PDF. The document may require OCR.",
      );
    }

    return extractedText;
  } finally {
    await parser.destroy();
  }
}
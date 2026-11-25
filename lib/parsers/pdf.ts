import pdf from "pdf-parse";

export async function parsePdfBuffer(buffer: Buffer): Promise<{ text: string; pages: number }> {
  try {
    const data = await pdf(buffer);
    const text = (data.text || "").trim();

    return {
      text,
      pages: data.numpages || 1,
    };
  } catch (error: any) {
    throw new Error(`Failed to extract text from PDF: ${error.message || "Corrupted file"}`);
  }
}

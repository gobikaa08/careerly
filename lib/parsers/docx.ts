import mammoth from "mammoth";

export async function parseDocxBuffer(buffer: Buffer): Promise<{ text: string }> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = (result.value || "").trim();

    return {
      text,
    };
  } catch (error: any) {
    throw new Error(`Failed to extract text from DOCX: ${error.message || "Corrupted file"}`);
  }
}

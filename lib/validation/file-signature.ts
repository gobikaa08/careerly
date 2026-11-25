/**
 * CAREERLY – Strict File Signature & MIME Type Validator
 * Verifies real file magic bytes to prevent renamed malicious or corrupted files.
 */

export interface FileSignatureValidationResult {
  isValid: boolean;
  format: "pdf" | "docx" | "unknown";
  mimeType: string;
  error?: string;
}

/**
 * Validates the file buffer against official binary magic byte signatures
 */
export function validateFileSignature(
  buffer: Buffer,
  filename: string,
  maxSizeBytes: number = 5 * 1024 * 1024
): FileSignatureValidationResult {
  // 1. Check Buffer existence and size
  if (!buffer || buffer.length === 0) {
    return {
      isValid: false,
      format: "unknown",
      mimeType: "application/octet-stream",
      error: "File is empty (0 bytes). Please upload a valid document.",
    };
  }

  if (buffer.length > maxSizeBytes) {
    const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      format: "unknown",
      mimeType: "application/octet-stream",
      error: `File size exceeds the limit of ${maxMb} MB. Please upload a smaller file.`,
    };
  }

  // 2. Check PDF Magic Bytes: %PDF- (0x25 0x50 0x44 0x46)
  // Per PDF spec ISO 32000-1, %PDF- must appear in the first 1024 bytes
  const headerSlice = buffer.subarray(0, Math.min(1024, buffer.length));
  const isPdf = headerSlice.indexOf(Buffer.from("%PDF-", "ascii")) !== -1;

  if (isPdf) {
    return {
      isValid: true,
      format: "pdf",
      mimeType: "application/pdf",
    };
  }

  // 3. Check DOCX Magic Bytes: PK\x03\x04 (0x50 0x4B 0x03 0x04)
  // DOCX files are standard OpenXML ZIP packages
  const isZip =
    buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07) &&
    (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08);

  if (isZip) {
    // Check if it looks like Word by extension or content
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "docx") {
      return {
        isValid: true,
        format: "docx",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
    }
  }

  // 4. If neither signature matched, reject with clear explanation
  const ext = filename.split(".").pop()?.toLowerCase();
  return {
    isValid: false,
    format: "unknown",
    mimeType: "application/octet-stream",
    error: `The uploaded file is not a valid PDF or Word document (Binary signature mismatch). Please ensure the file is an uncorrupted .pdf or .docx file.`,
  };
}

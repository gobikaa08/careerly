import { parsePdfBuffer } from "./pdf";
import { parseDocxBuffer } from "./docx";
import { ParsedResumeData } from "../../types";
import { extractSkillsRuleBased, extractEducationRuleBased } from "../analysis/rule-engine";
import { validateFileSignature } from "../validation/file-signature";
import { classifyDocument, DocumentClassificationResult } from "../validation/document-classifier";
import { extractResumeSections } from "./section-extractor";

export interface ExtractionResult {
  text: string;
  isScannedOrEmpty: boolean;
  pageCount?: number;
  initialParsedData: ParsedResumeData;
  classification: DocumentClassificationResult;
  isRejected: boolean;
  rejectionMessage?: string;
  detectedTypeLabel?: string;
}

export async function extractResumeText(
  buffer: Buffer,
  filename: string,
  declaredMimeType: string
): Promise<ExtractionResult> {
  // 1. Binary Magic Bytes Validation
  const sigValidation = validateFileSignature(buffer, filename);
  if (!sigValidation.isValid) {
    const errorMsg = sigValidation.error || "Invalid file format or corrupted binary signature.";
    return {
      text: "",
      isScannedOrEmpty: true,
      pageCount: 0,
      initialParsedData: createEmptyParsedData(),
      classification: {
        is_resume: false,
        isResume: false,
        document_type: "UNREADABLE",
        documentType: "unreadable",
        detectedTypeLabel: "Corrupted / Invalid File",
        confidence: 1.0,
        reason: errorMsg,
        candidateLevel: "not_applicable",
        sectionsFound: {
          contact: false,
          education: false,
          skills: false,
          experience: false,
          projects: false,
          summary: false,
          certifications: false,
        },
        rejectionReason: errorMsg,
        userFacingMessage: errorMsg,
      },
      isRejected: true,
      rejectionMessage: errorMsg,
      detectedTypeLabel: "Corrupted / Invalid File",
    };
  }

  // 2. Parse Readable Text from PDF or DOCX
  let text = "";
  let pageCount = 1;

  if (sigValidation.format === "pdf") {
    const res = await parsePdfBuffer(buffer);
    text = res.text;
    pageCount = res.pages;
  } else if (sigValidation.format === "docx") {
    const res = await parseDocxBuffer(buffer);
    text = res.text;
  }

  // 3. Document Semantic Classification & Section Verification
  const classification = classifyDocument(text);

  // Check if document was rejected (Invoice, Research Paper, Assignment, Certificate, Manual, Unreadable)
  if (!classification.isResume) {
    const rejectionMsg =
      classification.userFacingMessage ||
      `⚠️ This document doesn't appear to be a resume. Please upload a valid resume in PDF format. (Detected: ${classification.detectedTypeLabel})`;

    return {
      text,
      isScannedOrEmpty: classification.documentType === "unreadable",
      pageCount,
      initialParsedData: createEmptyParsedData(),
      classification,
      isRejected: true,
      rejectionMessage: rejectionMsg,
      detectedTypeLabel: classification.detectedTypeLabel,
    };
  }

  // 4. Extract Structured Heuristic & Sectional Resume Data
  const initialParsedData = extractHeuristicResumeData(text, classification.candidateLevel);

  return {
    text,
    isScannedOrEmpty: false,
    pageCount,
    initialParsedData,
    classification,
    isRejected: false,
    detectedTypeLabel: classification.detectedTypeLabel,
  };
}

/**
 * Creates empty data baseline
 */
function createEmptyParsedData(): ParsedResumeData {
  return {
    full_name: null,
    email: null,
    phone: null,
    location: null,
    linkedin_url: null,
    github_url: null,
    summary: null,
    education: [],
    technical_skills: [],
    tools_and_technologies: [],
    projects: [],
    work_experience: [],
    internships: [],
    certifications: [],
    achievements: [],
  };
}

/**
 * Robust rule-based extraction of foundational resume fields
 */
export function extractHeuristicResumeData(
  rawText: string,
  candidateLevel?: "student_fresher" | "experienced_professional" | "not_applicable"
): ParsedResumeData {
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);

  // Email regex
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = rawText.match(emailRegex);
  const email = emailMatch ? emailMatch[1] : null;

  // Phone regex
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = rawText.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : null;

  // LinkedIn & GitHub
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i;
  const linkedinMatch = rawText.match(linkedinRegex);
  const linkedin_url = linkedinMatch ? linkedinMatch[0] : null;

  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i;
  const githubMatch = rawText.match(githubRegex);
  const github_url = githubMatch ? githubMatch[0] : null;

  // Location heuristic
  const locationRegex = /\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?),\s*(?:[A-Z]{2}|India|USA|United States|UK|Canada|Germany|California|New York|Texas|Bangalore|Delhi|Mumbai|Hyderabad|Pune)\b/i;
  const locMatch = rawText.match(locationRegex);
  const location = locMatch ? locMatch[0] : null;

  // Candidate Name heuristic (1st or 2nd non-empty line without special characters or headers)
  let full_name: string | null = null;
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (
      line.length > 2 &&
      line.length < 40 &&
      !line.includes("@") &&
      !line.includes("http") &&
      !/curriculum|resume|page|email|phone|contact|developer|engineer|summary|profile/i.test(line)
    ) {
      full_name = line;
      break;
    }
  }

  // Extract skills and tools from comprehensive dictionary
  const { skills: foundSkills, tools: foundTools } = extractSkillsRuleBased(rawText);

  // Extract education
  const education = extractEducationRuleBased(rawText);

  // Deep section extraction: Summary, Projects, Experience, Certifications, Achievements
  const sections = extractResumeSections(rawText);

  return {
    full_name,
    email,
    phone,
    location,
    linkedin_url,
    github_url,
    summary: sections.summary,
    education: education.length > 0 ? education : [],
    technical_skills: foundSkills,
    tools_and_technologies: foundTools,
    projects: sections.projects,
    work_experience: sections.work_experience,
    internships: sections.internships,
    certifications: sections.certifications,
    achievements: sections.achievements,
  };
}

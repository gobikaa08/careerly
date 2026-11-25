/**
 * CAREERLY – Intelligent Document Validation & Classifier (Two-Stage Pipeline: Stage 1)
 *
 * Classifies uploaded documents into canonical types:
 * - RESUME
 * - TICKET (Train, Flight, Bus, Movie, Digital Ticket)
 * - INVOICE
 * - CERTIFICATE
 * - RESEARCH_PAPER
 * - ACADEMIC_ASSIGNMENT
 * - BOOK_OR_MANUAL
 * - OTHER
 * - UNREADABLE
 *
 * Implements calibrated confidence scoring and strictly enforces that non-resume documents
 * (including tickets containing words like "Digital Ticket") never reach the resume analysis stage.
 */

export type DocumentType =
  | "RESUME"
  | "TICKET"
  | "INVOICE"
  | "CERTIFICATE"
  | "RESEARCH_PAPER"
  | "ACADEMIC_ASSIGNMENT"
  | "BOOK_OR_MANUAL"
  | "OTHER"
  | "UNREADABLE"
  // Backward compatibility aliases
  | "resume_experienced"
  | "resume_fresher"
  | "invoice"
  | "research_paper"
  | "assignment"
  | "certificate"
  | "manual"
  | "unreadable"
  | "uncertain";

export interface DocumentClassificationResult {
  is_resume: boolean;
  isResume: boolean; // Alias for backward compatibility
  document_type: DocumentType;
  documentType: DocumentType; // Alias for backward compatibility
  detectedTypeLabel: string;
  confidence: number; // 0.0 to 1.0
  reason: string;
  candidateLevel?: "student_fresher" | "experienced_professional" | "not_applicable";
  sectionsFound: {
    contact: boolean;
    education: boolean;
    skills: boolean;
    experience: boolean;
    projects: boolean;
    summary: boolean;
    certifications: boolean;
  };
  rejectionReason?: string;
  userFacingMessage?: string;
}

export function classifyDocument(rawText: string): DocumentClassificationResult {
  const clean = rawText.replace(/\s+/g, " ").trim();

  // 1. Check for empty or unreadable text (< 50 chars)
  if (clean.length < 50) {
    return {
      is_resume: false,
      isResume: false,
      document_type: "UNREADABLE",
      documentType: "UNREADABLE",
      detectedTypeLabel: "Unreadable / Scanned Image Document",
      confidence: 0.98,
      reason: "Document does not contain sufficient extractable text (under 50 characters). It may be an image without OCR or empty.",
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
      rejectionReason: "Document does not contain readable text.",
      userFacingMessage: "⚠️ We couldn't extract readable content from this PDF. Please upload a clear, readable resume.",
    };
  }

  const lower = clean.toLowerCase();

  // 2. Section Scanners for Resumes
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(clean);
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(clean);
  const hasProfiles = /linkedin\.com|github\.com|portfolio|gitlab\.com|leetcode\.com/i.test(clean);
  const contactFound = hasEmail || (hasPhone && hasProfiles);

  const educationRegex = /\b(education|academic|university|college|b\.?tech|bachelor|master|b\.?e\b|m\.?tech|degree|cgpa|gpa|percentage|graduated|diploma|matriculation|secondary school)\b/i;
  const educationFound = educationRegex.test(lower);

  const skillsHeaderRegex = /\b(technical skills|programming skills|core competencies|technical competencies|technologies|frameworks|tools & technologies|core skills)\b/i;
  const skillsListRegex = /\b(javascript|typescript|python|react(?:\.js)?|node\.js|java(?!script)|c\+\+|postgresql|mongodb|docker|kubernetes)\b/i;
  const skillsFound = skillsHeaderRegex.test(lower) || (skillsListRegex.test(lower) && (educationFound || contactFound));

  const experienceRegex = /\b(work experience|professional experience|employment history|work history|internship|internships|software engineer|developer at|engineer at|worked as)\b/i;
  const experienceFound = experienceRegex.test(lower);

  const projectsRegex = /\b(academic projects|personal projects|key projects|capstone project|open source projects|featured projects|projects\b)/i;
  const projectsFound = projectsRegex.test(lower);

  const summaryRegex = /\b(professional summary|career objective|about me|profile overview|executive summary)\b/i;
  const summaryFound = summaryRegex.test(lower);

  const certsRegex = /\b(certifications|licenses & certifications|achievements|honors|awards)\b/i;
  const certificationsFound = certsRegex.test(lower);

  const sectionsFound = {
    contact: contactFound,
    education: educationFound,
    skills: skillsFound,
    experience: experienceFound,
    projects: projectsFound,
    summary: summaryFound,
    certifications: certificationsFound,
  };

  // Compute positive Resume indicators score (0 to 100)
  let resumeScore = 0;
  if (contactFound) resumeScore += 25;
  if (educationFound) resumeScore += 20;
  if (skillsFound) resumeScore += 25;
  if (projectsFound) resumeScore += 15;
  if (experienceFound) resumeScore += 20;
  if (summaryFound) resumeScore += 10;
  if (certificationsFound) resumeScore += 10;

  // ----------------------------------------------------------------
  // 3. Non-Resume Semantic Pattern Scanners
  // ----------------------------------------------------------------

  // A. Tickets (Train, Flight, Bus, Movie, Digital Ticket, Booking Receipt)
  const ticketMarkers = [
    // Train tickets
    /\birctc\b/gi,
    /\bpnr(?:\s*no|\s*number)?[:\s]*\d+/gi,
    /\btrain\s*(?:no|number|name)\b/gi,
    /\bcoach\b(?:\s*:\s*[a-z0-9]+|\s+[a-z0-9]+)/gi,
    /\bberth\b/gi,
    /\bboarding station\b/gi,
    /\bdestination station\b/gi,
    /\bindian railways\b/gi,
    /\bquota\s*:\s*(?:general|tatkal|ladies|senior)/gi,
    /\bamtrak\b/gi,
    /\beurostar\b/gi,
    /\brailway\b/gi,
    // Flight tickets & Boarding passes
    /\bboarding pass\b/gi,
    /\be-ticket\b/gi,
    /\belectronic ticket\b/gi,
    /\bflight\s*(?:no|number)\b/gi,
    /\bflight\s+[a-z]{2}\s*\d{2,4}\b/gi,
    /\bterminal\s*\d+/gi,
    /\bgate\s*[a-z0-9]+\b/gi,
    /\bseat\s*(?:no\.?)?\s*[:\s]*\d{1,3}[a-z]\b/gi,
    /\bbooking reference\b/gi,
    /\bpassenger name record\b/gi,
    /\bbaggage allowance\b/gi,
    /\bcabin baggage\b/gi,
    /\bcheck-in baggage\b/gi,
    /\bitinerary\s*(?:\/|\&)\s*receipt\b/gi,
    /\bfrequent flyer\b/gi,
    /\bdeparture time\b/gi,
    /\barrival time\b/gi,
    // Bus & Movie tickets
    /\bbus ticket\b/gi,
    /\bbus operator\b/gi,
    /\bredbus\b/gi,
    /\babhibus\b/gi,
    /\bboarding point\b/gi,
    /\bdropping point\b/gi,
    /\bmovie ticket\b/gi,
    /\bbookmyshow\b/gi,
    /\bpvr(?:\s*cinemas)?\b/gi,
    /\binox\b/gi,
    /\bcinepolis\b/gi,
    /\bscreen\s*\d+\b/gi,
    /\bshow time\b/gi,
    /\bauditorium\b/gi,
    /\bbox office\b/gi,
    // Generic / Digital tickets
    /\bdigital ticket\b/gi,
    /\bticket id\b/gi,
    /\bbooking id\b/gi,
    /\bticket fare\b/gi,
    /\btotal fare\b/gi,
    /\bvalid for travel\b/gi,
    /\bconvenience fee\b/gi,
    /\bentry pass\b/gi,
    /\badmission ticket\b/gi,
    /\bpassenger details\b/gi,
    /\btravel date\b/gi,
    /\bjourney date\b/gi,
  ];

  let ticketPoints = 0;
  ticketMarkers.forEach((m) => {
    const matches = lower.match(m);
    if (matches) ticketPoints += matches.length * 20;
  });

  // B. Invoices / Receipts / Financial Billing
  const invoiceMarkers = [
    /\binvoice\b/gi,
    /\btax invoice\b/gi,
    /\bbill to\b/gi,
    /\bship to\b/gi,
    /\bamount due\b/gi,
    /\btotal amount\b/gi,
    /\bsubtotal\b/gi,
    /\bbalance due\b/gi,
    /\binvoice number\b/gi,
    /\binv-\d+/gi,
    /\bdue date\b/gi,
    /\bpayment terms\b/gi,
    /\bgstin\b/gi,
    /\bvat registration\b/gi,
    /\bunit price\b/gi,
    /\bqty\b/gi,
    /\bquantity\b/gi,
    /\bwire transfer\b/gi,
    /\bpayment received\b/gi,
    /\breceipt\b/gi,
  ];

  let invoicePoints = 0;
  invoiceMarkers.forEach((m) => {
    const matches = lower.match(m);
    if (matches) invoicePoints += matches.length * 15;
  });

  // C. Academic / Scientific Research Paper
  const researchMarkers = [
    /\babstract\b/gi,
    /\bieee\b/gi,
    /\barxiv\b/gi,
    /\bdoi:\s*10\./gi,
    /\bmethodology\b/gi,
    /\brelated work\b/gi,
    /\bliterature review\b/gi,
    /\bconclusions and future work\b/gi,
    /\breferences\b/gi,
    /\bbibliography\b/gi,
    /\bproceedings of the\b/gi,
    /\bfig(?:ure)?\.?\s*\d+/gi,
    /\btable\s*\d+/gi,
    /\bin this paper, we\b/gi,
    /\bwe propose a novel\b/gi,
    /\bexperimental setup\b/gi,
  ];

  let researchPoints = 0;
  researchMarkers.forEach((m) => {
    const matches = lower.match(m);
    if (matches) researchPoints += matches.length * 15;
  });

  // D. College / University Assignment or Homework
  const assignmentMarkers = [
    /\bassignment\s*(?:no\.?|\#)?\s*\d+/gi,
    /\bhomework\s*(?:no\.?|\#)?\s*\d+/gi,
    /\bproblem set\s*\d+/gi,
    /\bquestion\s*\d+[\s:.]/gi,
    /\bsolution\s*(?:to\s*question|\d+)?[:.]/gi,
    /\bsubmitted by[:\s]/gi,
    /\bsubmitted to[:\s]/gi,
    /\broll no[:\s]/gi,
    /\bcourse instructor[:\s]/gi,
    /\bexercise\s*\d+/gi,
    /\btotal marks\b/gi,
  ];

  let assignmentPoints = 0;
  assignmentMarkers.forEach((m) => {
    const matches = lower.match(m);
    if (matches) assignmentPoints += matches.length * 20;
  });

  // E. Standalone Certificate / Credential
  const certificateMarkers = [
    /\bthis is to certify that\b/gi,
    /\bcertificate of completion\b/gi,
    /\bcertificate of achievement\b/gi,
    /\bcertificate of appreciation\b/gi,
    /\bhas successfully completed\b/gi,
    /\bis hereby awarded to\b/gi,
    /\bpresented to\b/gi,
    /\bdate of issue\b/gi,
    /\bauthorized signature\b/gi,
    /\bcredential id\b/gi,
  ];

  let certificatePoints = 0;
  certificateMarkers.forEach((m) => {
    const matches = lower.match(m);
    if (matches) certificatePoints += matches.length * 25;
  });

  // F. User Manual / Instruction Guide / Book
  const manualMarkers = [
    /\buser manual\b/gi,
    /\binstruction manual\b/gi,
    /\boperating instructions\b/gi,
    /\bsafety precautions\b/gi,
    /\btroubleshooting guide\b/gi,
    /\bwarranty card\b/gi,
    /\binstallation guide\b/gi,
    /\btable of contents\b/gi,
    /\bchapter\s*\d+[:\s]/gi,
  ];

  let manualPoints = 0;
  manualMarkers.forEach((m) => {
    const matches = lower.match(m);
    if (matches) manualPoints += matches.length * 25;
  });

  // ----------------------------------------------------------------
  // 4. Decision Logic & Disambiguation Rules
  // ----------------------------------------------------------------

  // Standard non-resume user error message
  const nonResumeErrorMessage = "⚠️ This document doesn't appear to be a resume. Please upload a valid resume in PDF format.";

  // Rule 4.1: Reject Tickets (Train, Flight, Bus, Movie, Digital Ticket)
  if (ticketPoints >= 30 && ticketPoints > resumeScore) {
    const confidence = Math.min(0.99, Number(((50 + ticketPoints) / 100).toFixed(2)));
    return {
      is_resume: false,
      isResume: false,
      document_type: "TICKET",
      documentType: "TICKET",
      detectedTypeLabel: "Ticket / Travel Booking / Boarding Pass",
      confidence,
      reason: "Detected travel or event ticket markers (e.g. PNR, train/flight number, seat/berth, boarding point, booking ID, or digital ticket).",
      candidateLevel: "not_applicable",
      sectionsFound,
      rejectionReason: "Detected ticket / travel / booking document.",
      userFacingMessage: nonResumeErrorMessage,
    };
  }

  // Rule 4.2: Reject Invoices / Billing
  if (invoicePoints >= 35 && invoicePoints > resumeScore) {
    const confidence = Math.min(0.99, Number(((60 + invoicePoints) / 100).toFixed(2)));
    return {
      is_resume: false,
      isResume: false,
      document_type: "INVOICE",
      documentType: "INVOICE",
      detectedTypeLabel: "Invoice / Billing Statement",
      confidence,
      reason: "Detected financial invoice or billing statement indicators (e.g. invoice number, total amount due, subtotal, billing address).",
      candidateLevel: "not_applicable",
      sectionsFound,
      rejectionReason: "Detected financial invoice or billing statement.",
      userFacingMessage: nonResumeErrorMessage,
    };
  }

  // Rule 4.3: Reject Research Papers
  if (researchPoints >= 40 && researchPoints > resumeScore) {
    const confidence = Math.min(0.99, Number(((65 + researchPoints) / 100).toFixed(2)));
    return {
      is_resume: false,
      isResume: false,
      document_type: "RESEARCH_PAPER",
      documentType: "RESEARCH_PAPER",
      detectedTypeLabel: "Academic / Research Paper",
      confidence,
      reason: "Detected scientific research paper format (abstract, literature review, methodology, references, citations).",
      candidateLevel: "not_applicable",
      sectionsFound,
      rejectionReason: "Detected academic/scientific research paper.",
      userFacingMessage: nonResumeErrorMessage,
    };
  }

  // Rule 4.4: Reject College Assignments
  if (assignmentPoints >= 35 && assignmentPoints > resumeScore) {
    const confidence = Math.min(0.99, Number(((65 + assignmentPoints) / 100).toFixed(2)));
    return {
      is_resume: false,
      isResume: false,
      document_type: "ACADEMIC_ASSIGNMENT",
      documentType: "ACADEMIC_ASSIGNMENT",
      detectedTypeLabel: "College Assignment / Homework",
      confidence,
      reason: "Detected academic assignment format (problem sets, questions, submission details, marks).",
      candidateLevel: "not_applicable",
      sectionsFound,
      rejectionReason: "Detected college assignment / homework submission.",
      userFacingMessage: nonResumeErrorMessage,
    };
  }

  // Rule 4.5: Reject Standalone Certificates (Unless it's a resume that mentions a certificate)
  if (certificatePoints >= 45 && !skillsFound && !experienceFound && !projectsFound) {
    const confidence = Math.min(0.99, Number(((70 + certificatePoints) / 100).toFixed(2)));
    return {
      is_resume: false,
      isResume: false,
      document_type: "CERTIFICATE",
      documentType: "CERTIFICATE",
      detectedTypeLabel: "Standalone Certificate / Award",
      confidence,
      reason: "Detected standalone award or completion certificate rather than a comprehensive CV/resume.",
      candidateLevel: "not_applicable",
      sectionsFound,
      rejectionReason: "Detected standalone certificate of completion/award.",
      userFacingMessage: nonResumeErrorMessage,
    };
  }

  // Rule 4.6: Reject User Manuals / Books
  if (manualPoints >= 35 && manualPoints > resumeScore) {
    const confidence = Math.min(0.99, Number(((70 + manualPoints) / 100).toFixed(2)));
    return {
      is_resume: false,
      isResume: false,
      document_type: "BOOK_OR_MANUAL",
      documentType: "BOOK_OR_MANUAL",
      detectedTypeLabel: "User Manual / Product Documentation",
      confidence,
      reason: "Detected product operating guide, installation documentation, or user manual.",
      candidateLevel: "not_applicable",
      sectionsFound,
      rejectionReason: "Detected user manual or instructional book.",
      userFacingMessage: nonResumeErrorMessage,
    };
  }

  // ----------------------------------------------------------------
  // 5. Positive Resume Validation & Candidate Level Classification
  // ----------------------------------------------------------------

  // Check explicit student/fresher indicators
  const explicitlyStudentOrFresher =
    lower.includes("student") ||
    lower.includes("fresher") ||
    (lower.includes("intern") && !lower.includes("senior") && !lower.includes("years of experience"));

  // Archetype A: Fresher / Student Resume (with zero corporate experience)
  // Hallmarks: Education + Skills + (Projects OR Contact info)
  if (explicitlyStudentOrFresher && (educationFound || projectsFound || skillsFound)) {
    const confidence = Math.min(0.98, Number(((50 + resumeScore) / 100).toFixed(2)));
    return {
      is_resume: true,
      isResume: true,
      document_type: "RESUME",
      documentType: "resume_fresher",
      detectedTypeLabel: "Student / Fresher Resume",
      confidence,
      reason: "Contains identifiable student/fresher education, skills, projects, and contact information.",
      candidateLevel: "student_fresher",
      sectionsFound,
    };
  }

  // Archetype B: Experienced Professional Resume
  // Hallmarks: Experience + Skills + Contact (or Education)
  const isExperienced = experienceFound && skillsFound && (contactFound || educationFound);
  if (isExperienced) {
    const confidence = Math.min(0.99, Number(((55 + resumeScore) / 100).toFixed(2)));
    return {
      is_resume: true,
      isResume: true,
      document_type: "RESUME",
      documentType: "resume_experienced",
      detectedTypeLabel: "Experienced Professional Resume",
      confidence,
      reason: "Contains identifiable professional experience, technical skills, projects, and contact information.",
      candidateLevel: "experienced_professional",
      sectionsFound,
    };
  }

  // Archetype C: General Early Career / Fresher Resume
  const isFresherOrStudent =
    educationFound &&
    skillsFound &&
    (projectsFound || contactFound);

  if (isFresherOrStudent || resumeScore >= 45) {
    const confidence = Math.min(0.96, Number(((48 + resumeScore) / 100).toFixed(2)));
    return {
      is_resume: true,
      isResume: true,
      document_type: "RESUME",
      documentType: "resume_fresher",
      detectedTypeLabel: "Student / Fresher Resume",
      confidence,
      reason: "Contains identifiable resume structure including education, skills, and projects.",
      candidateLevel: "student_fresher",
      sectionsFound,
    };
  }

  // ----------------------------------------------------------------
  // 6. Fallback: Uncertain / Non-Resume Document
  // ----------------------------------------------------------------
  // Low confidence document: Not enough resume sections to be confident
  if (resumeScore >= 20 && resumeScore < 45) {
    return {
      is_resume: false,
      isResume: false,
      document_type: "OTHER",
      documentType: "uncertain",
      detectedTypeLabel: "Uncertain Document",
      confidence: 0.45,
      reason: "Document contains isolated keywords but lacks standard resume structure (missing multiple critical sections like Education, Experience, or Skills).",
      candidateLevel: "not_applicable",
      sectionsFound,
      rejectionReason: "Could not identify standard resume sections such as Education, Technical Skills, Projects, or Contact Information.",
      userFacingMessage: "⚠️ We couldn't confidently identify this document as a resume. Please upload a clearer or properly formatted resume.",
    };
  }

  return {
    is_resume: false,
    isResume: false,
    document_type: "OTHER",
    documentType: "OTHER",
    detectedTypeLabel: "Unrecognized Non-Resume Document",
    confidence: 0.85,
    reason: "Document has no structural resume indicators (no contact info, education history, technical skills, or professional experience).",
    candidateLevel: "not_applicable",
    sectionsFound,
    rejectionReason: "Could not identify standard resume sections.",
    userFacingMessage: nonResumeErrorMessage,
  };
}

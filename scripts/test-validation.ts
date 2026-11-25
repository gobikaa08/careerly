/**
 * CAREERLY – Comprehensive Document Validation & False Skill Detection Test Suite
 *
 * Covers all 18 mandatory test scenarios specified in the requirements:
 *  1. Professional Resume (Accept)
 *  2. Fresher Resume (Accept – without work experience penalty)
 *  3. Student Resume (Accept)
 *  4. Software Developer Resume (Accept)
 *  5. Train Ticket (Reject – TICKET)
 *  6. Flight Ticket / Boarding Pass (Reject – TICKET)
 *  7. Movie Ticket (Reject – TICKET)
 *  8. Bus Booking Confirmation (Reject – TICKET)
 *  9. Invoice Document (Reject – INVOICE)
 * 10. College Assignment (Reject – ACADEMIC_ASSIGNMENT)
 * 11. Research Paper (Reject – RESEARCH_PAPER)
 * 12. Course Certificate (Reject – CERTIFICATE)
 * 13. Digital Ticket containing "Digital" (Reject – TICKET & NO Git extraction)
 * 14. Resume with JavaScript (Accept – identifies JavaScript, NOT Java)
 * 15. Resume with Git in skills section (Accept – identifies Git)
 * 16. Scanned Resume / Low-text PDF (Reject as unreadable)
 * 17. Empty PDF (Reject)
 * 18. Corrupted PDF / Invalid binary magic bytes (Reject)
 *
 * Additional Precision Tests:
 * - "Reacted to customer complaints" must NEVER extract React
 * - Isolated technology keywords without resume structure must be rejected
 * - Mathematical consistency of evidence-based category weights
 */

import { validateFileSignature } from "../lib/validation/file-signature";
import { classifyDocument } from "../lib/validation/document-classifier";
import { extractSkillsRuleBased, analyzeResumeRuleBased } from "../lib/analysis/rule-engine";
import { ParsedResumeData } from "../types";

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${testName} – ${detail || "Assertion failed"}`);
    failed++;
  }
}

async function runTests() {
  console.log("=================================================");
  console.log("CAREERLY RESUME VALIDATION & ACCURACY TEST SUITE");
  console.log("=================================================\n");

  // ----------------------------------------------------------------
  // GROUP 1: Binary File Signatures & Corrupted Files
  // ----------------------------------------------------------------
  console.log("--- TEST GROUP 1: Binary Magic Bytes & File Integrity ---");

  // 1.1 Valid PDF Magic Bytes
  const validPdfBuf = Buffer.concat([Buffer.from("%PDF-1.5\n"), Buffer.alloc(500)]);
  const pdfSig = validateFileSignature(validPdfBuf, "resume.pdf");
  assert(pdfSig.isValid && pdfSig.format === "pdf", "1. Valid PDF magic bytes accepted");

  // 1.2 Empty PDF (0 bytes)
  const emptyBuf = Buffer.alloc(0);
  const emptySig = validateFileSignature(emptyBuf, "empty.pdf");
  assert(!emptySig.isValid, "2. Empty PDF (0 bytes) rejected");

  // 1.3 Corrupted PDF (e.g. text file renamed to .pdf)
  const fakePdfBuf = Buffer.from("Plain text file pretending to be a pdf");
  const fakePdfSig = validateFileSignature(fakePdfBuf, "fake.pdf");
  assert(!fakePdfSig.isValid, "3. Corrupted PDF without magic bytes rejected");

  // 1.4 Scanned / Unreadable Document (< 50 chars)
  const scannedText = "Scan 001 - Page 1";
  const scannedResult = classifyDocument(scannedText);
  assert(
    !scannedResult.is_resume && scannedResult.document_type === "UNREADABLE",
    "4. Scanned / Low text document (< 50 chars) rejected as UNREADABLE",
    `Got document_type: ${scannedResult.document_type}`
  );

  // ----------------------------------------------------------------
  // GROUP 2: Irrelevant Documents & Tickets (Must be REJECTED)
  // ----------------------------------------------------------------
  console.log("\n--- TEST GROUP 2: Irrelevant Document & Ticket Detection ---");

  // 2.1 Train Ticket (IRCTC, PNR, Train No, Berth, Coach)
  const trainTicketText = `
    IRCTC Electronic Reservation Slip (ERS)
    PNR No: 4528192831
    Train No & Name: 12951 / TEJAS RAJ EXP
    Class: 3A | Quota: GENERAL
    Boarding Station: NDLS - NEW DELHI | Destination Station: BCT - MUMBAI CENTRAL
    Passenger Details:
    1. Mr. Rajesh Kumar, Age 29, Male | Booking Status: CNF / B3 / 42 / LOWER BERTH
    Ticket Fare: Rs. 2,410.00 | IRCTC Service Charge: Rs. 35.40
    Total Fare: Rs. 2,445.40
  `;
  const trainResult = classifyDocument(trainTicketText);
  assert(
    !trainResult.is_resume && trainResult.document_type === "TICKET",
    "5. Train ticket detected and firmly rejected",
    `Got: ${trainResult.document_type}`
  );

  // 2.2 Flight Ticket / Boarding Pass
  const flightTicketText = `
    BOARDING PASS / ELECTRONIC TICKET
    Airline: IndiGo 6E-512
    Passenger: Sarah Connor
    Flight Number: 6E 512 | Booking Reference: PNR X89J2K
    From: DEL (Delhi Terminal 3) To: BLR (Bengaluru Terminal 1)
    Date: 28 Nov 2024 | Departure Time: 08:30 | Gate: 14B | Seat: 12F
    Baggage Allowance: 15kg Check-in, 7kg Cabin Baggage
  `;
  const flightResult = classifyDocument(flightTicketText);
  assert(
    !flightResult.is_resume && flightResult.document_type === "TICKET",
    "6. Flight boarding pass detected and rejected",
    `Got: ${flightResult.document_type}`
  );

  // 2.3 Movie Ticket
  const movieTicketText = `
    BOOKMYSHOW BOOKING CONFIRMATION
    Cinema: PVR Cinemas, Forum Mall, Screen 4
    Movie: Inception - 10th Anniversary Re-Release
    Show Time: Friday, 29 Nov 2024 | 07:15 PM
    Audi 4 | Seat: H-12, H-13 | Category: PRIME GOLD
    Total Fare: Rs. 750.00 | Convenience Fee: Rs. 65.00
    Box Office Code: BMS-99201-PVR
  `;
  const movieResult = classifyDocument(movieTicketText);
  assert(
    !movieResult.is_resume && movieResult.document_type === "TICKET",
    "7. Movie ticket detected and rejected",
    `Got: ${movieResult.document_type}`
  );

  // 2.4 Bus Booking Confirmation
  const busTicketText = `
    REDBUS E-TICKET CONFIRMATION
    Trip ID: RB-8891024
    Bus Operator: SRS Travels - Multi-Axle Volvo AC Sleeper
    Boarding Point: Madiwala, Bangalore | Drop Point: Majestic, Hyderabad
    Departure: 21:00 hrs | Seat Numbers: 14, 15
    Total Bus Fare: Rs. 1,600.00
  `;
  const busResult = classifyDocument(busTicketText);
  assert(
    !busResult.is_resume && busResult.document_type === "TICKET",
    "8. Bus booking confirmation detected and rejected",
    `Got: ${busResult.document_type}`
  );

  // 2.5 Digital Ticket containing "Digital" (CRITICAL TEST)
  const digitalTicketText = `
    DIGITAL TICKET RECEIPT
    Booking ID: DIGI-TK-88319
    Service: Digital Ticket Entry Pass for Tech Expo 2024
    Valid for Travel & Entry on: 05 Dec 2024
    Attendee Name: Alex Mercer
    Total Fare: $45.00 (Paid via Credit Card)
  `;
  const digitalResult = classifyDocument(digitalTicketText);
  assert(
    !digitalResult.is_resume && digitalResult.document_type === "TICKET",
    "9. Digital ticket containing 'Digital' rejected as TICKET",
    `Got: ${digitalResult.document_type}`
  );

  // Verify that "Digital Ticket" NEVER produces "Git" as a detected skill
  const digitalSkills = extractSkillsRuleBased(digitalTicketText);
  assert(
    !digitalSkills.skills.includes("Git") && !digitalSkills.skills.includes("GitHub"),
    "10. ROOT CAUSE FIX: 'Digital Ticket' must NEVER extract 'Git' as a skill",
    `Extracted skills were: [${digitalSkills.skills.join(", ")}]`
  );

  // 2.6 Invoice
  const invoiceText = `
    TAX INVOICE
    Invoice Number: INV-2024-901
    Due Date: 15-Dec-2024
    Bill To: Global Tech Enterprises
    Total Amount Due: $3,500.00
    Subtotal: $3,000.00 | Tax (18%): $500.00
    Payment Terms: Net 30 | Wire Transfer: Wells Fargo
  `;
  const invoiceResult = classifyDocument(invoiceText);
  assert(
    !invoiceResult.is_resume && invoiceResult.document_type === "INVOICE",
    "11. Financial Invoice detected and rejected",
    `Got: ${invoiceResult.document_type}`
  );

  // 2.7 Academic Research Paper
  const researchPaperText = `
    Distributed Consensus in Fault Tolerant Networks
    Department of Computer Science, MIT
    doi: 10.1109/TSE.2024.1234567
    Abstract: In this paper, we propose a novel consensus protocol...
    1. Introduction & Related Work
    2. Methodology & Experimental Setup
    Figure 1 shows latency benchmarks. Table 2 summarizes throughput.
    References:
    [1] L. Lamport, The Byzantine Generals Problem, 1982.
  `;
  const researchResult = classifyDocument(researchPaperText);
  assert(
    !researchResult.is_resume && researchResult.document_type === "RESEARCH_PAPER",
    "12. Research Paper detected and rejected",
    `Got: ${researchResult.document_type}`
  );

  // 2.8 College Assignment
  const assignmentText = `
    Assignment No. 4: Operating System Synchronization
    Course: CS 401 | Submitted By: Emily Watson | Roll No: 2022CS44
    Submitted To: Dr. Robert Miller, Course Instructor
    Total Marks: 100
    Question 1: Explain the Readers-Writers Problem using Semaphores.
    Solution:
    The readers-writers problem relates to an object shared among multiple concurrent processes...
  `;
  const assignmentResult = classifyDocument(assignmentText);
  assert(
    !assignmentResult.is_resume && assignmentResult.document_type === "ACADEMIC_ASSIGNMENT",
    "13. College Assignment detected and rejected",
    `Got: ${assignmentResult.document_type}`
  );

  // 2.9 Course Certificate of Completion
  const certText = `
    CERTIFICATE OF COMPLETION
    This is to certify that
    Johnathan Smith
    has successfully completed the 12-week course in
    Full-Stack Cloud Architecture & Container Security
    Date of Issue: November 10, 2024
    Credential ID: CERT-88912-CLOUD
    Authorized Signatory
  `;
  const certResult = classifyDocument(certText);
  assert(
    !certResult.is_resume && certResult.document_type === "CERTIFICATE",
    "14. Standalone Course Certificate detected and rejected",
    `Got: ${certResult.document_type}`
  );

  // 2.10 User Manual / Documentation
  const manualText = `
    SMART HOME HUB V3
    User Manual & Installation Guide
    Table of Contents
    1. Safety Precautions
    2. Operating Instructions & Troubleshooting Guide
    3. Hardware Specifications & Warranty Card
  `;
  const manualResult = classifyDocument(manualText);
  assert(
    !manualResult.is_resume && manualResult.document_type === "BOOK_OR_MANUAL",
    "15. User Manual detected and rejected",
    `Got: ${manualResult.document_type}`
  );

  // 2.11 Document with Isolated Tech Keywords (No Resume Structure)
  const isolatedKeywordsText = `
    Python JavaScript Docker Kubernetes React Git
    Hardware inventory list for Office Floor 3.
    Room 302, Table 4.
  `;
  const isolatedResult = classifyDocument(isolatedKeywordsText);
  assert(
    !isolatedResult.is_resume,
    "16. Isolated keywords without resume structure rejected as non-resume"
  );

  // ----------------------------------------------------------------
  // GROUP 3: Legitimate Resumes (Must be ACCEPTED)
  // ----------------------------------------------------------------
  console.log("\n--- TEST GROUP 3: Legitimate Resumes (Must be ACCEPTED) ---");

  // 3.1 Professional / Experienced Resume
  const professionalResumeText = `
    Sarah Connor
    sarah.connor@example.com | +1 (555) 234-5678 | San Francisco, CA
    linkedin.com/in/sarahconnor | github.com/sarahconnor

    Professional Summary
    Senior Software Engineer with 6+ years of experience building high-scale distributed backend systems and web applications.

    Technical Skills
    Programming Languages: TypeScript, JavaScript, Python, SQL
    Frameworks: React, Next.js, Node.js, Express, Tailwind CSS
    Cloud & Databases: PostgreSQL, Redis, Docker, Kubernetes, AWS, Git

    Professional Experience
    Senior Software Engineer | TechNova Inc | 2021 - Present
    • Architected microservices handling 25M daily requests using Node.js and PostgreSQL.
    • Reduced API p99 latency by 35% through Redis caching and query indexing.

    Full-Stack Developer | CloudPeak Solutions | 2018 - 2021
    • Built customer-facing dashboard in React and TypeScript.

    Projects
    High-Performance Trading Engine (React, Node.js, PostgreSQL)
    • Developed open-source order matching engine with sub-10ms processing latency.

    Education
    B.S. in Computer Science | UC Berkeley | 2014 - 2018 | GPA: 3.8/4.0
  `;
  const profResult = classifyDocument(professionalResumeText);
  assert(
    profResult.is_resume && profResult.candidateLevel === "experienced_professional",
    "17. Professional / Experienced Resume accepted",
    `Got candidateLevel: ${profResult.candidateLevel}`
  );

  // 3.2 Fresher Resume (College Grad with ZERO work experience)
  const fresherResumeText = `
    Aarav Sharma
    aarav.sharma@example.com | +91 98765 43210 | Bangalore, India
    linkedin.com/in/aaravsharma | github.com/aaravsharma

    Career Objective
    Enthusiastic Computer Science graduate seeking an Entry-Level Software Engineer role to leverage skills in React, JavaScript, and Node.js.

    Education
    B.Tech in Computer Science & Engineering
    National Institute of Technology Karnataka (NITK) | 2020 - 2024
    CGPA: 8.8 / 10.0

    Technical Skills
    Programming Languages: Python, JavaScript, C++, SQL
    Web Technologies: React, HTML5, CSS3, Tailwind CSS, Node.js, Express
    Tools & Technologies: Git, GitHub, VS Code, Postman, Linux

    Key Projects
    Campus Event Portal (React, Node.js, PostgreSQL)
    • Developed full-stack event registration application used by 2,000+ students.
    • Integrated JWT authentication and role-based permissions.

    Algorithmic Trading Simulator (Python, Pandas)
    • Implemented backtesting algorithms for moving average crossovers.

    Certifications & Achievements
    • 1st Place - NITK Annual Hackathon 2023
  `;
  const fresherResult = classifyDocument(fresherResumeText);
  assert(
    fresherResult.is_resume && fresherResult.candidateLevel === "student_fresher",
    "18. Fresher Resume (0 work experience) accepted without penalty",
    `Got candidateLevel: ${fresherResult.candidateLevel}`
  );

  // 3.3 Student Resume (Undergrad with Internships)
  const studentResumeText = `
    Emily Chen
    emily.chen@example.edu | (415) 555-0192 | Boston, MA
    github.com/emilychen | linkedin.com/in/emilychen

    Profile
    Third-year student pursuing B.S. in Computer Science at Boston University.

    Education
    B.S. in Computer Science | Boston University | Expected 2026 | GPA: 3.9 / 4.0

    Technical Competencies
    Languages: Java, Python, TypeScript, SQL
    Frameworks & Tools: React, Docker, Git, Spring Boot

    Internships
    Software Engineering Intern | Boston Health Tech | June 2024 - Aug 2024
    • Automated ETL pipeline in Python, processing 100K daily lab test results.

    Academic Projects
    Distributed Raft Protocol (Java, Docker)
    • Implemented leader election and state machine replication.
  `;
  const studentResult = classifyDocument(studentResumeText);
  assert(
    studentResult.is_resume && studentResult.candidateLevel === "student_fresher",
    "19. Student Resume with Internships accepted",
    `Got candidateLevel: ${studentResult.candidateLevel}`
  );

  // 3.4 Software Developer Resume
  const devResumeText = `
    Devon Vance
    devon.vance@example.com | +1 (555) 789-0123 | Seattle, WA
    linkedin.com/in/devonvance | github.com/devonvance

    Professional Summary
    Software Developer specializing in React, Next.js, and Cloud Infrastructure.

    Technical Skills
    Languages: JavaScript, TypeScript, Python
    Frameworks: React, Next.js, Express, Node.js
    DevOps: Docker, AWS, Git, CI/CD

    Experience
    Software Developer | Apex Cloud Systems | 2022 - Present
    • Developed serverless functions and modern web interfaces using Next.js.

    Education
    B.S. in Software Engineering | University of Washington | 2018 - 2022
  `;
  const devResult = classifyDocument(devResumeText);
  assert(
    devResult.is_resume,
    "20. Software Developer Resume accepted"
  );

  // ----------------------------------------------------------------
  // GROUP 4: False Skill Detection Precision Checks
  // ----------------------------------------------------------------
  console.log("\n--- TEST GROUP 4: False Skill Detection Precision Checks ---");

  // 4.1 Resume with JavaScript must NOT falsely extract Java
  const jsResumeText = `
    Alex Miller
    alex@example.com | linkedin.com/in/alexm
    Technical Skills: JavaScript, React, Node.js, HTML5, CSS3, Git
    Education: B.S. in Computer Science | 2023
    Projects: Web App built with JavaScript and React.
  `;
  const jsSkills = extractSkillsRuleBased(jsResumeText);
  assert(
    jsSkills.skills.includes("JavaScript"),
    "21. Identifies JavaScript correctly from resume"
  );
  assert(
    !jsSkills.skills.includes("Java"),
    "22. CRITICAL FIX: JavaScript must NEVER falsely extract Java",
    `Skills found: [${jsSkills.skills.join(", ")}]`
  );

  // 4.2 Resume with Git in skills section must extract Git
  assert(
    jsSkills.skills.includes("Git"),
    "23. Resume with Git in skills section correctly identifies Git"
  );

  // 4.3 "Reacted to customer complaints" must NEVER extract React
  const nonTechProse = `
    Customer Support Specialist
    Managed client escalations and reacted to customer complaints with empathy and quick turnaround.
    Organized weekly team syncs and communication channels.
  `;
  const reactSkills = extractSkillsRuleBased(nonTechProse);
  assert(
    !reactSkills.skills.includes("React"),
    "24. CRITICAL FIX: 'Reacted to customer complaints' must NEVER extract React",
    `Skills found: [${reactSkills.skills.join(", ")}]`
  );

  // ----------------------------------------------------------------
  // GROUP 5: Scoring Rubric & Mathematical Consistency
  // ----------------------------------------------------------------
  console.log("\n--- TEST GROUP 5: Evidence-Based Scoring Accuracy ---");

  const emptyParsedData: ParsedResumeData = {
    full_name: "Sarah Connor",
    email: "sarah.connor@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    linkedin_url: "https://linkedin.com/in/sarahconnor",
    github_url: "https://github.com/sarahconnor",
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

  const expAnalysis = analyzeResumeRuleBased(professionalResumeText, emptyParsedData);
  const calculatedSum = Math.min(
    98,
    Math.max(25, expAnalysis.analysis.categories.reduce((acc, c) => acc + c.weightedScore, 0))
  );
  assert(
    expAnalysis.analysis.overall_score === calculatedSum,
    "25. Composite score mathematically equals sum of weighted category scores",
    `overall: ${expAnalysis.analysis.overall_score}, sum: ${calculatedSum}`
  );

  // Verify Fresher candidate is not penalized for missing experience
  const fresherParsedData: ParsedResumeData = {
    full_name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
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

  const fresherAnalysis = analyzeResumeRuleBased(fresherResumeText, fresherParsedData);
  assert(
    fresherAnalysis.analysis.candidate_level === "student_fresher",
    "26. Candidate level correctly classified as student_fresher"
  );
  assert(
    fresherAnalysis.analysis.overall_score >= 75,
    `27. Fresher with high-quality projects & skills earns strong score (${fresherAnalysis.analysis.overall_score}%)`
  );

  console.log("\n=================================================");
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

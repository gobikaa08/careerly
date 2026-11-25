import { ParsedResumeData, ATSChecklistItem } from "../../types";
import { CAREER_DATABASE } from "../careers-data";
import { extractResumeSections } from "../parsers/section-extractor";

export interface CategoryEvaluation {
  category: string;
  score: number; // 0 to 100
  weight: number; // percentage in overall composite
  weightedScore: number;
  status: "passed" | "warning" | "needs_improvement" | "not_applicable";
  positiveEvidence: string[];
  deductions: Array<{
    reason: string;
    points: number;
    actionableFix: string;
  }>;
}

export interface RuleBasedAnalysisResult {
  parsedData: ParsedResumeData;
  analysis: {
    overall_score: number; // 0 to 100
    candidate_level: "student_fresher" | "experienced_professional";
    summary: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    ats_checklist: ATSChecklistItem[];
    formatting_notes: string;
    categories: CategoryEvaluation[];
  };
  recommendedCareers: Array<{
    career_title: string;
    match_score: number;
    explanation: string;
    matching_skills: string[];
    missing_skills: string[];
    suggested_projects: string[];
    learning_path_summary: string;
  }>;
  aiSource: "rule-based";
}

/**
 * Comprehensive technical skills dictionary covering:
 * Languages, Frontend, Backend, Databases, Cloud/DevOps, AI/Data, Mobile, Testing, and Tools.
 */
export const TECH_SKILLS_DICTIONARY: Array<{ name: string; category: string; aliases?: string[] }> = [
  // Programming Languages
  { name: "JavaScript", category: "Language", aliases: ["JS", "ES6", "ES2015", "ECMAScript"] },
  { name: "TypeScript", category: "Language", aliases: ["TS"] },
  { name: "Python", category: "Language", aliases: ["Python3", "Py"] },
  { name: "Java", category: "Language" },
  { name: "C++", category: "Language", aliases: ["CPP", "C/C++"] },
  { name: "C#", category: "Language", aliases: ["CSharp", ".NET C#"] },
  { name: "C", category: "Language" },
  { name: "Go", category: "Language", aliases: ["Golang"] },
  { name: "Rust", category: "Language" },
  { name: "PHP", category: "Language" },
  { name: "Ruby", category: "Language" },
  { name: "Swift", category: "Language" },
  { name: "Kotlin", category: "Language" },
  { name: "SQL", category: "Language", aliases: ["Structured Query Language"] },
  { name: "HTML5", category: "Frontend", aliases: ["HTML"] },
  { name: "CSS3", category: "Frontend", aliases: ["CSS", "SCSS", "Sass"] },
  { name: "Bash", category: "DevOps", aliases: ["Shell Scripting", "Zsh"] },

  // Frontend Frameworks & Libraries
  { name: "React", category: "Frontend", aliases: ["React.js", "ReactJS"] },
  { name: "Next.js", category: "Frontend", aliases: ["NextJS", "Next 13", "Next 14"] },
  { name: "Vue.js", category: "Frontend", aliases: ["Vue", "VueJS", "Nuxt.js", "Nuxt"] },
  { name: "Angular", category: "Frontend", aliases: ["AngularJS", "Angular 2+"] },
  { name: "Svelte", category: "Frontend", aliases: ["SvelteKit"] },
  { name: "Tailwind CSS", category: "Frontend", aliases: ["TailwindCSS", "Tailwind"] },
  { name: "Redux", category: "Frontend", aliases: ["Redux Toolkit", "RTK"] },
  { name: "Bootstrap", category: "Frontend" },
  { name: "Webpack", category: "Frontend" },
  { name: "Vite", category: "Frontend" },

  // Backend Frameworks & Runtimes
  { name: "Node.js", category: "Backend", aliases: ["NodeJS", "Node"] },
  { name: "Express", category: "Backend", aliases: ["Express.js", "ExpressJS"] },
  { name: "NestJS", category: "Backend", aliases: ["Nest.js"] },
  { name: "Django", category: "Backend", aliases: ["Django REST Framework", "DRF"] },
  { name: "FastAPI", category: "Backend" },
  { name: "Flask", category: "Backend" },
  { name: "Spring Boot", category: "Backend", aliases: ["SpringBoot", "Spring Framework"] },
  { name: "ASP.NET", category: "Backend", aliases: [".NET Core", "ASP.NET Core"] },
  { name: "Ruby on Rails", category: "Backend", aliases: ["Rails"] },
  { name: "GraphQL", category: "Backend", aliases: ["Apollo GraphQL"] },
  { name: "REST APIs", category: "Backend", aliases: ["RESTful API", "REST API", "REST"] },
  { name: "gRPC", category: "Backend" },
  { name: "Microservices", category: "Backend" },

  // Databases & ORMs
  { name: "PostgreSQL", category: "Database", aliases: ["Postgres", "psql"] },
  { name: "MongoDB", category: "Database", aliases: ["Mongo"] },
  { name: "MySQL", category: "Database" },
  { name: "Redis", category: "Database" },
  { name: "SQLite", category: "Database" },
  { name: "Supabase", category: "Database" },
  { name: "Firebase", category: "Database", aliases: ["Firestore"] },
  { name: "Prisma", category: "Database", aliases: ["Prisma ORM"] },
  { name: "DynamoDB", category: "Database" },
  { name: "Elasticsearch", category: "Database" },

  // Cloud & DevOps
  { name: "Docker", category: "DevOps", aliases: ["Containerization"] },
  { name: "Kubernetes", category: "DevOps", aliases: ["K8s"] },
  { name: "AWS", category: "Cloud", aliases: ["Amazon Web Services", "EC2", "S3", "Lambda"] },
  { name: "Google Cloud", category: "Cloud", aliases: ["GCP", "Google Cloud Platform"] },
  { name: "Azure", category: "Cloud", aliases: ["Microsoft Azure"] },
  { name: "CI/CD", category: "DevOps", aliases: ["Continuous Integration", "GitHub Actions", "GitLab CI"] },
  { name: "Terraform", category: "DevOps" },
  { name: "Linux", category: "DevOps", aliases: ["Ubuntu", "CentOS", "Debian"] },
  { name: "Nginx", category: "DevOps" },
  { name: "Prometheus", category: "DevOps" },
  { name: "Grafana", category: "DevOps" },

  // AI / ML & Data Science
  { name: "Machine Learning", category: "AI/ML", aliases: ["ML"] },
  { name: "Deep Learning", category: "AI/ML", aliases: ["Neural Networks"] },
  { name: "PyTorch", category: "AI/ML" },
  { name: "TensorFlow", category: "AI/ML", aliases: ["Keras"] },
  { name: "Scikit-Learn", category: "AI/ML", aliases: ["sklearn"] },
  { name: "Pandas", category: "Data Science" },
  { name: "NumPy", category: "Data Science" },
  { name: "NLP", category: "AI/ML", aliases: ["Natural Language Processing"] },
  { name: "Computer Vision", category: "AI/ML", aliases: ["OpenCV"] },
  { name: "Data Engineering", category: "Data Science", aliases: ["ETL Pipelines", "Airflow", "Apache Spark"] },

  // Mobile & UX
  { name: "React Native", category: "Mobile" },
  { name: "Flutter", category: "Mobile", aliases: ["Dart"] },
  { name: "Figma", category: "Design", aliases: ["UI/UX", "Wireframing"] },

  // Testing & Quality
  { name: "Jest", category: "Testing" },
  { name: "Cypress", category: "Testing" },
  { name: "Playwright", category: "Testing" },
  { name: "Unit Testing", category: "Testing", aliases: ["TDD", "Integration Testing"] },

  // Tools & Version Control
  { name: "Git", category: "Tools" },
  { name: "GitHub", category: "Tools" },
  { name: "Postman", category: "Tools" },
  { name: "Jira", category: "Tools", aliases: ["Agile", "Scrum"] },
];

export interface ExtractedSkillEvidence {
  skill: string;
  category: string;
  confidence: number;
  evidence: string;
  sourceSection: "skills_section" | "projects" | "experience" | "summary" | "body";
}

/**
 * High-Precision Context-Aware & Section-Aware Skill Extraction Engine
 * Enforces whole-word token boundaries, semantic verification, and confidence scoring.
 * Prevents false positives (e.g. "Digital" -> Git, "Reacted" -> React, "JavaScript" -> Java).
 */
export function extractSkillsRuleBased(text: string): {
  skills: string[];
  tools: string[];
  verifiedSkills?: ExtractedSkillEvidence[];
} {
  const foundSkillsSet = new Set<string>();
  const foundToolsSet = new Set<string>();
  const verifiedList: ExtractedSkillEvidence[] = [];

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // 1. Structural Section Segmentation
  const skillsLines: string[] = [];
  const projectLines: string[] = [];
  const experienceLines: string[] = [];
  const otherLines: string[] = [];

  let currentZone: "skills" | "projects" | "experience" | "other" = "other";

  for (const line of lines) {
    // Check for inline section header with content on same line (e.g. "Technical Skills: React, Git, Node.js")
    const inlineSkillsMatch = line.match(
      /^(?:technical\s+skills|skills|skills\s+&\s+tools|core\s+competencies|technical\s+competencies|technologies|tools\s+&\s+technologies|programming\s+languages|developer\s+tools|frameworks)\s*[:\-]\s*(.+)$/i
    );
    if (inlineSkillsMatch) {
      currentZone = "skills";
      skillsLines.push(inlineSkillsMatch[1].trim());
      continue;
    }

    const inlineProjectsMatch = line.match(
      /^(?:projects|academic\s+projects|personal\s+projects|key\s+projects|selected\s+projects|featured\s+projects)\s*[:\-]\s*(.+)$/i
    );
    if (inlineProjectsMatch) {
      currentZone = "projects";
      projectLines.push(inlineProjectsMatch[1].trim());
      continue;
    }

    const inlineExpMatch = line.match(
      /^(?:work\s+experience|professional\s+experience|experience|employment\s+history|employment|internships|internship\s+experience)\s*[:\-]\s*(.+)$/i
    );
    if (inlineExpMatch) {
      currentZone = "experience";
      experienceLines.push(inlineExpMatch[1].trim());
      continue;
    }

    const cleanHeader = line.replace(/[:\-_#*]/g, "").trim().toLowerCase();
    if (
      cleanHeader.length < 50 &&
      /^(?:technical\s+skills|skills|skills\s+&\s+tools|core\s+competencies|technical\s+competencies|technologies|tools\s+&\s+technologies|programming\s+languages|developer\s+tools|frameworks)$/i.test(cleanHeader)
    ) {
      currentZone = "skills";
      continue;
    } else if (
      cleanHeader.length < 50 &&
      /^(?:projects|academic\s+projects|personal\s+projects|key\s+projects|selected\s+projects|featured\s+projects)$/i.test(cleanHeader)
    ) {
      currentZone = "projects";
      continue;
    } else if (
      cleanHeader.length < 50 &&
      /^(?:work\s+experience|professional\s+experience|experience|employment\s+history|employment|internships|internship\s+experience)$/i.test(cleanHeader)
    ) {
      currentZone = "experience";
      continue;
    } else if (
      cleanHeader.length < 50 &&
      /^(?:education|academic\s+background|academics|certifications|achievements|summary|professional\s+summary|profile|about\s+me)$/i.test(cleanHeader)
    ) {
      currentZone = "other";
      continue;
    }

    if (currentZone === "skills") {
      skillsLines.push(line);
    } else if (currentZone === "projects") {
      projectLines.push(line);
    } else if (currentZone === "experience") {
      experienceLines.push(line);
    } else {
      otherLines.push(line);
    }
  }

  const skillsText = skillsLines.join("\n");
  const projectsText = projectLines.join("\n");
  const experienceText = experienceLines.join("\n");
  const otherText = otherLines.join("\n");

  // Helper: Token-specific boundary matcher
  const matchTokenInZone = (token: string, zoneText: string, isExplicitSkillsZone: boolean): { matched: boolean; snippet: string } => {
    if (!zoneText || zoneText.length === 0) return { matched: false, snippet: "" };

    // A. GIT / GITHUB / GITLAB
    // Must NEVER match "digital", "digit", "legit", "agitate", etc.
    if (token === "Git") {
      // Must be bounded by non-alphanumeric punctuation or whitespace
      const gitRegex = /(?:^|[\s,;()[\]{}:/|•*–—])(Git|GitHub|GitLab)(?=[\s,;()[\]{}:/|•*–—]|$)/i;
      const m = zoneText.match(gitRegex);
      if (m) {
        // Strict boundary check: ensure matched term is an exact token
        const matchedWord = m[1];
        if (/^(Git|GitHub|GitLab)$/i.test(matchedWord)) {
          // Double verify not inside "digital"
          const idx = zoneText.indexOf(m[0]);
          const snippet = zoneText.substring(Math.max(0, idx - 10), Math.min(zoneText.length, idx + 20));
          if (!/digital/i.test(snippet)) {
            return { matched: true, snippet: m[0].trim() };
          }
        }
      }
      return { matched: false, snippet: "" };
    }

    // B. JAVA (Must NOT match JavaScript)
    if (token === "Java") {
      // Negative lookahead for "Script"
      const javaRegex = /(?:^|[\s,;()[\]{}:/|•*–—])Java(?=[\s,;()[\]{}:/|•*–—]|$)(?!\s*Script)/i;
      const m = zoneText.match(javaRegex);
      if (m) return { matched: true, snippet: m[0].trim() };
      return { matched: false, snippet: "" };
    }

    // C. REACT (Must NOT match reacted, reacting, reaction, etc.)
    if (token === "React") {
      // Negative lookahead for English verb conjugations or common noun forms
      const reactRegex = /(?:^|[\s,;()[\]{}:/|•*–—])React(?:\.js|js)?(?=[\s,;()[\]{}:/|•*–—]|$)(?!(?:ed|ing|ion|s\b|ive|or|ant))/i;
      const m = zoneText.match(reactRegex);
      if (m) return { matched: true, snippet: m[0].trim() };
      return { matched: false, snippet: "" };
    }

    // D. GO / GOLANG (Common English verb "go")
    if (token === "Go") {
      // Free match for Golang
      if (/(?:^|[\s,;()[\]{}:/|•*–—])Golang(?=[\s,;()[\]{}:/|•*–—]|$)/i.test(zoneText)) {
        return { matched: true, snippet: "Golang" };
      }
      // Inside explicit skills section, allow Go if bounded
      if (isExplicitSkillsZone) {
        const goSkillsRegex = /(?:^|[\s,;()[\]{}:/|•*–—])Go(?=[\s,;()[\]{}:/|•*–—]|$)/;
        const m = zoneText.match(goSkillsRegex);
        if (m) return { matched: true, snippet: m[0].trim() };
      }
      // Outside skills section: must be followed by technical terms
      const goTechRegex = /(?:^|[\s,;()[\]{}:/|•*–—])Go\s+(?:language|programming|developer|engineer|backend|microservices|routines?)(?=[\s,;()[\]{}:/|•*–—]|$)/i;
      const m2 = zoneText.match(goTechRegex);
      if (m2) return { matched: true, snippet: m2[0].trim() };
      return { matched: false, snippet: "" };
    }

    // E. C (Single letter "C")
    if (token === "C") {
      // Inside explicit skills section, allow if adjacent to C++ or in comma-separated list
      if (isExplicitSkillsZone) {
        const cSkillsRegex = /(?:^|[\s,;:/|•*–—])C(?=[\s,;:/|•*–—]|$)/;
        if (cSkillsRegex.test(zoneText) && /\b(?:C\+\+|Python|Java|SQL|Rust|Go)\b/i.test(zoneText)) {
          return { matched: true, snippet: "C language" };
        }
      }
      // Technical compound forms
      const cTechRegex = /(?:^|[\s,;()[\]{}:/|•*–—])(?:C\s+programming|C\s+language|ANSI\s+C|C\s*\/\s*C\+\+)(?=[\s,;()[\]{}:/|•*–—]|$)/i;
      const m = zoneText.match(cTechRegex);
      if (m) return { matched: true, snippet: m[0].trim() };
      return { matched: false, snippet: "" };
    }

    // F. REST / REST APIs (Do not match plain English "rest")
    if (token === "REST" || token === "REST APIs") {
      const restRegex = /(?:^|[\s,;()[\]{}:/|•*–—])(?:REST\s*APIs?|RESTful(?:\s*APIs?)?|REST\s+architecture)(?=[\s,;()[\]{}:/|•*–—]|$)/i;
      const m = zoneText.match(restRegex);
      if (m) return { matched: true, snippet: m[0].trim() };
      if (isExplicitSkillsZone && /(?:^|[\s,;()[\]{}:/|•*–—])REST(?=[\s,;()[\]{}:/|•*–—]|$)/i.test(zoneText)) {
        return { matched: true, snippet: "REST" };
      }
      return { matched: false, snippet: "" };
    }

    // G. SQL (Standalone whole-word)
    if (token === "SQL") {
      const sqlRegex = /(?:^|[\s,;()[\]{}:/|•*–—])SQL(?=[\s,;()[\]{}:/|•*–—]|$)/i;
      const m = zoneText.match(sqlRegex);
      if (m) {
        // High confidence in skills, projects, experience, or if db context exists
        if (isExplicitSkillsZone || /\b(?:database|postgres|mysql|sqlite|queries|relational|schema)\b/i.test(zoneText)) {
          return { matched: true, snippet: m[0].trim() };
        }
      }
      return { matched: false, snippet: "" };
    }

    // Default Boundary Matcher
    const escaped = token.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const defaultRegex = new RegExp(`(?:^|[\\s,;()[\\]{}:/|•*–—])${escaped}(?=[\\s,;()[\\]{}:/|•*–—]|$)`, "i");
    const m = zoneText.match(defaultRegex);
    if (m) return { matched: true, snippet: m[0].trim() };
    return { matched: false, snippet: "" };
  };

  // 2. Iterate Dictionary and Score Each Skill with Context & Confidence
  for (const item of TECH_SKILLS_DICTIONARY) {
    const allNames = [item.name, ...(item.aliases || [])];
    let bestConfidence = 0;
    let bestEvidence = "";
    let bestSection: "skills_section" | "projects" | "experience" | "summary" | "body" = "body";

    for (const token of allNames) {
      // Priority 1: Check Explicit Skills Section (Confidence: 1.0)
      if (skillsText.length > 0) {
        const res = matchTokenInZone(token, skillsText, true);
        if (res.matched) {
          bestConfidence = 1.0;
          bestEvidence = `Listed under technical skills: "${res.snippet}"`;
          bestSection = "skills_section";
          break;
        }
      }

      // Priority 2: Check Projects Block (Confidence: 0.95)
      if (projectsText.length > 0) {
        const res = matchTokenInZone(token, projectsText, false);
        if (res.matched) {
          bestConfidence = 0.95;
          bestEvidence = `Demonstrated in project portfolio: "${res.snippet}"`;
          bestSection = "projects";
          break;
        }
      }

      // Priority 3: Check Professional Experience (Confidence: 0.90)
      if (experienceText.length > 0) {
        const res = matchTokenInZone(token, experienceText, false);
        if (res.matched) {
          bestConfidence = 0.90;
          bestEvidence = `Utilized in professional experience: "${res.snippet}"`;
          bestSection = "experience";
          break;
        }
      }

      // Priority 4: Check Other Sections / Summary / Plain Narrative
      // Only accept if token is a specialized, unambiguous tech name (length >= 4 and not common English)
      if (otherText.length > 0) {
        const res = matchTokenInZone(token, otherText, false);
        if (res.matched) {
          const isAmbiguous = /^(?:Git|Java|Go|C|REST|SQL|ML|NLP|Vite|ES6)$/i.test(token);
          if (!isAmbiguous && token.length >= 4) {
            bestConfidence = 0.80;
            bestEvidence = `Referenced in profile overview: "${res.snippet}"`;
            bestSection = "summary";
            break;
          }
        }
      }
    }

    // Only include skills meeting the 0.75 confidence threshold
    if (bestConfidence >= 0.75) {
      foundSkillsSet.add(item.name);
      if (item.category === "Tools" || item.category === "DevOps" || item.category === "Cloud") {
        foundToolsSet.add(item.name);
      }
      verifiedList.push({
        skill: item.name,
        category: item.category,
        confidence: bestConfidence,
        evidence: bestEvidence,
        sourceSection: bestSection,
      });
    }
  }

  return {
    skills: Array.from(foundSkillsSet),
    tools: Array.from(foundToolsSet),
    verifiedSkills: verifiedList,
  };
}

/**
 * Extracts education details from resume text
 */
export function extractEducationRuleBased(text: string) {
  const degreeRegex = /\b(B\.?Tech|B\.?E\.?|B\.?S\.?|Bachelor(?:'s)?(?:\s+of\s+[A-Za-z]+)?|M\.?Tech|M\.?S\.?|Master(?:'s)?(?:\s+of\s+[A-Za-z]+)?|BCA|MCA|Ph\.?D|Diploma)\b/i;
  const yearRegex = /\b(20[1-2][0-9](?:\s*[-–—to]\s*(?:20[1-2][0-9]|Present|Current))?)\b/i;
  const gpaRegex = /\b(?:CGPA|GPA|Score)[:\s]*([0-9.]+)\s*(?:\/\s*10|\/\s*4)?|\b([6-9][0-9](?:\.[0-9]+)?%)/i;

  const degMatch = text.match(degreeRegex);
  const yrMatch = text.match(yearRegex);
  const gpaMatch = text.match(gpaRegex);

  const degree = degMatch ? degMatch[0] : "";
  const graduation_year = yrMatch ? yrMatch[0] : undefined;
  const cgpa_or_percentage = gpaMatch ? (gpaMatch[1] || gpaMatch[2]) : undefined;

  let institution = "University / College";
  const collegeMatch = text.match(/([A-Z][A-Za-z\s&]+(?:University|Institute|College|Academy|School\s+of\s+[A-Za-z]+))/);
  if (collegeMatch && collegeMatch[1].length < 60) {
    institution = collegeMatch[1].trim();
  }

  if (degree || collegeMatch) {
    return [
      {
        institution,
        degree: degree || "Technical Degree",
        graduation_year,
        cgpa_or_percentage,
        field_of_study: /computer science|information technology|software engineering|data science|electrical/i.test(text)
          ? "Computer Science & Engineering"
          : "Engineering / Technology",
      },
    ];
  }

  return [];
}

/**
 * High-Precision Evidence-Based Resume Evaluation Engine
 * Evaluates 10 Core Dimensions with dynamic normalization for Students/Freshers vs Experienced.
 */
export function analyzeResumeRuleBased(
  extractedText: string,
  initialData: ParsedResumeData,
  userPreferences?: { target_career?: string; interests?: string[] }
): RuleBasedAnalysisResult {
  const clean = extractedText.replace(/\s+/g, " ").trim();
  const lower = clean.toLowerCase();

  // 1. Refine skills & section extraction (preserve newlines for section parsing)
  const { skills: extractedSkills, tools: extractedTools } = extractSkillsRuleBased(extractedText);
  const combinedSkills = Array.from(new Set([...(initialData.technical_skills || []), ...extractedSkills]));
  const combinedTools = Array.from(new Set([...(initialData.tools_and_technologies || []), ...extractedTools]));

  const education = (initialData.education && initialData.education.length > 0)
    ? initialData.education
    : extractEducationRuleBased(extractedText);

  const sections = extractResumeSections(extractedText);

  const parsedData: ParsedResumeData = {
    ...initialData,
    summary: initialData.summary || sections.summary,
    technical_skills: combinedSkills,
    tools_and_technologies: combinedTools,
    education,
    projects: (initialData.projects && initialData.projects.length > 0) ? initialData.projects : sections.projects,
    work_experience: (initialData.work_experience && initialData.work_experience.length > 0) ? initialData.work_experience : sections.work_experience,
    internships: (initialData.internships && initialData.internships.length > 0) ? initialData.internships : sections.internships,
    certifications: (initialData.certifications && initialData.certifications.length > 0) ? initialData.certifications : sections.certifications,
    achievements: (initialData.achievements && initialData.achievements.length > 0) ? initialData.achievements : sections.achievements,
  };

  // 2. Candidate Archetype Determination
  const hasCorporateExperience = (parsedData.work_experience || []).length > 0;
  const isSeniorOrExperienced =
    hasCorporateExperience &&
    (lower.includes("years of experience") ||
      lower.includes("senior") ||
      lower.includes("lead") ||
      (parsedData.work_experience || []).length >= 2);

  const isFresher =
    !isSeniorOrExperienced &&
    (!hasCorporateExperience ||
      lower.includes("fresher") ||
      lower.includes("undergraduate") ||
      lower.includes("seeking summer") ||
      lower.includes("candidate for b.s") ||
      ((parsedData.internships || []).length > 0 && (parsedData.work_experience || []).length === 0));

  const candidateLevel: "student_fresher" | "experienced_professional" = isFresher
    ? "student_fresher"
    : "experienced_professional";

  // 3. Category Evaluation Array (10 Core Areas)
  const categories: CategoryEvaluation[] = [];
  const checklist: ATSChecklistItem[] = [];

  // ==========================================
  // Area 1: Contact Information (10% weight)
  // ==========================================
  const contactDeductions: Array<{ reason: string; points: number; actionableFix: string }> = [];
  const contactEvidence: string[] = [];
  let contactScore = 100;

  if (parsedData.email) {
    contactEvidence.push(`Valid professional email verified: ${parsedData.email}`);
  } else {
    contactScore -= 30;
    contactDeductions.push({
      reason: "Missing direct contact email address",
      points: 30,
      actionableFix: "Include a clean, professional email (e.g. name@domain.com) at the very top.",
    });
  }

  if (parsedData.phone) {
    contactEvidence.push(`Contact phone number provided: ${parsedData.phone}`);
  } else {
    contactScore -= 20;
    contactDeductions.push({
      reason: "Missing contact telephone number",
      points: 20,
      actionableFix: "Add a phone number with country code for recruiter outreach.",
    });
  }

  if (parsedData.github_url || /github\.com/i.test(clean)) {
    contactEvidence.push("Public GitHub profile link detected for code verification.");
  } else {
    contactScore -= 25;
    contactDeductions.push({
      reason: "Missing GitHub repository portfolio link",
      points: 25,
      actionableFix: "Add a clickable GitHub profile link showcasing your open-source projects.",
    });
  }

  if (parsedData.linkedin_url || /linkedin\.com/i.test(clean)) {
    contactEvidence.push("LinkedIn professional profile link verified.");
  } else {
    contactScore -= 15;
    contactDeductions.push({
      reason: "Missing LinkedIn profile link",
      points: 15,
      actionableFix: "Include a customized LinkedIn profile URL (e.g. linkedin.com/in/yourname).",
    });
  }

  contactScore = Math.max(0, contactScore);
  categories.push({
    category: "Contact & Online Presence",
    score: contactScore,
    weight: 0.10,
    weightedScore: Math.round(contactScore * 0.10),
    status: contactScore >= 80 ? "passed" : contactScore >= 50 ? "warning" : "needs_improvement",
    positiveEvidence: contactEvidence,
    deductions: contactDeductions,
  });

  checklist.push({
    id: "ats-contact-info",
    category: "Contact & Identity",
    criterion: "Comprehensive contact information (Email, Phone, GitHub, LinkedIn)",
    status: contactScore >= 80 ? "passed" : contactScore >= 50 ? "warning" : "missing",
    feedback: contactEvidence.join(" • ") || "Incomplete contact details.",
    weight: 10,
  });

  // ==========================================
  // Area 2: Professional Summary (10% weight)
  // ==========================================
  const summaryDeductions: Array<{ reason: string; points: number; actionableFix: string }> = [];
  const summaryEvidence: string[] = [];
  let summaryScore = 100;

  if (parsedData.summary && parsedData.summary.length >= 40) {
    summaryEvidence.push(`Distinct professional summary identified (${parsedData.summary.length} characters).`);
    if (/years of experience|developer|engineer|specialist|passionate|proficient/i.test(parsedData.summary)) {
      summaryEvidence.push("Contains clear career objective and target competency alignment.");
    }
  } else if (parsedData.summary && parsedData.summary.length < 40) {
    summaryScore -= 35;
    summaryDeductions.push({
      reason: "Professional summary is too brief",
      points: 35,
      actionableFix: "Expand summary to 2-3 sentences highlighting your core stack, top achievements, and target trajectory.",
    });
  } else {
    summaryScore -= 50;
    summaryDeductions.push({
      reason: "Missing dedicated professional summary or career objective",
      points: 50,
      actionableFix: "Add a 2-3 line Professional Summary at the top of your resume before the skills section.",
    });
  }

  summaryScore = Math.max(0, summaryScore);
  categories.push({
    category: "Professional Summary & Objective",
    score: summaryScore,
    weight: 0.10,
    weightedScore: Math.round(summaryScore * 0.10),
    status: summaryScore >= 75 ? "passed" : summaryScore >= 50 ? "warning" : "needs_improvement",
    positiveEvidence: summaryEvidence,
    deductions: summaryDeductions,
  });

  checklist.push({
    id: "ats-summary",
    category: "Value Proposition",
    criterion: "Dedicated Professional Summary or Career Objective",
    status: summaryScore >= 75 ? "passed" : summaryScore >= 50 ? "warning" : "missing",
    feedback: summaryEvidence[0] || "Include a 2-3 sentence overview of your technical expertise.",
    weight: 10,
  });

  // ==========================================
  // Area 3: Technical Skills Depth (25% weight for Experienced, 30% for Fresher)
  // ==========================================
  const skillsWeight = isFresher ? 0.30 : 0.25;
  const skillsDeductions: Array<{ reason: string; points: number; actionableFix: string }> = [];
  const skillsEvidence: string[] = [];
  let skillsScore = 100;

  const count = combinedSkills.length;
  if (count >= 10) {
    skillsEvidence.push(`Extensive technical breadth: detected ${count} verified skills (${combinedSkills.slice(0, 6).join(", ")}).`);
  } else if (count >= 6) {
    skillsEvidence.push(`Solid technical foundation: detected ${count} skills.`);
    skillsScore -= 15;
  } else if (count >= 3) {
    skillsScore -= 35;
    skillsDeductions.push({
      reason: `Moderate skill count: only ${count} technical competencies detected`,
      points: 35,
      actionableFix: "Explicitly list programming languages, databases, cloud platforms, and dev tools you use.",
    });
  } else {
    skillsScore -= 60;
    skillsDeductions.push({
      reason: "Low technical keyword density detected",
      points: 60,
      actionableFix: "Create a dedicated 'Technical Skills' section categorized into Languages, Frameworks, Databases, and Tools.",
    });
  }

  skillsScore = Math.max(0, skillsScore);
  categories.push({
    category: "Technical & Soft Skills",
    score: skillsScore,
    weight: skillsWeight,
    weightedScore: Math.round(skillsScore * skillsWeight),
    status: skillsScore >= 80 ? "passed" : skillsScore >= 55 ? "warning" : "needs_improvement",
    positiveEvidence: skillsEvidence,
    deductions: skillsDeductions,
  });

  checklist.push({
    id: "ats-skills-footprint",
    category: "Technical Competencies",
    criterion: "Core technical skill keywords (at least 6-8 verified competencies)",
    status: skillsScore >= 80 ? "passed" : skillsScore >= 55 ? "warning" : "missing",
    feedback: skillsEvidence[0] || "List your programming languages, frameworks, and database technologies.",
    weight: 20,
  });

  // ==========================================
  // Area 4: Projects & Practical Code (15% for Experienced, 25% for Fresher)
  // ==========================================
  const projectsWeight = isFresher ? 0.25 : 0.15;
  const projectDeductions: Array<{ reason: string; points: number; actionableFix: string }> = [];
  const projectEvidence: string[] = [];
  let projectScore = 100;

  const projCount = (parsedData.projects || []).length;
  const metricRegex = /\d+%\s*|\d+x\s*|\$[\d,]+|\b\d+\s*(?:users|clients|requests|ms|seconds|stars|downloads|queries)\b/i;
  const hasMetrics = metricRegex.test(clean);

  if (projCount >= 2) {
    projectEvidence.push(`Identified ${projCount} structured projects with technology stacks.`);
  } else if (projCount === 1) {
    projectEvidence.push("1 project identified. Adding a second project significantly improves recruiter interest.");
    projectScore -= 25;
    projectDeductions.push({
      reason: "Only 1 project found on resume",
      points: 25,
      actionableFix: "Add at least 2-3 production-grade capstone projects demonstrating full-stack problem solving.",
    });
  } else {
    projectScore -= 50;
    projectDeductions.push({
      reason: "No structured Projects section detected",
      points: 50,
      actionableFix: "Include a 'Key Projects' section with project names, descriptions, tech stacks, and live links.",
    });
  }

  if (hasMetrics) {
    projectEvidence.push("Quantifiable impact metrics detected in bullet points (e.g. latency, user volume, performance %).");
  } else {
    projectScore -= 20;
    projectDeductions.push({
      reason: "Project descriptions lack quantifiable impact metrics",
      points: 20,
      actionableFix: "Use the Google XYZ formula: 'Accomplished [X] measured by [Y] by doing [Z]' (e.g. 'Reduced API response times by 35%').",
    });
  }

  projectScore = Math.max(0, projectScore);
  categories.push({
    category: "Projects & Practical Application",
    score: projectScore,
    weight: projectsWeight,
    weightedScore: Math.round(projectScore * projectsWeight),
    status: projectScore >= 75 ? "passed" : projectScore >= 50 ? "warning" : "needs_improvement",
    positiveEvidence: projectEvidence,
    deductions: projectDeductions,
  });

  checklist.push({
    id: "ats-projects",
    category: "Practical Application",
    criterion: "Structured project portfolio with tech stack and quantifiable metrics",
    status: projectScore >= 75 ? "passed" : projectScore >= 50 ? "warning" : "missing",
    feedback: projectEvidence.join(" • ") || "Detail your major development projects with measurable results.",
    weight: 15,
  });

  // ==========================================
  // Area 5: Work Experience & Internships (20% for Experienced, Not Applicable / Fairly Redistributed for Fresher)
  // ==========================================
  const expDeductions: Array<{ reason: string; points: number; actionableFix: string }> = [];
  const expEvidence: string[] = [];
  let expScore = 100;
  const expWeight = isFresher ? 0.0 : 0.20;

  if (isFresher) {
    // For Fresher/Student: Work Experience is NOT APPLICABLE.
    // If they have internships, acknowledge as strong bonus; otherwise do NOT penalize!
    if (parsedData.internships && parsedData.internships.length > 0) {
      expScore = 100;
      expEvidence.push(`Valuable internship experience detected: ${parsedData.internships.map(i => i.role).join(", ")}.`);
    } else {
      expScore = 90;
      expEvidence.push("Fresher / Student Profile: Corporate work experience is optional. Scored primarily on projects and core competencies.");
    }

    categories.push({
      category: "Work Experience & Internships",
      score: expScore,
      weight: 0.0,
      weightedScore: 0,
      status: "not_applicable",
      positiveEvidence: expEvidence,
      deductions: [],
    });
  } else {
    // For Experienced Candidates:
    const expCount = (parsedData.work_experience || []).length;
    if (expCount >= 2) {
      expEvidence.push(`Documented ${expCount} employment roles with professional responsibilities.`);
    } else if (expCount === 1) {
      expEvidence.push("1 employment role identified.");
      expScore -= 20;
    } else {
      expScore -= 50;
      expDeductions.push({
        reason: "Missing corporate work experience details",
        points: 50,
        actionableFix: "Include past employment history with company names, job titles, dates, and bullet points.",
      });
    }

    expScore = Math.max(0, expScore);
    categories.push({
      category: "Work Experience & Internships",
      score: expScore,
      weight: expWeight,
      weightedScore: Math.round(expScore * expWeight),
      status: expScore >= 75 ? "passed" : expScore >= 50 ? "warning" : "needs_improvement",
      positiveEvidence: expEvidence,
      deductions: expDeductions,
    });

    checklist.push({
      id: "ats-experience",
      category: "Experience",
      criterion: "Documented professional employment history",
      status: expScore >= 75 ? "passed" : expScore >= 50 ? "warning" : "missing",
      feedback: expEvidence.join(" • ") || "List your professional work history.",
      weight: 15,
    });
  }

  // ==========================================
  // Area 6: Education & Credentials (10% for Experienced, 15% for Fresher)
  // ==========================================
  const eduWeight = isFresher ? 0.15 : 0.10;
  const eduDeductions: Array<{ reason: string; points: number; actionableFix: string }> = [];
  const eduEvidence: string[] = [];
  let eduScore = 100;

  if (education.length > 0) {
    const e = education[0];
    eduEvidence.push(`Academic credentials identified: ${e.degree} from ${e.institution}`);
    if (e.graduation_year) {
      eduEvidence.push(`Graduation year verified: ${e.graduation_year}`);
    } else {
      eduScore -= 20;
      eduDeductions.push({
        reason: "Graduation year or completion timeline omitted",
        points: 20,
        actionableFix: "Add graduation year (e.g. 2024 or 2021 - 2025) to assist recruiters with experience calibration.",
      });
    }
  } else {
    eduScore -= 45;
    eduDeductions.push({
      reason: "No recognized academic degree or institution detected",
      points: 45,
      actionableFix: "Include an Education section indicating your degree, college/university, and graduation year.",
    });
  }

  eduScore = Math.max(0, eduScore);
  categories.push({
    category: "Education & Academics",
    score: eduScore,
    weight: eduWeight,
    weightedScore: Math.round(eduScore * eduWeight),
    status: eduScore >= 80 ? "passed" : eduScore >= 50 ? "warning" : "needs_improvement",
    positiveEvidence: eduEvidence,
    deductions: eduDeductions,
  });

  checklist.push({
    id: "ats-education-record",
    category: "Education",
    criterion: "Recognized degree, university, and graduation year",
    status: eduScore >= 80 ? "passed" : eduScore >= 50 ? "warning" : "missing",
    feedback: eduEvidence[0] || "Add education credentials.",
    weight: 10,
  });

  // ==========================================
  // Area 7: Grammar, Action Verbs & Readability (10% weight)
  // ==========================================
  const grammarDeductions: Array<{ reason: string; points: number; actionableFix: string }> = [];
  const grammarEvidence: string[] = [];
  let grammarScore = 100;

  const actionVerbs = [
    "developed", "built", "engineered", "implemented", "designed", "architected",
    "optimized", "spearheaded", "deployed", "scaled", "automated", "created", "refactored"
  ];
  const foundVerbs = actionVerbs.filter(v => new RegExp(`\\b${v}\\b`, "i").test(clean));

  if (foundVerbs.length >= 4) {
    grammarEvidence.push(`Strong active voice: identified ${foundVerbs.length} impact verbs (${foundVerbs.slice(0, 3).join(", ")}).`);
  } else if (foundVerbs.length >= 2) {
    grammarScore -= 20;
    grammarDeductions.push({
      reason: "Moderate action verb frequency in bullet points",
      points: 20,
      actionableFix: "Begin bullet points with powerful past-tense verbs (e.g. Architected, Optimized, Deployed).",
    });
  } else {
    grammarScore -= 40;
    grammarDeductions.push({
      reason: "Passive phrasing or weak action verbs detected",
      points: 40,
      actionableFix: "Replace passive phrases like 'Responsible for' or 'Worked on' with strong action verbs.",
    });
  }

  grammarScore = Math.max(0, grammarScore);
  categories.push({
    category: "Action Verbs & Readability",
    score: grammarScore,
    weight: 0.10,
    weightedScore: Math.round(grammarScore * 0.10),
    status: grammarScore >= 75 ? "passed" : grammarScore >= 50 ? "warning" : "needs_improvement",
    positiveEvidence: grammarEvidence,
    deductions: grammarDeductions,
  });

  checklist.push({
    id: "ats-action-verbs-list",
    category: "Readability & Voice",
    criterion: "Bullet points driven by high-impact action verbs",
    status: grammarScore >= 75 ? "passed" : grammarScore >= 50 ? "warning" : "missing",
    feedback: grammarEvidence[0] || "Use strong action verbs to start each bullet.",
    weight: 10,
  });

  // ==========================================
  // Area 8: ATS Formatting & Parsability (10% weight)
  // ==========================================
  const atsDeductions: Array<{ reason: string; points: number; actionableFix: string }> = [];
  const atsEvidence: string[] = [];
  let atsScore = 100;

  if (clean.length >= 400 && clean.length <= 4000) {
    atsEvidence.push(`Optimal textual density for ATS scanners (${clean.length} characters, ~${Math.round(clean.length / 5)} words).`);
  } else if (clean.length < 400) {
    atsScore -= 30;
    atsDeductions.push({
      reason: "Resume text is concise; keyword coverage may be limited",
      points: 30,
      actionableFix: "Add deeper technical details about project implementations and challenges solved.",
    });
  }

  atsScore = Math.max(0, atsScore);
  categories.push({
    category: "ATS Layout & Parsability",
    score: atsScore,
    weight: 0.10,
    weightedScore: Math.round(atsScore * 0.10),
    status: atsScore >= 75 ? "passed" : "warning",
    positiveEvidence: atsEvidence,
    deductions: atsDeductions,
  });

  checklist.push({
    id: "ats-parsability-check",
    category: "Formatting",
    criterion: "Clean single-column textual hierarchy compatible with ATS algorithms",
    status: atsScore >= 75 ? "passed" : "warning",
    feedback: atsEvidence[0] || "Ensure single-column layout without complex textboxes.",
    weight: 5,
  });

  // ==========================================
  // Composite Score Calculation
  // ==========================================
  const overallScore = Math.min(
    98,
    Math.max(25, categories.reduce((sum, c) => sum + c.weightedScore, 0))
  );

  // Compile Strengths & Weaknesses directly from positiveEvidence and deductions
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  categories.forEach((cat) => {
    cat.positiveEvidence.forEach((ev) => {
      if (strengths.length < 5) strengths.push(ev);
    });
    cat.deductions.forEach((ded) => {
      if (weaknesses.length < 4) {
        weaknesses.push(`${ded.reason} (-${ded.points} pts in ${cat.category})`);
      }
      if (suggestions.length < 5) {
        suggestions.push(ded.actionableFix);
      }
    });
  });

  if (strengths.length === 0) {
    strengths.push("Readable document structure with standard font and layout.");
  }
  if (suggestions.length === 0) {
    suggestions.push("Tailor your primary technical skills to match the exact keywords of your target job description.");
  }

  // Summary
  const summary = `Resume evaluated using Careerly's evidence-based rubric for a ${
    isFresher ? "Fresher / Student" : "Professional"
  } profile. Verified ${combinedSkills.length} technical competencies and ${
    education.length > 0 ? education[0].degree : "foundational qualifications"
  }. Overall Job Readiness Rating is ${overallScore}% based on contact completeness, project depth, and ATS compatibility.`;

  // Career Matching against CAREER_DATABASE
  const candidateSkillsLower = new Set(combinedSkills.map((s) => s.toLowerCase()));

  const careerMatches = CAREER_DATABASE.map((career) => {
    const requiredSkills = career.skills.map((s) => s.name);
    const matched: string[] = [];
    const missing: string[] = [];

    for (const reqSkill of requiredSkills) {
      const reqLower = reqSkill.toLowerCase();
      const hasMatch = Array.from(candidateSkillsLower).some(
        (cs) => cs === reqLower || cs.includes(reqLower) || reqLower.includes(cs)
      );
      if (hasMatch) {
        matched.push(reqSkill);
      } else {
        missing.push(reqSkill);
      }
    }

    const baseRatio = matched.length / Math.max(requiredSkills.length, 1);
    let matchScore = Math.round(baseRatio * 100);

    if (
      userPreferences?.target_career &&
      career.title.toLowerCase() === userPreferences.target_career.toLowerCase()
    ) {
      matchScore = Math.min(98, matchScore + 15);
    }

    matchScore = Math.max(40, Math.min(96, matchScore));

    const explanation =
      matched.length > 0
        ? `Matches ${matched.length} core competencies: ${matched.slice(0, 3).join(", ")}. Missing ${missing.length} benchmark skills to reach full proficiency.`
        : `High-growth trajectory that builds upon your technical problem-solving foundation.`;

    const capstoneProject =
      career.roadmapPhases[career.roadmapPhases.length - 1]?.project ||
      `${career.title} Production Capstone Deliverable`;

    return {
      career_title: career.title,
      match_score: matchScore,
      explanation,
      matching_skills: matched,
      missing_skills: missing,
      suggested_projects: [capstoneProject],
      learning_path_summary: `Structured 5-phase curriculum available in Careerly roadmap covering ${
        missing.slice(0, 3).join(", ") || "advanced production concepts"
      }.`,
    };
  }).sort((a, b) => b.match_score - a.match_score);

  return {
    parsedData,
    analysis: {
      overall_score: overallScore,
      candidate_level: candidateLevel,
      summary,
      strengths,
      weaknesses,
      suggestions,
      ats_checklist: checklist,
      formatting_notes:
        "Notice: This assessment is an approximate Careerly heuristic evaluating clarity, completeness, and keyword presence — not an employer's proprietary ATS score.",
      categories,
    },
    recommendedCareers: careerMatches.slice(0, 5),
    aiSource: "rule-based",
  };
}

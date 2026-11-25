/**
 * CAREERLY – High-Precision Resume Section Extractor
 * Extracts Projects, Experience, Education, Certifications, Summary, and Contact info
 * from raw unstructured text.
 */

import { ParsedProject, ParsedExperience, ParsedEducation } from "../../types";

export interface ExtractedSections {
  summary: string | null;
  projects: ParsedProject[];
  work_experience: ParsedExperience[];
  internships: ParsedExperience[];
  certifications: string[];
  achievements: string[];
  soft_skills: string[];
}

/**
 * Standard section heading markers in tech resumes
 */
const SECTION_HEADERS = [
  { key: "summary", regex: /^(?:professional\s+summary|summary|career\s+objective|objective|about\s+me|profile)$/i },
  { key: "experience", regex: /^(?:work\s+experience|professional\s+experience|experience|employment\s+history|employment)$/i },
  { key: "internships", regex: /^(?:internships|internship\s+experience)$/i },
  { key: "projects", regex: /^(?:projects|academic\s+projects|personal\s+projects|key\s+projects|selected\s+projects)$/i },
  { key: "education", regex: /^(?:education|academic\s+background|academics|qualifications)$/i },
  { key: "skills", regex: /^(?:technical\s+skills|skills|skills\s+&\s+tools|core\s+competencies|competencies|technologies)$/i },
  { key: "certifications", regex: /^(?:certifications|certificates|licenses|licenses\s+&\s+certifications)$/i },
  { key: "achievements", regex: /^(?:achievements|honors|awards|honors\s+&\s+awards)$/i },
];

/**
 * Parses raw resume text into distinct structural blocks
 */
export function extractResumeSections(rawText: string): ExtractedSections {
  const lines = rawText.split("\n").map(l => l.trim()).filter(Boolean);

  const sectionBlocks: Record<string, string[]> = {
    summary: [],
    experience: [],
    internships: [],
    projects: [],
    education: [],
    skills: [],
    certifications: [],
    achievements: [],
  };

  let currentSection: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line is a section header (clean short line, usually <= 4 words)
    if (line.length < 40 && !line.includes("@") && !line.includes("http")) {
      const cleanHeader = line.replace(/[:\-_#*]/g, "").trim();
      const matched = SECTION_HEADERS.find(h => h.regex.test(cleanHeader));
      if (matched) {
        currentSection = matched.key;
        continue;
      }
    }

    if (currentSection && sectionBlocks[currentSection]) {
      sectionBlocks[currentSection].push(line);
    }
  }

  // 1. Extract Summary
  let summary: string | null = null;
  if (sectionBlocks.summary.length > 0) {
    summary = sectionBlocks.summary.slice(0, 8).join(" ");
  }

  // 2. Extract Projects
  const projects = parseProjectsBlock(sectionBlocks.projects, rawText);

  // 3. Extract Experience & Internships
  const { workExperience, internships } = parseExperienceBlock(
    sectionBlocks.experience,
    sectionBlocks.internships,
    rawText
  );

  // 4. Extract Certifications & Achievements
  const certifications = parseListBlock(sectionBlocks.certifications, rawText, "certifications");
  const achievements = parseListBlock(sectionBlocks.achievements, rawText, "achievements");

  // 5. Extract Soft Skills
  const softSkills = extractSoftSkills(rawText);

  return {
    summary,
    projects,
    work_experience: workExperience,
    internships,
    certifications,
    achievements,
    soft_skills: softSkills,
  };
}

/**
 * Parses project entries from text lines
 */
function parseProjectsBlock(lines: string[], rawText: string): ParsedProject[] {
  const projects: ParsedProject[] = [];

  if (lines.length === 0) {
    // Fallback: search for common project patterns in rawText
    const projectMatch = rawText.match(/(?:Projects|Key Projects)[\s\S]*?(?:Education|Skills|Experience|Certifications|$)/i);
    if (projectMatch) {
      lines = projectMatch[0].split("\n").map(l => l.trim()).filter(Boolean).slice(1);
    }
  }

  let currentProject: ParsedProject | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect project heading: typically title followed by (React, Node) or a link or short title
    const techInLine = line.match(/(?:Tech(?:nologies)?|Stack|Built with)[:\s-]*([^)]+)/i);
    const linkInLine = line.match(/(?:https?:\/\/)?(?:www\.)?(?:github\.com\/[^\s]+|[a-z0-9-]+\.(?:vercel\.app|netlify\.app|com)[^\s]*)/i);

    // If line looks like a project title (short, capitalized, no bullet prefix)
    const isHeaderLine =
      line.length < 70 &&
      !line.startsWith("•") &&
      !line.startsWith("-") &&
      !line.startsWith("*") &&
      !/implemented|developed|created|built|designed|engineered/i.test(line.slice(0, 15));

    if (isHeaderLine) {
      if (currentProject && currentProject.description) {
        projects.push(currentProject);
      }

      // Extract technologies mentioned in parentheses or title
      const extractedTech: string[] = [];
      const parenMatch = line.match(/\(([^)]+)\)/);
      if (parenMatch) {
        parenMatch[1].split(/[,|/]/).forEach(t => extractedTech.push(t.trim()));
      }

      currentProject = {
        title: line.replace(/\([^)]+\)/g, "").replace(/[-|].*$/, "").trim(),
        description: "",
        technologies: extractedTech,
        link: linkInLine ? linkInLine[0] : undefined,
      };
    } else if (currentProject) {
      if (techInLine) {
        techInLine[1].split(/[,|/]/).forEach(t => currentProject!.technologies.push(t.trim()));
      } else {
        const cleanDesc = line.replace(/^[•\-*]\s*/, "");
        if (currentProject.description) {
          currentProject.description += " " + cleanDesc;
        } else {
          currentProject.description = cleanDesc;
        }
      }
      if (linkInLine && !currentProject.link) {
        currentProject.link = linkInLine[0];
      }
    }
  }

  if (currentProject && currentProject.description) {
    projects.push(currentProject);
  }

  return projects.slice(0, 6);
}

/**
 * Parses work experience & internship items
 */
function parseExperienceBlock(
  expLines: string[],
  internLines: string[],
  rawText: string
): { workExperience: ParsedExperience[]; internships: ParsedExperience[] } {
  const workExperience: ParsedExperience[] = [];
  const internships: ParsedExperience[] = [];

  const combinedLines = [...expLines, ...internLines];

  if (combinedLines.length === 0) {
    const expMatch = rawText.match(/(?:Work Experience|Experience|Employment)[\s\S]*?(?:Projects|Education|Skills|Certifications|$)/i);
    if (expMatch) {
      combinedLines.push(...expMatch[0].split("\n").map(l => l.trim()).filter(Boolean).slice(1));
    }
  }

  let currentExp: ParsedExperience | null = null;

  for (let i = 0; i < combinedLines.length; i++) {
    const line = combinedLines[i];
    const dateMatch = line.match(/\b(20[1-2][0-9]|Present|Current)\b/i);

    const isExpHeader =
      line.length < 80 &&
      (dateMatch ||
        /\b(?:Engineer|Developer|Intern|Analyst|Consultant|Manager|Architect|Lead|Associate|Specialist)\b/i.test(line));

    if (isExpHeader && !line.startsWith("•") && !line.startsWith("-")) {
      if (currentExp && currentExp.description) {
        if (/intern/i.test(currentExp.role) || /intern/i.test(currentExp.company)) {
          internships.push(currentExp);
        } else {
          workExperience.push(currentExp);
        }
      }

      const parts = line.split(/[-–—|@,]/).map(p => p.trim());
      const role = parts[0] || "Software Professional";
      const company = parts[1] || "Technology Company";
      const duration = dateMatch ? line.match(/(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?\d{4}\s*[-–—to]\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:\d{4}|Present|Current)/i)?.[0] : undefined;

      currentExp = {
        role,
        company,
        duration,
        description: "",
        bullets: [],
      };
    } else if (currentExp) {
      const cleanBullet = line.replace(/^[•\-*]\s*/, "");
      if (cleanBullet.length > 10) {
        currentExp.bullets = currentExp.bullets || [];
        currentExp.bullets.push(cleanBullet);
        currentExp.description = currentExp.bullets.join(" ");
      }
    }
  }

  if (currentExp && currentExp.description) {
    if (/intern/i.test(currentExp.role) || /intern/i.test(currentExp.company)) {
      internships.push(currentExp);
    } else {
      workExperience.push(currentExp);
    }
  }

  return {
    workExperience: workExperience.slice(0, 5),
    internships: internships.slice(0, 3),
  };
}

/**
 * Extracts line items for certifications and achievements
 */
function parseListBlock(lines: string[], rawText: string, type: "certifications" | "achievements"): string[] {
  const items: string[] = [];

  if (lines.length === 0) {
    const regex = type === "certifications"
      ? /(?:Certifications|Licenses)[\s\S]*?(?:Projects|Education|Skills|Experience|$)/i
      : /(?:Achievements|Awards|Honors)[\s\S]*?(?:Projects|Education|Skills|Experience|$)/i;
    const match = rawText.match(regex);
    if (match) {
      lines = match[0].split("\n").map(l => l.trim()).filter(Boolean).slice(1);
    }
  }

  for (const line of lines) {
    const clean = line.replace(/^[•\-*#\d.]\s*/, "").trim();
    if (clean.length > 5 && clean.length < 120 && !clean.includes("http")) {
      items.push(clean);
    }
  }

  return Array.from(new Set(items)).slice(0, 8);
}

/**
 * Extracts recognized professional soft skills
 */
function extractSoftSkills(text: string): string[] {
  const softSkillsDict = [
    "Problem Solving",
    "Communication",
    "Team Collaboration",
    "Agile Methodology",
    "Scrum",
    "Critical Thinking",
    "Leadership",
    "Time Management",
    "Adaptability",
    "Code Reviews",
    "Mentorship",
    "Cross-Functional Coordination",
  ];

  const found: string[] = [];
  const lower = text.toLowerCase();

  for (const s of softSkillsDict) {
    if (lower.includes(s.toLowerCase())) {
      found.push(s);
    }
  }

  return found;
}

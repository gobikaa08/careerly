"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Target, RotateCcw } from "lucide-react";
import { CAREER_DATABASE } from "@/lib/careers-data";
import { setGlobalTargetRole } from "@/lib/target-role";

const ASSESSMENT_QUESTIONS = [
  {
    id: "q1",
    phase: "Interests & Passions",
    question: "When approaching a challenging project, which type of activity excites you the most?",
    subtitle: "Select the option that feels most natural and energizing to you.",
    options: [
      { id: "q1_a", text: "Building tangible digital products and seeing code turn into working apps", tags: { "Full-Stack Web Developer": 30, "UI/UX Product Designer": 15, "AI & Machine Learning Engineer": 10 } },
      { id: "q1_b", text: "Training intelligent algorithms, analyzing trends, and solving mathematical puzzles", tags: { "AI & Machine Learning Engineer": 30, "Data Scientist & Analytics Lead": 30 } },
      { id: "q1_c", text: "Crafting visually stunning layouts, micro-interactions, and human-centered experiences", tags: { "UI/UX Product Designer": 35, "Full-Stack Web Developer": 10 } },
      { id: "q1_d", text: "Securing systems, orchestrating cloud networks, and automating server infrastructure", tags: { "Cloud & DevOps Solutions Engineer": 30, "Cybersecurity Analyst & Threat Hunter": 30 } },
      { id: "q1_e", text: "Defining product strategy, aligning teams, and driving business growth", tags: { "Technical Product Manager": 30 } }
    ]
  },
  {
    id: "q2",
    phase: "Interests & Passions",
    question: "How do you prefer to spend your daily work time?",
    subtitle: "Choose the environment where you do your deepest, best work.",
    options: [
      { id: "q2_a", text: "Hands-on writing and debugging code across frontend and backend stacks", tags: { "Full-Stack Web Developer": 25, "Cloud & DevOps Solutions Engineer": 15 } },
      { id: "q2_b", text: "Exploring data sets, running experiments, and building statistical models", tags: { "Data Scientist & Analytics Lead": 25, "AI & Machine Learning Engineer": 25 } },
      { id: "q2_c", text: "Sketching user flows, interviewing users, and designing interfaces in Figma", tags: { "UI/UX Product Designer": 30 } },
      { id: "q2_d", text: "Hunting security vulnerabilities, monitoring traffic, and configuring firewalls", tags: { "Cybersecurity Analyst & Threat Hunter": 30, "Cloud & DevOps Solutions Engineer": 20 } },
      { id: "q2_e", text: "Aligning roadmap priorities and translating customer pain points into specs", tags: { "Technical Product Manager": 30 } }
    ]
  },
  {
    id: "q3",
    phase: "Technical Affinity",
    question: "What is your comfort or interest level with programming languages?",
    subtitle: "Be honest—there are great career paths for all technical preferences.",
    options: [
      { id: "q3_a", text: "Love programming deeply (JavaScript/TypeScript, Python, APIs, DBs)", tags: { "Full-Stack Web Developer": 30, "AI & Machine Learning Engineer": 25, "Cloud & DevOps Solutions Engineer": 20 } },
      { id: "q3_b", text: "Excited by Python, SQL queries, and scientific libraries (Pandas, PyTorch)", tags: { "AI & Machine Learning Engineer": 30, "Data Scientist & Analytics Lead": 30 } },
      { id: "q3_c", text: "Prefer visual design, UX psychology, and only light HTML/CSS understanding", tags: { "UI/UX Product Designer": 35 } },
      { id: "q3_d", text: "Prefer scripting, terminal commands, Linux Bash, and cloud automation", tags: { "Cloud & DevOps Solutions Engineer": 30, "Cybersecurity Analyst & Threat Hunter": 25 } },
      { id: "q3_e", text: "Prefer strategic thinking, user empathy, and no-code analytics over writing code", tags: { "Technical Product Manager": 30 } }
    ]
  },
  {
    id: "q4",
    phase: "Technical Affinity",
    question: "How do you feel about working with mathematics, statistics, and data models?",
    subtitle: "Helps calibrate analytical vs design vs engineering weighting.",
    options: [
      { id: "q4_a", text: "I love statistics, probability, matrices, and quantitative hypotheses", tags: { "AI & Machine Learning Engineer": 30, "Data Scientist & Analytics Lead": 35 } },
      { id: "q4_b", text: "Comfortable with logic and algorithms, but don't want pure academic math", tags: { "Full-Stack Web Developer": 25, "Cloud & DevOps Solutions Engineer": 20 } },
      { id: "q4_c", text: "I care about product business metrics (conversion rates, churn, user retention)", tags: { "Technical Product Manager": 30 } },
      { id: "q4_d", text: "I prefer visual creativity, emotional resonance, and ergonomics over numbers", tags: { "UI/UX Product Designer": 30 } }
    ]
  },
  {
    id: "q5",
    phase: "Work Style & Strengths",
    question: "Which of these personal strengths best characterizes your problem-solving style?",
    subtitle: "Your innate cognitive strengths dictate which roles will feel effortless.",
    options: [
      { id: "q5_a", text: "Architectural builder: breaking complex requirements into elegant components", tags: { "Full-Stack Web Developer": 30, "Cloud & DevOps Solutions Engineer": 20 } },
      { id: "q5_b", text: "Investigative analyst: questioning data, spotting anomalies, uncovering truth", tags: { "Data Scientist & Analytics Lead": 30, "Cybersecurity Analyst & Threat Hunter": 25 } },
      { id: "q5_c", text: "Empathic creator: deeply understanding human frustration and simplifying friction", tags: { "UI/UX Product Designer": 35 } },
      { id: "q5_d", text: "Resilience champion: protecting systems, anticipating disasters, ensuring uptime", tags: { "Cloud & DevOps Solutions Engineer": 25, "Cybersecurity Analyst & Threat Hunter": 30 } },
      { id: "q5_e", text: "Strategic communicator: rallying people around a bold vision and prioritizing value", tags: { "Technical Product Manager": 35 } }
    ]
  },
  {
    id: "q6",
    phase: "Work Style & Strengths",
    question: "How do you respond when a problem is ambiguous with no clear single answer?",
    subtitle: "Different tech disciplines handle ambiguity in distinct ways.",
    options: [
      { id: "q6_a", text: "I run prototypes and fast experiments to see what works practically", tags: { "Full-Stack Web Developer": 25 } },
      { id: "q6_b", text: "I gather data, conduct research, and calculate probabilities", tags: { "Data Scientist & Analytics Lead": 30, "AI & Machine Learning Engineer": 25 } },
      { id: "q6_c", text: "I talk to users, observe their behavior, and test wireframes", tags: { "UI/UX Product Designer": 30, "Technical Product Manager": 25 } },
      { id: "q6_d", text: "I perform threat assessments, audit configurations, and eliminate risks", tags: { "Cybersecurity Analyst & Threat Hunter": 30, "Cloud & DevOps Solutions Engineer": 25 } }
    ]
  },
  {
    id: "q7",
    phase: "Career Goals & Outcomes",
    question: "What is your primary career motivation over the next 2-3 years?",
    subtitle: "Aligning your path with your true motivation leads to long-term success.",
    options: [
      { id: "q7_a", text: "Building high-demand technical craft with strong remote job opportunities", tags: { "Full-Stack Web Developer": 25, "Cloud & DevOps Solutions Engineer": 20 } },
      { id: "q7_b", text: "Pioneering at the bleeding edge of Artificial Intelligence and deep tech", tags: { "AI & Machine Learning Engineer": 35, "Data Scientist & Analytics Lead": 20 } },
      { id: "q7_c", text: "Expressing creative design talent while influencing how millions experience software", tags: { "UI/UX Product Designer": 30 } },
      { id: "q7_d", text: "High job security, mission-critical defense, and vital enterprise necessity", tags: { "Cybersecurity Analyst & Threat Hunter": 35, "Cloud & DevOps Solutions Engineer": 25 } },
      { id: "q7_e", text: "Fast-tracking into leadership, executive influence, or founding a startup", tags: { "Technical Product Manager": 30 } }
    ]
  },
  {
    id: "q8",
    phase: "Career Goals & Outcomes",
    question: "What type of project portfolio would you be proudest to show an employer?",
    subtitle: "Your portfolio is your ultimate passport to landing interviews.",
    options: [
      { id: "q8_a", text: "A deployed, full-stack web application with responsive UI, auth, and database", tags: { "Full-Stack Web Developer": 35 } },
      { id: "q8_b", text: "An autonomous AI agent / RAG application with custom PyTorch models", tags: { "AI & Machine Learning Engineer": 35 } },
      { id: "q8_c", text: "A Figma design system with verified user research case studies and prototypes", tags: { "UI/UX Product Designer": 35 } },
      { id: "q8_d", text: "A multi-cloud automated CI/CD pipeline and Kubernetes cluster via Terraform", tags: { "Cloud & DevOps Solutions Engineer": 35 } },
      { id: "q8_e", text: "A security audit report disclosing vulnerabilities and hardening strategies", tags: { "Cybersecurity Analyst & Threat Hunter": 35 } },
      { id: "q8_f", text: "A comprehensive PRD, product strategy roadmap, and user metrics analysis", tags: { "Technical Product Manager": 35 } }
    ]
  }
];

export default function CareerAssessmentPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any[] | null>(null);
  const [settingTarget, setSettingTarget] = useState(false);

  const q = ASSESSMENT_QUESTIONS[currentStep];
  const progress = Math.round(((currentStep + 1) / ASSESSMENT_QUESTIONS.length) * 100);

  const handleSelectOption = (optId: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: optId }));
  };

  const handleNext = () => {
    if (!answers[q.id]) {
      alert("Please select an option to proceed.");
      return;
    }

    if (currentStep < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResults();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateResults = () => {
    const scores: Record<string, number> = {};
    CAREER_DATABASE.forEach((c) => {
      scores[c.title] = 0;
    });

    Object.entries(answers).forEach(([questionId, optId]) => {
      const question = ASSESSMENT_QUESTIONS.find((qu) => qu.id === questionId);
      const option = question?.options.find((o) => o.id === optId);
      if (option?.tags) {
        Object.entries(option.tags).forEach(([careerTitle, weight]) => {
          if (scores[careerTitle] !== undefined) {
            scores[careerTitle] += weight;
          }
        });
      }
    });

    const ranked = Object.entries(scores)
      .map(([title, rawScore]) => {
        const career = CAREER_DATABASE.find((c) => c.title === title) || CAREER_DATABASE[0];
        const matchScore = Math.min(98, Math.max(45, Math.round((rawScore / 160) * 100)));
        return {
          career,
          matchScore,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    setResults(ranked);
  };

  const handleSetTargetAndNavigate = async (careerTitle: string, careerId?: string) => {
    setSettingTarget(true);
    try {
      await setGlobalTargetRole(careerTitle);
      router.push(`/skill-gap?career=${careerId || encodeURIComponent(careerTitle)}`);
    } catch {
      alert("Failed to set target career.");
    } finally {
      setSettingTarget(false);
    }
  };

  if (results) {
    const topMatch = results[0];
    const secondaries = results.slice(1, 4);

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 mb-2 inline-block">
            ✓ Evaluation Completed
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Your Personalized Career Alignment
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Calculated using our transparent multi-trait scoring matrix.
          </p>
        </div>

        {/* Top Recommendation Hero */}
        <div className="mb-10 p-8 rounded-3xl bg-white dark:bg-[#111827] border-2 border-indigo-600 shadow-xl space-y-4">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-600 text-white">
              TOP MATCH • {topMatch.matchScore}% ALIGNMENT
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {topMatch.career.projectedGrowth}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{topMatch.career.title}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {topMatch.career.overview}
          </p>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-3">
            <button
              onClick={() => handleSetTargetAndNavigate(topMatch.career.title, topMatch.career.id)}
              disabled={settingTarget}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center gap-2"
            >
              Select as Target Career &amp; Analyze Gaps <ArrowRight size={16} />
            </button>
            <Link
              href={`/roadmap?career=${topMatch.career.id}`}
              className="px-5 py-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              Preview Roadmap
            </Link>
          </div>
        </div>

        {/* Secondary Matches */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Strong Secondary Matches</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {secondaries.map((sec, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600">{sec.matchScore}% Match</span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1 mb-2">{sec.career.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{sec.career.tagline}</p>
              </div>

              <button
                onClick={() => handleSetTargetAndNavigate(sec.career.title, sec.career.id)}
                className="mt-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
              >
                Set as Target →
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setResults(null);
              setCurrentStep(0);
              setAnswers({});
            }}
            className="text-xs text-slate-500 hover:text-indigo-600 font-semibold inline-flex items-center gap-1.5"
          >
            <RotateCcw size={14} /> Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Step Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
            {q.phase}
          </span>
          <span className="text-slate-400 font-semibold">
            Question {currentStep + 1} of {ASSESSMENT_QUESTIONS.length}
          </span>
        </div>

        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
            {q.question}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{q.subtitle}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt) => {
            const isSelected = answers[q.id] === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between gap-4 ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-white font-semibold ring-1 ring-indigo-600"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                }`}
              >
                <span>{opt.text}</span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300"
                  }`}
                >
                  {isSelected && <CheckCircle2 size={14} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-500 hover:text-slate-800 disabled:opacity-30 flex items-center gap-1.5"
          >
            <ArrowLeft size={16} /> Previous
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center gap-1.5"
          >
            {currentStep === ASSESSMENT_QUESTIONS.length - 1 ? "Calculate Alignment" : "Next Question"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Briefcase, Sparkles, Loader2 } from "lucide-react";
import { Experience, PersonalInfo } from "@/types/cv";
import AccordionSection from "./AccordionSection";
import { Button } from "@/components/ui/button";
import QuillTextEditor from "./QuillTextEditor";
import {
  cvService,
  type ExperienceAssessment,
} from "@/services/cv/cvServiceOptimized";

// ---- 1) TYPE: allow string[] for achievements updates
interface ExperienceSectionProps {
  experiences: Experience[];
  personalInfo: PersonalInfo;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (
    id: string,
    field: string | keyof Experience,
    value: string | boolean | string[] // ⬅️ widened to include string[]
  ) => void;
  onShowAIConsent?: () => void;
  aiConsent?: { aiProcessing: boolean; aiTraining: boolean } | null;
  cvId?: string;
  onCheckExistingConsent?: (
    cvId: string
  ) => Promise<{ aiProcessing: boolean; aiTraining: boolean } | null>;
}

/* ---------------- helpers ---------------- */
function stripTags(s = "") {
  return s.replace(/<[^>]*>/g, "");
}
function normalizeHtml(s = "") {
  return s.replace(/\s+/g, " ").trim();
}
// Simple safe escape for non-HTML description
function escapeHtml(s = "") {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function isHtml(s = "") {
  return /<\/?[a-z][\s\S]*>/i.test(s);
}
function arraysShallowEqual(a: string[] = [], b: string[] = []) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

/** Build Quill-friendly HTML from description + achievements */
function toEditorHtml(desc?: string, achievements?: string[]) {
  const blocks: string[] = [];
  const d = (desc || "").trim();

  if (d) {
    // If desc already contains HTML, keep it; else wrap in <p>
    blocks.push(isHtml(d) ? d : `<p>${escapeHtml(d)}</p>`);
  }

  const items = (achievements || [])
    .map((t) => String(t || "").trim())
    .filter(Boolean)
    .map((t) => `<li>${escapeHtml(t)}</li>`)
    .join("");

  if (items) blocks.push(`<ul>${items}</ul>`);
  return blocks.join("");
}

/** Parse Quill HTML back to { description(html), achievements[] } */
function fromEditorHtml(html: string): {
  description: string;
  achievements: string[];
} {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html || "", "text/html");

    // Collect achievements from any lists
    const liNodes = Array.from(doc.querySelectorAll("ul li, ol li"));
    const achievements = liNodes
      .map((li) => (li.textContent || "").trim())
      .filter(Boolean);

    // Remove lists to isolate description
    doc.querySelectorAll("ul, ol").forEach((n) => n.remove());

    // Remaining HTML is the description (can be multiple <p>, etc.)
    const description = (doc.body.innerHTML || "").trim();

    return { description, achievements };
  } catch {
    // Fallback: treat entire thing as description
    return { description: html || "", achievements: [] };
  }
}

/** Build Quill-friendly HTML: description as <p>, achievements as <ul><li> */
function buildExperienceHtml(description?: string, achievements?: string[]) {
  const blocks: string[] = [];
  const d = (description || "").trim();
  if (d) blocks.push(`<p>${stripTags(d)}</p>`);

  const items = (achievements || [])
    .map((b) => String(b || "").trim())
    .filter(Boolean)
    .map((b) => `<li>${stripTags(b)}</li>`)
    .join("");

  if (items) blocks.push(`<ul>${items}</ul>`);
  return blocks.join("");
}
/* ----------------------------------------- */

export default function ExperienceSection({
  experiences,
  personalInfo,
  onAdd,
  onRemove,
  onUpdate,
  onShowAIConsent,
  aiConsent,
  cvId,
}: ExperienceSectionProps) {
  const [isGeneratingAI, setIsGeneratingAI] = useState<string | null>(null);

  const getExperienceTitle = (exp: Experience) => {
    if (exp.position && exp.company) {
      return `${exp.position} at ${exp.company}`;
    }
    return exp.position || exp.company || "";
  };

  const generateAISuggestion = async (
    expId: string,
    jobTitle: string,
    company: string
  ) => {
    if (!personalInfo || !personalInfo.industry) {
      alert(
        "Please select your industry in the Personal Information section first."
      );
      return;
    }

    // Always fetch latest consent from server by CV id
    let currentConsent = aiConsent as {
      aiProcessing: boolean;
      aiTraining: boolean;
    } | null;
    try {
      if (cvId) {
        const cv = await cvService.getCV(String(cvId));
        const serverConsent = cv?.consent;
        if (serverConsent) {
          currentConsent = {
            aiProcessing: !!serverConsent.aiProcessing,
            aiTraining: !!serverConsent.aiTraining,
          };
        }
      }
    } catch {
      // fall back to local aiConsent
    }

    if (
      !currentConsent ||
      !currentConsent.aiProcessing ||
      !currentConsent.aiTraining
    ) {
      if (onShowAIConsent) onShowAIConsent();
      else
        alert(
          "AI processing and AI training consent are required. Please give consent to use AI features."
        );
      return;
    }

    setIsGeneratingAI(expId);

    try {
      const exp = experiences.find((e) => e.id === expId);
      const targetRole = (
        jobTitle ||
        personalInfo?.targetedJobTitle ||
        ""
      ).trim();
      const industry = (personalInfo?.industry || "").trim();

      const data = await cvService.generateExperience(
        String(cvId),
        { targetRole, industry },
        { jobTitle, company, preferCurrent: !!exp?.current } // ⬅️ helps pick the right item
      );

      const hasDesc = !!data?.description && data.description.trim().length > 0;
      const hasAch =
        Array.isArray(data?.achievements) && data.achievements.length > 0;

      if (!hasDesc && !hasAch) {
        alert("AI did not return any content for this experience.");
        return;
      }

      // ✅ Save both fields
      if (hasDesc) onUpdate(expId, "description", data!.description!);
      if (hasAch) onUpdate(expId, "achievements", data!.achievements!);
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      alert(
        (error as Error)?.message ||
          "Failed to generate AI suggestions. Please try again."
      );
    } finally {
      setIsGeneratingAI(null);
    }
  };

  return (
    <>
      <AccordionSection
        title="Work Experience"
        items={experiences}
        emptyStateIcon={Briefcase}
        emptyStateTitle="No work experience added yet"
        emptyStateDescription='Click "Add Experience" to get started'
        addButtonText="Add Experience"
        onAdd={onAdd}
        onRemove={onRemove}
        getItemTitle={getExperienceTitle}
      >
        {(exp: Experience) => (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => onUpdate(exp.id, "company", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => onUpdate(exp.id, "position", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Job title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={exp.location || ""}
                  onChange={(e) => onUpdate(exp.id, "location", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="City, State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) =>
                    onUpdate(exp.id, "startDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="month"
                  value={exp.endDate || ""}
                  onChange={(e) => onUpdate(exp.id, "endDate", e.target.value)}
                  disabled={exp.current}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) =>
                    onUpdate(exp.id, "current", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Currently working here
                </label>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    generateAISuggestion(exp.id, exp.position, exp.company)
                  }
                  disabled={
                    isGeneratingAI === exp.id || !exp.position.trim() || !cvId
                  }
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-50 rounded-[10px]"
                  title={
                    !exp.position.trim()
                      ? "Please enter a job position first"
                      : !cvId
                      ? "CV must be created first"
                      : !aiConsent?.aiProcessing
                      ? "AI processing consent required - click to give consent"
                      : "Generate AI-powered experience description"
                  }
                >
                  {isGeneratingAI === exp.id ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-8 w-8" />
                      AI Suggestions
                    </>
                  )}
                </Button>
              </div>

              {/* 🔄 Quill Text Editor (controlled) */}
              <QuillTextEditor
                value={toEditorHtml(exp.description, exp.achievements)}
                onChange={(value) => {
                  const next = fromEditorHtml(value);

                  // Avoid noisy updates
                  const descChanged =
                    normalizeHtml(next.description) !==
                    normalizeHtml(exp.description || "");

                  const achChanged = !arraysShallowEqual(
                    (exp.achievements || []).map((s) => s.trim()),
                    (next.achievements || []).map((s) => s.trim())
                  );

                  if (!descChanged && !achChanged) return;

                  if (descChanged)
                    onUpdate(exp.id, "description", next.description);
                  if (achChanged)
                    onUpdate(exp.id, "achievements", next.achievements);
                }}
                placeholder="Describe your key responsibilities and achievements…"
              />
            </div>
          </>
        )}
      </AccordionSection>
    </>
  );
}

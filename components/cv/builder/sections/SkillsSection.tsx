"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Award, Trash2, Sparkles, Loader2, X, Check } from "lucide-react";
import { Skill, PersonalInfo } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { cvService } from "@/services/cv/cvServiceOptimized";

interface SkillsSectionProps {
  skills: Skill[];
  personalInfo?: PersonalInfo;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Skill, value: string) => void;
  onShowAIConsent?: () => void;
  aiConsent?: { aiProcessing: boolean; aiTraining: boolean } | null;
  cvId?: string;
}

type AISuggestion = { name: string; score: number; evidence?: string };

function scoreToLevel(score: number): Skill["level"] {
  if (score >= 85) return "Expert";
  if (score >= 65) return "Advanced";
  if (score >= 45) return "Intermediate";
  return "Beginner";
}

export default function SkillsSection({
  skills,
  personalInfo,
  onAdd,
  onRemove,
  onUpdate,
  onShowAIConsent,
  aiConsent,
  cvId,
}: SkillsSectionProps) {
  const [isGeneratingAI, setIsGeneratingAI] = useState<string | null>(null);
  const [openForRow, setOpenForRow] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[] | null>(
    null
  );

  // Remove the hook usage since we have cvId as prop
  // const { generateSkills } = useCVSimplified();

  // Optimistic row edits (so inputs update immediately)
  const [pending, setPending] = useState<Record<string, Partial<Skill>>>({});
  const setRowEdits = (id: string, patch: Partial<Skill>) =>
    setPending((p) => ({ ...p, [id]: { ...p[id], ...patch } }));

  const closePicker = () => setOpenForRow(null);

  // Keep a set of existing skill names to disable duplicates
  const existingNames = useMemo(() => {
    const s = new Set<string>();
    skills.forEach((sk) => {
      const name = (pending[sk.id]?.name ?? sk.name ?? "").trim().toLowerCase();
      if (name) s.add(name);
    });
    return s;
  }, [skills, pending]);

  // Queue for suggestions awaiting a new row (because onAdd doesn't return an id)
  const addQueueRef = useRef<AISuggestion[]>([]);
  const prevCountRef = useRef<number>(skills.length);

  // When parent adds a row, fill it with the next queued suggestion
  useEffect(() => {
    if (skills.length > prevCountRef.current && addQueueRef.current.length) {
      const newRow = skills[skills.length - 1];
      const suggestion = addQueueRef.current.shift()!;
      const level = scoreToLevel(suggestion.score);

      onUpdate(newRow.id, "name", suggestion.name);
      onUpdate(newRow.id, "level", String(level));
      setRowEdits(newRow.id, { name: suggestion.name, level });

      if (addQueueRef.current.length) onAdd();
    }
    prevCountRef.current = skills.length;
  }, [skills, onAdd, onUpdate]);

  const applyOrAdd = (rowId: string, s: AISuggestion) => {
    const level = scoreToLevel(Number(s.score || 0));
    const current = skills.find((k) => k.id === rowId);
    const currentName = ((pending[rowId]?.name ?? current?.name) || "").trim();

    if (!currentName) {
      setRowEdits(rowId, { name: s.name, level });
      onUpdate(rowId, "name", s.name);
      onUpdate(rowId, "level", String(level));
    } else {
      addQueueRef.current.push(s);
      onAdd();
    }
  };

  const generateAISkills = async (rowId: string) => {
    if (!personalInfo?.targetedJobTitle?.trim()) {
      alert("Please fill in your targeted job title first.");
      return;
    }
    if (!cvId || cvId === "undefined" || cvId === "null") {
      alert("CV must be created first.");
      return;
    }

    // Consent check
    try {
      const cv = await cvService.getCV(String(cvId));
      const ok = !!cv?.consent?.aiProcessing && !!cv?.consent?.aiTraining;
      if (!ok && !(aiConsent?.aiProcessing && aiConsent?.aiTraining)) {
        onShowAIConsent ? onShowAIConsent() : alert("AI consent is required.");
        return;
      }
    } catch {
      if (!aiConsent?.aiProcessing || !aiConsent?.aiTraining) {
        onShowAIConsent ? onShowAIConsent() : alert("AI consent is required.");
        return;
      }
    }

    setIsGeneratingAI(rowId);
    try {
      // ✅ call the service directly with cvId prop
      const res = await cvService.generateSkills(
        String(cvId),
        "all",
        undefined,
        {
          targetRole: personalInfo.targetedJobTitle,
          industry: undefined,
        }
      );

      const suggestions: AISuggestion[] =
        (res?.skills ?? [])
          .filter((s) => s?.name)
          .map((s) => ({
            name: s.name,
            score: Number(s.score ?? 0),
            evidence: s.evidence,
          })) || [];

      if (!suggestions.length) {
        alert("No skill suggestions returned. Try again later.");
        return;
      }

      setAiSuggestions(suggestions);
      setOpenForRow(rowId);
    } catch (err) {
      console.error("AI skills error", err);
      alert("Failed to generate AI skills. Please try again.");
    } finally {
      setIsGeneratingAI(null);
    }
  };

  const addSuggestions = (
    list: AISuggestion[],
    opts: { replace?: boolean; top5?: boolean } = {}
  ) => {
    const base = opts.top5 ? list.slice(0, 5) : list;

    // de-dupe against what’s already in the section
    const toAdd = base.filter(
      (s) => !existingNames.has((s.name || "").trim().toLowerCase())
    );

    if (opts.replace) {
      // clear current skills first
      skills.forEach((k) => onRemove(k.id));
    }

    if (toAdd.length === 0) {
      alert("All suggested skills are already present.");
      return;
    }

    // queue them; your useEffect will fill rows as they're added
    addQueueRef.current.push(...toAdd);
    for (let i = 0; i < toAdd.length; i++) onAdd();

    setOpenForRow(null); // close the popover
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl font-bold text-gray-900 dark:text-white" />
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Add Skill</span>
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-12">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No skills added yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Click &quot;Add Skill&quot; to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {skills.map((skill) => {
            const local = pending[skill.id] || {};
            const valueName = (local.name ?? skill.name) || "";
            const valueLevel = (local.level ?? skill.level) || "Beginner";
            const isOpen = openForRow === skill.id && !!aiSuggestions?.length;

            return (
              <div
                key={skill.id}
                className="relative p-4 border border-gray-200 dark:border-gray-700 rounded-[10px]"
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={valueName}
                      onChange={(e) => {
                        setRowEdits(skill.id, { name: e.target.value });
                        onUpdate(skill.id, "name", e.target.value);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Skill name"
                    />

                    {/* AI button + popover */}
                    {/* <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          isOpen
                            ? setOpenForRow(null)
                            : generateAISkills(skill.id)
                        }
                        disabled={isGeneratingAI === skill.id || !cvId}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-50 min-w-[60px] rounded-[5px]"
                        title={
                          !cvId
                            ? "CV must be created first"
                            : !personalInfo?.targetedJobTitle?.trim()
                            ? "Please fill in your targeted job title first"
                            : "Show AI skill suggestions"
                        }
                      >
                        {isGeneratingAI === skill.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="h-3 w-3" />
                            <span className="text-xs">
                              {isOpen ? "Hide" : "AI"}
                            </span>
                          </>
                        )}
                      </Button>

                      {isOpen && (
                        <div
                          className="absolute left-full top-0 ml-2 z-30 w-[420px] max-h-80 overflow-auto rounded-[10px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl"
                          role="dialog"
                          aria-label="AI skill suggestions"
                        >
                          <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              Select all the skills you want
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={() => addSuggestions(aiSuggestions!)}
                              >
                                Add all
                              </button>
                              <button
                                className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={() =>
                                  addSuggestions(aiSuggestions!, { top5: true })
                                }
                              >
                                Add top 5
                              </button>
                              <button
                                className="text-xs px-2 py-1 border rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                                onClick={() =>
                                  addSuggestions(aiSuggestions!, {
                                    replace: true,
                                  })
                                }
                                title="Replace current skills with AI suggestions"
                              >
                                Replace
                              </button>

                              <button
                                onClick={closePicker}
                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                aria-label="Close suggestions"
                              >
                                <X className="h-4 w-4 text-gray-500" />
                              </button>
                            </div>
                          </div>

                          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                            {aiSuggestions!.map((s, idx) => {
                              const key = (s.name || "").trim().toLowerCase();
                              const alreadyAdded = existingNames.has(key);
                              const level = scoreToLevel(s.score);

                              return (
                                <li
                                  key={`${s.name}-${idx}`}
                                  className={`p-3 cursor-pointer select-none ${
                                    alreadyAdded
                                      ? "opacity-50"
                                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                  }`}
                                  onClick={() => {
                                    if (alreadyAdded) return;
                                    applyOrAdd(skill.id, s);
                                  }}
                                  title={
                                    alreadyAdded
                                      ? "Already added"
                                      : `Click to add ${s.name} (${level})`
                                  }
                                  aria-disabled={alreadyAdded}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                          {s.name}
                                        </span>
                                        <span
                                          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border"
                                          title={`Score: ${s.score}`}
                                        >
                                          {s.score}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {level}
                                        </span>
                                      </div>
                                      {s.evidence && (
                                        <div
                                          className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2"
                                          title={s.evidence}
                                        >
                                          {s.evidence}
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex-shrink-0">
                                      {alreadyAdded ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <div className="h-4 w-4 rounded border border-gray-300 dark:border-gray-600" />
                                      )}
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div> */}
                  </div>

                  <div className="w-32">
                    <select
                      value={valueLevel}
                      onChange={(e) => {
                        const v = e.target.value as Skill["level"];
                        setRowEdits(skill.id, { level: v });
                        onUpdate(skill.id, "level", v as string);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>

                  <button
                    onClick={() => onRemove(skill.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Remove skill"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ResumeSection } from "@/types/cv/index";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import { useAIFeatures } from "@/hooks/useAIFeatures";
import {
  Sparkles,
  Wand2,
  Brain,
  Target,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface AIEnhancedSectionArrangementProps {
  sections: ResumeSection[];
  onReorder: (sections: ResumeSection[]) => void;
  leftColumnSections: string[];
  onLeftColumnChange: (sections: string[]) => void;
  cvId?: string;
  onAISuggestion?: (sectionType: string, suggestion: any) => void;
}

export function AIEnhancedSectionArrangement({
  sections,
  onReorder,
  leftColumnSections,
  onLeftColumnChange,
  cvId,
  onAISuggestion,
}: AIEnhancedSectionArrangementProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // AI Features (commented out - hook deleted)
  // const {
  //   aiResults,
  //   loading: aiFeaturesLoading,
  //   error: aiError,
  //   analyzeExperience,
  //   generateSummary,
  //   extractSkills,
  //   getMatchScore,
  //   enhanceWorkExperience,
  //   formatEducation,
  //   prioritizeSkills,
  //   summarizeProjects,
  //   clearAIResult,
  // } = useAIFeatures(cvId);

  // Default values for AI features
  const aiResults = null;
  const aiFeaturesLoading = false;
  const aiError = null;
  const analyzeExperience = (...args: any[]) => ({
    success: false,
    data: null,
  });
  const generateSummary = (...args: any[]) => ({ success: false, data: null });
  const extractSkills = (...args: any[]) => ({ success: false, data: null });
  const getMatchScore = (...args: any[]) => ({ success: false, data: null });
  const enhanceWorkExperience = (...args: any[]) => ({
    success: false,
    data: null,
  });
  const formatEducation = (...args: any[]) => ({ success: false, data: null });
  const prioritizeSkills = (...args: any[]) => ({ success: false, data: null });
  const summarizeProjects = (...args: any[]) => ({
    success: false,
    data: null,
  });
  const clearAIResult = (...args: any[]) => {};

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  const toggleLeftColumn = (sectionType: string) => {
    const newLeftColumn = leftColumnSections.includes(sectionType)
      ? leftColumnSections.filter((type) => type !== sectionType)
      : [...leftColumnSections, sectionType];

    onLeftColumnChange(newLeftColumn);
  };

  const getSectionDisplayName = (type: string) => {
    const names: { [key: string]: string } = {
      "personal-info": "Personal Information",
      "professional-summary": "Professional Summary",
      "work-experience": "Work Experience",
      education: "Education",
      skills: "Skills",
      languages: "Languages",
      projects: "Projects",
      certifications: "Certifications",
      awards: "Awards",
      interests: "Interests",
      courses: "Courses",
      organizations: "Organizations",
      publications: "Publications",
      references: "References",
      declarations: "Declarations",
      custom: "Custom Section",
    };
    return (
      names[type] ||
      type?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
      type ||
      "Unknown Section"
    );
  };

  const handleAIAnalysis = async (
    sectionType: string,
    analysisType: string
  ) => {
    if (!cvId) {
      alert("CV ID is required for AI analysis");
      return;
    }

    setAiLoading(`${sectionType}-${analysisType}`);

    try {
      let result;

      switch (analysisType) {
        case "experience":
          result = await analyzeExperience({
            context: { targetRole: "Software Engineer" },
          });
          break;
        case "summary":
          result = await generateSummary({
            tone: "professional and concise",
            context: { targetRole: "Software Engineer" },
          });
          break;
        case "skills":
          result = await extractSkills({
            level: "top-5",
            context: { targetRole: "Software Engineer" },
          });
          break;
        case "match-score":
          result = await getMatchScore({
            context: {
              targetRole: "Software Engineer",
              industry: "Technology",
            },
          });
          break;
        case "enhance-work":
          result = await enhanceWorkExperience({
            prompt: "Rewrite to emphasize achievements and quantify impact",
          });
          break;
        case "format-education":
          result = await formatEducation({
            context: { targetRole: "Software Engineer" },
          });
          break;
        case "prioritize-skills":
          result = await prioritizeSkills({
            context: { targetRole: "Software Engineer" },
          });
          break;
        case "summarize-projects":
          result = await summarizeProjects({
            prompt:
              "Create concise project summaries highlighting key achievements",
          });
          break;
        default:
          return;
      }

      if (result.success && result.data && onAISuggestion) {
        onAISuggestion(sectionType, result.data);
      }
    } catch (error) {
      console.error("AI analysis failed:", error);
    } finally {
      setAiLoading(null);
    }
  };

  const getAIActions = (sectionType: string) => {
    const actions: {
      [key: string]: Array<{
        type: string;
        label: string;
        icon: React.ReactNode;
      }>;
    } = {
      "work-experience": [
        {
          type: "enhance-work",
          label: "Enhance",
          icon: <Wand2 className="h-3 w-3" />,
        },
        {
          type: "experience",
          label: "Analyze",
          icon: <Brain className="h-3 w-3" />,
        },
      ],
      "professional-summary": [
        {
          type: "summary",
          label: "Generate",
          icon: <Sparkles className="h-3 w-3" />,
        },
      ],
      skills: [
        {
          type: "prioritize-skills",
          label: "Prioritize",
          icon: <Target className="h-3 w-3" />,
        },
        {
          type: "skills",
          label: "Extract",
          icon: <Brain className="h-3 w-3" />,
        },
      ],
      education: [
        {
          type: "format-education",
          label: "Format",
          icon: <Wand2 className="h-3 w-3" />,
        },
      ],
      projects: [
        {
          type: "summarize-projects",
          label: "Summarize",
          icon: <Sparkles className="h-3 w-3" />,
        },
      ],
    };

    return actions[sectionType] || [];
  };

  const getAIResult = (sectionType: string, analysisType: string) => {
    const key = `${sectionType}-${analysisType}`;
    return aiResults?.[key] || aiResults?.[analysisType];
  };

  return (
    <div className="bg-white border rounded-[10px] p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">Section Arrangement</h3>
          {cvId && (
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm hover:bg-purple-200 transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              <span>AI</span>
            </button>
          )}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
        >
          {isOpen ? "Hide" : "Arrange Sections"}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          {/* AI Panel */}
          {showAIPanel && cvId && (
            <div className="bg-purple-50 border border-purple-200 rounded-[10px] p-4 mb-4">
              <h4 className="text-sm font-medium text-purple-900 mb-3 flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                AI-Powered Enhancements
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAIAnalysis("all", "match-score")}
                  disabled={aiLoading === "all-match-score"}
                  className="flex items-center justify-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {aiLoading === "all-match-score" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Target className="h-3 w-3" />
                  )}
                  <span>Match Score</span>
                </button>
                <button
                  onClick={() => handleAIAnalysis("all", "summary")}
                  disabled={aiLoading === "all-summary"}
                  className="flex items-center justify-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {aiLoading === "all-summary" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  <span>Generate Summary</span>
                </button>
              </div>

              {aiError && (
                <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-red-700 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {aiError}
                </div>
              )}
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Drag to reorder sections:
            </h4>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {sections.map((section, index) => {
                      const aiActions = getAIActions(section.type);
                      const isLoading = aiLoading?.startsWith(section.type);

                      return (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-gray-50 border rounded-[10px] p-3 transition-all ${
                                snapshot.isDragging
                                  ? "shadow-lg bg-blue-50 border-blue-300"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="text-gray-400 hover:text-gray-600 cursor-grab"
                                  >
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                      />
                                    </svg>
                                  </div>

                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900">
                                      {getSectionDisplayName(section.type)}
                                    </h5>
                                    <p className="text-sm text-gray-500">
                                      {section.visible ? "Visible" : "Hidden"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  {/* AI Actions */}
                                  {aiActions.length > 0 && cvId && (
                                    <div className="flex space-x-1">
                                      {aiActions.map((action) => (
                                        <button
                                          key={action.type}
                                          onClick={() =>
                                            handleAIAnalysis(
                                              section.type,
                                              action.type
                                            )
                                          }
                                          disabled={isLoading}
                                          className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 disabled:opacity-50 transition-colors"
                                        >
                                          {isLoading ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                          ) : (
                                            action.icon
                                          )}
                                          <span>{action.label}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  {/* Left Column Toggle */}
                                  <button
                                    onClick={() =>
                                      toggleLeftColumn(section.type)
                                    }
                                    className={`px-2 py-1 rounded text-xs transition-colors ${
                                      leftColumnSections.includes(section.type)
                                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                  >
                                    {leftColumnSections.includes(
                                      section.type
                                    ) ? (
                                      <CheckCircle className="h-3 w-3" />
                                    ) : (
                                      <div className="h-3 w-3 border border-gray-400 rounded" />
                                    )}
                                  </button>

                                  {/* Visibility Toggle */}
                                  <button
                                    onClick={() => {
                                      // Toggle visibility logic would go here
                                      console.log(
                                        "Toggle visibility for",
                                        section.type
                                      );
                                    }}
                                    className={`px-2 py-1 rounded text-xs transition-colors ${
                                      section.visible
                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                        : "bg-red-100 text-red-700 hover:bg-red-200"
                                    }`}
                                  >
                                    {section.visible ? "Show" : "Hide"}
                                  </button>
                                </div>
                              </div>

                              {/* AI Results Display */}
                              {aiActions.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {aiActions.map((action) => {
                                    const result = getAIResult(
                                      section.type,
                                      action.type
                                    );
                                    if (!result) return null;

                                    return (
                                      <div
                                        key={action.type}
                                        className="p-2 bg-purple-50 border border-purple-200 rounded text-xs"
                                      >
                                        <div className="font-medium text-purple-900 mb-1">
                                          {action.label} Result:
                                        </div>
                                        <div className="text-purple-700">
                                          {typeof result === "string"
                                            ? result
                                            : JSON.stringify(result, null, 2)}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Left Column Sections */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Left Column Sections:
            </h4>
            <div className="flex flex-wrap gap-2">
              {leftColumnSections.map((sectionType) => (
                <span
                  key={sectionType}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                >
                  {getSectionDisplayName(sectionType)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  Briefcase,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Target,
  Upload,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  BarChart3,
  Lightbulb,
  Zap,
} from "lucide-react";

interface JobBoard {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  requirements: {
    minSkills: number;
    requiredSections: string[];
    maxLength: number;
  };
}

interface ATS {
  id: string;
  name: string;
  description: string;
  compatibility: number;
  requirements: {
    format: string;
    maxFileSize: number;
    keywords: string[];
    sections: string[];
  };
  tips: string[];
}

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  jobBoard: string;
  appliedAt: Date;
  status: "applied" | "reviewed" | "interview" | "rejected" | "accepted";
}

interface JobBoardIntegrationProps {
  jobBoards: JobBoard[];
  atsSystems: ATS[];
  applications: JobApplication[];
  onSubmitToJobBoard: (
    jobBoardId: string,
    jobId: string,
    jobTitle: string,
    company: string
  ) => Promise<void>;
  onCheckATSCompatibility: (atsId: string) => number;
  onGetOptimizationSuggestions: (atsId: string) => string[];
  onValidateCV: (jobBoardId: string) => { isValid: boolean; errors: string[] };
  onGetRecommendedJobBoards: () => JobBoard[];
}

export default function JobBoardIntegration({
  jobBoards,
  atsSystems,
  applications,
  onSubmitToJobBoard,
  onCheckATSCompatibility,
  onGetOptimizationSuggestions,
  onValidateCV,
  onGetRecommendedJobBoards,
}: JobBoardIntegrationProps) {
  const [activeTab, setActiveTab] = useState<
    "job-boards" | "ats" | "applications"
  >("job-boards");
  const [selectedJobBoard, setSelectedJobBoard] = useState<string | null>(null);
  const [selectedATS, setSelectedATS] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20";
      case "reviewed":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20";
      case "interview":
        return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20";
      case "accepted":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20";
      case "rejected":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getCompatibilityBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  const handleJobBoardSubmit = async (jobBoardId: string) => {
    setIsSubmitting(true);
    try {
      // This would be a form submission in a real app
      await onSubmitToJobBoard(
        jobBoardId,
        "job-123",
        "Software Engineer",
        "Tech Company"
      );
    } catch (error) {
      console.error("Failed to submit to job board:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[10px] shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-[10px] flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Job Board Integration
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Apply to jobs and optimize for ATS systems
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-[10px] p-1">
          {[
            { id: "job-boards", label: "Job Boards", icon: Briefcase },
            { id: "ats", label: "ATS Compatibility", icon: Target },
            { id: "applications", label: "Applications", icon: Clock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "job-boards" && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobBoards.map((jobBoard) => {
              const validation = onValidateCV(jobBoard.id);
              const isRecommended =
                onGetRecommendedJobBoards().includes(jobBoard);

              return (
                <div
                  key={jobBoard.id}
                  className={`border rounded-[10px] p-4 transition-colors ${
                    validation.isValid
                      ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                      : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {jobBoard.name}
                    </h3>
                    {isRecommended && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      {validation.isValid ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      <span>
                        {validation.isValid
                          ? "Ready to apply"
                          : "Needs attention"}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Min skills: {jobBoard.requirements.minSkills}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Max length: {jobBoard.requirements.maxLength} words
                    </div>
                  </div>

                  {validation.errors.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {validation.errors.map((error, index) => (
                        <div
                          key={index}
                          className="text-xs text-red-600 dark:text-red-400"
                        >
                          • {error}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => setSelectedJobBoard(jobBoard.id)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-[10px] hover:bg-blue-700 transition-colors"
                      disabled={!validation.isValid || isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Apply"}
                    </button>
                    <button
                      onClick={() => window.open(jobBoard.url, "_blank")}
                      className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-[10px] transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "ats" && (
        <div className="p-6">
          <div className="space-y-4">
            {atsSystems.map((ats) => {
              const compatibility = onCheckATSCompatibility(ats.id);
              const suggestions = onGetOptimizationSuggestions(ats.id);

              return (
                <div
                  key={ats.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-[10px] p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {ats.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {ats.description}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-[10px] ${getCompatibilityBgColor(
                        compatibility
                      )}`}
                    >
                      <span
                        className={`text-sm font-medium ${getCompatibilityColor(
                          compatibility
                        )}`}
                      >
                        {compatibility}% Compatible
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Requirements
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <div>
                          Format: {ats.requirements.format.toUpperCase()}
                        </div>
                        <div>
                          Max size:{" "}
                          {(ats.requirements.maxFileSize / 1024 / 1024).toFixed(
                            1
                          )}
                          MB
                        </div>
                        <div>
                          Sections: {ats.requirements.sections.join(", ")}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Optimization Tips
                      </h4>
                      <div className="space-y-1">
                        {suggestions.slice(0, 3).map((tip, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-300"
                          >
                            <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedATS(ats.id)}
                      className="flex items-center space-x-1 px-3 py-2 text-sm bg-purple-600 text-white rounded-[10px] hover:bg-purple-700 transition-colors"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Optimize for {ats.name}</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-[10px] transition-colors">
                      <BarChart3 className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "applications" && (
        <div className="p-6">
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No applications yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Start applying to jobs to see your application history here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-[10px] p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {application.jobTitle}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{application.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{application.jobBoard}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            Applied {formatDate(application.appliedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <BarChart3 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

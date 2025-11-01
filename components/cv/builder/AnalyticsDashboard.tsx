"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  Lightbulb,
  Zap,
  Award,
  FileText,
  Users,
  Clock,
  Star,
} from "lucide-react";

interface AnalyticsDashboardProps {
  analytics: {
    score: number;
    suggestions: Array<{
      id: string;
      type: "error" | "warning" | "suggestion" | "optimization";
      category: string;
      title: string;
      description: string;
      impact: "high" | "medium" | "low";
    }>;
    strengths: string[];
    weaknesses: string[];
    atsScore: number;
    keywordDensity: Record<string, number>;
    sectionCompleteness: Record<string, number>;
    overallLength: number;
    wordCount: number;
  };
  onSuggestionApply?: (suggestion: any) => void;
}

export default function AnalyticsDashboard({
  analytics,
  onSuggestionApply,
}: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "suggestions" | "keywords" | "sections"
  >("overview");

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/20";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20";
      case "low":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "suggestion":
        return <Lightbulb className="h-4 w-4" />;
      case "optimization":
        return <Zap className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[10px] shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-[10px] flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Resume Analytics
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Optimize your resume for better results
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <div
          className={`px-4 py-2 rounded-[10px] ${getScoreBgColor(
            analytics.score
          )}`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Score
            </span>
            <span
              className={`text-2xl font-bold ${getScoreColor(analytics.score)}`}
            >
              {analytics.score}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-[10px] p-1">
        {[
          { id: "overview", label: "Overview", icon: Target },
          { id: "suggestions", label: "Suggestions", icon: Lightbulb },
          { id: "keywords", label: "Keywords", icon: FileText },
          { id: "sections", label: "Sections", icon: Users },
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

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-[10px] p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-[10px] flex items-center justify-center">
                  <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Overall Score
                  </p>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(
                      analytics.score
                    )}`}
                  >
                    {analytics.score}/100
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-[10px] p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-[10px] flex items-center justify-center">
                  <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    ATS Score
                  </p>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(
                      analytics.atsScore
                    )}`}
                  >
                    {analytics.atsScore}/100
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-[10px] p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-[10px] flex items-center justify-center">
                  <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Word Count
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.wordCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span>Strengths</span>
              </h3>
              <div className="space-y-2">
                {analytics.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300"
                  >
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span>Areas for Improvement</span>
              </h3>
              <div className="space-y-2">
                {analytics.weaknesses.map((weakness, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm text-red-700 dark:text-red-300"
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    <span>{weakness}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "suggestions" && (
        <div className="space-y-4">
          {analytics.suggestions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">
                No suggestions at this time!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your resume looks great.
              </p>
            </div>
          ) : (
            analytics.suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="border border-gray-200 dark:border-gray-600 rounded-[10px] p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-[10px] ${getImpactColor(
                      suggestion.impact
                    )}`}
                  >
                    {getTypeIcon(suggestion.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {suggestion.title}
                      </h4>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(
                          suggestion.impact
                        )}`}
                      >
                        {suggestion.impact}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {suggestion.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {suggestion.category}
                      </span>
                      <button
                        onClick={() => onSuggestionApply?.(suggestion)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Apply fix
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "keywords" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Keyword Density
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analytics.keywordDensity).map(
              ([keyword, count]) => (
                <div
                  key={keyword}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-[10px]"
                >
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {keyword}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((count / 3) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 w-6 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {activeTab === "sections" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Section Completeness
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.sectionCompleteness).map(
              ([section, completeness]) => (
                <div key={section} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {section}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {Math.round(completeness)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        completeness >= 80
                          ? "bg-green-600"
                          : completeness >= 60
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

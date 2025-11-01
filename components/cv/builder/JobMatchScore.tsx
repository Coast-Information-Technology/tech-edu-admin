"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cvService } from "@/services/cv/cvServiceOptimized";

interface JobMatchScoreProps {
  onScoreGenerated?: (score: number, analysis: any) => void;
  cvId?: string;
}

interface MatchAnalysis {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  improvements: string[];
}

export default function JobMatchScore({
  onScoreGenerated,
  cvId,
}: JobMatchScoreProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      if (!cvId) {
        setError("CV must be created first to analyze job match");
        return;
      }

      const result = await cvService.getMatchScore(cvId, jobDescription);

      if (result.success && result.data) {
        const matchAnalysis: MatchAnalysis = {
          score: result.data.score || 0,
          matchedKeywords: result.data.matchedKeywords || [],
          missingKeywords: result.data.missingKeywords || [],
          suggestions: result.data.suggestions || [],
          strengths: result.data.strengths || [],
          improvements: result.data.improvements || [],
        };

        setAnalysis(matchAnalysis);
        onScoreGenerated?.(matchAnalysis.score, matchAnalysis);
      } else {
        setError("Failed to analyze job match. Please try again.");
      }
    } catch (err) {
      console.error("Error analyzing job match:", err);
      setError("Failed to analyze job match. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4" />;
    if (score >= 60) return <AlertCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Job Match Analysis
          </CardTitle>
          <p className="text-sm text-gray-600">
            Paste a job description to see how well your CV matches the
            requirements
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label
              htmlFor="job-description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Job Description
            </label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              className="w-full"
            />
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Analyze Match
              </>
            )}
          </Button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Match Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2">
                {getScoreIcon(analysis.score)}
                <span className="text-2xl font-bold">{analysis.score}%</span>
                <span className="text-sm">Match</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {analysis.score >= 80
                  ? "Excellent match! Your CV aligns well with this role."
                  : analysis.score >= 60
                  ? "Good match with room for improvement."
                  : "Consider updating your CV to better match this role."}
              </p>
            </div>

            {/* Matched Keywords */}
            {analysis.matchedKeywords.length > 0 && (
              <div>
                <h4 className="font-medium text-green-700 mb-2">
                  Matched Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedKeywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {analysis.missingKeywords.length > 0 && (
              <div>
                <h4 className="font-medium text-red-700 mb-2">
                  Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-red-50 text-red-700 border-red-200"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div>
                <h4 className="font-medium text-blue-700 mb-2">Strengths</h4>
                <ul className="space-y-1">
                  {analysis.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {analysis.improvements.length > 0 && (
              <div>
                <h4 className="font-medium text-orange-700 mb-2">
                  Suggested Improvements
                </h4>
                <ul className="space-y-1">
                  {analysis.improvements.map((improvement, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* General Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Additional Suggestions
                </h4>
                <ul className="space-y-1">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

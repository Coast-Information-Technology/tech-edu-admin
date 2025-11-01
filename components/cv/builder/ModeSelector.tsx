"use client";

import React from "react";
import {
  FileText,
  Eye,
  ChevronRight,
  Award,
  Trophy,
  Download,
} from "lucide-react";

interface ModeSelectorProps {
  onModeSelect: (mode: "scratch" | "upload") => void;
}

export default function ModeSelector({ onModeSelect }: ModeSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-slow">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✨</span>
              </div>
            </div>
            <div className="ml-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                ResumeBuilder
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mt-2"></div>
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Create a{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              professional resume
            </span>{" "}
            that stands out from the crowd. Choose how you'd like to start your
            journey to the perfect CV.
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <button
            onClick={() => onModeSelect("scratch")}
            className="group p-10 rounded-3xl border-2 transition-all duration-300 text-left border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm relative overflow-hidden"
          >
            {/* Hover Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                Start from Scratch
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Build your resume from the ground up with our intuitive guided
                form and modern templates
              </p>
              <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform duration-300">
                <span>Get Started</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </button>

          <button
            onClick={() => onModeSelect("upload")}
            className="group p-10 rounded-3xl border-2 transition-all duration-300 text-left border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm relative overflow-hidden"
          >
            {/* Hover Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Eye className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                Upload & Revamp
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Upload your existing resume and let our AI help modernize and
                improve it with smart suggestions
              </p>
              <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400 font-medium group-hover:translate-x-1 transition-transform duration-300">
                <span>Upload CV</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </button>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Why Choose ResumeBuilder?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-[12px] flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Professional Templates
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Choose from modern, ATS-friendly templates
              </p>
            </div>
            <div className="p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-[12px] flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Get smart suggestions to improve your resume
              </p>
            </div>
            <div className="p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-[12px] flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Easy Export
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Download as PDF or share online instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

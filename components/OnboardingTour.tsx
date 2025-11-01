"use client";

import React, { useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, SkipForward } from "lucide-react";

interface OnboardingTourProps {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  currentStepData: {
    id: string;
    title: string;
    content: string;
    placement: "top" | "bottom" | "left" | "right";
  } | null;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export default function OnboardingTour({
  isActive,
  currentStep,
  totalSteps,
  currentStepData,
  onNext,
  onPrevious,
  onSkip,
  onComplete,
}: OnboardingTourProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Add data attributes to elements for targeting
  useEffect(() => {
    if (!isActive || !currentStepData) return;

    const targetElement = document.querySelector(
      `[data-tour="${currentStepData.id}"]`
    );
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isActive, currentStepData]);

  if (!isActive || !currentStepData) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0  z-50 pointer-events-none" />

      {/* Highlighted element overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div className="absolute inset-0 " />
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-50 bg-white dark:bg-gray-800 rounded-[10px] shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm p-6 pointer-events-auto"
        style={
          {
            // Position will be set by the hook
          }
        }
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentStepData.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <div className="flex space-x-1">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index <= currentStep
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="ml-4 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {currentStepData.content}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <button
                onClick={onPrevious}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
            )}
            <button
              onClick={onSkip}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <SkipForward className="h-4 w-4" />
              <span>Skip Tour</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {currentStep === totalSteps - 1 ? (
              <button
                onClick={onComplete}
                className="px-4 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started!
              </button>
            ) : (
              <button
                onClick={onNext}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-[10px] hover:bg-blue-700 transition-colors font-medium"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

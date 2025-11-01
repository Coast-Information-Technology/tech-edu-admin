"use client";

import { useState } from "react";
import { X, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (consent: { aiProcessing: boolean; aiTraining: boolean }) => void;
}

export default function AIConsentModal({
  isOpen,
  onClose,
  onAccept,
}: AIConsentModalProps) {
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiTraining, setAiTraining] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    onAccept({
      aiProcessing,
      aiTraining,
    });
    onClose();
  };

  const handleDecline = () => {
    onAccept({
      aiProcessing: false,
      aiTraining: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-[10px] shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Processing Consent
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[10px] p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    AI Features Available
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    To use AI-powered features like experience suggestions and
                    professional summary generation, we need your consent for AI
                    processing of your CV content.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Our AI Processing Policy
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-[10px] p-4 space-y-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  We process CV content to generate AI suggestions. We do not
                  store raw CV or job-description text in our AI logs. Instead,
                  we keep non-identifying metadata (hashes, model name, token
                  counts) for debugging and quality metrics.
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Where short-lived text is unavoidable, we redact PII and apply
                  automatic deletion within 7–30 days. Users can delete CVs at
                  any time, which also purges related AI logs.
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  We honor explicit consent for any use of data to improve AI
                  models (opt-in only).
                </p>
              </div>
            </div>

            {/* Consent Options */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Consent Options
              </h3>

              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[10px] p-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiProcessing}
                      onChange={(e) => setAiProcessing(e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-[4px]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        AI Processing Consent
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                        "I agree to allow this platform to use AI to analyze and
                        enhance my CV. This includes generating summaries,
                        rephrasing content, and suggesting improvements. My data
                        will only be processed for my personal CV creation and
                        will not be shared or used for training models."
                      </p>
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        ✓ Yes, I allow AI to process my CV data.
                      </div>
                    </div>
                  </label>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[10px] p-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiTraining}
                      onChange={(e) => setAiTraining(e.target.checked)}
                      className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded-[4px]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-green-900 dark:text-green-100 mb-2">
                        AI Training Consent
                      </div>
                      <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                        "I agree to allow my CV data (with all personal
                        identifiers removed) to be used for improving our AI
                        models. This helps make suggestions smarter for
                        everyone. You can withdraw this consent at any time in
                        your settings."
                      </p>
                      <div className="text-sm font-medium text-green-900 dark:text-green-100">
                        ✓ Yes, I allow my anonymized CV data to be used for AI
                        training.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-[10px] p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                    Important Note
                  </h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Each checkbox is optional and separate — you may accept AI
                    processing but not training, or vice versa. You can change
                    these consent settings at any time in your account settings.
                    Declining AI processing will disable AI-powered features but
                    won't affect your ability to create and edit CVs manually.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handleDecline}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Decline & Continue</span>
            </Button>

            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleAccept}
                disabled={!aiProcessing || !aiTraining}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                title={
                  !aiProcessing || !aiTraining
                    ? "Please check both AI Processing and AI Training to continue"
                    : undefined
                }
              >
                <CheckCircle className="h-4 w-4" />
                <span>Accept & Continue</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

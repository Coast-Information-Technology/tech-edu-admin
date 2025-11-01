"use client";

import React from "react";
import { CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";

interface StatusBarProps {
  isSaving?: boolean;
  lastSaved?: Date | null;
  error?: string | null;
  isCreating?: boolean;
  cvId?: string;
  isValid?: boolean;
  errors?: Record<string, string>;
  onSaveNow?: () => Promise<void>;
  onClearErrors?: () => void;
}

export function StatusBar({
  isSaving = false,
  lastSaved = null,
  error = null,
  isCreating = false,
  cvId,
  isValid = true,
  errors = {},
  onSaveNow,
  onClearErrors,
}: StatusBarProps) {
  const getStatusIcon = () => {
    if (error || !isValid) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (isSaving || isCreating) {
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    if (lastSaved) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  const getStatusText = () => {
    if (error) {
      return "Error occurred";
    }
    if (!isValid) {
      return "Validation errors";
    }
    if (isCreating) {
      return "Creating CV...";
    }
    if (isSaving) {
      return "Saving...";
    }
    if (lastSaved) {
      return `Last saved: ${lastSaved.toLocaleTimeString()}`;
    }
    if (cvId) {
      return "Ready";
    }
    return "Not saved";
  };

  const getStatusColor = () => {
    if (error || !isValid) {
      return "text-red-600 bg-red-50 border-red-200";
    }
    if (isSaving || isCreating) {
      return "text-blue-600 bg-blue-50 border-blue-200";
    }
    if (lastSaved) {
      return "text-green-600 bg-green-50 border-green-200";
    }
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div
      className={`px-3 py-2 border rounded-[10px] text-sm flex items-center justify-between ${getStatusColor()}`}
    >
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span>{getStatusText()}</span>
        {cvId && (
          <span className="text-xs opacity-75">(ID: {cvId.slice(-8)})</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-2">
        {!isValid && onClearErrors && (
          <button
            onClick={onClearErrors}
            className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
          >
            Clear Errors
          </button>
        )}
        {onSaveNow && !isSaving && !isCreating && (
          <button
            onClick={onSaveNow}
            className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
          >
            Save Now
          </button>
        )}
      </div>
    </div>
  );
}

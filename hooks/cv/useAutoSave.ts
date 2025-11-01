import { useCallback, useEffect, useRef } from "react";

interface UseAutoSaveOptions {
  data: any;
  saveFunction: (data: any) => Promise<void>;
  delay?: number; // Delay in milliseconds
  enabled?: boolean;
}

export function useAutoSave({
  data,
  saveFunction,
  delay = 2000, // 2 seconds default
  enabled = true,
}: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedDataRef = useRef<string>();

  const saveData = useCallback(async () => {
    try {
      const dataString = JSON.stringify(data);

      // Only save if data has actually changed
      if (dataString !== lastSavedDataRef.current) {
        await saveFunction(data);
        lastSavedDataRef.current = dataString;
        console.log("Auto-save completed");
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, [data, saveFunction]);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(saveData, delay);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveFunction, delay, enabled]);

  // Manual save function
  const manualSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await saveData();
  }, [saveData]);

  return {
    manualSave,
    isSaving: false, // Add this property
    lastSaved: null, // Add this property
    saveNow: manualSave, // Add this property
  };
}

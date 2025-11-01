import { useState, useCallback, useRef } from "react";
import {
  CVBuilderState,
  HistoryState,
  HistoryManager,
} from "@/types/cv/cv-builder";

interface UseHistoryProps {
  initialState: CVBuilderState;
  maxHistorySize?: number;
}

export function useHistory({
  initialState,
  maxHistorySize = 50,
}: UseHistoryProps): HistoryManager {
  const [history, setHistory] = useState<HistoryState[]>([
    {
      state: initialState,
      timestamp: Date.now(),
      action: "Initial State",
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isUndoRedoRef = useRef(false);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const push = useCallback(
    (state: CVBuilderState, action: string) => {
      // Don't push if we're in the middle of an undo/redo operation
      if (isUndoRedoRef.current) {
        isUndoRedoRef.current = false;
        return;
      }

      // Use functional updates to avoid dependency on currentIndex
      setCurrentIndex((prevIndex) => {
        setHistory((prevHistory) => {
          // Remove any history after current index (when user makes new changes after undo)
          const newHistory = prevHistory.slice(0, prevIndex + 1);

          // Add new state
          const newState: HistoryState = {
            state: { ...state },
            timestamp: Date.now(),
            action,
          };

          const updatedHistory = [...newHistory, newState];

          // Limit history size
          if (updatedHistory.length > maxHistorySize) {
            return updatedHistory.slice(-maxHistorySize);
          }

          return updatedHistory;
        });

        // Return new index
        return Math.min(prevIndex + 1, maxHistorySize - 1);
      });
    },
    [maxHistorySize] // Remove currentIndex dependency
  );

  const undo = useCallback((): CVBuilderState | null => {
    if (!canUndo) return null;

    isUndoRedoRef.current = true;
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);

    return history[newIndex].state;
  }, [canUndo, currentIndex, history]);

  const redo = useCallback((): CVBuilderState | null => {
    if (!canRedo) return null;

    isUndoRedoRef.current = true;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);

    return history[newIndex].state;
  }, [canRedo, currentIndex, history]);

  const clear = useCallback(() => {
    setHistory([
      {
        state: initialState,
        timestamp: Date.now(),
        action: "Initial State",
      },
    ]);
    setCurrentIndex(0);
  }, [initialState]);

  return {
    history,
    currentIndex,
    canUndo,
    canRedo,
    push,
    undo,
    redo,
    clear,
  };
}

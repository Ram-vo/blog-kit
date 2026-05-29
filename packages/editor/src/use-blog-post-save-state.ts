"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { EditorialPostInput } from "blog-kit-core";

export type BlogPostSaveStatus = "idle" | "saving" | "saved" | "error";

export interface UseBlogPostSaveStateOptions {
  value: EditorialPostInput;
  initialSavedValue?: EditorialPostInput;
  onSave: (value: EditorialPostInput) => Promise<void> | void;
  now?: () => Date;
  isEqual?: (current: EditorialPostInput, saved: EditorialPostInput) => boolean;
}

export interface BlogPostSaveState {
  isDirty: boolean;
  status: BlogPostSaveStatus;
  lastSavedAt?: Date;
  error?: unknown;
  save: (value?: EditorialPostInput) => Promise<void>;
  resetSavedValue: (value?: EditorialPostInput) => void;
}

function defaultIsEqual(current: EditorialPostInput, saved: EditorialPostInput): boolean {
  return JSON.stringify(current) === JSON.stringify(saved);
}

export function useBlogPostSaveState({
  value,
  initialSavedValue = value,
  onSave,
  now = () => new Date(),
  isEqual = defaultIsEqual
}: UseBlogPostSaveStateOptions): BlogPostSaveState {
  const requestIdRef = useRef(0);
  const [savedValue, setSavedValue] = useState<EditorialPostInput>(initialSavedValue);
  const [status, setStatus] = useState<BlogPostSaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | undefined>();
  const [error, setError] = useState<unknown>();

  const isDirty = useMemo(() => !isEqual(value, savedValue), [isEqual, savedValue, value]);

  const resetSavedValue = useCallback(
    (nextSavedValue: EditorialPostInput = value) => {
      requestIdRef.current += 1;
      setSavedValue(nextSavedValue);
      setStatus("idle");
      setError(undefined);
    },
    [value]
  );

  const save = useCallback(
    async (nextValue: EditorialPostInput = value) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setStatus("saving");
      setError(undefined);

      try {
        await onSave(nextValue);

        if (requestId === requestIdRef.current) {
          setSavedValue(nextValue);
          setLastSavedAt(now());
          setStatus("saved");
          setError(undefined);
        }
      } catch (nextError) {
        if (requestId === requestIdRef.current) {
          setStatus("error");
          setError(nextError);
        }

        throw nextError;
      }
    },
    [now, onSave, value]
  );

  return {
    isDirty,
    status,
    lastSavedAt,
    error,
    save,
    resetSavedValue
  };
}

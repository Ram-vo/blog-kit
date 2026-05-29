import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { EditorialPostInput } from "blog-kit-core";
import { useBlogPostSaveState } from "./use-blog-post-save-state";

function createValue(overrides: Partial<EditorialPostInput> = {}): EditorialPostInput {
  return {
    title: "Draft title",
    slug: "draft-title",
    excerpt: "Draft excerpt",
    content: "Initial content",
    categoryIds: [],
    tags: [],
    isDraft: true,
    ...overrides
  };
}

function createDeferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
}

describe("useBlogPostSaveState", () => {
  it("tracks dirty state and marks the saved payload clean after save succeeds", async () => {
    const initialValue = createValue();
    const editedValue = createValue({ content: "Edited content" });
    const savedAt = new Date("2026-05-29T08:30:00.000Z");
    const onSave = vi.fn();

    const { result, rerender } = renderHook(
      ({ value }: { value: EditorialPostInput }) =>
        useBlogPostSaveState({
          value,
          onSave,
          now: () => savedAt
        }),
      { initialProps: { value: initialValue } }
    );

    expect(result.current.isDirty).toBe(false);
    expect(result.current.status).toBe("idle");

    rerender({ value: editedValue });

    expect(result.current.isDirty).toBe(true);

    await act(async () => {
      await result.current.save();
    });

    expect(onSave).toHaveBeenCalledWith(editedValue);
    expect(result.current.status).toBe("saved");
    expect(result.current.isDirty).toBe(false);
    expect(result.current.lastSavedAt).toEqual(savedAt);
  });

  it("keeps current edits dirty when an older save resolves after a newer edit", async () => {
    const initialValue = createValue();
    const firstEdit = createValue({ content: "First edit" });
    const secondEdit = createValue({ content: "Second edit" });
    const deferred = createDeferred();
    const onSave = vi.fn(() => deferred.promise);

    const { result, rerender } = renderHook(
      ({ value }: { value: EditorialPostInput }) =>
        useBlogPostSaveState({
          value,
          onSave,
          now: () => new Date("2026-05-29T08:30:00.000Z")
        }),
      { initialProps: { value: initialValue } }
    );

    rerender({ value: firstEdit });

    let firstSaveResult: Promise<void> | undefined;
    await act(async () => {
      firstSaveResult = result.current.save();
      firstSaveResult.catch(() => undefined);
    });

    expect(result.current.status).toBe("saving");

    rerender({ value: secondEdit });

    await act(async () => {
      deferred.resolve();
      await deferred.promise;
    });

    expect(onSave).toHaveBeenCalledWith(firstEdit);
    expect(result.current.status).toBe("saved");
    expect(result.current.isDirty).toBe(true);
  });

  it("ignores stale save failures after a newer save has succeeded", async () => {
    const initialValue = createValue();
    const firstEdit = createValue({ content: "First edit" });
    const secondEdit = createValue({ content: "Second edit" });
    const firstSave = createDeferred();
    const secondSave = createDeferred();
    const onSave = vi
      .fn()
      .mockReturnValueOnce(firstSave.promise)
      .mockReturnValueOnce(secondSave.promise);

    const { result, rerender } = renderHook(
      ({ value }: { value: EditorialPostInput }) =>
        useBlogPostSaveState({
          value,
          onSave,
          now: () => new Date("2026-05-29T08:30:00.000Z")
        }),
      { initialProps: { value: initialValue } }
    );

    rerender({ value: firstEdit });

    let firstSaveResult: Promise<void> | undefined;
    await act(async () => {
      firstSaveResult = result.current.save();
      firstSaveResult.catch(() => undefined);
    });

    rerender({ value: secondEdit });

    await act(async () => {
      void result.current.save();
    });

    await act(async () => {
      secondSave.resolve();
      await secondSave.promise;
    });

    await act(async () => {
      firstSave.reject(new Error("stale save failed"));
      await firstSaveResult?.catch(() => undefined);
    });

    expect(result.current.status).toBe("saved");
    expect(result.current.error).toBeUndefined();
    expect(result.current.isDirty).toBe(false);
  });
});

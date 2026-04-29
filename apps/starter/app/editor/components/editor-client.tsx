"use client";

import {
  type EditorialCategoryOption,
  type EditorialPost,
  type EditorialPostInput,
  type EditorialValidationIssue,
  validateEditorialPostInput
} from "blog-kit-core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PrimaryLink, SurfacePanel } from "../../components/starter-ui";
import { EditorShell } from "./editor-shell";

export interface StarterEditorClientProps {
  mode: "create" | "edit";
  source: "local" | "supabase";
  postId?: string;
  initialValue: EditorialPostInput;
  categories: readonly EditorialCategoryOption[];
}

async function readErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string };
    return payload.message ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

export function StarterEditorClient({
  mode,
  source,
  postId,
  initialValue,
  categories
}: StarterEditorClientProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [validationIssues, setValidationIssues] = useState<EditorialValidationIssue[]>([]);

  function changeValue(nextValue: EditorialPostInput) {
    setValue(nextValue);
    setSaveStatus("idle");
    setValidationIssues([]);
  }

  async function save(nextValue: EditorialPostInput, validationMode: "draft" | "publish") {
    const nextIssues = validateEditorialPostInput(nextValue, validationMode);

    if (nextIssues.some((issue) => issue.severity === "error")) {
      setValidationIssues(nextIssues);
      setSaveStatus("error");
      setError("Resolve the highlighted validation issues before saving.");
      return;
    }

    if (validationMode === "publish" && nextIssues.length > 0) {
      setValidationIssues(nextIssues);
      setSaveStatus("error");
      setError("Resolve the highlighted validation issues before publishing.");
      return;
    }

    setSaving(true);
    setSaveStatus("saving");
    setError(null);
    setValidationIssues([]);

    try {
      const response = await fetch(
        mode === "create" ? "/api/editor/posts" : `/api/editor/posts/${postId}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(nextValue)
        }
      );

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      const savedPost = (await response.json()) as EditorialPost;
      setSaveStatus("saved");
      router.push(`/editor/${savedPost.id}`);
      router.refresh();
    } catch (nextError) {
      setSaveStatus("error");
      setError(nextError instanceof Error ? nextError.message : "Unknown editor error");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!postId) {
      return;
    }

    setSaving(true);
    setSaveStatus("saving");
    setError(null);

    try {
      const response = await fetch(`/api/editor/posts/${postId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      router.push("/editor");
      router.refresh();
    } catch (nextError) {
      setSaveStatus("error");
      setError(nextError instanceof Error ? nextError.message : "Unknown editor error");
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/editor/media", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const asset = (await response.json()) as { url: string };
    return asset.url;
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-1">
          <span className="font-sans text-[0.76rem] uppercase tracking-[0.08em] text-starter-soft">
            Starter editor · {source}
          </span>
          <h1 className="text-[clamp(2rem,4vw,3.1rem)] leading-none font-semibold tracking-[-0.05em]">
            {mode === "create"
              ? `Create a ${source} post`
              : `Edit ${source} post`}
          </h1>
        </div>
        <PrimaryLink href="/editor" className="rounded-full border border-[var(--surface-border)] px-4 py-3">
          Back to editor home
        </PrimaryLink>
      </div>

      {error ? (
        <SurfacePanel className="px-5 py-4 text-sm text-red-700">
          {error}
        </SurfacePanel>
      ) : null}

      <EditorShell
        value={value}
        categories={categories}
        saving={saving}
        saveStatus={saveStatus}
        validationIssues={validationIssues}
        canDelete={mode === "edit"}
        onChange={changeValue}
        onSaveDraft={async (nextValue) => {
          changeValue(nextValue);
          await save(nextValue, "draft");
        }}
        onPublish={async (nextValue) => {
          changeValue(nextValue);
          await save(nextValue, "publish");
        }}
        onDelete={mode === "edit" ? remove : undefined}
        imageUploadHandler={uploadImage}
      />
    </div>
  );
}

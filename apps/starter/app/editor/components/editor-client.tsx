"use client";

import type { EditorialCategoryOption, EditorialPost, EditorialPostInput } from "blog-kit-core";
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
  const [error, setError] = useState<string | null>(null);

  async function save(nextValue: EditorialPostInput) {
    setSaving(true);
    setError(null);

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
      router.push(`/editor/${savedPost.id}`);
      router.refresh();
    } catch (nextError) {
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
      setError(nextError instanceof Error ? nextError.message : "Unknown editor error");
    } finally {
      setSaving(false);
    }
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
        canDelete={mode === "edit"}
        onChange={setValue}
        onSaveDraft={async (nextValue) => {
          setValue(nextValue);
          await save(nextValue);
        }}
        onPublish={async (nextValue) => {
          setValue(nextValue);
          await save(nextValue);
        }}
        onDelete={mode === "edit" ? remove : undefined}
      />
    </div>
  );
}

"use client";

import type { Category, EditorialPostInput } from "blog-kit-core";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  imagePlugin,
  linkPlugin,
  toolbarPlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  frontmatterPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  InsertImage,
  BlockTypeSelect,
  CodeToggle,
  StrikeThroughSupSubToggles,
  ListsToggle,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  InsertFrontmatter,
  DiffSourceToggleWrapper
} from "@mdxeditor/editor";
import type { ReactNode } from "react";

export interface BlogPostEditorProps {
  value: EditorialPostInput;
  categories?: readonly Pick<Category, "id" | "name" | "slug">[];
  disabled?: boolean;
  loading?: boolean;
  saving?: boolean;
  canPublish?: boolean;
  canDelete?: boolean;
  titlePlaceholder?: string;
  excerptPlaceholder?: string;
  onChange: (value: EditorialPostInput) => void;
  onSaveDraft?: (value: EditorialPostInput) => Promise<void> | void;
  onPublish?: (value: EditorialPostInput) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  imageUploadHandler?: (image: File) => Promise<string>;
  footer?: ReactNode;
}

function updateValue(
  value: EditorialPostInput,
  patch: Partial<EditorialPostInput>
): EditorialPostInput {
  return {
    ...value,
    ...patch
  };
}

function defaultSlugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toggleCategoryId(selectedIds: readonly string[], categoryId: string): string[] {
  if (selectedIds.includes(categoryId)) {
    return selectedIds.filter((id) => id !== categoryId);
  }

  return [...selectedIds, categoryId];
}

function formatTagsInput(tags: readonly string[]): string {
  return tags.join(", ");
}

function parseTagsInput(rawTags: string): string[] {
  return rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function BlogPostEditor({
  value,
  categories = [],
  disabled = false,
  loading = false,
  saving = false,
  canPublish = true,
  canDelete = false,
  titlePlaceholder = "Write the title...",
  excerptPlaceholder = "Add a short excerpt...",
  onChange,
  onSaveDraft,
  onPublish,
  onDelete,
  imageUploadHandler,
  footer
}: BlogPostEditorProps) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-sm text-zinc-500 shadow-sm">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <input
          type="text"
          value={value.title}
          disabled={disabled}
          placeholder={titlePlaceholder}
          onChange={(event) => {
            const title = event.target.value;
            const slug = value.slug || defaultSlugify(title);
            onChange(updateValue(value, { title, slug }));
          }}
          className="w-full border-none bg-transparent text-4xl font-semibold tracking-tight text-zinc-950 outline-none placeholder:text-zinc-300"
        />

        <div className="rounded-3xl border border-zinc-200 bg-white p-2 shadow-sm">
          <MDXEditor
            markdown={value.content}
            onChange={(content) => onChange(updateValue(value, { content }))}
            readOnly={disabled}
            contentEditableClassName="starter-editor-content min-h-[420px] p-4 lg:p-8"
            plugins={[
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              thematicBreakPlugin(),
              linkPlugin(),
              markdownShortcutPlugin(),
              tablePlugin(),
              codeBlockPlugin({ defaultCodeBlockLanguage: "ts" }),
              codeMirrorPlugin({
                codeBlockLanguages: {
                  ts: "TypeScript",
                  js: "JavaScript",
                  tsx: "TSX",
                  css: "CSS",
                  html: "HTML",
                  bash: "Bash",
                  json: "JSON",
                  python: "Python",
                  sql: "SQL"
                }
              }),
              diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: value.content }),
              frontmatterPlugin(),
              ...(imageUploadHandler ? [imagePlugin({ imageUploadHandler })] : []),
              toolbarPlugin({
                toolbarContents: () => (
                  <DiffSourceToggleWrapper>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <CodeToggle />
                    <StrikeThroughSupSubToggles />
                    <div className="mx-2 h-6 w-px bg-zinc-200" />
                    <ListsToggle />
                    <div className="mx-2 h-6 w-px bg-zinc-200" />
                    <BlockTypeSelect />
                    <div className="mx-2 h-6 w-px bg-zinc-200" />
                    <CreateLink />
                    {imageUploadHandler ? <InsertImage /> : null}
                    <InsertTable />
                    <InsertThematicBreak />
                    <InsertCodeBlock />
                    <InsertFrontmatter />
                  </DiffSourceToggleWrapper>
                )
              })
            ]}
          />
        </div>

        {footer}
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <section className="rounded-3xl border border-zinc-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(250,247,240,0.94))] p-5 shadow-sm">
          <div className="mb-4 grid gap-1 border-b border-zinc-200/80 pb-4">
            <p className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Post status
            </p>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[1.05rem] font-semibold tracking-[-0.03em] text-zinc-950">
                Publishing
              </h2>
              <span
                className={[
                  "rounded-full px-2.5 py-1 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.08em]",
                  value.isDraft
                    ? "bg-amber-100 text-amber-800"
                    : "bg-emerald-100 text-emerald-800"
                ].join(" ")}
              >
                {value.isDraft ? "Draft" : "Published"}
              </span>
            </div>
          </div>
          <p className="mb-4 text-[0.92rem] leading-[1.6] text-zinc-600">
            Save incremental changes, publish the current post, or remove it from the local content store.
          </p>
          <div className="grid gap-2.5">
            <button
              type="button"
              disabled={disabled || saving || !onSaveDraft}
              onClick={() => onSaveDraft?.(updateValue(value, { isDraft: true }))}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 transition hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save draft"}
            </button>
            <button
              type="button"
              disabled={disabled || saving || !onPublish || !canPublish}
              onClick={() =>
                onPublish?.(
                  updateValue(value, {
                    isDraft: false,
                    publishedAt: value.publishedAt ?? new Date().toISOString()
                  })
                )
              }
              className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Publish
            </button>
            {canDelete && onDelete ? (
              <button
                type="button"
                disabled={disabled || saving}
                onClick={() => onDelete()}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete post
              </button>
            ) : null}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 grid gap-1 border-b border-zinc-200/80 pb-4">
            <p className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Metadata
            </p>
            <h2 className="text-[1.05rem] font-semibold tracking-[-0.03em] text-zinc-950">
              Search and social fields
            </h2>
          </div>
          <div className="space-y-4">
            <label className="grid gap-1.5">
              <span className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                Slug
              </span>
              <input
                type="text"
                value={value.slug}
                disabled={disabled}
                onChange={(event) => onChange(updateValue(value, { slug: event.target.value }))}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                Excerpt
              </span>
              <textarea
                value={value.excerpt ?? ""}
                disabled={disabled}
                rows={4}
                placeholder={excerptPlaceholder}
                onChange={(event) => onChange(updateValue(value, { excerpt: event.target.value }))}
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                Tags
              </span>
              <input
                type="text"
                value={formatTagsInput(value.tags)}
                disabled={disabled}
                onChange={(event) =>
                  onChange(updateValue(value, { tags: parseTagsInput(event.target.value) }))
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                Cover image URL
              </span>
              <input
                type="text"
                value={value.coverImageUrl ?? ""}
                disabled={disabled}
                onChange={(event) =>
                  onChange(updateValue(value, { coverImageUrl: event.target.value || undefined }))
                }
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/60 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 grid gap-1 border-b border-zinc-200/80 pb-4">
            <p className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Taxonomy
            </p>
            <h2 className="text-[1.05rem] font-semibold tracking-[-0.03em] text-zinc-950">
              Categories
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.length === 0 ? (
              <p className="text-sm leading-[1.6] text-zinc-500">No categories have been provided yet.</p>
            ) : null}

            {categories.map((category) => {
              const selected = value.categoryIds.includes(category.id);

              return (
                <button
                  key={category.id}
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    onChange(
                      updateValue(value, {
                        categoryIds: toggleCategoryId(value.categoryIds, category.id)
                      })
                    )
                  }
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    selected
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100",
                    disabled ? "cursor-not-allowed opacity-50" : ""
                  ].join(" ")}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </section>
      </aside>
    </div>
  );
}

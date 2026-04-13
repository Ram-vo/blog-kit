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
            contentEditableClassName="min-h-[420px] p-4 lg:p-8"
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

      <aside className="space-y-6">
        <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Publishing
          </h2>
          <div className="space-y-3">
            <button
              type="button"
              disabled={disabled || saving || !onSaveDraft}
              onClick={() => onSaveDraft?.(updateValue(value, { isDraft: true }))}
              className="w-full rounded-full border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="w-full rounded-full bg-zinc-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Publish
            </button>
            {canDelete && onDelete ? (
              <button
                type="button"
                disabled={disabled || saving}
                onClick={() => onDelete()}
                className="w-full rounded-full border border-red-200 px-4 py-3 text-sm font-medium text-red-700 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete post
              </button>
            ) : null}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Metadata
          </h2>
          <div className="space-y-4">
            <label className="block space-y-1">
              <span className="text-sm font-medium text-zinc-700">Slug</span>
              <input
                type="text"
                value={value.slug}
                disabled={disabled}
                onChange={(event) => onChange(updateValue(value, { slug: event.target.value }))}
                className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:border-zinc-400"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-zinc-700">Excerpt</span>
              <textarea
                value={value.excerpt ?? ""}
                disabled={disabled}
                rows={4}
                placeholder={excerptPlaceholder}
                onChange={(event) => onChange(updateValue(value, { excerpt: event.target.value }))}
                className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:border-zinc-400"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-zinc-700">Tags</span>
              <input
                type="text"
                value={formatTagsInput(value.tags)}
                disabled={disabled}
                onChange={(event) =>
                  onChange(updateValue(value, { tags: parseTagsInput(event.target.value) }))
                }
                className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:border-zinc-400"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-zinc-700">Cover image URL</span>
              <input
                type="text"
                value={value.coverImageUrl ?? ""}
                disabled={disabled}
                onChange={(event) =>
                  onChange(updateValue(value, { coverImageUrl: event.target.value || undefined }))
                }
                className="w-full rounded-2xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:border-zinc-400"
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.length === 0 ? (
              <p className="text-sm text-zinc-500">No categories have been provided yet.</p>
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
                    "rounded-full border px-3 py-1 text-xs font-medium transition",
                    selected
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50",
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

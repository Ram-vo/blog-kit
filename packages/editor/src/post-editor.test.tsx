import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { EditorialPostInput } from "blog-kit-core";
import { BlogPostEditor } from "./post-editor";

vi.mock("@mdxeditor/editor", () => {
  const noopPlugin = () => ({});

  function MDXEditor({
    markdown,
    onChange,
    readOnly
  }: {
    markdown: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
  }) {
    return (
      <textarea
        aria-label="Markdown editor"
        defaultValue={markdown}
        disabled={readOnly}
        onChange={(event) => onChange?.(event.target.value)}
      />
    );
  }

  function Button({ children }: { children: string }) {
    return <button type="button">{children}</button>;
  }

  function BlockTypeSelect() {
    return (
      <select aria-label="Block type">
        <option>Paragraph</option>
      </select>
    );
  }

  function DiffSourceToggleWrapper({ children }: { children: ReactNode }) {
    return <div>{children}</div>;
  }

  return {
    MDXEditor,
    headingsPlugin: noopPlugin,
    listsPlugin: noopPlugin,
    quotePlugin: noopPlugin,
    thematicBreakPlugin: noopPlugin,
    markdownShortcutPlugin: noopPlugin,
    imagePlugin: noopPlugin,
    linkPlugin: noopPlugin,
    toolbarPlugin: noopPlugin,
    tablePlugin: noopPlugin,
    codeBlockPlugin: noopPlugin,
    codeMirrorPlugin: noopPlugin,
    diffSourcePlugin: noopPlugin,
    frontmatterPlugin: noopPlugin,
    UndoRedo: () => <Button>UndoRedo</Button>,
    BoldItalicUnderlineToggles: () => <Button>BoldItalicUnderlineToggles</Button>,
    InsertImage: () => <Button>InsertImage</Button>,
    BlockTypeSelect,
    CodeToggle: () => <Button>CodeToggle</Button>,
    StrikeThroughSupSubToggles: () => <Button>StrikeThroughSupSubToggles</Button>,
    ListsToggle: () => <Button>ListsToggle</Button>,
    CreateLink: () => <Button>CreateLink</Button>,
    InsertTable: () => <Button>InsertTable</Button>,
    InsertThematicBreak: () => <Button>InsertThematicBreak</Button>,
    InsertCodeBlock: () => <Button>InsertCodeBlock</Button>,
    InsertFrontmatter: () => <Button>InsertFrontmatter</Button>,
    DiffSourceToggleWrapper
  };
});

function createValue(overrides: Partial<Parameters<typeof BlogPostEditor>[0]["value"]> = {}) {
  return {
    title: "Starter apps as documentation",
    slug: "",
    excerpt: "A starter app can be the clearest package documentation.",
    content: "Initial content",
    categoryIds: [],
    tags: ["starter"],
    isDraft: true,
    coverImageUrl: undefined,
    publishedAt: undefined,
    ...overrides
  };
}

function EditorHarness({
  initialValue = createValue(),
  onSaveDraft,
  onPublish,
  onDelete,
  saveStatus,
  validationIssues,
  categories = []
}: {
  initialValue?: EditorialPostInput;
  onSaveDraft?: (value: EditorialPostInput) => void;
  onPublish?: (value: EditorialPostInput) => void;
  onDelete?: () => void;
  saveStatus?: Parameters<typeof BlogPostEditor>[0]["saveStatus"];
  validationIssues?: Parameters<typeof BlogPostEditor>[0]["validationIssues"];
  categories?: { id: string; name: string; slug: string }[];
}) {
  const [value, setValue] = useState<EditorialPostInput>(initialValue);

  return (
    <BlogPostEditor
      value={value}
      categories={categories}
      canDelete={Boolean(onDelete)}
      saveStatus={saveStatus}
      validationIssues={validationIssues}
      onChange={(nextValue) => setValue(nextValue)}
      onSaveDraft={onSaveDraft}
      onPublish={onPublish}
      onDelete={onDelete}
    />
  );
}

afterEach(() => {
  cleanup();
});

describe("BlogPostEditor", () => {
  it("renders a loading state before the editor is ready", () => {
    render(<BlogPostEditor value={createValue()} loading onChange={() => undefined} />);

    expect(screen.getByText("Loading editor...")).toBeTruthy();
  });

  it("updates the title and auto-generates a slug when none exists", async () => {
    render(<EditorHarness initialValue={createValue()} />);

    const titleInput = screen.getByPlaceholderText("Write the title...");
    fireEvent.change(titleInput, { target: { value: "Blog kit editor flow" } });

    expect((titleInput as HTMLInputElement).value).toBe("Blog kit editor flow");
    expect(
      (screen.getByRole("textbox", { name: "Slug" }) as HTMLInputElement).value
    ).toBe("blog-kit-editor-flow");
  });

  it("parses tags and toggles categories through the sidebar controls", async () => {
    const user = userEvent.setup();

    render(
      <EditorHarness
        initialValue={createValue()}
        categories={[
          { id: "architecture", name: "Architecture", slug: "architecture" },
          { id: "implementation", name: "Implementation", slug: "implementation" }
        ]}
      />
    );

    const tagsInput = screen.getByRole("textbox", { name: "Tags" });
    fireEvent.change(tagsInput, { target: { value: "starter, docs, mdx" } });

    expect((tagsInput as HTMLInputElement).value).toBe("starter, docs, mdx");

    await user.click(screen.getByRole("button", { name: "Architecture" }));

    expect(
      screen.getByRole("button", { name: "Architecture" }).className
    ).toContain("bg-zinc-950");
  });

  it("routes save, publish, and delete actions through the supplied callbacks", async () => {
    const user = userEvent.setup();
    const onSaveDraft = vi.fn();
    const onPublish = vi.fn();
    const onDelete = vi.fn();

    render(
      <EditorHarness
        initialValue={createValue({ isDraft: true, publishedAt: undefined })}
        onSaveDraft={onSaveDraft}
        onPublish={onPublish}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByRole("button", { name: "Save draft" }));
    expect(onSaveDraft).toHaveBeenCalledWith(
      expect.objectContaining({
        isDraft: true
      })
    );

    await user.click(screen.getByRole("button", { name: "Publish" }));
    expect(onPublish).toHaveBeenCalledWith(
      expect.objectContaining({
        isDraft: false,
        publishedAt: expect.any(String)
      })
    );

    await user.click(screen.getByRole("button", { name: "Delete post" }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("shows save status and validation issues in the publishing panel", () => {
    render(
      <EditorHarness
        initialValue={createValue()}
        saveStatus="error"
        validationIssues={[
          {
            field: "excerpt",
            message: "Add an excerpt before publishing.",
            severity: "error"
          }
        ]}
        onPublish={() => undefined}
      />
    );

    expect(screen.getByText("Save state · Needs attention")).toBeTruthy();
    expect(screen.getByText("Add an excerpt before publishing.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Publish" })).toHaveProperty("disabled", true);
  });
});

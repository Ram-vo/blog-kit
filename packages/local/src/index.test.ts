import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { createLocalAdapter } from "./index";

const tempDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true })
    )
  );
});

async function createTempDirectory() {
  const directory = await mkdtemp(join(tmpdir(), "blog-kit-local-"));
  tempDirectories.push(directory);
  return directory;
}

describe("blog-kit-local editorial adapter", () => {
  it("creates and reloads local MDX posts", async () => {
    const contentDirectory = await createTempDirectory();
    const adapter = createLocalAdapter({ contentDirectory });

    const created = await adapter.editorial.createPost({
      title: "Local draft",
      slug: "local-draft",
      excerpt: "Filesystem-backed content.",
      content: "# Hello",
      categoryIds: [],
      tags: ["local"],
      isDraft: true
    });

    const reloaded = await adapter.editorial.getPostById(created.id);
    const fileContents = await readFile(join(contentDirectory, "local-draft.mdx"), "utf8");

    expect(reloaded?.slug).toBe("local-draft");
    expect(fileContents).toContain("title: Local draft");
    expect(fileContents).toContain("# Hello");
  });

  it("creates category records in the companion categories file", async () => {
    const contentDirectory = await createTempDirectory();
    const adapter = createLocalAdapter({ contentDirectory });

    await adapter.editorial.createCategory?.({
      name: "Architecture",
      slug: "architecture"
    });

    const categories = await adapter.editorial.listCategories();

    expect(categories).toEqual([
      {
        id: "architecture",
        name: "Architecture",
        slug: "architecture"
      }
    ]);
  });
});

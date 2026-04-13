# blog-kit-editor

Reusable React editor primitives for `blog-kit`.

This package wraps `@mdxeditor/editor` behind a publishing-oriented API
that stays independent from any specific auth provider or persistence
layer.

Use this package when you want:

- a generic MDX post editor UI
- controlled post state owned by the host app
- pluggable save, publish, delete, and image upload handlers
- compatibility with custom auth, local content, or Supabase-backed
  editorial flows

## Install

```bash
pnpm add blog-kit-editor react react-dom
```

Import the upstream editor stylesheet in your app shell:

```tsx
import "@mdxeditor/editor/style.css";
```

## Example

```tsx
"use client";

import { useState } from "react";
import { BlogPostEditor, type EditorialPostInput } from "blog-kit-editor";

const initialPost: EditorialPostInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  categoryIds: [],
  tags: [],
  isDraft: true
};

export function EditorExample() {
  const [post, setPost] = useState(initialPost);

  return (
    <BlogPostEditor
      value={post}
      categories={[{ id: "architecture", name: "Architecture", slug: "architecture" }]}
      onChange={setPost}
      onSaveDraft={async (nextPost) => {
        console.log("save draft", nextPost);
      }}
      onPublish={async (nextPost) => {
        console.log("publish", nextPost);
      }}
    />
  );
}
```

## Integration Model

`blog-kit-editor` does not own auth or persistence.

The host app is responsible for:

- resolving the current session and permissions
- selecting a persistence adapter such as `blog-kit-local` or
  `blog-kit-supabase`
- passing save and publish handlers into the editor
- optionally providing an image upload handler

This keeps the editor reusable across:

- local filesystem-backed blogs
- Supabase-backed blogs
- apps with custom authentication stacks

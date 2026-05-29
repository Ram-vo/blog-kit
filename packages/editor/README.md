# blog-kit-editor

Reusable React editor primitives for `blog-kit`.

This package wraps `@mdxeditor/editor` behind a publishing-oriented API
that stays independent from auth, routing, and persistence.

## Install

```bash
pnpm add blog-kit-editor react react-dom
```

Import the upstream MDXEditor stylesheet in your app shell:

```tsx
import "@mdxeditor/editor/style.css";
```

## Use It For

- Editing MDX post content
- Updating post metadata
- Saving drafts
- Publishing posts
- Deleting posts
- Plugging in custom image upload behavior
- Showing validation issues and save-state feedback

The host app owns the current post state and passes handlers into the
editor.

## Example

```tsx
"use client";

import { useState } from "react";
import {
  BlogPostEditor,
  useBlogPostSaveState,
  type EditorialPostInput
} from "blog-kit-editor";

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
  const saveState = useBlogPostSaveState({
    value: post,
    onSave: async (nextPost) => {
      console.log("save draft", nextPost);
    }
  });

  return (
    <BlogPostEditor
      value={post}
      categories={[
        { id: "architecture", name: "Architecture", slug: "architecture" }
      ]}
      saveStatus={saveState.status}
      validationIssues={[]}
      onChange={setPost}
      onSaveDraft={saveState.save}
      onPublish={async (nextPost) => {
        console.log("publish", nextPost);
      }}
    />
  );
}
```

## Validation And Save State

`blog-kit-editor` does not validate content by itself. Pass validation
issues from your host app or from `validateEditorialPostInput` in
`blog-kit-core`:

```tsx
<BlogPostEditor
  value={post}
  categories={categories}
  saveStatus={saveStatus}
  validationIssues={validationIssues}
  onChange={setPost}
/>
```

Supported save states are:

- `idle`
- `saving`
- `saved`
- `error`

For reusable dirty-state tracking, use `useBlogPostSaveState` in the
host app:

```tsx
const saveState = useBlogPostSaveState({
  value: post,
  onSave: async (nextPost) => {
    await saveDraft(nextPost);
  }
});

saveState.isDirty;
saveState.status;
saveState.lastSavedAt;
saveState.error;
```

The hook compares the current editor payload with the last saved
payload, updates `lastSavedAt` after successful saves, exposes
recoverable save errors, and ignores stale async responses from older
save attempts. Storage, auth, routing, and retries still belong to the
host app.

## Auth And Persistence

`blog-kit-editor` does not own auth or storage.

The host app is responsible for:

- resolving the current user and permissions
- deciding whether the route is protected
- choosing `blog-kit-local`, `blog-kit-supabase`, or another backend
- passing save, publish, delete, and upload handlers into the editor

This makes the same editor usable with custom auth, Supabase Auth, local
MDX files, or another future adapter.

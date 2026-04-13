"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const BlogPostEditor = dynamic(
  () => import("blog-kit-editor").then((module) => module.BlogPostEditor),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-sm text-zinc-500 shadow-sm">
        Loading editor...
      </div>
    )
  }
);

export type EditorShellProps = ComponentProps<typeof BlogPostEditor>;

export function EditorShell(props: EditorShellProps) {
  return <BlogPostEditor {...props} />;
}

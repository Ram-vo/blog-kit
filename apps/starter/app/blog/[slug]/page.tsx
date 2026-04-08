import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toBlogPost } from "blog-kit-core";
import { toArticleMetadata } from "blog-kit-next";
import { samplePosts } from "../../../src/sample-posts";
import { siteConfig } from "../../../src/site-config";

export function generateStaticParams() {
  return samplePosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params
}: {
  params: { slug: string };
}): Metadata {
  const post = samplePosts.find((entry) => entry.slug === params.slug);

  if (!post) {
    return {};
  }

  return toArticleMetadata(post, siteConfig);
}

export default function BlogPostPage({
  params
}: {
  params: { slug: string };
}) {
  const match = samplePosts.find((entry) => entry.slug === params.slug);

  if (!match) {
    notFound();
  }

  const article = toBlogPost(match, siteConfig);

  return (
    <main style={{ padding: "88px 24px 72px" }}>
      <article style={{ maxWidth: 760, margin: "0 auto" }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#6f685b"
          }}
        >
          {article.categories[0]?.name ?? "Uncategorized"} · {article.readingTime} min
        </p>
        <h1
          style={{
            margin: "16px 0 12px",
            fontSize: "clamp(2.6rem, 7vw, 4.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.05em"
          }}
        >
          {article.title}
        </h1>
        <p style={{ margin: "0 0 32px", fontSize: 20, lineHeight: 1.5, color: "#4f4a3f" }}>
          {article.excerpt}
        </p>
        <div
          style={{
            padding: 24,
            borderRadius: 20,
            border: "1px solid #ddd8cb",
            background: "#fffdf8",
            whiteSpace: "pre-wrap",
            lineHeight: 1.7
          }}
        >
          {article.content}
        </div>
      </article>
    </main>
  );
}

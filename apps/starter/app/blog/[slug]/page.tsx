import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  toArticleMetadata,
  toBlogPostingStructuredData,
  toBreadcrumbStructuredData
} from "blog-kit-next";
import {
  getBlogPostBySlug,
  getPublishedPosts,
  getRenderableBlogPost
} from "../../../src/blog-data";
import { siteConfig } from "../../../src/site-config";
import {
  PrimaryLink,
  StarterContainer,
  SurfacePanel
} from "../../components/starter-ui";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return toArticleMetadata(post, siteConfig);
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getRenderableBlogPost(slug);

  if (!article) {
    notFound();
  }

  const articleStructuredData = toBlogPostingStructuredData(
    article,
    siteConfig
  );
  const breadcrumbStructuredData = toBreadcrumbStructuredData(
    [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/" },
      { name: article.title, path: `/blog/${article.slug}` }
    ],
    siteConfig
  );

  return (
    <StarterContainer className="pt-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />
      <div
        className="mb-[18px] flex flex-wrap gap-2.5 font-sans text-[0.78rem] uppercase tracking-[0.08em] text-starter-soft"
        aria-label="Breadcrumb"
      >
        <PrimaryLink href="/">
          Home
        </PrimaryLink>
        <span>/</span>
        <PrimaryLink href="/">
          Blog
        </PrimaryLink>
        <span>/</span>
        <span>{article.slug}</span>
      </div>
      <SurfacePanel className="overflow-hidden">
        <div className="border-b border-[var(--surface-border)] bg-[linear-gradient(135deg,rgba(255,248,236,0.92),rgba(247,238,221,0.84))] px-6 py-8 sm:px-8">
          <p className="font-sans text-[0.78rem] uppercase tracking-[0.08em] text-starter-soft">
            {article.categories[0]?.name ?? "Uncategorized"} ·{" "}
            {article.readingTime} min read
          </p>
          <h1 className="mt-4 max-w-[15ch] text-[clamp(2.6rem,5.4vw,4.4rem)] leading-[0.94] font-semibold tracking-[-0.055em]">
            {article.title}
          </h1>
          <p className="mt-3 max-w-[40rem] text-[1.18rem] leading-[1.75] text-starter-muted">
            {article.excerpt}
          </p>
        </div>
        <div className="bg-starter-cream px-6 py-8 text-[1.05rem] leading-[1.9] whitespace-pre-wrap text-starter-ink sm:px-8">
          {article.content}
        </div>
      </SurfacePanel>
    </StarterContainer>
  );
}

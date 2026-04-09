import { paginateItems, toBlogPostSummary } from "blog-kit-core";
import { toArticleMetadata, toBlogStructuredData } from "blog-kit-next";
import { getBlogPostSummaries, getPublishedPosts } from "../src/blog-data";
import { siteConfig } from "../src/site-config";
import {
  EmptyState,
  Eyebrow,
  HeroLink,
  PrimaryLink,
  SectionHeading,
  StarterContainer,
  SurfaceCard,
  SurfacePanel
} from "./components/starter-ui";

export default async function HomePage() {
  const publishedPosts = await getPublishedPosts();
  const posts = await getBlogPostSummaries();
  const featuredPost = publishedPosts[0];
  const featuredSummary = featuredPost
    ? toBlogPostSummary(featuredPost, siteConfig)
    : null;
  const featuredMetadata = featuredPost
    ? toArticleMetadata(featuredPost, siteConfig)
    : null;
  const blogStructuredData = toBlogStructuredData(
    publishedPosts.slice(0, 10),
    siteConfig
  );
  const paginatedPosts = paginateItems(posts, {
    page: 1,
    pageSize: 6
  });

  return (
    <StarterContainer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData)
        }}
      />
      <SurfacePanel className="relative overflow-hidden px-6 py-8 sm:px-8">
        <div className="pointer-events-none absolute -bottom-28 -right-[12%] h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(211,91,45,0.2),transparent_68%)]" />
        <div className="grid gap-6">
          <Eyebrow>Starter app</Eyebrow>
          <h1 className="max-w-[16ch] text-[clamp(2.9rem,6.2vw,5.1rem)] leading-[0.92] font-semibold tracking-[-0.06em] sm:max-w-[14ch]">
            Ship a blog around reusable domain and adapter packages.
          </h1>
          <p className="max-w-[42rem] text-[1.2rem] leading-[1.7] text-starter-muted">
            This starter shows how a site can consume{" "}
            <strong>blog-kit-core</strong> and{" "}
            <strong>blog-kit-next</strong> while keeping brand and UI
            decisions inside the app layer.
          </p>
          <p className="max-w-[38rem] font-sans text-[0.95rem] leading-[1.6] text-starter-soft">
            Use it with local sample content for zero-setup development,
            or point it at a compatible Supabase project to validate the
            adapter path with real data.
          </p>
        </div>
      </SurfacePanel>

      <section className="mt-7">
          {featuredSummary && featuredMetadata && (
            <div className="rounded-[24px] bg-[linear-gradient(135deg,rgba(12,31,24,0.98),rgba(18,56,44,0.94))] px-7 py-7 text-[#fff7ea] shadow-[var(--shadow-soft)]">
              <p className="font-sans text-[0.78rem] uppercase tracking-[0.08em] text-[rgba(255,247,234,0.72)]">
                Featured post
              </p>
              <h2 className="mt-3 max-w-[18ch] text-[clamp(1.8rem,3.2vw,2.7rem)] leading-[1] font-semibold tracking-[-0.045em]">
                {featuredSummary.title}
              </h2>
              <p className="mt-2 max-w-[42rem] text-[1.02rem] leading-[1.7] text-[rgba(255,247,234,0.78)]">
                {featuredSummary.excerpt}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <span className="font-sans text-[0.92rem] text-[rgba(255,247,234,0.58)]">
                  Canonical URL: {featuredMetadata.alternates.canonical}
                </span>
                <HeroLink href={`/blog/${featuredSummary.slug}`}>
                  Read featured article
                </HeroLink>
              </div>
            </div>
          )}
      </section>

      <section className="mt-7">
        <SectionHeading
          title="Published posts"
          meta={
            <>
            Showing {paginatedPosts.items.length} of{" "}
            {paginatedPosts.meta.totalItems} posts · Page{" "}
            {paginatedPosts.meta.page} of {paginatedPosts.meta.totalPages}
            </>
          }
        />
        {paginatedPosts.items.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
            {paginatedPosts.items.map((post) => (
              <SurfaceCard key={post.slug} className="grid min-h-[280px] gap-4 px-6 py-6">
                <p className="font-sans text-[0.78rem] uppercase tracking-[0.08em] text-starter-soft">
                  {post.categories[0]?.name ?? "Uncategorized"} · {post.readingTime} min
                </p>
                <h3 className="max-w-[16ch] text-[1.55rem] leading-[1.08] font-semibold tracking-[-0.035em]">
                  {post.title}
                </h3>
                <p className="text-starter-muted leading-[1.65]">
                  {post.excerpt}
                </p>
                <PrimaryLink
                  href={`/blog/${post.slug}`}
                  className="mt-auto text-starter-green"
                >
                  Open article
                </PrimaryLink>
              </SurfaceCard>
            ))}
          </div>
        ) : (
          <EmptyState
            eyebrow="No published posts"
            title="The starter is running, but there is no public content yet."
            copy={
              <>
                Add sample posts locally or insert published rows in
                Supabase with <code>is_draft = false</code>. Once content
                exists, the index, RSS feed, and sitemap will reflect it.
              </>
            }
            actions={
              <>
                <PrimaryLink
                  href="/blog/rss.xml"
                  className="w-fit rounded-full bg-starter-dark px-4 py-3 text-[#fff7ea]"
                >
                  Check the RSS route
                </PrimaryLink>
                <PrimaryLink
                  href="/sitemap.xml"
                  className="w-fit rounded-full bg-starter-dark px-4 py-3 text-[#fff7ea]"
                >
                  Check the sitemap
                </PrimaryLink>
              </>
            }
          />
        )}
      </section>
    </StarterContainer>
  );
}

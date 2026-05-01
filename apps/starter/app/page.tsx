import Link from "next/link";
import type { Route } from "next";
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

const packageCards = [
  {
    name: "blog-kit-core",
    eyebrow: "Core layer",
    copy: "Domain types, repository contracts, pagination, and pure content helpers.",
    href: "/blog/inside-blog-kit-core" as Route,
    cta: "Read core article"
  },
  {
    name: "blog-kit-next",
    eyebrow: "App integration",
    copy: "Metadata, RSS, sitemap, and structured data helpers for App Router projects.",
    href: "/blog/nextjs-publishing-helpers" as Route,
    cta: "Read Next.js article"
  },
  {
    name: "blog-kit-supabase",
    eyebrow: "Provider adapter",
    copy: "Provider-specific repositories and mapping logic for a Supabase-backed blog.",
    href: "/blog/why-adapters-matter" as Route,
    cta: "Read adapter article"
  },
  {
    name: "blog-kit-editor",
    eyebrow: "Editor layer",
    copy: "Reusable MDX editing UI with host-controlled auth, persistence, and media uploads.",
    href: "/blog/editorial-workflows-with-blog-kit" as Route,
    cta: "Read editor article"
  }
];

const deploymentModes = [
  {
    title: "Local sample mode",
    copy: "Boot the starter with in-repo content and validate package boundaries without credentials.",
    href: "/blog/choosing-between-local-and-supabase" as Route,
    cta: "Open local mode article"
  },
  {
    title: "Supabase-backed mode",
    copy: "Point the app at a compatible schema and validate the adapter path with real published rows.",
    href: "/blog/choosing-between-local-and-supabase" as Route,
    cta: "Open Supabase article"
  },
  {
    title: "Static demo mode",
    copy: "Export the starter for GitHub Pages and use it as a public package website and live preview.",
    href: "/blog/exporting-the-starter-as-a-public-demo" as Route,
    cta: "Open deployment article"
  }
];

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
        <div className="pointer-events-none absolute -top-16 left-[48%] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(13,111,81,0.16),transparent_70%)]" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:items-end">
          <div className="grid gap-6">
            <Eyebrow>Public starter demo</Eyebrow>
            <h1 className="max-w-[11ch] text-[clamp(3.2rem,7vw,5.9rem)] leading-[0.9] font-semibold tracking-[-0.07em] sm:max-w-[12ch]">
              Ship a reusable blog without coupling it to one app.
            </h1>
            <p className="max-w-[42rem] text-[1.16rem] leading-[1.75] text-starter-muted">
              <strong>blog-kit</strong> splits content logic, provider
              adapters, and app shell composition so you can swap brand,
              CMS, or routes without rewriting the whole blog layer.
            </p>
            <div className="flex flex-wrap gap-3">
              <PrimaryLink
                href="/blog/building-a-modular-blog-toolkit"
                className="inline-flex rounded-full bg-starter-dark px-5 py-3 text-[#fff7ea]"
              >
                Explore the starter
              </PrimaryLink>
              <a
                href="https://github.com/Ram-vo/blog-kit"
                className="starter-link inline-flex rounded-full border border-[var(--surface-border)] bg-[rgba(255,255,255,0.58)] px-5 py-3 font-sans text-[0.92rem] text-starter-ink"
              >
                View repository
              </a>
            </div>
          </div>

          <div className="rounded-[28px] border border-[rgba(16,33,27,0.14)] bg-[linear-gradient(180deg,rgba(21,39,31,0.98),rgba(15,31,25,0.96))] px-5 py-5 text-[#fff7ea] shadow-[var(--shadow-card)]">
            <p className="font-sans text-[0.76rem] uppercase tracking-[0.1em] text-[rgba(255,247,234,0.72)]">
              Quick start
            </p>
            <pre className="mt-4 overflow-x-auto rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.08)] p-4 font-sans text-[0.92rem] leading-[1.8] text-[#fff8ed] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <code>{`pnpm install
pnpm --dir apps/starter dev
pnpm --dir apps/starter build:static`}</code>
            </pre>
            <p className="mt-4 text-[0.96rem] leading-[1.7] text-[rgba(255,247,234,0.84)]">
              Use sample content locally, switch to Supabase when the
              schema is ready, and export the same app as a public GitHub
              Pages demo.
            </p>
          </div>
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

      <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
        <SurfacePanel className="px-6 py-6 sm:px-7">
          <SectionHeading
            title="Package boundaries"
            meta="Reusable pieces"
          />
          <div className="grid gap-4">
            <Link
              href="/blog/building-a-modular-blog-toolkit"
              className="group grid gap-3 rounded-[24px] border border-[var(--surface-border)] bg-[linear-gradient(135deg,rgba(255,250,243,0.95),rgba(248,240,225,0.92))] px-5 py-5 transition-transform duration-150 hover:-translate-y-0.5 hover:border-[rgba(19,38,31,0.22)] hover:shadow-[var(--shadow-card)]"
            >
              <p className="font-sans text-[0.76rem] uppercase tracking-[0.1em] text-starter-soft">
                System design
              </p>
              <h3 className="max-w-[24ch] text-[1.28rem] leading-[1.05] font-semibold tracking-[-0.04em]">
                Keep content rules, provider code, and app composition in separate layers.
              </h3>
              <p className="max-w-[56ch] text-[0.97rem] leading-[1.7] text-starter-muted">
                The starter is intentionally wired against public package
                APIs so teams can replace the shell, theme, and data
                source without reimplementing the blog domain.
              </p>
              <span className="starter-link inline-flex items-center gap-2 font-sans text-[0.84rem] text-starter-green">
                Read system design article
              </span>
            </Link>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {packageCards.map((pkg) => (
              <Link
                key={pkg.name}
                href={pkg.href}
                className="starter-card grid gap-3 rounded-[24px] px-5 py-5 transition-transform duration-150 hover:-translate-y-0.5 hover:border-[rgba(19,38,31,0.22)] hover:shadow-[var(--shadow-soft)]"
              >
                <p className="font-sans text-[0.72rem] uppercase tracking-[0.1em] text-starter-soft">
                  {pkg.eyebrow}
                </p>
                <h3 className="text-[1.08rem] leading-[1.04] font-semibold tracking-[-0.04em] text-starter-ink">
                  {pkg.name}
                </h3>
                <p className="text-[0.94rem] leading-[1.65] text-starter-muted">
                  {pkg.copy}
                </p>
                <span className="starter-link mt-auto inline-flex items-center gap-2 font-sans text-[0.84rem] text-starter-green">
                  {pkg.cta}
                </span>
              </Link>
            ))}
            </div>
          </div>
        </SurfacePanel>

        <SurfacePanel className="px-6 py-6 sm:px-7">
          <SectionHeading
            title="Adoption path"
            meta="Three ways in"
          />
          <div className="grid gap-3">
            {deploymentModes.map((mode, index) => (
              <Link
                key={mode.title}
                href={mode.href}
                className="grid gap-2 rounded-[22px] border border-[var(--surface-border)] bg-[rgba(255,255,255,0.52)] px-4 py-4 transition-transform duration-150 hover:-translate-y-0.5 hover:border-[rgba(19,38,31,0.22)] hover:shadow-[var(--shadow-card)]"
              >
                <p className="font-sans text-[0.72rem] uppercase tracking-[0.1em] text-starter-soft">
                  0{index + 1}
                </p>
                <h3 className="text-[1.1rem] leading-[1.04] font-semibold tracking-[-0.04em]">
                  {mode.title}
                </h3>
                <p className="max-w-[34ch] text-[0.95rem] leading-[1.65] text-starter-muted">
                  {mode.copy}
                </p>
                <span className="starter-link inline-flex items-center gap-2 font-sans text-[0.84rem] text-starter-green">
                  {mode.cta}
                </span>
              </Link>
            ))}
          </div>
        </SurfacePanel>
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

      <section className="mt-7">
        <SurfacePanel className="grid gap-6 px-6 py-6 sm:px-7 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)] lg:items-end">
          <div className="grid gap-3">
            <Eyebrow>Deployable reference</Eyebrow>
            <h2 className="max-w-[15ch] text-[clamp(2.2rem,4.8vw,3.6rem)] leading-[0.94] font-semibold tracking-[-0.055em]">
              One starter, three validation paths.
            </h2>
            <p className="max-w-[44rem] text-[1.05rem] leading-[1.75] text-starter-muted">
              Run the app locally with sample data, connect it to
              Supabase for integration work, or publish the exported
              version to GitHub Pages so people can inspect the product
              without cloning the repo.
            </p>
          </div>
          <div className="grid gap-3 font-sans text-[0.95rem] leading-[1.7] text-starter-soft">
            <PrimaryLink href="/blog/rss.xml">
              Check the RSS output
            </PrimaryLink>
            <PrimaryLink href="/sitemap.xml">
              Check the sitemap output
            </PrimaryLink>
            <a
              href="https://github.com/Ram-vo/blog-kit/blob/main/docs/starter-deploy.md"
              className="starter-link"
            >
              Read the deployment guide
            </a>
          </div>
        </SurfacePanel>
      </section>
    </StarterContainer>
  );
}

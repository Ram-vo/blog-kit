import Link from "next/link";
import { paginateItems, toBlogPostSummary } from "blog-kit-core";
import { toArticleMetadata, toBlogStructuredData } from "blog-kit-next";
import { getBlogPostSummaries, getPublishedPosts } from "../src/blog-data";
import { siteConfig } from "../src/site-config";

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
    <main style={{ minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogStructuredData)
        }}
      />
      <section
        style={{
          padding: "96px 24px 56px",
          borderBottom: "1px solid #ddd8cb",
          background:
            "linear-gradient(180deg, #fffdf6 0%, #f3eee2 100%)"
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <span
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: 999,
              background: "#101010",
              color: "#fff",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase"
            }}
          >
            Starter app
          </span>
          <h1
            style={{
              margin: "20px 0 12px",
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.06em",
              maxWidth: 860
            }}
          >
            Ship a blog around reusable domain and adapter packages.
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 720,
              fontSize: 20,
              lineHeight: 1.5,
              color: "#4f4a3f"
            }}
          >
            This starter shows how a site can consume <strong>blog-kit-core</strong>
            {" "}and <strong>blog-kit-next</strong> while keeping brand and UI
            decisions inside the app layer.
          </p>
        </div>
      </section>

      <section style={{ padding: "32px 24px 0" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          {featuredSummary && featuredMetadata && (
            <div
              style={{
                padding: 24,
                borderRadius: 24,
                background: "#101010",
                color: "#f8f4e8"
              }}
            >
              <p style={{ margin: "0 0 8px", fontSize: 12, textTransform: "uppercase" }}>
                Featured post
              </p>
              <h2 style={{ margin: 0, fontSize: 34, lineHeight: 1.05 }}>
                {featuredSummary.title}
              </h2>
              <p style={{ margin: "14px 0 0", maxWidth: 720, color: "#c8c1ae" }}>
                {featuredSummary.excerpt}
              </p>
              <p style={{ margin: "14px 0 0", fontSize: 14, color: "#c8c1ae" }}>
                Canonical URL: {featuredMetadata.alternates.canonical}
              </p>
              <div style={{ marginTop: 18 }}>
                <Link
                  href={`/blog/${featuredSummary.slug}`}
                  style={{ color: "#f8f4e8", fontWeight: 700, textDecoration: "none" }}
                >
                  Read featured article
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: "32px 24px 72px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div
            style={{
              marginBottom: 18,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              color: "#6f685b",
              fontSize: 13
            }}
          >
            <span>
              Showing {paginatedPosts.items.length} of {paginatedPosts.meta.totalItems} posts
            </span>
            <span>
              Page {paginatedPosts.meta.page} of {paginatedPosts.meta.totalPages}
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gap: 20,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))"
            }}
          >
            {paginatedPosts.items.map((post) => (
              <article
                key={post.slug}
                style={{
                  padding: 22,
                  border: "1px solid #ddd8cb",
                  borderRadius: 20,
                  background: "#fffdf8"
                }}
              >
                <p style={{ margin: 0, fontSize: 12, color: "#6f685b" }}>
                  {post.categories[0]?.name ?? "Uncategorized"} · {post.readingTime} min
                </p>
                <h2 style={{ margin: "12px 0 10px", fontSize: 24, lineHeight: 1.1 }}>
                  {post.title}
                </h2>
                <p style={{ margin: "0 0 16px", color: "#4f4a3f", lineHeight: 1.5 }}>
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  style={{ color: "#101010", fontWeight: 700, textDecoration: "none" }}
                >
                  Open article
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

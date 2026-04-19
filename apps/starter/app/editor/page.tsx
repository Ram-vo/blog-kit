import {
  createStarterEditorialRepository,
  getStarterEditorialSourceLabel
} from "../../src/editorial/provider";
import {
  PrimaryLink,
  SectionHeading,
  StarterContainer,
  SurfaceCard,
  SurfacePanel
} from "../components/starter-ui";

export const dynamic = "force-dynamic";

export default async function EditorIndexPage() {
  const { source, editorial } = createStarterEditorialRepository();
  const posts = await editorial.listPosts();

  return (
    <StarterContainer>
      <SurfacePanel className="grid gap-6 px-6 py-6 sm:px-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            title="Starter editor"
            meta={getStarterEditorialSourceLabel(source)}
          />
          <PrimaryLink
            href="/editor/new"
            className="rounded-full bg-starter-dark px-4 py-3 text-[#fff7ea]"
          >
            New post
          </PrimaryLink>
        </div>
        <p className="max-w-[48rem] text-[1rem] leading-[1.7] text-starter-muted">
          This route uses <code>blog-kit-editor</code> with the
          {source === "supabase" ? (
            <>
              Supabase-backed <code>blog-kit-supabase</code> adapter.
            </>
          ) : (
            <>
              filesystem-backed <code>blog-kit-local</code> adapter.
            </>
          )}{" "}
          It is intentionally simple so the example proves editor
          boundaries before auth and provider wiring are added.
        </p>

        <div className="grid gap-4">
          {posts.length === 0 ? (
            <SurfaceCard className="px-5 py-5">
              <p className="text-starter-muted">
                No posts have been created for the current editorial
                source yet.
              </p>
            </SurfaceCard>
          ) : null}

          {posts.map((post) => (
            <SurfaceCard
              key={post.id}
              className="grid gap-3 px-5 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
            >
              <div className="grid gap-1">
                <p className="font-sans text-[0.76rem] uppercase tracking-[0.08em] text-starter-soft">
                  {post.isDraft ? "Draft" : "Published"} · {post.slug}
                </p>
                <h2 className="text-[1.35rem] leading-[1.05] font-semibold tracking-[-0.04em]">
                  {post.title}
                </h2>
                <p className="text-[0.96rem] leading-[1.65] text-starter-muted">
                  {post.excerpt || "No excerpt yet."}
                </p>
              </div>
              <PrimaryLink href={`/editor/${post.id}`} className="w-fit rounded-full border border-[var(--surface-border)] px-4 py-3">
                Open editor
              </PrimaryLink>
            </SurfaceCard>
          ))}
        </div>
      </SurfacePanel>
    </StarterContainer>
  );
}

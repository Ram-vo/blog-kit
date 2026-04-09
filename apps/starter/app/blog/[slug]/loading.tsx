export default function BlogPostLoading() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-160px)] w-[min(calc(100%-32px),1120px)] place-items-center">
      <article className="starter-panel w-full max-w-[760px] rounded-[32px] px-[30px] py-[30px]">
        <p className="font-sans text-[0.78rem] uppercase tracking-[0.08em] text-starter-soft">
          Loading article
        </p>
        <div className="mt-[18px] grid gap-3" aria-hidden="true">
          <div className="starter-shimmer h-[52px] w-full rounded-full" />
          <div className="starter-shimmer h-[18px] w-[72%] rounded-full" />
          <div className="starter-shimmer h-[18px] w-full rounded-full" />
          <div className="starter-shimmer h-[18px] w-[88%] rounded-full" />
          <div className="starter-shimmer h-[18px] w-[72%] rounded-full" />
        </div>
      </article>
    </main>
  );
}

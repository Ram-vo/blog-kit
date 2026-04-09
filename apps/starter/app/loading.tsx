export default function LoadingPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-160px)] w-[min(calc(100%-32px),1120px)] place-items-center">
      <div className="starter-panel rounded-[32px] px-[30px] py-[30px]">
        <p className="font-sans text-[0.78rem] uppercase tracking-[0.08em] text-starter-soft">
          Loading
        </p>
        <h1 className="mt-3 text-[clamp(2.1rem,5vw,3.2rem)] leading-[0.98] font-semibold tracking-[-0.05em]">
          Preparing the starter content.
        </h1>
        <p className="mt-3 max-w-[42rem] leading-[1.7] text-starter-muted">
          The app is resolving local sample content or fetching data from
          Supabase, depending on the current runtime configuration.
        </p>
        <div className="mt-[18px] grid gap-3" aria-hidden="true">
          <div className="starter-shimmer h-[52px] w-full rounded-full" />
          <div className="starter-shimmer h-[18px] w-[88%] rounded-full" />
          <div className="starter-shimmer h-[18px] w-[72%] rounded-full" />
        </div>
      </div>
    </main>
  );
}

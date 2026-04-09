import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-160px)] w-[min(calc(100%-32px),1120px)] place-items-center">
      <div className="starter-panel rounded-[32px] px-[30px] py-[30px]">
        <p className="font-sans text-[0.78rem] uppercase tracking-[0.08em] text-starter-soft">
          404
        </p>
        <h1 className="mt-3 text-[clamp(2.1rem,5vw,3.2rem)] leading-[0.98] font-semibold tracking-[-0.05em]">
          The requested post was not found.
        </h1>
        <p className="mt-3 max-w-[42rem] leading-[1.7] text-starter-muted">
          This usually means the slug does not exist in the current local
          sample data or in the configured Supabase dataset.
        </p>
        <Link
          href="/"
          className="starter-link mt-5 inline-flex w-fit rounded-full bg-starter-dark px-4 py-3 text-[#fff7ea]"
        >
          Return to the starter homepage
        </Link>
      </div>
    </main>
  );
}

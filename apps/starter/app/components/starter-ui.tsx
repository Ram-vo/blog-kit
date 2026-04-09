import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { cn } from "../../src/classnames";

export function StarterContainer({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("mx-auto w-[min(calc(100%-32px),1120px)]", className)}>
      {children}
    </main>
  );
}

export function Eyebrow({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "starter-pill text-starter-soft before:h-px before:w-6 before:bg-current before:opacity-65 before:content-['']",
        className
      )}
    >
      {children}
    </span>
  );
}

export function SurfacePanel({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("starter-panel rounded-[var(--radius-panel)]", className)}>
      {children}
    </div>
  );
}

export function SurfaceCard({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={cn("starter-card rounded-[var(--radius-card)]", className)}>
      {children}
    </article>
  );
}

export function SectionHeading({
  title,
  meta
}: {
  title: string;
  meta?: ReactNode;
}) {
  return (
    <div className="mb-[18px] flex flex-wrap items-end justify-between gap-3">
      <h2 className="text-[clamp(2rem,4vw,3rem)] leading-none font-semibold tracking-[-0.05em]">
        {title}
      </h2>
      {meta ? (
        <div className="font-sans text-[0.78rem] uppercase tracking-[0.08em] text-starter-soft">
          {meta}
        </div>
      ) : null}
    </div>
  );
}

export function PrimaryLink({
  href,
  children,
  className
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const isInternal = href.startsWith("/");

  if (isInternal && !href.endsWith(".xml")) {
    return (
      <Link href={href as Route} className={cn("starter-link", className)}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={cn("starter-link", className)}>
      {children}
    </a>
  );
}

export function EmptyState({
  eyebrow,
  title,
  copy,
  actions
}: {
  eyebrow: string;
  title: string;
  copy: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <SurfacePanel className="grid gap-[14px] px-[30px] py-[30px]">
      <p className="font-sans text-[0.78rem] uppercase tracking-[0.08em] text-starter-soft">
        {eyebrow}
      </p>
      <h3 className="text-[clamp(2.1rem,5vw,3.2rem)] leading-[0.98] font-semibold tracking-[-0.05em]">
        {title}
      </h3>
      <div className="max-w-[42rem] leading-[1.7] text-starter-muted">
        {copy}
      </div>
      {actions ? <div className="mt-1 flex flex-wrap gap-3">{actions}</div> : null}
    </SurfacePanel>
  );
}

export function HeroLink({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) {
  return <PrimaryLink href={href} className="text-[#fff7ea]">{children}</PrimaryLink>;
}

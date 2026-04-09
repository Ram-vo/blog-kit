import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { siteConfig } from "../src/site-config";
import { getStarterThemeStyle } from "../src/starter-theme";
import { PrimaryLink } from "./components/starter-ui";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const themeStyle = getStarterThemeStyle() as CSSProperties;

  return (
    <html lang="en">
      <body style={themeStyle}>
        <div className="min-h-screen">
          <header className="sticky top-0 z-20 border-b border-black/8 bg-[rgba(255,250,241,0.78)] backdrop-blur-xl">
            <div className="mx-auto flex w-[min(calc(100%-32px),1120px)] flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <PrimaryLink href="/" className="inline-flex items-center gap-3 no-underline">
                <span className="inline-grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,#d35b2d_0%,#f0c05c_100%)] font-sans text-[1.05rem] font-bold tracking-[-0.04em] text-[#fff8ed] shadow-[var(--shadow-card)]">
                  bk
                </span>
                <span className="grid gap-0.5">
                  <span className="font-sans text-[0.95rem] font-bold tracking-[-0.03em]">
                    {siteConfig.name}
                  </span>
                  <span className="font-sans text-[0.76rem] text-starter-soft">
                    Starter reference app
                  </span>
                </span>
              </PrimaryLink>
              <nav
                className="flex flex-wrap items-center justify-end gap-3"
                aria-label="Primary"
              >
                <PrimaryLink
                  href="/"
                  className="font-sans text-[0.9rem] text-starter-muted"
                >
                  Home
                </PrimaryLink>
                <PrimaryLink
                  href="/blog/rss.xml"
                  className="font-sans text-[0.9rem] text-starter-muted"
                >
                  RSS
                </PrimaryLink>
                <PrimaryLink
                  href="/sitemap.xml"
                  className="font-sans text-[0.9rem] text-starter-muted"
                >
                  Sitemap
                </PrimaryLink>
                <PrimaryLink
                  href="/"
                  className="starter-link rounded-full bg-starter-dark px-4 py-3 font-sans text-[0.9rem] text-[#fff7ea]"
                >
                  View starter
                </PrimaryLink>
              </nav>
            </div>
          </header>
          <div className="pb-20 pt-6">{children}</div>
        </div>
      </body>
    </html>
  );
}

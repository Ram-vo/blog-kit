import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "../src/site-config";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: "#f6f6f2",
          color: "#101010"
        }}
      >
        {children}
      </body>
    </html>
  );
}

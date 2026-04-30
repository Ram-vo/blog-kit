import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getStarterBasePath,
  getStarterDataBackend,
  getStarterDataMode,
  getStarterSiteUrl,
  isStaticExportMode,
  shouldUseSampleContent,
  withStarterBasePath
} from "./runtime-config";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("starter runtime config", () => {
  it("defaults to auto runtime modes", () => {
    expect(getStarterDataMode()).toBe("auto");
    expect(getStarterDataBackend()).toBe("auto");
    expect(isStaticExportMode()).toBe(false);
    expect(shouldUseSampleContent()).toBe(false);
  });

  it("uses sample content during explicit sample mode or static export", () => {
    vi.stubEnv("STARTER_DATA_MODE", "sample");
    expect(shouldUseSampleContent()).toBe(true);

    vi.unstubAllEnvs();
    vi.stubEnv("STARTER_OUTPUT_MODE", "export");
    expect(isStaticExportMode()).toBe(true);
    expect(shouldUseSampleContent()).toBe(true);
  });

  it("applies the configured base path only to root-relative paths", () => {
    vi.stubEnv("STARTER_BASE_PATH", "/blog-kit");

    expect(getStarterBasePath()).toBe("/blog-kit");
    expect(withStarterBasePath("/")).toBe("/blog-kit");
    expect(withStarterBasePath("/editor")).toBe("/blog-kit/editor");
    expect(withStarterBasePath("https://example.com")).toBe("https://example.com");
  });

  it("derives a fallback site URL from the base path", () => {
    vi.stubEnv("STARTER_BASE_PATH", "/blog-kit");
    expect(getStarterSiteUrl()).toBe("https://example.com/blog-kit");

    vi.stubEnv("STARTER_SITE_URL", "https://docs.example.com");
    expect(getStarterSiteUrl()).toBe("https://docs.example.com");
  });
});

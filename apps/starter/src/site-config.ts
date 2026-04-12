import type { SiteConfig } from "blog-kit-core";
import { getStarterSiteUrl } from "./runtime-config";

const siteUrl = getStarterSiteUrl();

export const siteConfig: SiteConfig = {
  name: "Blog Kit Starter",
  description: "A minimal starter app for the blog-kit monorepo.",
  siteUrl,
  locale: "en-US",
  publisher: {
    name: "Blog Kit",
    url: siteUrl
  },
  defaultAuthorId: "starter-team",
  defaultAuthorName: "Starter Team"
};

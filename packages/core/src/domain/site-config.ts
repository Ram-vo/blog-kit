export interface SitePublisher {
  name: string;
  url?: string;
  logoUrl?: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  siteUrl: string;
  locale: string;
  publisher: SitePublisher;
  defaultAuthorId?: string;
  defaultAuthorName?: string;
}

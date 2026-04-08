export interface AuthorProfile {
  id: string;
  name: string;
  headline: string | null;
  role: string | null;
  bio: string;
  avatar: string | null;
  linkedin: string | null;
  twitter: string | null;
  facebook: string | null;
  instagram: string | null;
  github: string | null;
}

export interface CategoryProfile {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  categories: CategoryProfile[];
  tags: readonly string[];
  author: string;
  authorDetails?: AuthorProfile | null;
  publishedAt: string;
  isDraft: boolean;
  readingTime: number;
}

export interface BlogPost extends BlogPostSummary {
  content: string;
}

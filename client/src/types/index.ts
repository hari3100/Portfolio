export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  homepage: string | null;
}

export interface SkillTag {
  name: string;
  category: 'programming' | 'ml' | 'cloud' | 'data';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
  publishedAt: string;
  imageUrl: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ProjectFilter {
  id: string;
  label: string;
  category: string;
}

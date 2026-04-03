export interface SkillDto {
  id: string;
  name: string;
  description: string;
  content: string;
  domain: string;
  installCount: number;
  upvoteCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  tags: string[];
  testedOn: string[];
  originalAuthorName: string | null;
  originalAuthorUrl: string | null;
  sourceUrl: string | null;
  claimedBy: {
    id: string;
    username: string;
  } | null;
  claimedAt: string | null;
}

export interface CreateSkillDto {
  name: string;
  description: string;
  content: string;
  domain: string;
  tags: string[];
  testedOn: string[];
  originalAuthorName?: string;
  originalAuthorUrl?: string;
  sourceUrl?: string;
}

export interface UpdateSkillDto {
  name?: string;
  description?: string;
  content?: string;
  domain?: string;
  tags?: string[];
  testedOn?: string[];
}

export interface SkillSearchParams {
  search?: string;
  domain?: string;
  tags?: string[];
  sort?: 'trending' | 'newest';
  page?: number;
  limit?: number;
}

export const SKILL_DOMAINS = [
  'Frontend Design',
  'Writing',
  'Research',
  'Code Review',
  'Data Analysis',
  'Content Strategy',
  'UX Research',
  'API Documentation',
] as const;

export type SkillDomain = (typeof SKILL_DOMAINS)[number];

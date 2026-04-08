export interface ResearchSourceDto {
  title: string;
  url: string | null;
  description: string | null;
}

export interface ResearchDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  content: string;
  contentHash: string;
  domain: string;
  version: number;
  referenceCount: number;
  methodology: string | null;
  keyFindings: string | null;
  upvoteCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  tags: string[];
  sources: ResearchSourceDto[];
  originalAuthorName: string | null;
  originalAuthorUrl: string | null;
  sourceUrl: string | null;
  claimedBy: {
    id: string;
    username: string;
  } | null;
  claimedAt: string | null;
}

export interface CreateResearchDto {
  name: string;
  description: string;
  content: string;
  domain: string;
  tags?: string[];
  sources?: Array<{ title: string; url?: string; description?: string }>;
  methodology?: string;
  keyFindings?: string;
  originalAuthorName?: string;
  originalAuthorUrl?: string;
  sourceUrl?: string;
}

export interface UpdateResearchDto {
  name?: string;
  description?: string;
  content?: string;
  domain?: string;
  tags?: string[];
  sources?: Array<{ title: string; url?: string; description?: string }>;
  methodology?: string;
  keyFindings?: string;
}

export interface UpsertResearchDto {
  name: string;
  description: string;
  content: string;
  domain: string;
  tags?: string[];
  sources?: Array<{ title: string; url?: string; description?: string }>;
  methodology?: string;
  keyFindings?: string;
}

export interface ResearchBulkSyncDto {
  research: UpsertResearchDto[];
}

export interface ResearchUpsertResult {
  action: 'created' | 'updated' | 'unchanged';
  version: number;
  research: ResearchDto;
}

export interface ResearchBulkSyncResult {
  summary: {
    created: number;
    updated: number;
    unchanged: number;
    total: number;
  };
  results: ResearchUpsertResult[];
}

export interface ResearchSearchParams {
  search?: string;
  domain?: string;
  tag?: string;
  sortBy?: 'newest' | 'popular' | 'references';
  page?: number;
  limit?: number;
}

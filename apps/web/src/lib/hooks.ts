import { useQuery } from '@tanstack/react-query';
import api from './api';

// ── Types ──

export interface NormalizedAuthor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  skillsPublished: number;
}

export interface NormalizedSkill {
  id: string;
  title: string;
  description: string;
  content: string;
  author: NormalizedAuthor;
  tags: string[];
  domain: string;
  testedOn: string[];
  downloads: number;
  upvotes: number;
  createdAt: string;
  relatedSkills: string[];
  originalAuthorName: string | null;
  originalAuthorUrl: string | null;
  sourceUrl: string | null;
  claimedBy: { id: string; username: string } | null;
  claimedAt: string | null;
}

export interface NormalizedResearchSource {
  title: string;
  url: string | null;
  description: string | null;
}

export interface NormalizedResearch {
  id: string;
  title: string;
  description: string;
  content: string;
  author: NormalizedAuthor;
  tags: string[];
  domain: string;
  sources: NormalizedResearchSource[];
  methodology: string | null;
  keyFindings: string | null;
  references: number;
  upvotes: number;
  createdAt: string;
  originalAuthorName: string | null;
  originalAuthorUrl: string | null;
  sourceUrl: string | null;
  claimedBy: { id: string; username: string } | null;
  claimedAt: string | null;
}

export interface NormalizedCommunityUser {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  communityScore: number;
  tokens: number;
  badges: string[];
  tokenHistory: never[];
}

export interface NormalizedPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: NormalizedCommunityUser;
  upvotes: number;
  replies: any[];
  replyCount: number;
  createdAt: string;
}

export interface NormalizedRequest {
  id: string;
  title: string;
  description: string;
  domain: string;
  author: NormalizedCommunityUser;
  status: 'open' | 'fulfilled';
  replies: any[];
  replyCount: number;
  createdAt: string;
}

export interface NormalizedShowcase {
  id: string;
  title: string;
  description: string;
  author: NormalizedCommunityUser;
  skillsUsed: string[];
  upvotes: number;
  createdAt: string;
}

export interface NormalizedCollection {
  id: string;
  title: string;
  description: string;
  author: NormalizedAuthor;
  skillIds: string[];
  followers: number;
  createdAt: string;
  skillCount: number;
}

export interface NormalizedUserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  communityScore: number;
  tokens: number;
  badges: string[];
  tokenHistory: never[];
  skillCount: number;
  collectionCount: number;
}

// ── Helpers to normalize API responses to frontend shapes ──

function normalizeAuthor(author: any): NormalizedAuthor {
  if (!author) {
    return { id: '', name: '', avatar: '', bio: '', skillsPublished: 0 };
  }
  return {
    id: author.id,
    name: author.username,
    avatar: author.avatarUrl || '',
    bio: author.bio || '',
    skillsPublished: author._count?.skills ?? 0,
  };
}

function normalizeSkill(s: any): NormalizedSkill {
  return {
    id: s.id,
    title: s.name,
    description: s.description,
    content: s.content,
    author: normalizeAuthor(s.author),
    tags: s.tags?.map((t: any) => t.tag) ?? [],
    domain: s.domain,
    testedOn: s.testedOn?.map((t: any) => t.model) ?? [],
    downloads: s.installCount ?? 0,
    upvotes: s._count?.upvotes ?? 0,
    createdAt: s.createdAt,
    relatedSkills: [] as string[],
    originalAuthorName: s.originalAuthorName ?? null,
    originalAuthorUrl: s.originalAuthorUrl ?? null,
    sourceUrl: s.sourceUrl ?? null,
    claimedBy: s.claimedBy ?? null,
    claimedAt: s.claimedAt ?? null,
  };
}

function normalizeResearch(r: any): NormalizedResearch {
  return {
    id: r.id,
    title: r.name,
    description: r.description,
    content: r.content,
    author: normalizeAuthor(r.author),
    tags: r.tags?.map((t: any) => t.tag) ?? [],
    domain: r.domain,
    sources: r.sources?.map((s: any) => ({
      title: s.title,
      url: s.url ?? null,
      description: s.description ?? null,
    })) ?? [],
    methodology: r.methodology ?? null,
    keyFindings: r.keyFindings ?? null,
    references: r.referenceCount ?? 0,
    upvotes: r._count?.upvotes ?? 0,
    createdAt: r.createdAt,
    originalAuthorName: r.originalAuthorName ?? null,
    originalAuthorUrl: r.originalAuthorUrl ?? null,
    sourceUrl: r.sourceUrl ?? null,
    claimedBy: r.claimedBy ?? null,
    claimedAt: r.claimedAt ?? null,
  };
}

function normalizeCollection(c: any): NormalizedCollection {
  return {
    id: c.id,
    title: c.name,
    description: c.description || '',
    author: normalizeAuthor(c.author),
    skillIds: c.skills?.map((cs: any) => cs.skill?.id ?? cs.skillId) ?? [],
    followers: 0,
    createdAt: c.createdAt,
    skillCount: c._count?.skills ?? c.skills?.length ?? 0,
  };
}

function normalizePost(p: any): NormalizedPost {
  return {
    id: p.id,
    title: p.title || '',
    content: p.body,
    category: (p.category || 'general').toLowerCase().replace('_', '-').replace('show-and-tell', 'show-tell') as any,
    author: {
      id: p.author.id,
      name: p.author.username,
      avatar: p.author.avatarUrl || '',
      bio: '',
      communityScore: 0,
      tokens: 0,
      badges: [] as string[],
      tokenHistory: [],
    },
    upvotes: p._count?.upvotes ?? 0,
    replies: p.replies?.map((r: any) => ({
      id: r.id,
      content: r.body,
      author: {
        id: r.author?.id || '',
        name: r.author?.username || '',
        avatar: r.author?.avatarUrl || '',
        bio: '',
        communityScore: 0,
        tokens: 0,
        badges: [],
        tokenHistory: [],
      },
      upvotes: 0,
      createdAt: r.createdAt,
    })) ?? [],
    replyCount: p._count?.replies ?? 0,
    createdAt: p.createdAt,
  };
}

function normalizeRequest(r: any): NormalizedRequest {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    domain: '',
    author: {
      id: r.author.id,
      name: r.author.username,
      avatar: r.author.avatarUrl || '',
      bio: '',
      communityScore: 0,
      tokens: 0,
      badges: [] as string[],
      tokenHistory: [],
    },
    status: (r.status || 'open').toLowerCase() as 'open' | 'fulfilled',
    replies: r.replies?.map((rep: any) => ({
      id: rep.id,
      content: rep.body,
      author: {
        id: rep.author?.id || rep.authorId || '',
        name: rep.author?.username || '',
        avatar: rep.author?.avatarUrl || '',
        bio: '',
        communityScore: 0,
        tokens: 0,
        badges: [],
        tokenHistory: [],
      },
      skillId: rep.skillId,
      createdAt: rep.createdAt,
    })) ?? [],
    replyCount: r._count?.replies ?? 0,
    createdAt: r.createdAt,
  };
}

function normalizeShowcase(s: any): NormalizedShowcase {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    author: {
      id: s.author.id,
      name: s.author.username,
      avatar: s.author.avatarUrl || '',
      bio: '',
      communityScore: 0,
      tokens: 0,
      badges: [] as string[],
      tokenHistory: [],
    },
    skillsUsed: s.skills?.map((ss: any) => ss.skill?.id) ?? [],
    upvotes: 0,
    createdAt: s.createdAt,
  };
}

function normalizeUserProfile(u: any): NormalizedUserProfile {
  return {
    id: u.id,
    name: u.username,
    avatar: u.avatarUrl || '',
    bio: u.bio || '',
    communityScore: u.communityScore ?? 0,
    tokens: u.tokenBalance ?? 0,
    badges: u.badges?.map((b: any) => b.type.toLowerCase().replace(/_/g, '-')) ?? [],
    tokenHistory: [],
    skillCount: u._count?.skills ?? 0,
    collectionCount: u._count?.collections ?? 0,
  };
}

// ── Skills hooks ──

export function useSkills(params?: {
  search?: string;
  domain?: string;
  tag?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['skills', params],
    queryFn: async (): Promise<{ skills: NormalizedSkill[]; meta: any }> => {
      const { data } = await api.get('/skills', { params });
      return {
        skills: (data.data as any[]).map(normalizeSkill),
        meta: data.meta,
      };
    },
  });
}

export function useSkill(id: string | undefined) {
  return useQuery({
    queryKey: ['skill', id],
    queryFn: async (): Promise<NormalizedSkill> => {
      const { data } = await api.get(`/skills/${id}`);
      return normalizeSkill(data);
    },
    enabled: !!id,
  });
}

// ── Research hooks ──

export function useResearchList(params?: {
  search?: string;
  domain?: string;
  tag?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['research', params],
    queryFn: async (): Promise<{ research: NormalizedResearch[]; meta: any }> => {
      const { data } = await api.get('/research', { params });
      return {
        research: (data.data as any[]).map(normalizeResearch),
        meta: data.meta,
      };
    },
  });
}

export function useResearch(id: string | undefined) {
  return useQuery({
    queryKey: ['research-item', id],
    queryFn: async (): Promise<NormalizedResearch> => {
      const { data } = await api.get(`/research/${id}`);
      return normalizeResearch(data);
    },
    enabled: !!id,
  });
}

export function useUserResearch(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-research', userId],
    queryFn: async (): Promise<NormalizedResearch[]> => {
      const { data } = await api.get('/research', { params: { author: userId, limit: 100 } });
      return (data.data as any[]).map(normalizeResearch);
    },
    enabled: !!userId,
  });
}

// ── Collections hooks ──

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async (): Promise<NormalizedCollection[]> => {
      const { data } = await api.get('/collections');
      return (data as any[]).map(normalizeCollection);
    },
  });
}

export function useCollection(id: string | undefined) {
  return useQuery({
    queryKey: ['collection', id],
    queryFn: async (): Promise<NormalizedCollection & { skills: NormalizedSkill[] }> => {
      const { data } = await api.get(`/collections/${id}`);
      return {
        ...normalizeCollection(data),
        skills: (data.skills as any[] ?? []).map((cs: any) => normalizeSkill(cs.skill)),
      };
    },
    enabled: !!id,
  });
}

// ── Community hooks ──

export function usePosts(category?: string) {
  return useQuery({
    queryKey: ['posts', category],
    queryFn: async (): Promise<NormalizedPost[]> => {
      const params = category ? { category } : undefined;
      const { data } = await api.get('/community/posts', { params });
      return (data as any[]).map(normalizePost);
    },
  });
}

export function useRequests() {
  return useQuery({
    queryKey: ['requests'],
    queryFn: async (): Promise<NormalizedRequest[]> => {
      const { data } = await api.get('/requests');
      return (data as any[]).map(normalizeRequest);
    },
  });
}

export function useShowcases() {
  return useQuery({
    queryKey: ['showcases'],
    queryFn: async (): Promise<NormalizedShowcase[]> => {
      const { data } = await api.get('/showcases');
      return (data as any[]).map(normalizeShowcase);
    },
  });
}

// ── User hooks ──

export function useUserProfile(id: string | undefined) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async (): Promise<NormalizedUserProfile> => {
      const { data } = await api.get(`/users/${id}`);
      return normalizeUserProfile(data);
    },
    enabled: !!id,
  });
}

export function useUserSkills(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-skills', userId],
    queryFn: async (): Promise<NormalizedSkill[]> => {
      const { data } = await api.get(`/users/${userId}/skills`);
      return (data as any[]).map(normalizeSkill);
    },
    enabled: !!userId,
  });
}

export function useUserCollections(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-collections', userId],
    queryFn: async (): Promise<NormalizedCollection[]> => {
      const { data } = await api.get(`/users/${userId}/collections`);
      return (data as any[]).map(normalizeCollection);
    },
    enabled: !!userId,
  });
}

// ── Domains (derived from skills or hardcoded fallback) ──

export function useDomains() {
  return useQuery({
    queryKey: ['domains'],
    queryFn: async (): Promise<string[]> => {
      const { data } = await api.get('/skills', { params: { limit: 100 } });
      const domainSet = new Set<string>((data.data as any[]).map((s: any) => s.domain).filter(Boolean));
      return Array.from(domainSet).sort();
    },
    staleTime: 5 * 60 * 1000,
  });
}

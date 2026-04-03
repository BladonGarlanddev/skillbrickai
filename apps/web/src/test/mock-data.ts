import type { NormalizedSkill, NormalizedPost, NormalizedRequest, NormalizedShowcase, NormalizedCollection, NormalizedUserProfile } from '@/lib/hooks';

export const mockAuthor = {
  id: 'author-1',
  name: 'Jane Doe',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Test author bio',
  skillsPublished: 5,
};

export const mockSkill: NormalizedSkill = {
  id: 'skill-1',
  title: 'Empathetic Email Composition',
  description: 'Write professional emails that balance clarity with warmth',
  content: 'You are an expert email writer...',
  author: mockAuthor,
  tags: ['writing', 'communication', 'email'],
  domain: 'Writing',
  testedOn: ['Claude 3.5', 'GPT-4'],
  downloads: 1234,
  upvotes: 42,
  createdAt: '2026-03-01T00:00:00Z',
  relatedSkills: [],
  originalAuthorName: null,
  originalAuthorUrl: null,
  sourceUrl: null,
  claimedBy: null,
  claimedAt: null,
};

export const mockSkill2: NormalizedSkill = {
  id: 'skill-2',
  title: 'Code Review Assistant',
  description: 'Review code for bugs, style issues, and performance',
  content: 'You are an expert code reviewer...',
  author: { ...mockAuthor, id: 'author-2', name: 'John Smith' },
  tags: ['code', 'review'],
  domain: 'Code Review',
  testedOn: ['Claude 3.5'],
  downloads: 567,
  upvotes: 18,
  createdAt: '2026-03-05T00:00:00Z',
  relatedSkills: [],
  originalAuthorName: null,
  originalAuthorUrl: null,
  sourceUrl: null,
  claimedBy: null,
  claimedAt: null,
};

export const mockPost: NormalizedPost = {
  id: 'post-1',
  title: 'How to handle context window limits?',
  content: 'I have been hitting limits with large skills...',
  category: 'help',
  author: {
    id: 'author-1',
    name: 'Jane Doe',
    avatar: 'https://example.com/avatar.jpg',
    bio: '',
    communityScore: 1240,
    tokens: 42,
    badges: ['early-adopter'],
    tokenHistory: [],
  },
  upvotes: 12,
  replies: [],
  replyCount: 3,
  createdAt: '2026-03-12T00:00:00Z',
};

export const mockRequest: NormalizedRequest = {
  id: 'req-1',
  title: 'Legal Document Reviewer',
  description: 'Need a skill for reviewing contracts',
  domain: 'Legal',
  author: {
    id: 'author-3',
    name: 'Elena Rodriguez',
    avatar: 'https://example.com/elena.jpg',
    bio: '',
    communityScore: 432,
    tokens: 20,
    badges: [],
    tokenHistory: [],
  },
  status: 'open',
  replies: [],
  replyCount: 1,
  createdAt: '2026-03-10T00:00:00Z',
};

export const mockShowcase: NormalizedShowcase = {
  id: 'show-1',
  title: 'AI-powered documentation generator',
  description: 'Used skills to build a doc generator',
  author: {
    id: 'author-1',
    name: 'Jane Doe',
    avatar: 'https://example.com/avatar.jpg',
    bio: '',
    communityScore: 1240,
    tokens: 42,
    badges: ['early-adopter'],
    tokenHistory: [],
  },
  skillsUsed: ['skill-1'],
  upvotes: 18,
  createdAt: '2026-03-09T00:00:00Z',
};

export const mockCollection: NormalizedCollection = {
  id: 'col-1',
  title: 'Frontend Developer Essential Pack',
  description: 'Must-have skills for frontend development',
  author: mockAuthor,
  skillIds: ['skill-1', 'skill-2'],
  followers: 234,
  createdAt: '2026-02-15T00:00:00Z',
  skillCount: 2,
};

export const mockUserProfile: NormalizedUserProfile = {
  id: 'author-1',
  name: 'Jane Doe',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Test user bio',
  communityScore: 1240,
  tokens: 42,
  badges: ['early-adopter', 'contributor'],
  tokenHistory: [],
  skillCount: 5,
  collectionCount: 2,
};

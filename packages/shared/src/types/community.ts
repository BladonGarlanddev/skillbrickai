export interface PostDto {
  id: string;
  title: string | null;
  body: string;
  category: PostCategory;
  parentId: string | null;
  createdAt: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
    communityScore: number;
  };
  replyCount: number;
  upvoteCount: number;
}

export enum PostCategory {
  GENERAL = 'GENERAL',
  HELP = 'HELP',
  IDEAS = 'IDEAS',
  SHOW_AND_TELL = 'SHOW_AND_TELL',
}

export interface CreatePostDto {
  title?: string;
  body: string;
  category: PostCategory;
  parentId?: string;
}

export interface SkillRequestDto {
  id: string;
  title: string;
  description: string;
  status: SkillRequestStatus;
  createdAt: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
    communityScore: number;
  };
  replyCount: number;
}

export enum SkillRequestStatus {
  OPEN = 'OPEN',
  FULFILLED = 'FULFILLED',
}

export interface CreateSkillRequestDto {
  title: string;
  description: string;
}

export interface ShowcaseDto {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
    communityScore: number;
  };
  skills: { id: string; name: string }[];
  upvoteCount: number;
}

export interface CreateShowcaseDto {
  title: string;
  description: string;
  skillIds: string[];
}

export interface CollectionDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  skillCount: number;
  followerCount: number;
}

export interface CreateCollectionDto {
  name: string;
  description?: string;
}

export interface ImprovementSuggestionDto {
  id: string;
  proposedContent: string;
  note: string | null;
  status: SuggestionStatus;
  createdAt: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
}

export enum SuggestionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface CreateSuggestionDto {
  proposedContent: string;
  note?: string;
}

export enum UpvoteTarget {
  SKILL = 'SKILL',
  POST = 'POST',
  REPLY = 'REPLY',
  SHOWCASE = 'SHOWCASE',
}

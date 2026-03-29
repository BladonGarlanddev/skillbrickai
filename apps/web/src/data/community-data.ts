export type BadgeType =
  | "early-adopter"
  | "contributor"
  | "active-community"
  | "mr-popular"
  | "curator"
  | "helper"
  | "verified-expert";

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
}

export interface TokenTransaction {
  id: string;
  type: "earn" | "spend";
  amount: number;
  description: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  communityScore: number;
  tokens: number;
  badges: BadgeType[];
  tokenHistory: TokenTransaction[];
}

export interface DiscussionPost {
  id: string;
  title: string;
  content: string;
  category: "general" | "help" | "ideas" | "show-tell";
  author: UserProfile;
  upvotes: number;
  replies: DiscussionReply[];
  createdAt: string;
}

export interface DiscussionReply {
  id: string;
  content: string;
  author: UserProfile;
  upvotes: number;
  createdAt: string;
}

export interface SkillRequest {
  id: string;
  title: string;
  description: string;
  domain: string;
  author: UserProfile;
  status: "open" | "fulfilled";
  replies: RequestReply[];
  createdAt: string;
}

export interface RequestReply {
  id: string;
  content: string;
  author: UserProfile;
  skillId?: string;
  createdAt: string;
}

export interface Showcase {
  id: string;
  title: string;
  description: string;
  author: UserProfile;
  skillsUsed: string[];
  imageUrl?: string;
  upvotes: number;
  createdAt: string;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  author: UserProfile;
  skillIds: string[];
  followers: number;
  createdAt: string;
}

export const badges: Record<BadgeType, Badge> = {
  "early-adopter": {
    id: "early-adopter",
    name: "Early Adopter",
    description: "Account created during early access",
    icon: "\u2726"
  },
  "contributor": {
    id: "contributor",
    name: "Contributor",
    description: "Published at least one skill",
    icon: "\u25C6"
  },
  "active-community": {
    id: "active-community",
    name: "Active Community Member",
    description: "Regular participation in discussions and requests",
    icon: "\u25CF"
  },
  "mr-popular": {
    id: "mr-popular",
    name: "Mr. Popular",
    description: "A skill reached high usage threshold",
    icon: "\u2605"
  },
  "curator": {
    id: "curator",
    name: "Curator",
    description: "Created a collection",
    icon: "\u25C8"
  },
  "helper": {
    id: "helper",
    name: "Helper",
    description: "Replied to a skill request with a skill that was used",
    icon: "\u2666"
  },
  "verified-expert": {
    id: "verified-expert",
    name: "Verified Expert",
    description: "Domain-verified professional",
    icon: "\u2713"
  }
};

export const currentUser: UserProfile = {
  id: "1",
  name: "Sarah Chen",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  bio: "Product designer focused on AI tooling and design systems. Building bridges between human intent and machine understanding.",
  communityScore: 1240,
  tokens: 42,
  badges: ["early-adopter", "contributor", "curator", "mr-popular"],
  tokenHistory: [
    {
      id: "1",
      type: "earn",
      amount: 10,
      description: "Posted Design System Auditor",
      timestamp: "2026-03-12"
    },
    {
      id: "2",
      type: "spend",
      amount: 1,
      description: "Installed React Component Reviewer",
      timestamp: "2026-03-10"
    },
    {
      id: "3",
      type: "earn",
      amount: 30,
      description: "Created account",
      timestamp: "2026-01-15"
    }
  ]
};

export const discussionPosts: DiscussionPost[] = [
  {
    id: "1",
    title: "How do you handle context window limits when using large skills?",
    content: "I've been using some of the longer research and documentation skills, and I'm hitting context limits on GPT-4. Has anyone found good strategies for breaking these down or working around the limitation?",
    category: "help",
    author: {
      id: "2",
      name: "Marcus Rivera",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      bio: "Technical writer and documentation specialist.",
      communityScore: 856,
      tokens: 25,
      badges: ["early-adopter", "contributor"],
      tokenHistory: []
    },
    upvotes: 12,
    replies: [
      {
        id: "1",
        content: "I usually extract just the core principles section and use that for shorter tasks. The full skill is great for complex work, but for quick iterations I've found trimming it helps.",
        author: currentUser,
        upvotes: 8,
        createdAt: "2026-03-13"
      }
    ],
    createdAt: "2026-03-12"
  },
  {
    id: "2",
    title: "Feature idea: Skill versioning",
    content: "Would be great to have versioning on skills so we can track improvements and potentially roll back if a change doesn't work well. Similar to how packages work in npm.",
    category: "ideas",
    author: {
      id: "4",
      name: "James Liu",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      bio: "Senior engineer passionate about code quality.",
      communityScore: 2341,
      tokens: 18,
      badges: ["early-adopter", "contributor", "helper", "verified-expert"],
      tokenHistory: []
    },
    upvotes: 24,
    replies: [],
    createdAt: "2026-03-11"
  }
];

export const skillRequests: SkillRequest[] = [
  {
    id: "1",
    title: "Legal Document Reviewer",
    description: "Need a skill for reviewing contracts and legal documents for common issues, plain language violations, and missing standard clauses.",
    domain: "Legal",
    author: {
      id: "5",
      name: "Elena Rodriguez",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
      bio: "Legal operations specialist",
      communityScore: 432,
      tokens: 20,
      badges: ["early-adopter"],
      tokenHistory: []
    },
    status: "open",
    replies: [
      {
        id: "1",
        content: "This sounds like it would need domain expertise. Have you looked at the API Documentation Reviewer? Some of the patterns might translate.",
        author: currentUser,
        createdAt: "2026-03-13"
      }
    ],
    createdAt: "2026-03-10"
  },
  {
    id: "2",
    title: "SQL Query Optimizer",
    description: "A skill that reviews SQL queries for performance issues, suggests indexes, and identifies N+1 problems.",
    domain: "Code Review",
    author: {
      id: "4",
      name: "James Liu",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      bio: "Senior engineer passionate about code quality.",
      communityScore: 2341,
      tokens: 18,
      badges: ["early-adopter", "contributor", "helper", "verified-expert"],
      tokenHistory: []
    },
    status: "fulfilled",
    replies: [
      {
        id: "1",
        content: "I just published one! Check it out:",
        author: {
          id: "6",
          name: "Priya Sharma",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
          bio: "Database architect",
          communityScore: 1567,
          tokens: 35,
          badges: ["contributor", "helper", "verified-expert"],
          tokenHistory: []
        },
        skillId: "4",
        createdAt: "2026-03-12"
      }
    ],
    createdAt: "2026-03-08"
  }
];

export const showcases: Showcase[] = [
  {
    id: "1",
    title: "Built an AI-powered documentation generator",
    description: "Used the API Documentation Reviewer and Research Paper Synthesizer skills to build a tool that generates comprehensive API docs from code comments. The combination of both skills helped create documentation that's both technically accurate and readable.",
    author: currentUser,
    skillsUsed: ["2", "3"],
    upvotes: 18,
    createdAt: "2026-03-09"
  },
  {
    id: "2",
    title: "Automated email response system for support",
    description: "Integrated the Empathetic Email Composition skill into our customer support workflow. Response time decreased by 40% while maintaining quality and customer satisfaction scores.",
    author: {
      id: "2",
      name: "Marcus Rivera",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      bio: "Technical writer and documentation specialist.",
      communityScore: 856,
      tokens: 25,
      badges: ["early-adopter", "contributor"],
      tokenHistory: []
    },
    skillsUsed: ["1"],
    upvotes: 32,
    createdAt: "2026-03-07"
  }
];

export const collections: Collection[] = [
  {
    id: "1",
    title: "Frontend Developer Essential Pack",
    description: "Must-have skills for modern frontend development - from code review to design systems to accessibility.",
    author: currentUser,
    skillIds: ["4", "6", "9"],
    followers: 234,
    createdAt: "2026-02-15"
  },
  {
    id: "2",
    title: "Content Creation Toolkit",
    description: "Everything you need for writing, editing, and publishing great content.",
    author: {
      id: "2",
      name: "Marcus Rivera",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      bio: "Technical writer and documentation specialist.",
      communityScore: 856,
      tokens: 25,
      badges: ["early-adopter", "contributor"],
      tokenHistory: []
    },
    skillIds: ["1", "7"],
    followers: 142,
    createdAt: "2026-02-20"
  }
];

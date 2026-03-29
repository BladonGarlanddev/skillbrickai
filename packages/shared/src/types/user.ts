export interface UserDto {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  communityScore: number;
  tokenBalance: number;
  isEarlyAdopter: boolean;
  createdAt: string;
  badges: BadgeDto[];
}

export interface BadgeDto {
  id: string;
  type: BadgeType;
  earnedAt: string;
}

export enum BadgeType {
  EARLY_ADOPTER = 'EARLY_ADOPTER',
  CONTRIBUTOR = 'CONTRIBUTOR',
  ACTIVE_COMMUNITY_MEMBER = 'ACTIVE_COMMUNITY_MEMBER',
  MR_POPULAR = 'MR_POPULAR',
  CURATOR = 'CURATOR',
  HELPER = 'HELPER',
  VERIFIED_EXPERT = 'VERIFIED_EXPERT',
}

export interface CreateUserDto {
  email: string;
  username: string;
  password?: string;
  avatarUrl?: string;
}

export interface UpdateUserDto {
  username?: string;
  avatarUrl?: string;
  bio?: string;
}

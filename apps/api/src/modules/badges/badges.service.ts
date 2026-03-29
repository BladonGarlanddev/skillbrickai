import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BadgesService {
  constructor(private readonly prisma: PrismaService) {}

  async awardBadge(userId: string, badgeType: string) {
    // Upsert to avoid duplicate badge errors
    return this.prisma.badge.upsert({
      where: {
        userId_type: {
          userId,
          type: badgeType as any,
        },
      },
      create: {
        userId,
        type: badgeType as any,
      },
      update: {},
    });
  }

  async getUserBadges(userId: string) {
    return this.prisma.badge.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
    });
  }

  async checkAndAwardBadges(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            skills: true,
            posts: true,
            collections: true,
            upvotes: true,
          },
        },
      },
    });

    if (!user) return;

    // Contributor: has posted at least 1 skill
    if (user._count.skills >= 1) {
      await this.awardBadge(userId, 'CONTRIBUTOR');
    }

    // Active Community Member: has posted at least 5 posts
    if (user._count.posts >= 5) {
      await this.awardBadge(userId, 'ACTIVE_COMMUNITY_MEMBER');
    }

    // Curator: has created at least 3 collections
    if (user._count.collections >= 3) {
      await this.awardBadge(userId, 'CURATOR');
    }

    // Mr Popular: community score >= 50
    if (user.communityScore >= 50) {
      await this.awardBadge(userId, 'MR_POPULAR');
    }

    // Helper: has given at least 10 upvotes
    if (user._count.upvotes >= 10) {
      await this.awardBadge(userId, 'HELPER');
    }
  }
}

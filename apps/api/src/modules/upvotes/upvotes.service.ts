import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UpvotesService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleUpvote(
    userId: string,
    targetType: string,
    targetId: string,
    targetAuthorId: string,
  ) {
    const existing = await this.prisma.upvote.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: targetType as any,
          targetId,
        },
      },
    });

    if (existing) {
      // Remove upvote
      await this.prisma.upvote.delete({ where: { id: existing.id } });

      // Decrement community score on the target's author
      if (targetAuthorId !== userId) {
        await this.prisma.user.update({
          where: { id: targetAuthorId },
          data: { communityScore: { decrement: 1 } },
        });
      }

      return { upvoted: false };
    } else {
      // Create upvote
      await this.prisma.upvote.create({
        data: {
          userId,
          targetType: targetType as any,
          targetId,
        },
      });

      // Increment community score on the target's author
      if (targetAuthorId !== userId) {
        await this.prisma.user.update({
          where: { id: targetAuthorId },
          data: { communityScore: { increment: 1 } },
        });
      }

      return { upvoted: true };
    }
  }
}

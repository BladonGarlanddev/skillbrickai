import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        bio: true,
        communityScore: true,
        tokenBalance: true,
        isEarlyAdopter: true,
        createdAt: true,
        badges: {
          select: {
            type: true,
            earnedAt: true,
          },
        },
        _count: {
          select: {
            skills: true,
            collections: true,
            posts: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(
    userId: string,
    data: { username?: string; bio?: string; avatarUrl?: string },
  ) {
    if (data.username) {
      const existing = await this.prisma.user.findUnique({
        where: { username: data.username },
      });
      if (existing && existing.id !== userId) {
        throw new ConflictException('Username already taken');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        bio: true,
        communityScore: true,
        tokenBalance: true,
      },
    });
  }

  async getUserSkills(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.skill.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: { id: true, username: true, avatarUrl: true },
        },
        tags: true,
        testedOn: true,
        _count: { select: { upvotes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserCollections(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.collection.findMany({
      where: { authorId: userId },
      include: {
        _count: { select: { skills: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.collection.findMany({
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { skills: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(
    userId: string,
    data: { name: string; description?: string },
  ) {
    return this.prisma.collection.create({
      data: {
        name: data.name,
        description: data.description,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
      },
    });
  }

  async findOne(id: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        skills: {
          include: {
            skill: {
              include: {
                author: {
                  select: { id: true, username: true, avatarUrl: true },
                },
                tags: true,
                _count: { select: { upvotes: true } },
              },
            },
          },
          orderBy: { addedAt: 'desc' },
        },
      },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    return collection;
  }

  async update(
    userId: string,
    id: string,
    data: { name?: string; description?: string },
  ) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.authorId !== userId) {
      throw new ForbiddenException('You can only update your own collections');
    }

    return this.prisma.collection.update({
      where: { id },
      data,
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { skills: true } },
      },
    });
  }

  async remove(userId: string, id: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own collections');
    }

    await this.prisma.collection.delete({ where: { id } });

    return { deleted: true };
  }

  async addSkill(userId: string, collectionId: string, skillId: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.authorId !== userId) {
      throw new ForbiddenException(
        'You can only add skills to your own collections',
      );
    }

    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    const existing = await this.prisma.collectionSkill.findUnique({
      where: {
        collectionId_skillId: { collectionId, skillId },
      },
    });

    if (existing) {
      throw new ConflictException('Skill already in collection');
    }

    await this.prisma.collectionSkill.create({
      data: { collectionId, skillId },
    });

    return { message: 'Skill added to collection' };
  }
}

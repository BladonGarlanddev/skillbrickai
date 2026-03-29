import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TokensService } from '../tokens/tokens.service';
import { BadgesService } from '../badges/badges.service';
import { UpvotesService } from '../upvotes/upvotes.service';

@Injectable()
export class SkillsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokensService: TokensService,
    private readonly badgesService: BadgesService,
    private readonly upvotesService: UpvotesService,
  ) {}

  async findAll(query: {
    search?: string;
    domain?: string;
    tag?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.domain) {
      where.domain = query.domain;
    }

    if (query.tag) {
      where.tags = { some: { tag: query.tag } };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (query.sortBy === 'popular') {
      orderBy = { upvotes: { _count: 'desc' } };
    } else if (query.sortBy === 'installs') {
      orderBy = { installCount: 'desc' };
    }

    const [skills, total] = await Promise.all([
      this.prisma.skill.findMany({
        where,
        include: {
          author: {
            select: { id: true, username: true, avatarUrl: true },
          },
          tags: true,
          testedOn: true,
          _count: { select: { upvotes: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.skill.count({ where }),
    ]);

    return {
      data: skills,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(
    userId: string,
    data: {
      name: string;
      description: string;
      content: string;
      domain: string;
      tags?: string[];
      testedOn?: string[];
    },
  ) {
    const skill = await this.prisma.skill.create({
      data: {
        name: data.name,
        description: data.description,
        content: data.content,
        domain: data.domain,
        authorId: userId,
        tags: data.tags
          ? { create: data.tags.map((tag) => ({ tag })) }
          : undefined,
        testedOn: data.testedOn
          ? { create: data.testedOn.map((model) => ({ model })) }
          : undefined,
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        tags: true,
        testedOn: true,
      },
    });

    // Credit 10 tokens for posting a skill
    await this.tokensService.creditTokens(userId, 10, 'SKILL_POSTED', skill.id);

    // Award Contributor badge if this is the user's first skill
    const skillCount = await this.prisma.skill.count({
      where: { authorId: userId },
    });
    if (skillCount === 1) {
      await this.badgesService.awardBadge(userId, 'CONTRIBUTOR');
    }

    return skill;
  }

  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            communityScore: true,
          },
        },
        tags: true,
        testedOn: true,
        _count: { select: { upvotes: true } },
      },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return skill;
  }

  async update(
    userId: string,
    id: string,
    data: {
      name?: string;
      description?: string;
      content?: string;
      domain?: string;
      tags?: string[];
      testedOn?: string[];
    },
  ) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    if (skill.authorId !== userId) {
      throw new ForbiddenException('You can only update your own skills');
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.domain !== undefined) updateData.domain = data.domain;

    // Handle tags replacement
    if (data.tags !== undefined) {
      await this.prisma.skillTag.deleteMany({ where: { skillId: id } });
      updateData.tags = { create: data.tags.map((tag) => ({ tag })) };
    }

    // Handle testedOn replacement
    if (data.testedOn !== undefined) {
      await this.prisma.skillTestedOn.deleteMany({ where: { skillId: id } });
      updateData.testedOn = {
        create: data.testedOn.map((model) => ({ model })),
      };
    }

    return this.prisma.skill.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        tags: true,
        testedOn: true,
      },
    });
  }

  async remove(userId: string, id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    if (skill.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own skills');
    }

    // Delete related records first
    await this.prisma.skillTag.deleteMany({ where: { skillId: id } });
    await this.prisma.skillTestedOn.deleteMany({ where: { skillId: id } });
    await this.prisma.upvote.deleteMany({
      where: { targetId: id, targetType: 'SKILL' },
    });
    await this.prisma.collectionSkill.deleteMany({ where: { skillId: id } });
    await this.prisma.showcaseSkill.deleteMany({ where: { skillId: id } });
    await this.prisma.improvementSuggestion.deleteMany({
      where: { skillId: id },
    });

    await this.prisma.skill.delete({ where: { id } });

    return { deleted: true };
  }

  async install(userId: string, skillId: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    // Check user has enough tokens
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { tokenBalance: true },
    });

    if (!user || user.tokenBalance < 1) {
      throw new BadRequestException('Insufficient tokens');
    }

    // Debit 1 token
    await this.tokensService.debitTokens(
      userId,
      1,
      'SKILL_INSTALLED',
      skillId,
    );

    // Increment install count
    await this.prisma.skill.update({
      where: { id: skillId },
      data: { installCount: { increment: 1 } },
    });

    return {
      message: 'Skill installed successfully',
      content: skill.content,
    };
  }

  async toggleUpvote(userId: string, skillId: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
      select: { id: true, authorId: true },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return this.upvotesService.toggleUpvote(
      userId,
      'SKILL',
      skillId,
      skill.authorId,
    );
  }
}

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function hashContent(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

const MIN_CONTENT_LENGTH = 20;

@Injectable()
export class ClaudeMdService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    search?: string;
    tag?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {
      visibility: 'PUBLIC',
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.tag) {
      where.tags = { some: { tag: query.tag } };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (query.sortBy === 'installs') {
      orderBy = { installCount: 'desc' };
    }

    const [claudeMds, total] = await Promise.all([
      this.prisma.claudeMd.findMany({
        where,
        include: {
          author: {
            select: { id: true, username: true, avatarUrl: true },
          },
          tags: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.claudeMd.count({ where }),
    ]);

    return {
      data: claudeMds,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const claudeMd = await this.prisma.claudeMd.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, username: true, avatarUrl: true },
        },
        tags: true,
      },
    });

    if (!claudeMd) {
      throw new NotFoundException('CLAUDE.md not found');
    }

    return claudeMd;
  }

  async create(
    userId: string,
    data: {
      name: string;
      description: string;
      content: string;
      projectUrl?: string;
      visibility?: 'PUBLIC' | 'PRIVATE';
      tags?: string[];
    },
  ) {
    if (data.content.trim().length < MIN_CONTENT_LENGTH) {
      throw new BadRequestException(
        `CLAUDE.md content must be at least ${MIN_CONTENT_LENGTH} characters.`,
      );
    }

    const slug = generateSlug(data.name);
    const contentDigest = hashContent(data.content);
    const visibility = data.visibility || 'PRIVATE';

    const claudeMd = await this.prisma.claudeMd.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        content: data.content,
        contentHash: contentDigest,
        projectUrl: data.projectUrl || null,
        visibility,
        authorId: userId,
        tags: data.tags
          ? { create: data.tags.map((tag) => ({ tag })) }
          : undefined,
        versions: {
          create: {
            version: 1,
            content: data.content,
            contentHash: contentDigest,
          },
        },
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        tags: true,
      },
    });

    return claudeMd;
  }

  async update(
    userId: string,
    id: string,
    data: {
      name?: string;
      description?: string;
      content?: string;
      projectUrl?: string;
      visibility?: 'PUBLIC' | 'PRIVATE';
      tags?: string[];
    },
  ) {
    const claudeMd = await this.prisma.claudeMd.findUnique({ where: { id } });

    if (!claudeMd) {
      throw new NotFoundException('CLAUDE.md not found');
    }

    if (claudeMd.authorId !== userId) {
      throw new ForbiddenException('You can only update your own CLAUDE.md files');
    }

    if (data.content !== undefined && data.content.trim().length < MIN_CONTENT_LENGTH) {
      throw new BadRequestException(
        `CLAUDE.md content must be at least ${MIN_CONTENT_LENGTH} characters.`,
      );
    }

    const updateData: any = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = generateSlug(data.name);
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.projectUrl !== undefined) updateData.projectUrl = data.projectUrl;
    if (data.visibility !== undefined) updateData.visibility = data.visibility;
    if (data.content !== undefined) {
      updateData.content = data.content;
      updateData.contentHash = hashContent(data.content);
      updateData.version = { increment: 1 };
    }

    if (data.tags !== undefined) {
      await this.prisma.claudeMdTag.deleteMany({ where: { claudeMdId: id } });
      updateData.tags = { create: data.tags.map((tag) => ({ tag })) };
    }

    if (data.content !== undefined) {
      const newVersion = claudeMd.version + 1;
      await this.prisma.claudeMdVersion.create({
        data: {
          claudeMdId: id,
          version: newVersion,
          content: data.content,
          contentHash: hashContent(data.content),
        },
      });
    }

    return this.prisma.claudeMd.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        tags: true,
      },
    });
  }

  async remove(userId: string, id: string) {
    const claudeMd = await this.prisma.claudeMd.findUnique({ where: { id } });

    if (!claudeMd) {
      throw new NotFoundException('CLAUDE.md not found');
    }

    if (claudeMd.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own CLAUDE.md files');
    }

    await this.prisma.claudeMdTag.deleteMany({ where: { claudeMdId: id } });
    await this.prisma.claudeMdVersion.deleteMany({ where: { claudeMdId: id } });
    await this.prisma.claudeMd.delete({ where: { id } });

    return { deleted: true };
  }

  async upsert(
    userId: string,
    data: {
      name: string;
      description: string;
      content: string;
      projectUrl?: string;
      visibility?: 'PUBLIC' | 'PRIVATE';
      tags?: string[];
    },
  ) {
    const slug = generateSlug(data.name);
    const contentDigest = hashContent(data.content);

    const existing = await this.prisma.claudeMd.findUnique({
      where: { authorId_slug: { authorId: userId, slug } },
    });

    if (!existing) {
      const claudeMd = await this.create(userId, data);
      return { action: 'created' as const, version: 1, claudeMd };
    }

    if (existing.contentHash === contentDigest) {
      const claudeMd = await this.findOne(existing.id);
      return { action: 'unchanged' as const, version: existing.version, claudeMd };
    }

    const claudeMd = await this.update(userId, existing.id, data);
    return {
      action: 'updated' as const,
      version: existing.version + 1,
      claudeMd,
    };
  }

  async findByAuthor(userId: string) {
    const claudeMds = await this.prisma.claudeMd.findMany({
      where: { authorId: userId },
      include: {
        tags: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return claudeMds.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      version: c.version,
      contentHash: c.contentHash,
      projectUrl: c.projectUrl,
      visibility: c.visibility,
      installCount: c.installCount,
      updatedAt: c.updatedAt,
      tags: c.tags.map((t) => t.tag),
    }));
  }
}

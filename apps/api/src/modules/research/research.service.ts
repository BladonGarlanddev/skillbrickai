import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { TokensService } from '../tokens/tokens.service';
import { BadgesService } from '../badges/badges.service';
import { UpvotesService } from '../upvotes/upvotes.service';

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

@Injectable()
export class ResearchService {
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

    const searchTerm = query.search?.trim();

    // ── Search path: use Postgres full-text search + trigram fuzzy matching ──
    // Scoring blends ts_rank_cd (weighted FTS over name/tags/description/domain/
    // keyFindings/methodology/content) with trigram similarity on name/description.
    // Rows match if EITHER the tsvector matches OR trigram similarity is high
    // enough, so typos and partial words still surface the right item.
    if (searchTerm) {
      const filterClauses: Prisma.Sql[] = [
        Prisma.sql`r.visibility = 'PUBLIC'`,
      ];
      if (query.domain) {
        filterClauses.push(Prisma.sql`r.domain = ${query.domain}`);
      }
      if (query.tag) {
        filterClauses.push(
          Prisma.sql`EXISTS (SELECT 1 FROM "ResearchTag" rt WHERE rt."researchId" = r.id AND rt.tag = ${query.tag})`,
        );
      }
      const whereSql = Prisma.join(filterClauses, ' AND ');

      const ranked = await this.prisma.$queryRaw<
        Array<{ id: string; total: bigint }>
      >`
        WITH scored AS (
          SELECT
            r.id,
            (
              COALESCE(
                ts_rank_cd(
                  r."searchVector",
                  websearch_to_tsquery('english', ${searchTerm})
                ),
                0
              ) * 4
              + GREATEST(
                  similarity(r.name, ${searchTerm}),
                  similarity(r.description, ${searchTerm}) * 0.6
                )
              + LEAST(r."referenceCount", 100) / 100.0 * 0.3
            ) AS score,
            COUNT(*) OVER() AS total
          FROM "Research" r
          WHERE ${whereSql}
            AND (
              r."searchVector" @@ websearch_to_tsquery('english', ${searchTerm})
              OR r.name % ${searchTerm}
              OR r.description % ${searchTerm}
            )
        )
        SELECT id, total
        FROM scored
        ORDER BY score DESC, id ASC
        LIMIT ${limit}
        OFFSET ${skip}
      `;

      const total = ranked.length > 0 ? Number(ranked[0].total) : 0;
      const ids = ranked.map((r) => r.id);

      if (ids.length === 0) {
        return {
          data: [],
          meta: { total: 0, page, limit, totalPages: 0 },
        };
      }

      const records = await this.prisma.research.findMany({
        where: { id: { in: ids } },
        include: {
          author: { select: { id: true, username: true, avatarUrl: true } },
          claimedBy: { select: { id: true, username: true } },
          tags: true,
          sources: true,
        },
      });
      const byId = new Map(records.map((r) => [r.id, r]));
      const ordered = ids
        .map((id) => byId.get(id))
        .filter((r): r is NonNullable<typeof r> => !!r);

      const withUpvotes = await Promise.all(
        ordered.map(async (r) => {
          const upvoteCount = await this.prisma.upvote.count({
            where: { targetId: r.id, targetType: 'RESEARCH' },
          });
          return { ...r, _count: { upvotes: upvoteCount } };
        }),
      );

      return {
        data: withUpvotes,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    }

    // ── Browse path: no search term, use standard Prisma ordering ──
    const where: Prisma.ResearchWhereInput = { visibility: 'PUBLIC' };
    if (query.domain) where.domain = query.domain;
    if (query.tag) where.tags = { some: { tag: query.tag } };

    let orderBy: Prisma.ResearchOrderByWithRelationInput = { createdAt: 'desc' };
    if (query.sortBy === 'popular' || query.sortBy === 'references') {
      orderBy = { referenceCount: 'desc' };
    }

    const [research, total] = await Promise.all([
      this.prisma.research.findMany({
        where,
        include: {
          author: {
            select: { id: true, username: true, avatarUrl: true },
          },
          claimedBy: { select: { id: true, username: true } },
          tags: true,
          sources: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.research.count({ where }),
    ]);

    const researchWithUpvotes = await Promise.all(
      research.map(async (r) => {
        const upvoteCount = await this.prisma.upvote.count({
          where: { targetId: r.id, targetType: 'RESEARCH' },
        });
        return { ...r, _count: { upvotes: upvoteCount } };
      }),
    );

    return {
      data: researchWithUpvotes,
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
      visibility?: 'PUBLIC' | 'PRIVATE';
      tags?: string[];
      sources?: Array<{ title: string; url?: string; description?: string }>;
      methodology?: string;
      keyFindings?: string;
      originalAuthorName?: string;
      originalAuthorUrl?: string;
      sourceUrl?: string;
    },
  ) {
    const slug = generateSlug(data.name);
    const contentDigest = hashContent(data.content);
    const visibility = data.visibility || 'PUBLIC';

    const research = await this.prisma.research.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        content: data.content,
        contentHash: contentDigest,
        domain: data.domain,
        visibility,
        authorId: userId,
        methodology: data.methodology || null,
        keyFindings: data.keyFindings || null,
        originalAuthorName: data.originalAuthorName || null,
        originalAuthorUrl: data.originalAuthorUrl || null,
        sourceUrl: data.sourceUrl || null,
        tags: data.tags
          ? { create: data.tags.map((tag) => ({ tag })) }
          : undefined,
        sources: data.sources
          ? {
              create: data.sources.map((s) => ({
                title: s.title,
                url: s.url || null,
                description: s.description || null,
              })),
            }
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
        claimedBy: { select: { id: true, username: true } },
        tags: true,
        sources: true,
      },
    });

    // Credit 5 tokens for posting public research (private research doesn't earn credits)
    if (visibility === 'PUBLIC') {
      await this.tokensService.creditTokens(userId, 5, 'RESEARCH_POSTED', research.id);
    }

    // Award Researcher badge if this is the user's first research
    const researchCount = await this.prisma.research.count({
      where: { authorId: userId },
    });
    if (researchCount === 1) {
      await this.badgesService.awardBadge(userId, 'RESEARCHER');
    }

    return research;
  }

  async findOne(id: string) {
    const research = await this.prisma.research.findUnique({
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
        claimedBy: { select: { id: true, username: true } },
        tags: true,
        sources: true,
      },
    });

    if (!research) {
      throw new NotFoundException('Research not found');
    }

    const upvoteCount = await this.prisma.upvote.count({
      where: { targetId: id, targetType: 'RESEARCH' },
    });

    return { ...research, _count: { upvotes: upvoteCount } };
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
      sources?: Array<{ title: string; url?: string; description?: string }>;
      methodology?: string;
      keyFindings?: string;
    },
  ) {
    const research = await this.prisma.research.findUnique({ where: { id } });

    if (!research) {
      throw new NotFoundException('Research not found');
    }

    if (research.authorId !== userId) {
      throw new ForbiddenException('You can only update your own research');
    }

    const updateData: any = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = generateSlug(data.name);
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.content !== undefined) {
      updateData.content = data.content;
      updateData.contentHash = hashContent(data.content);
      updateData.version = { increment: 1 };
    }
    if (data.domain !== undefined) updateData.domain = data.domain;
    if (data.methodology !== undefined) updateData.methodology = data.methodology;
    if (data.keyFindings !== undefined) updateData.keyFindings = data.keyFindings;

    // Handle tags replacement
    if (data.tags !== undefined) {
      await this.prisma.researchTag.deleteMany({ where: { researchId: id } });
      updateData.tags = { create: data.tags.map((tag) => ({ tag })) };
    }

    // Handle sources replacement
    if (data.sources !== undefined) {
      await this.prisma.researchSource.deleteMany({ where: { researchId: id } });
      updateData.sources = {
        create: data.sources.map((s) => ({
          title: s.title,
          url: s.url || null,
          description: s.description || null,
        })),
      };
    }

    // Create version record if content changed
    if (data.content !== undefined) {
      const newVersion = research.version + 1;
      await this.prisma.researchVersion.create({
        data: {
          researchId: id,
          version: newVersion,
          content: data.content,
          contentHash: hashContent(data.content),
        },
      });
    }

    return this.prisma.research.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        claimedBy: { select: { id: true, username: true } },
        tags: true,
        sources: true,
      },
    });
  }

  async remove(userId: string, id: string) {
    const research = await this.prisma.research.findUnique({ where: { id } });

    if (!research) {
      throw new NotFoundException('Research not found');
    }

    if (research.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own research');
    }

    // Delete related records first
    await this.prisma.researchTag.deleteMany({ where: { researchId: id } });
    await this.prisma.researchSource.deleteMany({ where: { researchId: id } });
    await this.prisma.upvote.deleteMany({
      where: { targetId: id, targetType: 'RESEARCH' },
    });
    await this.prisma.collectionResearch.deleteMany({ where: { researchId: id } });

    await this.prisma.research.delete({ where: { id } });

    return { deleted: true };
  }

  async reference(userId: string, researchId: string) {
    const research = await this.prisma.research.findUnique({
      where: { id: researchId },
    });

    if (!research) {
      throw new NotFoundException('Research not found');
    }

    // Increment reference count (free — no token cost)
    await this.prisma.research.update({
      where: { id: researchId },
      data: { referenceCount: { increment: 1 } },
    });

    return {
      message: 'Reference saved successfully',
      content: research.content,
    };
  }

  async claimResearch(userId: string, researchId: string) {
    const research = await this.prisma.research.findUnique({
      where: { id: researchId },
    });

    if (!research) {
      throw new NotFoundException('Research not found');
    }

    if (!research.originalAuthorName) {
      throw new BadRequestException('This research is not an attributed item');
    }

    if (research.claimedById) {
      throw new BadRequestException('This research has already been claimed');
    }

    const updated = await this.prisma.research.update({
      where: { id: researchId },
      data: {
        claimedById: userId,
        claimedAt: new Date(),
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        claimedBy: { select: { id: true, username: true } },
        tags: true,
        sources: true,
      },
    });

    return updated;
  }

  async toggleUpvote(userId: string, researchId: string) {
    const research = await this.prisma.research.findUnique({
      where: { id: researchId },
      select: { id: true, authorId: true },
    });

    if (!research) {
      throw new NotFoundException('Research not found');
    }

    return this.upvotesService.toggleUpvote(
      userId,
      'RESEARCH',
      researchId,
      research.authorId,
    );
  }

  async upsert(
    userId: string,
    data: {
      name: string;
      description: string;
      content: string;
      domain: string;
      visibility?: 'PUBLIC' | 'PRIVATE';
      tags?: string[];
      sources?: Array<{ title: string; url?: string; description?: string }>;
      methodology?: string;
      keyFindings?: string;
    },
  ) {
    const slug = generateSlug(data.name);
    const contentDigest = hashContent(data.content);

    const existing = await this.prisma.research.findUnique({
      where: { authorId_slug: { authorId: userId, slug } },
    });

    if (!existing) {
      const research = await this.create(userId, data);
      return { action: 'created' as const, version: 1, research };
    }

    if (existing.contentHash === contentDigest) {
      const research = await this.findOne(existing.id);
      return { action: 'unchanged' as const, version: existing.version, research };
    }

    const research = await this.update(userId, existing.id, data);
    return {
      action: 'updated' as const,
      version: existing.version + 1,
      research,
    };
  }

  async bulkSync(
    userId: string,
    items: Array<{
      name: string;
      description: string;
      content: string;
      domain: string;
      visibility?: 'PUBLIC' | 'PRIVATE';
      tags?: string[];
      sources?: Array<{ title: string; url?: string; description?: string }>;
      methodology?: string;
      keyFindings?: string;
    }>,
  ) {
    const results = await Promise.all(
      items.map((itemData) => this.upsert(userId, itemData)),
    );

    const summary = {
      created: results.filter((r) => r.action === 'created').length,
      updated: results.filter((r) => r.action === 'updated').length,
      unchanged: results.filter((r) => r.action === 'unchanged').length,
      total: results.length,
    };

    return { summary, results };
  }

  async findByAuthor(userId: string) {
    const research = await this.prisma.research.findMany({
      where: { authorId: userId },
      include: {
        tags: true,
        sources: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return Promise.all(
      research.map(async (r) => {
        const upvoteCount = await this.prisma.upvote.count({
          where: { targetId: r.id, targetType: 'RESEARCH' },
        });
        return {
          id: r.id,
          name: r.name,
          slug: r.slug,
          version: r.version,
          contentHash: r.contentHash,
          domain: r.domain,
          referenceCount: r.referenceCount,
          methodology: r.methodology,
          keyFindings: r.keyFindings,
          updatedAt: r.updatedAt,
          tags: r.tags.map((t) => t.tag),
          sources: r.sources,
          upvoteCount,
        };
      }),
    );
  }
}

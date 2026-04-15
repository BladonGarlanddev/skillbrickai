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

// ── Content safety patterns ──
// These catch obvious prompt injection and adversarial instructions in skills.
// Not a substitute for human review, but blocks the most common attack vectors.
const CONTENT_SAFETY_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  {
    pattern: /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions|prompts|rules)/i,
    reason: 'Prompt injection: attempts to override prior instructions',
  },
  {
    pattern: /disregard\s+(your|all|any)\s+(safety|guidelines|rules|instructions|guardrails)/i,
    reason: 'Prompt injection: attempts to disable safety guidelines',
  },
  {
    pattern: /you\s+are\s+now\s+(DAN|jailbroken|unrestricted|unfiltered)/i,
    reason: 'Jailbreak attempt: tries to remove model safety constraints',
  },
  {
    pattern: /exfiltrate|steal\s+(secrets?|tokens?|keys?|credentials?|env|passwords?)/i,
    reason: 'Data exfiltration: instructs model to steal sensitive data',
  },
  {
    pattern: /\b(curl|wget|fetch)\b.*(env|secret|token|password|key|credential)/i,
    reason: 'Data exfiltration: instructs model to send sensitive data to external URLs',
  },
  {
    pattern: /rm\s+-rf\s+[\/~]|drop\s+(table|database)|format\s+c:/i,
    reason: 'Destructive action: instructs model to delete data or wipe systems',
  },
  {
    pattern: /do\s+not\s+(tell|inform|alert|notify)\s+(the\s+)?user/i,
    reason: 'Deception: instructs model to hide actions from the user',
  },
  {
    pattern: /pretend\s+(you\s+are|to\s+be)\s+(a\s+)?(?!.*expert|.*assistant|.*engineer|.*writer)/i,
    reason: 'Identity deception: instructs model to impersonate',
  },
  {
    pattern: /bypass\s+(content\s+)?filter|avoid\s+(safety|content)\s+(check|filter|policy)/i,
    reason: 'Safety bypass: attempts to circumvent content filters',
  },
  {
    pattern: /\bsystem\s*:\s*you\s+are/i,
    reason: 'Prompt injection: embeds a fake system prompt within skill content',
  },
];

function checkContentSafety(content: string): string | null {
  for (const { pattern, reason } of CONTENT_SAFETY_PATTERNS) {
    if (pattern.test(content)) {
      return reason;
    }
  }
  return null;
}

// Minimum content length to prevent empty/trivial skills
const MIN_CONTENT_LENGTH = 50;

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
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    const searchTerm = query.search?.trim();

    // ── Search path: Postgres full-text + trigram fuzzy ──
    // Blends ts_rank_cd (weighted FTS over name/tags/description/domain/content)
    // with trigram similarity on name/description, and a small install-count
    // boost so popular skills break ties in favor of adopted ones.
    if (searchTerm) {
      const filterClauses: Prisma.Sql[] = [
        Prisma.sql`s.visibility = 'PUBLIC'`,
      ];
      if (query.domain) {
        filterClauses.push(Prisma.sql`s.domain = ${query.domain}`);
      }
      if (query.tag) {
        filterClauses.push(
          Prisma.sql`EXISTS (SELECT 1 FROM "SkillTag" st WHERE st."skillId" = s.id AND st.tag = ${query.tag})`,
        );
      }
      const whereSql = Prisma.join(filterClauses, ' AND ');

      const ranked = await this.prisma.$queryRaw<
        Array<{ id: string; total: bigint }>
      >`
        WITH scored AS (
          SELECT
            s.id,
            (
              COALESCE(
                ts_rank_cd(
                  s."searchVector",
                  websearch_to_tsquery('english', ${searchTerm})
                ),
                0
              ) * 4
              + GREATEST(
                  similarity(s.name, ${searchTerm}),
                  similarity(s.description, ${searchTerm}) * 0.6
                )
              + LEAST(s."installCount", 100) / 100.0 * 0.3
            ) AS score,
            COUNT(*) OVER() AS total
          FROM "Skill" s
          WHERE ${whereSql}
            AND (
              s."searchVector" @@ websearch_to_tsquery('english', ${searchTerm})
              OR s.name % ${searchTerm}
              OR s.description % ${searchTerm}
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

      const records = await this.prisma.skill.findMany({
        where: { id: { in: ids } },
        include: {
          author: { select: { id: true, username: true, avatarUrl: true } },
          claimedBy: { select: { id: true, username: true } },
          tags: true,
          testedOn: true,
          _count: { select: { upvotes: true } },
        },
      });
      const byId = new Map(records.map((s) => [s.id, s]));
      const ordered = ids
        .map((id) => byId.get(id))
        .filter((s): s is NonNullable<typeof s> => !!s);

      return {
        data: ordered,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    }

    // ── Browse path: no search term, use standard Prisma ordering ──
    const where: Prisma.SkillWhereInput = { visibility: 'PUBLIC' };
    if (query.domain) where.domain = query.domain;
    if (query.tag) where.tags = { some: { tag: query.tag } };

    let orderBy: Prisma.SkillOrderByWithRelationInput = { createdAt: 'desc' };
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
          claimedBy: { select: { id: true, username: true } },
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
      visibility?: 'PUBLIC' | 'PRIVATE';
      tags?: string[];
      testedOn?: string[];
      originalAuthorName?: string;
      originalAuthorUrl?: string;
      sourceUrl?: string;
    },
  ) {
    // ── Content quality gate ──
    if (data.content.trim().length < MIN_CONTENT_LENGTH) {
      throw new BadRequestException(
        `Skill content must be at least ${MIN_CONTENT_LENGTH} characters. Provide meaningful instructions.`,
      );
    }

    // ── Content safety scan — violation = immediate ban ──
    const safetyViolation = checkContentSafety(data.content);
    if (safetyViolation) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          isBanned: true,
          banReason: `Automated ban: published skill content triggered safety check — ${safetyViolation}`,
        },
      });
      throw new ForbiddenException({
        error: 'ACCOUNT_BANNED',
        message:
          'Your account has been banned for publishing content that violates our Terms of Service. Contact abuse@skillbrickai.com if you believe this is an error.',
      });
    }

    // ── Duplicate content detection ──
    const contentDigest = hashContent(data.content);
    const duplicateSkill = await this.prisma.skill.findFirst({
      where: { contentHash: contentDigest },
      select: { id: true, name: true },
    });
    if (duplicateSkill) {
      throw new BadRequestException({
        error: 'DUPLICATE_CONTENT',
        message: `A skill with identical content already exists: "${duplicateSkill.name}". Please create original content.`,
      });
    }

    const slug = generateSlug(data.name);

    const visibility = data.visibility || 'PUBLIC';

    const skill = await this.prisma.skill.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        content: data.content,
        contentHash: contentDigest,
        domain: data.domain,
        visibility,
        authorId: userId,
        originalAuthorName: data.originalAuthorName || null,
        originalAuthorUrl: data.originalAuthorUrl || null,
        sourceUrl: data.sourceUrl || null,
        tags: data.tags
          ? { create: data.tags.map((tag) => ({ tag })) }
          : undefined,
        testedOn: data.testedOn
          ? { create: data.testedOn.map((model) => ({ model })) }
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
        testedOn: true,
      },
    });

    // Credit 10 tokens for posting a public skill (private skills don't earn credits)
    if (visibility === 'PUBLIC') {
      await this.tokensService.creditTokens(userId, 10, 'SKILL_POSTED', skill.id);
    }

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
        claimedBy: { select: { id: true, username: true } },
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

    // ── Content safety scan on update ──
    if (data.content !== undefined) {
      if (data.content.trim().length < MIN_CONTENT_LENGTH) {
        throw new BadRequestException(
          `Skill content must be at least ${MIN_CONTENT_LENGTH} characters.`,
        );
      }
      const safetyViolation = checkContentSafety(data.content);
      if (safetyViolation) {
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            isBanned: true,
            banReason: `Automated ban: updated skill content triggered safety check — ${safetyViolation}`,
          },
        });
        throw new ForbiddenException({
          error: 'ACCOUNT_BANNED',
          message:
            'Your account has been banned for publishing content that violates our Terms of Service. Contact abuse@skillbrickai.com if you believe this is an error.',
        });
      }
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

    // Create version record if content changed
    if (data.content !== undefined) {
      const newVersion = skill.version + 1;
      await this.prisma.skillVersion.create({
        data: {
          skillId: id,
          version: newVersion,
          content: data.content,
          contentHash: hashContent(data.content),
        },
      });
    }

    return this.prisma.skill.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        claimedBy: { select: { id: true, username: true } },
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
      throw new BadRequestException({
        error: 'INSUFFICIENT_CREDITS',
        message: 'You have run out of download credits.',
        currentBalance: user?.tokenBalance ?? 0,
        requiredCredits: 1,
        options: [
          {
            method: 'submit_skill',
            description:
              'Submit a skill to the SkillBrick AI platform to earn 10 download credits. Use the upload_skill MCP tool or visit the website to submit.',
            creditsAwarded: 10,
          },
          {
            method: 'subscription',
            description:
              'Subscribe to a SkillBrick AI plan for monthly download credits. Visit the pricing page for details.',
            creditsAwarded: 'unlimited',
            actionUrl: '/pricing',
          },
        ],
      });
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

  async claimSkill(userId: string, skillId: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    if (!skill.originalAuthorName) {
      throw new BadRequestException('This skill is not an attributed skill');
    }

    if (skill.claimedById) {
      throw new BadRequestException('This skill has already been claimed');
    }

    const updated = await this.prisma.skill.update({
      where: { id: skillId },
      data: {
        claimedById: userId,
        claimedAt: new Date(),
      },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        claimedBy: { select: { id: true, username: true } },
        tags: true,
        testedOn: true,
        _count: { select: { upvotes: true } },
      },
    });

    return updated;
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

  async upsert(
    userId: string,
    data: {
      name: string;
      description: string;
      content: string;
      domain: string;
      visibility?: 'PUBLIC' | 'PRIVATE';
      tags?: string[];
      testedOn?: string[];
    },
  ) {
    const slug = generateSlug(data.name);
    const contentDigest = hashContent(data.content);

    const existing = await this.prisma.skill.findUnique({
      where: { authorId_slug: { authorId: userId, slug } },
    });

    if (!existing) {
      const skill = await this.create(userId, data);
      return { action: 'created' as const, version: 1, skill };
    }

    if (existing.contentHash === contentDigest) {
      const skill = await this.findOne(existing.id);
      return { action: 'unchanged' as const, version: existing.version, skill };
    }

    const skill = await this.update(userId, existing.id, data);
    return {
      action: 'updated' as const,
      version: existing.version + 1,
      skill,
    };
  }

  async bulkSync(
    userId: string,
    skills: Array<{
      name: string;
      description: string;
      content: string;
      domain: string;
      visibility?: 'PUBLIC' | 'PRIVATE';
      tags?: string[];
      testedOn?: string[];
    }>,
  ) {
    const results = await Promise.all(
      skills.map((skillData) => this.upsert(userId, skillData)),
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
    const skills = await this.prisma.skill.findMany({
      where: { authorId: userId },
      include: {
        tags: true,
        testedOn: true,
        _count: { select: { upvotes: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return skills.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      version: s.version,
      contentHash: s.contentHash,
      domain: s.domain,
      installCount: s.installCount,
      updatedAt: s.updatedAt,
      tags: s.tags.map((t) => t.tag),
      testedOn: s.testedOn.map((t) => t.model),
      upvoteCount: s._count.upvotes,
    }));
  }
}

import { describe, it, expect, vi } from 'vitest';
import { ResearchService } from './research.service';

// ── Mocks ──

function createMockPrisma() {
  return {
    research: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn(),
      findFirst: vi.fn().mockResolvedValue(null),
      count: vi.fn().mockResolvedValue(0),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    researchTag: { deleteMany: vi.fn() },
    researchSource: { deleteMany: vi.fn() },
    researchVersion: { create: vi.fn() },
    upvote: { count: vi.fn().mockResolvedValue(0), deleteMany: vi.fn() },
    collectionResearch: { deleteMany: vi.fn() },
  };
}

function createMockTokensService() {
  return { creditTokens: vi.fn(), debitTokens: vi.fn() };
}

function createMockBadgesService() {
  return { awardBadge: vi.fn() };
}

function createMockUpvotesService() {
  return { toggleUpvote: vi.fn() };
}

function createService() {
  const prisma = createMockPrisma();
  const tokens = createMockTokensService();
  const badges = createMockBadgesService();
  const upvotes = createMockUpvotesService();
  const service = new ResearchService(prisma as any, tokens as any, badges as any, upvotes as any);
  return { service, prisma, tokens, badges };
}

// ── Tests ──

describe('ResearchService', () => {
  describe('findAll', () => {
    it('filters to PUBLIC visibility by default', async () => {
      const { service, prisma } = createService();
      prisma.research.findMany.mockResolvedValue([]);
      prisma.research.count.mockResolvedValue(0);

      await service.findAll({});

      const whereArg = prisma.research.findMany.mock.calls[0][0].where;
      expect(whereArg.visibility).toBe('PUBLIC');
    });

    it('includes visibility filter alongside search and domain', async () => {
      const { service, prisma } = createService();
      prisma.research.findMany.mockResolvedValue([]);
      prisma.research.count.mockResolvedValue(0);

      await service.findAll({ search: 'llm', domain: 'AI Engineering' });

      const whereArg = prisma.research.findMany.mock.calls[0][0].where;
      expect(whereArg.visibility).toBe('PUBLIC');
      expect(whereArg.domain).toBe('AI Engineering');
    });
  });

  describe('create', () => {
    const baseData = {
      name: 'Test Research',
      description: 'A test research item',
      content: 'This is test research content with enough length to be valid.',
      domain: 'AI Engineering',
    };

    it('defaults to PUBLIC visibility', async () => {
      const { service, prisma } = createService();
      prisma.research.create.mockResolvedValue({ id: '1', ...baseData, visibility: 'PUBLIC' });
      prisma.research.count.mockResolvedValue(1);

      await service.create('user1', baseData);

      const createArg = prisma.research.create.mock.calls[0][0].data;
      expect(createArg.visibility).toBe('PUBLIC');
    });

    it('accepts PRIVATE visibility', async () => {
      const { service, prisma } = createService();
      prisma.research.create.mockResolvedValue({ id: '1', ...baseData, visibility: 'PRIVATE' });
      prisma.research.count.mockResolvedValue(1);

      await service.create('user1', { ...baseData, visibility: 'PRIVATE' });

      const createArg = prisma.research.create.mock.calls[0][0].data;
      expect(createArg.visibility).toBe('PRIVATE');
    });

    it('credits 5 tokens for PUBLIC research', async () => {
      const { service, prisma, tokens } = createService();
      prisma.research.create.mockResolvedValue({ id: 'r1', ...baseData, visibility: 'PUBLIC' });
      prisma.research.count.mockResolvedValue(1);

      await service.create('user1', baseData);

      expect(tokens.creditTokens).toHaveBeenCalledWith('user1', 5, 'RESEARCH_POSTED', 'r1');
    });

    it('does NOT credit tokens for PRIVATE research', async () => {
      const { service, prisma, tokens } = createService();
      prisma.research.create.mockResolvedValue({ id: 'r1', ...baseData, visibility: 'PRIVATE' });
      prisma.research.count.mockResolvedValue(1);

      await service.create('user1', { ...baseData, visibility: 'PRIVATE' });

      expect(tokens.creditTokens).not.toHaveBeenCalled();
    });

    it('awards Researcher badge on first research', async () => {
      const { service, prisma, badges } = createService();
      prisma.research.create.mockResolvedValue({ id: 'r1', ...baseData, visibility: 'PUBLIC' });
      prisma.research.count.mockResolvedValue(1);

      await service.create('user1', baseData);

      expect(badges.awardBadge).toHaveBeenCalledWith('user1', 'RESEARCHER');
    });

    it('does not award Researcher badge on subsequent research', async () => {
      const { service, prisma, badges } = createService();
      prisma.research.create.mockResolvedValue({ id: 'r2', ...baseData, visibility: 'PUBLIC' });
      prisma.research.count.mockResolvedValue(2);

      await service.create('user1', baseData);

      expect(badges.awardBadge).not.toHaveBeenCalled();
    });
  });

  describe('upsert', () => {
    const baseData = {
      name: 'Test Research',
      description: 'A test',
      content: 'This is test research content with enough length to be valid.',
      domain: 'coding',
    };

    it('passes visibility through on new research', async () => {
      const { service, prisma, tokens } = createService();
      prisma.research.findUnique.mockResolvedValue(null);
      prisma.research.create.mockResolvedValue({ id: 'new1', ...baseData, visibility: 'PRIVATE' });
      prisma.research.count.mockResolvedValue(1);

      const result = await service.upsert('user1', { ...baseData, visibility: 'PRIVATE' });

      expect(result.action).toBe('created');
      expect(tokens.creditTokens).not.toHaveBeenCalled();
    });
  });
});

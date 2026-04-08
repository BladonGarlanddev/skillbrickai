import { describe, it, expect, vi } from 'vitest';
import { ClaudeMdService } from './claude-md.service';

// ── Mocks ──

function createMockPrisma() {
  return {
    claudeMd: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn(),
      count: vi.fn().mockResolvedValue(0),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    claudeMdTag: { deleteMany: vi.fn() },
    claudeMdVersion: { create: vi.fn(), deleteMany: vi.fn() },
  };
}

function createService() {
  const prisma = createMockPrisma();
  const service = new ClaudeMdService(prisma as any);
  return { service, prisma };
}

// ── Tests ──

describe('ClaudeMdService', () => {
  describe('findAll', () => {
    it('filters to PUBLIC visibility', async () => {
      const { service, prisma } = createService();

      await service.findAll({});

      const whereArg = prisma.claudeMd.findMany.mock.calls[0][0].where;
      expect(whereArg.visibility).toBe('PUBLIC');
    });

    it('applies search filter alongside visibility', async () => {
      const { service, prisma } = createService();

      await service.findAll({ search: 'nextjs' });

      const whereArg = prisma.claudeMd.findMany.mock.calls[0][0].where;
      expect(whereArg.visibility).toBe('PUBLIC');
      expect(whereArg.OR).toBeDefined();
      expect(whereArg.OR[0].name.contains).toBe('nextjs');
    });

    it('applies tag filter', async () => {
      const { service, prisma } = createService();

      await service.findAll({ tag: 'monorepo' });

      const whereArg = prisma.claudeMd.findMany.mock.calls[0][0].where;
      expect(whereArg.tags).toEqual({ some: { tag: 'monorepo' } });
    });

    it('respects pagination', async () => {
      const { service, prisma } = createService();

      await service.findAll({ page: 3, limit: 5 });

      const call = prisma.claudeMd.findMany.mock.calls[0][0];
      expect(call.skip).toBe(10);
      expect(call.take).toBe(5);
    });

    it('caps limit at 100', async () => {
      const { service, prisma } = createService();

      await service.findAll({ limit: 500 });

      const call = prisma.claudeMd.findMany.mock.calls[0][0];
      expect(call.take).toBe(100);
    });
  });

  describe('create', () => {
    const baseData = {
      name: 'My Next.js Project',
      description: 'CLAUDE.md for a Next.js app',
      content: '# My Project\n\n## Commands\n- npm run dev\n- npm run build\n- npm test',
    };

    it('defaults to PRIVATE visibility', async () => {
      const { service, prisma } = createService();
      prisma.claudeMd.create.mockResolvedValue({ id: '1', ...baseData, visibility: 'PRIVATE' });

      await service.create('user1', baseData);

      const createArg = prisma.claudeMd.create.mock.calls[0][0].data;
      expect(createArg.visibility).toBe('PRIVATE');
    });

    it('accepts PUBLIC visibility', async () => {
      const { service, prisma } = createService();
      prisma.claudeMd.create.mockResolvedValue({ id: '1', ...baseData, visibility: 'PUBLIC' });

      await service.create('user1', { ...baseData, visibility: 'PUBLIC' });

      const createArg = prisma.claudeMd.create.mock.calls[0][0].data;
      expect(createArg.visibility).toBe('PUBLIC');
    });

    it('generates correct slug from name', async () => {
      const { service, prisma } = createService();
      prisma.claudeMd.create.mockResolvedValue({ id: '1', ...baseData });

      await service.create('user1', baseData);

      const createArg = prisma.claudeMd.create.mock.calls[0][0].data;
      expect(createArg.slug).toBe('my-next-js-project');
    });

    it('stores content hash', async () => {
      const { service, prisma } = createService();
      prisma.claudeMd.create.mockResolvedValue({ id: '1', ...baseData });

      await service.create('user1', baseData);

      const createArg = prisma.claudeMd.create.mock.calls[0][0].data;
      expect(createArg.contentHash).toBeDefined();
      expect(createArg.contentHash).toHaveLength(64); // SHA-256 hex
    });

    it('creates initial version record', async () => {
      const { service, prisma } = createService();
      prisma.claudeMd.create.mockResolvedValue({ id: '1', ...baseData });

      await service.create('user1', baseData);

      const createArg = prisma.claudeMd.create.mock.calls[0][0].data;
      expect(createArg.versions.create.version).toBe(1);
      expect(createArg.versions.create.content).toBe(baseData.content);
    });

    it('stores projectUrl when provided', async () => {
      const { service, prisma } = createService();
      prisma.claudeMd.create.mockResolvedValue({ id: '1', ...baseData });

      await service.create('user1', {
        ...baseData,
        projectUrl: 'https://github.com/user/repo',
      });

      const createArg = prisma.claudeMd.create.mock.calls[0][0].data;
      expect(createArg.projectUrl).toBe('https://github.com/user/repo');
    });

    it('stores tags when provided', async () => {
      const { service, prisma } = createService();
      prisma.claudeMd.create.mockResolvedValue({ id: '1', ...baseData });

      await service.create('user1', {
        ...baseData,
        tags: ['nextjs', 'monorepo', 'typescript'],
      });

      const createArg = prisma.claudeMd.create.mock.calls[0][0].data;
      expect(createArg.tags.create).toEqual([
        { tag: 'nextjs' },
        { tag: 'monorepo' },
        { tag: 'typescript' },
      ]);
    });

    it('rejects content shorter than minimum length', async () => {
      const { service } = createService();

      await expect(
        service.create('user1', { ...baseData, content: 'too short' }),
      ).rejects.toThrow('at least');
    });
  });

  describe('update', () => {
    it('rejects update from non-owner', async () => {
      const { service, prisma } = createService();
      prisma.claudeMd.findUnique.mockResolvedValue({ id: '1', authorId: 'user1' });

      await expect(
        service.update('user2', '1', { name: 'new name' }),
      ).rejects.toThrow('only update your own');
    });

    it('creates version record when content changes', async () => {
      const { service, prisma } = createService();
      prisma.claudeMd.findUnique.mockResolvedValue({ id: '1', authorId: 'user1', version: 2 });
      prisma.claudeMd.update.mockResolvedValue({ id: '1' });

      await service.update('user1', '1', { content: 'Updated content that is long enough' });

      expect(prisma.claudeMdVersion.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          claudeMdId: '1',
          version: 3,
          content: 'Updated content that is long enough',
        }),
      });
    });

    it('allows updating visibility', async () => {
      const { service, prisma } = createService();
      prisma.claudeMd.findUnique.mockResolvedValue({ id: '1', authorId: 'user1', version: 1 });
      prisma.claudeMd.update.mockResolvedValue({ id: '1' });

      await service.update('user1', '1', { visibility: 'PUBLIC' });

      const updateArg = prisma.claudeMd.update.mock.calls[0][0].data;
      expect(updateArg.visibility).toBe('PUBLIC');
    });
  });

  describe('upsert', () => {
    const baseData = {
      name: 'My Project',
      description: 'Test',
      content: '# My Project\n\n## Commands\n- npm run dev\n- npm run build\n- npm test',
    };

    it('creates new CLAUDE.md when none exists', async () => {
      const { service, prisma } = createService();
      prisma.claudeMd.findUnique.mockResolvedValue(null);
      prisma.claudeMd.create.mockResolvedValue({ id: 'new1', ...baseData, visibility: 'PRIVATE' });

      const result = await service.upsert('user1', baseData);

      expect(result.action).toBe('created');
      expect(result.version).toBe(1);
    });

    it('returns unchanged when content hash matches', async () => {
      const { service, prisma } = createService();
      const { createHash } = await import('crypto');
      const hash = createHash('sha256').update(baseData.content).digest('hex');

      prisma.claudeMd.findUnique.mockResolvedValueOnce({
        id: 'existing1',
        version: 2,
        contentHash: hash,
      }).mockResolvedValueOnce({
        id: 'existing1',
        ...baseData,
        version: 2,
        contentHash: hash,
        author: { id: 'user1', username: 'test' },
        tags: [],
      });

      const result = await service.upsert('user1', baseData);

      expect(result.action).toBe('unchanged');
      expect(result.version).toBe(2);
    });

    it('updates when content has changed', async () => {
      const { service, prisma } = createService();
      // First call: upsert slug lookup. Second call: update's ownership check.
      prisma.claudeMd.findUnique
        .mockResolvedValueOnce({
          id: 'existing1',
          authorId: 'user1',
          version: 1,
          contentHash: 'old-hash',
        })
        .mockResolvedValueOnce({
          id: 'existing1',
          authorId: 'user1',
          version: 1,
          contentHash: 'old-hash',
        });
      prisma.claudeMd.update.mockResolvedValue({ id: 'existing1', ...baseData });

      const result = await service.upsert('user1', baseData);

      expect(result.action).toBe('updated');
      expect(result.version).toBe(2);
    });
  });

  describe('remove', () => {
    it('deletes CLAUDE.md and related records', async () => {
      const { service, prisma } = createService();
      prisma.claudeMd.findUnique.mockResolvedValue({ id: '1', authorId: 'user1' });

      await service.remove('user1', '1');

      expect(prisma.claudeMdTag.deleteMany).toHaveBeenCalledWith({ where: { claudeMdId: '1' } });
      expect(prisma.claudeMdVersion.deleteMany).toHaveBeenCalledWith({ where: { claudeMdId: '1' } });
      expect(prisma.claudeMd.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('rejects deletion from non-owner', async () => {
      const { service, prisma } = createService();
      prisma.claudeMd.findUnique.mockResolvedValue({ id: '1', authorId: 'user1' });

      await expect(
        service.remove('user2', '1'),
      ).rejects.toThrow('only delete your own');
    });
  });

  describe('findByAuthor', () => {
    it('returns all CLAUDE.md files for the author', async () => {
      const { service, prisma } = createService();
      prisma.claudeMd.findMany.mockResolvedValue([
        {
          id: '1',
          name: 'Project A',
          slug: 'project-a',
          version: 2,
          contentHash: 'abc',
          projectUrl: null,
          visibility: 'PRIVATE',
          installCount: 0,
          updatedAt: new Date(),
          tags: [{ tag: 'nextjs' }],
        },
        {
          id: '2',
          name: 'Project B',
          slug: 'project-b',
          version: 1,
          contentHash: 'def',
          projectUrl: 'https://github.com/test',
          visibility: 'PUBLIC',
          installCount: 5,
          updatedAt: new Date(),
          tags: [],
        },
      ]);

      const result = await service.findByAuthor('user1');

      expect(result).toHaveLength(2);
      expect(result[0].tags).toEqual(['nextjs']);
      expect(result[1].visibility).toBe('PUBLIC');
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSkillBrickServer } from './server.js';

// ── Mock fetch globally ──

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Helper to create a mock fetch response
function mockResponse(data: any, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
}

// Helper to call a tool on the server by extracting from internals
// _registeredTools is a plain object { [name]: RegisteredTool }
async function callTool(server: any, toolName: string, args: Record<string, any> = {}) {
  const registeredTools = server._registeredTools;
  const tool = registeredTools[toolName];
  if (!tool) {
    throw new Error(`Tool "${toolName}" not found. Available: ${Object.keys(registeredTools).join(', ')}`);
  }
  return tool.handler(args, {} as any);
}

function hasTool(server: any, toolName: string): boolean {
  return toolName in server._registeredTools;
}

function hasPrompt(server: any, promptName: string): boolean {
  return promptName in server._registeredPrompts;
}

async function callPrompt(server: any, promptName: string, args: Record<string, any> = {}) {
  const registeredPrompts = server._registeredPrompts;
  const prompt = registeredPrompts[promptName];
  if (!prompt) {
    throw new Error(`Prompt "${promptName}" not found.`);
  }
  return prompt.callback(args, {} as any);
}

// ── Tests ──

describe('MCP Server', () => {
  let server: ReturnType<typeof createSkillBrickServer>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the auto-provision call
    mockFetch.mockResolvedValueOnce(mockResponse({
      accessToken: 'test-token',
      user: { id: 'user1', username: 'testuser' },
    }));
    server = createSkillBrickServer();
  });

  describe('server setup', () => {
    it('registers get_started tool', () => {
      expect(hasTool(server, 'get_started')).toBe(true);
    });

    it('registers all expected tools', () => {
      const expectedTools = [
        'get_started',
        'search_skills', 'get_skill', 'install_skill', 'check_credits',
        'list_collections', 'get_collection', 'list_domains', 'recommend_skills',
        'upload_skill', 'sync_skills', 'my_skills',
        'search_research', 'get_research', 'upload_research', 'my_research',
        'save_claude_md', 'my_claude_mds', 'get_claude_md', 'search_claude_mds',
        'create_account',
        'login',
      ];

      for (const tool of expectedTools) {
        expect(hasTool(server, tool), `Missing tool: ${tool}`).toBe(true);
      }
    });

    it('registers skillbrick-onboarding prompt', () => {
      expect(hasPrompt(server, 'skillbrick-onboarding')).toBe(true);
    });
  });

  describe('get_started', () => {
    it('returns onboarding content with platform skills', async () => {
      // Mock the skills search
      mockFetch.mockResolvedValueOnce(mockResponse({
        data: [
          {
            id: 'skill1',
            name: 'SkillBrick AI Agent',
            description: 'Teaches agents to use the platform',
            domain: 'productivity',
            content: 'You have access to SkillBrick...',
            installCount: 100,
            author: { username: 'SkillBrick AI' },
            tags: [{ tag: 'meta' }, { tag: 'skillbrickai' }],
            testedOn: [{ model: 'claude-3.5-sonnet' }],
            _count: { upvotes: 50 },
          },
        ],
        meta: { total: 1 },
      }));
      // Mock the balance check
      mockFetch.mockResolvedValueOnce(mockResponse({ balance: 30 }));

      const result = await callTool(server, 'get_started');

      const text = result.content[0].text;
      expect(text).toContain('Welcome to SkillBrick AI');
      expect(text).toContain('30 credits');
      expect(text).toContain('Default Skills');
      expect(text).toContain('What to Contribute');
      expect(text).toContain('Public vs Private');
      expect(text).toContain('CLAUDE.md Storage');
      expect(text).toContain('Staying Aligned');
      expect(text).toContain('Quick Reference');
    });

    it('includes fallback content when platform skills are not found', async () => {
      // Return empty skills
      mockFetch.mockResolvedValueOnce(mockResponse({ data: [], meta: { total: 0 } }));
      // Mock balance
      mockFetch.mockResolvedValueOnce(mockResponse({ balance: 30 }));

      const result = await callTool(server, 'get_started');

      const text = result.content[0].text;
      expect(text).toContain('Built-in Fallback');
      expect(text).toContain('search_skills');
      expect(text).toContain('upload_skill');
    });

    it('mentions private skills earn 0 credits', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ data: [], meta: { total: 0 } }));
      mockFetch.mockResolvedValueOnce(mockResponse({ balance: 10 }));

      const result = await callTool(server, 'get_started');

      const text = result.content[0].text;
      expect(text).toContain('PRIVATE');
      expect(text).toContain('0 credits');
    });

    it('includes behavioral alignment rules', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ data: [], meta: { total: 0 } }));
      mockFetch.mockResolvedValueOnce(mockResponse({ balance: 10 }));

      const result = await callTool(server, 'get_started');

      const text = result.content[0].text;
      expect(text).toContain('Never upload without');
      expect(text).toContain('Never install skills silently');
      expect(text).toContain('Never upload secrets');
    });

    it('includes CLAUDE.md tools in quick reference', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ data: [], meta: { total: 0 } }));
      mockFetch.mockResolvedValueOnce(mockResponse({ balance: 10 }));

      const result = await callTool(server, 'get_started');

      const text = result.content[0].text;
      expect(text).toContain('save_claude_md');
      expect(text).toContain('my_claude_mds');
      expect(text).toContain('get_claude_md');
      expect(text).toContain('search_claude_mds');
    });
  });

  describe('upload_skill', () => {
    it('passes visibility parameter to API', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({
        action: 'created',
        version: 1,
        skill: { id: 'new1', name: 'Test', visibility: 'PRIVATE' },
      }));

      await callTool(server, 'upload_skill', {
        name: 'Test Skill',
        description: 'A test',
        content: 'Test content',
        domain: 'coding',
        visibility: 'PRIVATE',
      });

      // Check that fetch was called with visibility in the body
      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const body = JSON.parse(lastCall[1].body);
      expect(body.visibility).toBe('PRIVATE');
    });

    it('sends to upsert endpoint', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ action: 'created' }));

      await callTool(server, 'upload_skill', {
        name: 'Test',
        description: 'A test',
        content: 'Test content',
        domain: 'coding',
      });

      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      expect(lastCall[0]).toContain('/skills/upsert');
      expect(lastCall[1].method).toBe('PUT');
    });
  });

  describe('sync_skills', () => {
    it('passes visibility per-skill to API', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({
        summary: { created: 2, updated: 0, unchanged: 0, total: 2 },
      }));

      await callTool(server, 'sync_skills', {
        skills: [
          { name: 'Public Skill', description: 'A', content: 'Content', domain: 'coding', visibility: 'PUBLIC' },
          { name: 'Private Skill', description: 'B', content: 'Content', domain: 'coding', visibility: 'PRIVATE' },
        ],
      });

      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const body = JSON.parse(lastCall[1].body);
      expect(body.skills[0].visibility).toBe('PUBLIC');
      expect(body.skills[1].visibility).toBe('PRIVATE');
    });
  });

  describe('upload_research', () => {
    it('passes visibility parameter to API', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({
        action: 'created',
        version: 1,
      }));

      await callTool(server, 'upload_research', {
        name: 'Test Research',
        description: 'A test',
        content: 'Research content',
        domain: 'coding',
        visibility: 'PRIVATE',
      });

      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const body = JSON.parse(lastCall[1].body);
      expect(body.visibility).toBe('PRIVATE');
    });
  });

  describe('save_claude_md', () => {
    it('sends to claude-md/upsert endpoint', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({
        action: 'created',
        version: 1,
        claudeMd: { id: 'cmd1', name: 'My Project' },
      }));

      await callTool(server, 'save_claude_md', {
        name: 'My Project',
        description: 'CLAUDE.md for my project',
        content: '# My Project\n\n## Commands\n- npm run dev',
      });

      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      expect(lastCall[0]).toContain('/claude-md/upsert');
      expect(lastCall[1].method).toBe('PUT');
    });

    it('passes visibility parameter', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ action: 'created' }));

      await callTool(server, 'save_claude_md', {
        name: 'My Project',
        description: 'Test',
        content: '# Content',
        visibility: 'PUBLIC',
      });

      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const body = JSON.parse(lastCall[1].body);
      expect(body.visibility).toBe('PUBLIC');
    });

    it('passes projectUrl and tags', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ action: 'created' }));

      await callTool(server, 'save_claude_md', {
        name: 'My Project',
        description: 'Test',
        content: '# Content',
        projectUrl: 'https://github.com/user/repo',
        tags: ['nextjs', 'typescript'],
      });

      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      const body = JSON.parse(lastCall[1].body);
      expect(body.projectUrl).toBe('https://github.com/user/repo');
      expect(body.tags).toEqual(['nextjs', 'typescript']);
    });
  });

  describe('my_claude_mds', () => {
    it('fetches from claude-md/mine endpoint', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse([
        { id: '1', name: 'Project A', version: 2 },
      ]));

      const result = await callTool(server, 'my_claude_mds');

      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      expect(lastCall[0]).toContain('/claude-md/mine');
    });
  });

  describe('get_claude_md', () => {
    it('fetches CLAUDE.md by ID and formats output', async () => {
      const claudeMdData = {
        id: 'cmd1',
        name: 'My Project',
        description: 'A Next.js project',
        content: '# My Project\n\n## Commands\n- npm run dev',
        version: 3,
        visibility: 'PRIVATE',
        projectUrl: 'https://github.com/user/repo',
        author: { username: 'testuser' },
        tags: [{ tag: 'nextjs' }, { tag: 'typescript' }],
      };
      // Wait for any pending provision call to settle
      await new Promise(r => setTimeout(r, 10));
      mockFetch.mockReset();
      mockFetch.mockResolvedValue(mockResponse(claudeMdData));

      const result = await callTool(server, 'get_claude_md', { claude_md_id: 'cmd1' });

      const text = result.content[0].text;
      expect(text).toContain('My Project');
      expect(text).toContain('Version:** 3');
      expect(text).toContain('PRIVATE');
      expect(text).toContain('github.com/user/repo');
      expect(text).toContain('nextjs, typescript');
      expect(text).toContain('npm run dev');
    });
  });

  describe('search_claude_mds', () => {
    it('searches public CLAUDE.md files', async () => {
      const searchResult = {
        data: [
          {
            id: 'cmd1',
            name: 'Next.js Starter',
            description: 'CLAUDE.md for Next.js projects',
            author: { username: 'expert' },
            projectUrl: 'https://github.com/expert/nextjs',
            tags: [{ tag: 'nextjs' }],
          },
        ],
        meta: { total: 1 },
      };
      await new Promise(r => setTimeout(r, 10));
      mockFetch.mockReset();
      mockFetch.mockResolvedValue(mockResponse(searchResult));

      const result = await callTool(server, 'search_claude_mds', { query: 'nextjs' });

      const text = result.content[0].text;
      expect(text).toContain('Found 1');
      expect(text).toContain('Next.js Starter');

      // Verify it called the correct endpoint
      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      expect(lastCall[0]).toContain('/claude-md?');
      expect(lastCall[0]).toContain('search=nextjs');
    });

    it('returns helpful message when no results found', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({
        data: [],
        meta: { total: 0 },
      }));

      const result = await callTool(server, 'search_claude_mds', { query: 'obscure-framework' });

      const text = result.content[0].text;
      expect(text).toContain('No public CLAUDE.md files found');
    });
  });

  describe('login', () => {
    it('is registered as a tool', () => {
      expect(hasTool(server, 'login')).toBe(true);
    });

    it('authenticates successfully and stores token', async () => {
      await new Promise(r => setTimeout(r, 10));
      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce(mockResponse({
        accessToken: 'login-token-123',
        user: { id: 'u1', username: 'alice', email: 'alice@example.com', credits: 42 },
      }));

      const result = await callTool(server, 'login', {
        email: 'alice@example.com',
        password: 'securePass!',
      });

      const text = result.content[0].text;
      expect(text).toContain('Logged in successfully');
      expect(text).toContain('alice');
      expect(text).toContain('alice@example.com');

      // Verify correct endpoint and payload
      const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
      expect(lastCall[0]).toContain('/auth/login');
      const body = JSON.parse(lastCall[1].body);
      expect(body.email).toBe('alice@example.com');
      expect(body.password).toBe('securePass!');
    });

    it('returns error on failed login', async () => {
      await new Promise(r => setTimeout(r, 10));
      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce(mockResponse(
        'Invalid credentials',
        false,
        401,
      ));

      const result = await callTool(server, 'login', {
        email: 'alice@example.com',
        password: 'wrongPass',
      });

      const text = result.content[0].text;
      expect(text).toContain('Login failed');
    });

    it('handles network errors gracefully', async () => {
      await new Promise(r => setTimeout(r, 10));
      mockFetch.mockReset();
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await callTool(server, 'login', {
        email: 'alice@example.com',
        password: 'pass',
      });

      const text = result.content[0].text;
      expect(text).toContain('Error logging in');
      expect(text).toContain('Network error');
    });
  });

  describe('create_account', () => {
    it('includes password in success response', async () => {
      await new Promise(r => setTimeout(r, 10));
      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce(mockResponse({
        accessToken: 'new-token',
        user: { id: 'u2', username: 'bob', email: 'bob@example.com' },
      }));

      const result = await callTool(server, 'create_account', {
        email: 'bob@example.com',
        username: 'bob',
        password: 'G3n3r4t3dP@ss!',
      });

      const text = result.content[0].text;
      expect(text).toContain('Account created successfully');
      expect(text).toContain('G3n3r4t3dP@ss!');
      expect(text).toContain('Tell the user their password');
    });

    it('suggests login when email already exists', async () => {
      await new Promise(r => setTimeout(r, 10));
      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        statusText: 'Conflict',
        json: () => Promise.resolve({}),
        text: () => Promise.resolve('Email already registered'),
      });

      const result = await callTool(server, 'create_account', {
        email: 'existing@example.com',
        username: 'newuser',
        password: 'somePass123',
      });

      const text = result.content[0].text;
      expect(text).toContain('already registered');
      expect(text).toContain('login');
    });

    it('suggests login on 409 status even without "already" in body', async () => {
      await new Promise(r => setTimeout(r, 10));
      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        statusText: 'Conflict',
        json: () => Promise.resolve({}),
        text: () => Promise.resolve('Conflict: duplicate entry'),
      });

      const result = await callTool(server, 'create_account', {
        email: 'dup@example.com',
        username: 'dupuser',
        password: 'somePass123',
      });

      const text = result.content[0].text;
      expect(text).toContain('login');
    });

    it('returns generic error for non-409 failures', async () => {
      await new Promise(r => setTimeout(r, 10));
      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({}),
        text: () => Promise.resolve('Internal server error'),
      });

      const result = await callTool(server, 'create_account', {
        email: 'bob@example.com',
        username: 'bob',
        password: 'somePass123',
      });

      const text = result.content[0].text;
      expect(text).toContain('Account creation failed');
      expect(text).not.toContain('login');
    });
  });

  describe('tool descriptions mention auth', () => {
    it('install_skill description mentions authentication', () => {
      const tools = (server as any)._registeredTools;
      const desc = tools['install_skill']?.description || '';
      expect(desc).toContain('Requires authentication');
    });

    it('upload_skill description mentions create_account', () => {
      const tools = (server as any)._registeredTools;
      const desc = tools['upload_skill']?.description || '';
      expect(desc).toContain('create_account');
    });
  });

  describe('onboarding mentions login', () => {
    it('get_started quick reference table includes login', async () => {
      await new Promise(r => setTimeout(r, 10));
      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce(mockResponse({ data: [], meta: { total: 0 } }));
      mockFetch.mockResolvedValueOnce(mockResponse({ balance: 30 }));

      const result = await callTool(server, 'get_started');

      const text = result.content[0].text;
      expect(text).toContain('login');
      expect(text).toContain('Log in');
    });

    it('get_started tool list includes login alongside create_account', async () => {
      await new Promise(r => setTimeout(r, 10));
      mockFetch.mockReset();
      mockFetch.mockResolvedValueOnce(mockResponse({ data: [], meta: { total: 0 } }));
      mockFetch.mockResolvedValueOnce(mockResponse({ balance: 30 }));

      const result = await callTool(server, 'get_started');

      const text = result.content[0].text;
      expect(text).toContain('create_account');
      expect(text).toContain('login');
    });
  });

  describe('skillbrick-onboarding prompt', () => {
    it('returns prompt with onboarding content', async () => {
      const result = await callPrompt(server, 'skillbrick-onboarding');

      expect(result.messages).toHaveLength(1);
      const text = result.messages[0].content.text;
      expect(text).toContain('SkillBrick AI');
      expect(text).toContain('get_started');
      expect(text).toContain('PUBLIC');
      expect(text).toContain('PRIVATE');
      expect(text).toContain('Credit System');
    });

    it('mentions login tool', async () => {
      const result = await callPrompt(server, 'skillbrick-onboarding');

      const text = result.messages[0].content.text;
      expect(text).toContain('login');
      expect(text).toContain('create_account');
    });
  });
});

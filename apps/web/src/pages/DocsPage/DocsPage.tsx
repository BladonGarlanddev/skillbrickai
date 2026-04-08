import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Book, Lock, ChevronDown, ChevronRight, Copy, Check, Cpu } from 'lucide-react';
import styles from './DocsPage.module.scss';

const BASE_URL = 'https://skillbrickai.com/api';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface Endpoint {
  method: Method;
  path: string;
  description: string;
  auth?: boolean;
  note?: string;
  params?: { name: string; type: string; description: string; required?: boolean }[];
  body?: Record<string, unknown>;
  response?: Record<string, unknown> | Record<string, unknown>[];
}

interface Section {
  title: string;
  basePath: string;
  endpoints: Endpoint[];
}

const sections: Section[] = [
  {
    title: 'Authentication',
    basePath: '/auth',
    endpoints: [
      {
        method: 'POST',
        path: '/auth/register',
        description: 'Register a new account. Awards Early Adopter badge and 30 tokens.',
        body: { email: 'user@example.com', username: 'janedoe', password: 'securepassword' },
        response: { accessToken: 'eyJhbGciOiJIUzI1NiIs...', user: { id: 'clx...', email: 'user@example.com', username: 'janedoe', isEarlyAdopter: true } },
      },
      {
        method: 'POST',
        path: '/auth/login',
        description: 'Login with email and password',
        body: { email: 'user@example.com', password: 'securepassword' },
        response: { accessToken: 'eyJhbGciOiJIUzI1NiIs...', user: { id: 'clx...', email: 'user@example.com', username: 'janedoe' } },
      },
    ],
  },
  {
    title: 'Skills',
    basePath: '/skills',
    endpoints: [
      {
        method: 'GET',
        path: '/skills',
        description: 'Search and browse skills',
        params: [
          { name: 'search', type: 'string', description: 'Search by name or description' },
          { name: 'domain', type: 'string', description: 'Filter by domain (e.g. "coding", "writing")' },
          { name: 'tag', type: 'string', description: 'Filter by tag' },
          { name: 'sortBy', type: 'string', description: '"newest" (default), "popular", or "installs"' },
          { name: 'page', type: 'number', description: 'Page number (default: 1)' },
          { name: 'limit', type: 'number', description: 'Results per page (default: 20)' },
        ],
        response: { data: [{ id: 'clx...', name: 'Code Reviewer', slug: 'code-reviewer', description: '...', domain: 'coding', version: 2, installCount: 342, author: { id: '123', username: 'janedoe', avatarUrl: '...' }, tags: [{ tag: 'code-review' }], testedOn: [{ model: 'claude-3.5-sonnet' }], _count: { upvotes: 56 } }], meta: { total: 150, page: 1, limit: 20, totalPages: 8 } },
      },
      {
        method: 'POST',
        path: '/skills',
        description: 'Create a new skill',
        auth: true,
        body: { name: 'Code Reviewer', description: 'Expert code review assistant', content: 'You are an expert code reviewer...', domain: 'coding', tags: ['code-review', 'quality'], testedOn: ['claude-3.5-sonnet', 'gpt-4'] },
        response: { id: 'clx...', name: 'Code Reviewer', slug: 'code-reviewer', version: 1, contentHash: 'a1b2c3...', domain: 'coding', author: { id: '123', username: 'janedoe' }, tags: [{ tag: 'code-review' }], testedOn: [{ model: 'claude-3.5-sonnet' }] },
      },
      {
        method: 'PUT',
        path: '/skills/upsert',
        description: 'Create or update a skill by name. Compares content hash — skips update if unchanged.',
        auth: true,
        body: { name: 'Code Reviewer', description: 'Expert code review assistant', content: 'You are an expert code reviewer...', domain: 'coding', tags: ['code-review'], testedOn: ['claude-3.5-sonnet'] },
        response: { action: 'created | updated | unchanged', version: 1, skill: { id: 'clx...', name: 'Code Reviewer', slug: 'code-reviewer' } },
      },
      {
        method: 'PUT',
        path: '/skills/bulk-sync',
        description: 'Sync multiple skills at once. Creates, updates, or skips each based on content hash.',
        auth: true,
        body: { skills: [{ name: 'Skill A', description: '...', content: '...', domain: 'coding' }, { name: 'Skill B', description: '...', content: '...', domain: 'writing' }] },
        response: { summary: { created: 1, updated: 0, unchanged: 1, total: 2 }, results: ['...'] },
      },
      {
        method: 'GET',
        path: '/skills/mine',
        description: 'List all skills owned by the authenticated user with version info',
        auth: true,
        response: [{ id: 'clx...', name: 'Code Reviewer', slug: 'code-reviewer', version: 2, contentHash: 'a1b2c3...', domain: 'coding', installCount: 342, updatedAt: '2026-03-15T10:00:00Z', tags: ['code-review'], testedOn: ['claude-3.5-sonnet'], upvoteCount: 56 }],
      },
      {
        method: 'GET',
        path: '/skills/:id',
        description: 'Get full skill details by ID',
        response: { id: 'clx...', name: 'Code Reviewer', slug: 'code-reviewer', description: '...', content: 'You are an expert...', contentHash: 'a1b2c3...', domain: 'coding', version: 2, installCount: 342, author: { id: '123', username: 'janedoe', avatarUrl: '...', communityScore: 1240 }, tags: [{ tag: 'code-review' }], testedOn: [{ model: 'claude-3.5-sonnet' }], _count: { upvotes: 56 } },
      },
      {
        method: 'PATCH',
        path: '/skills/:id',
        description: 'Update a skill. Content changes auto-increment version and create a version record.',
        auth: true,
        note: 'Owner only',
        body: { name: 'Updated Name', description: 'Updated description', content: 'Updated prompt...', tags: ['new-tag'] },
        response: { id: 'clx...', name: 'Updated Name', slug: 'updated-name', version: 3 },
      },
      {
        method: 'DELETE',
        path: '/skills/:id',
        description: 'Delete a skill and all related records',
        auth: true,
        note: 'Owner only',
        response: { deleted: true },
      },
      {
        method: 'POST',
        path: '/skills/:id/install',
        description: 'Install a skill (costs 1 token). Returns the skill content.',
        auth: true,
        response: { message: 'Skill installed successfully', content: 'You are an expert code reviewer...' },
      },
      {
        method: 'POST',
        path: '/skills/:id/upvote',
        description: 'Toggle upvote on a skill',
        auth: true,
        response: { upvoted: true },
      },
    ],
  },
  {
    title: 'Collections',
    basePath: '/collections',
    endpoints: [
      {
        method: 'GET',
        path: '/collections',
        description: 'List all collections',
        response: { collections: [{ id: '1', name: 'My Toolkit', skillCount: 5 }] },
      },
      {
        method: 'POST',
        path: '/collections',
        description: 'Create a new collection',
        auth: true,
        body: { name: 'My Toolkit', description: 'Essential skills for daily work' },
        response: { id: '1', name: 'My Toolkit', description: 'Essential skills for daily work' },
      },
      {
        method: 'GET',
        path: '/collections/:id',
        description: 'Get collection details with skills',
        response: { id: '1', name: 'My Toolkit', description: '...', skills: [{ id: '1', title: 'Code Reviewer' }] },
      },
      {
        method: 'PATCH',
        path: '/collections/:id',
        description: 'Update a collection',
        auth: true,
        note: 'Owner only',
        body: { name: 'Updated Name' },
        response: { id: '1', name: 'Updated Name' },
      },
      {
        method: 'DELETE',
        path: '/collections/:id',
        description: 'Delete a collection',
        auth: true,
        note: 'Owner only',
        response: { success: true },
      },
      {
        method: 'POST',
        path: '/collections/:id/skills',
        description: 'Add a skill to a collection',
        auth: true,
        note: 'Owner only',
        body: { skillId: '1' },
        response: { success: true },
      },
    ],
  },
  {
    title: 'Community',
    basePath: '/community',
    endpoints: [
      {
        method: 'GET',
        path: '/community/posts',
        description: 'List community posts',
        params: [
          { name: 'category', type: 'string', description: 'Filter by category' },
        ],
        response: { posts: [{ id: '1', title: 'Tips for writing skills', author: { name: 'Jane' }, replyCount: 3 }] },
      },
      {
        method: 'POST',
        path: '/community/posts',
        description: 'Create a community post',
        auth: true,
        body: { title: 'Tips for writing skills', body: 'Here are my top tips...', category: 'GENERAL' },
        response: { id: 'clx...', title: 'Tips for writing skills', category: 'GENERAL' },
      },
      {
        method: 'GET',
        path: '/community/posts/:id',
        description: 'Get a post with its replies',
        response: { id: '1', title: 'Tips for writing skills', content: '...', replies: [{ id: '1', content: 'Great tips!', author: { name: 'Bob' } }] },
      },
      {
        method: 'POST',
        path: '/community/posts/:id/replies',
        description: 'Reply to a post',
        auth: true,
        body: { body: 'Great tips, thanks!' },
        response: { id: 'clx...', body: 'Great tips, thanks!', category: 'GENERAL' },
      },
      {
        method: 'POST',
        path: '/community/posts/:id/upvote',
        description: 'Upvote a post',
        auth: true,
        response: { upvoted: true, upvotes: 12 },
      },
    ],
  },
  {
    title: 'Requests',
    basePath: '/requests',
    endpoints: [
      {
        method: 'GET',
        path: '/requests',
        description: 'List skill requests',
        response: { requests: [{ id: '1', title: 'Need a SQL optimization skill', status: 'open' }] },
      },
      {
        method: 'POST',
        path: '/requests',
        description: 'Create a skill request',
        auth: true,
        body: { title: 'Need a SQL optimization skill', description: 'Looking for a skill that helps optimize SQL queries...' },
        response: { id: '1', title: 'Need a SQL optimization skill', status: 'open' },
      },
      {
        method: 'GET',
        path: '/requests/:id',
        description: 'Get request details with replies',
        response: { id: '1', title: 'Need a SQL optimization skill', description: '...', replies: [] },
      },
      {
        method: 'POST',
        path: '/requests/:id/replies',
        description: 'Reply to a skill request. Optionally link a skill.',
        auth: true,
        body: { body: 'I created a skill for this!', skillId: 'clx...' },
        response: { id: 'clx...', body: 'I created a skill for this!', skillId: 'clx...' },
      },
      {
        method: 'PATCH',
        path: '/requests/:id/status',
        description: 'Update request status',
        auth: true,
        note: 'Author only',
        body: { status: 'FULFILLED' },
        response: { id: 'clx...', status: 'FULFILLED' },
      },
    ],
  },
  {
    title: 'Showcases',
    basePath: '/showcases',
    endpoints: [
      {
        method: 'GET',
        path: '/showcases',
        description: 'List showcases',
        response: { showcases: [{ id: '1', title: 'Built an AI tutor with SkillBrick', author: { name: 'Alice' } }] },
      },
      {
        method: 'POST',
        path: '/showcases',
        description: 'Create a showcase',
        auth: true,
        body: { title: 'Built an AI tutor with SkillBrick', content: 'Here is how I used skills to build...', skillIds: ['1', '2'] },
        response: { id: '1', title: 'Built an AI tutor with SkillBrick' },
      },
      {
        method: 'GET',
        path: '/showcases/:id',
        description: 'Get showcase details',
        response: { id: '1', title: 'Built an AI tutor with SkillBrick', content: '...', skills: [{ id: '1', title: 'Code Reviewer' }] },
      },
    ],
  },
  {
    title: 'Tokens',
    basePath: '/tokens',
    endpoints: [
      {
        method: 'GET',
        path: '/tokens/balance',
        description: 'Get your current token balance',
        auth: true,
        response: { balance: 10 },
      },
      {
        method: 'GET',
        path: '/tokens/history',
        description: 'Get token transaction history',
        auth: true,
        response: { transactions: [{ id: '1', type: 'spend', amount: -1, description: 'Installed "Code Reviewer"', createdAt: '2026-03-15T10:00:00Z' }] },
      },
    ],
  },
  {
    title: 'Users',
    basePath: '/users',
    endpoints: [
      {
        method: 'GET',
        path: '/users/:id',
        description: 'Get a user profile with badges and stats',
        response: { id: 'clx...', username: 'janedoe', avatarUrl: 'https://...', bio: 'AI enthusiast', communityScore: 1240, tokenBalance: 42, isEarlyAdopter: true, badges: [{ type: 'EARLY_ADOPTER' }, { type: 'CONTRIBUTOR' }] },
      },
      {
        method: 'PATCH',
        path: '/users/me',
        description: 'Update your profile',
        auth: true,
        body: { username: 'newname', bio: 'Updated bio', avatarUrl: 'https://...' },
        response: { id: 'clx...', username: 'newname', bio: 'Updated bio' },
      },
      {
        method: 'GET',
        path: '/users/:id/skills',
        description: "Get a user's published skills with tags, models, and upvote counts",
        response: [{ id: 'clx...', name: 'Code Reviewer', slug: 'code-reviewer', domain: 'coding', version: 2, installCount: 342, _count: { upvotes: 56 } }],
      },
      {
        method: 'GET',
        path: '/users/:id/collections',
        description: "Get a user's collections with skill counts",
        response: [{ id: 'clx...', name: 'My Toolkit', description: '...', _count: { skills: 5 } }],
      },
    ],
  },
];

const mcpConfig = `{
  "mcpServers": {
    "skillbrickai": {
      "command": "npx",
      "args": ["@skillbrickai/mcp-server"],
      "env": {
        "SKILLBRICK_API_URL": "https://skillbrickai.com"
      }
    }
  }
}`;

const mcpTools = [
  { name: 'search_skills', description: 'Search the skill library by keyword, domain, or tag with natural language queries' },
  { name: 'recommend_skills', description: 'Describe a task in plain English and get ranked skill recommendations' },
  { name: 'get_skill', description: 'Get full details and prompt content for a specific skill' },
  { name: 'install_skill', description: 'Install a skill and get the prompt content (costs 1 token, requires auth)' },
  { name: 'upload_skill', description: 'Create or update a skill on the platform (requires auth)' },
  { name: 'sync_skills', description: 'Bulk upload or update multiple skills in one call (requires auth)' },
  { name: 'my_skills', description: 'List all skills you\'ve uploaded with version and hash info (requires auth)' },
  { name: 'check_credits', description: 'Check your download credit balance and see pricing options' },
  { name: 'list_collections', description: 'Browse curated skill collections' },
  { name: 'get_collection', description: 'Get collection details with included skills' },
  { name: 'list_domains', description: 'List all available skill domains/categories' },
];

function MethodBadge({ method }: { method: Method }) {
  return <span className={`${styles.methodBadge} ${styles[method.toLowerCase()]}`}>{method}</span>;
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = endpoint.params || endpoint.body || endpoint.response;

  return (
    <div className={styles.endpointCard}>
      <button
        className={styles.endpointHeader}
        onClick={() => hasDetails && setExpanded(!expanded)}
        type="button"
        aria-expanded={expanded}
      >
        <div className={styles.endpointLeft}>
          <MethodBadge method={endpoint.method} />
          <code className={styles.endpointPath}>{endpoint.path}</code>
          {endpoint.auth && (
            <span className={styles.authBadge} title="Authentication required">
              <Lock size={12} />
            </span>
          )}
          {endpoint.note && <span className={styles.endpointNote}>{endpoint.note}</span>}
        </div>
        <div className={styles.endpointRight}>
          <span className={styles.endpointDesc}>{endpoint.description}</span>
          {hasDetails && (
            <span className={styles.expandIcon}>
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </div>
      </button>

      {expanded && hasDetails && (
        <div className={styles.endpointDetails}>
          {endpoint.params && (
            <div className={styles.detailSection}>
              <h4 className={styles.detailTitle}>Query Parameters</h4>
              <div className={styles.paramsTable}>
                <div className={styles.paramsHeader}>
                  <span>Name</span>
                  <span>Type</span>
                  <span>Description</span>
                </div>
                {endpoint.params.map((param) => (
                  <div key={param.name} className={styles.paramsRow}>
                    <code>{param.name}</code>
                    <span className={styles.paramType}>{param.type}</span>
                    <span>{param.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {endpoint.body && (
            <div className={styles.detailSection}>
              <h4 className={styles.detailTitle}>Request Body</h4>
              <CodeBlock code={JSON.stringify(endpoint.body, null, 2)} />
            </div>
          )}

          {endpoint.response && (
            <div className={styles.detailSection}>
              <h4 className={styles.detailTitle}>Response</h4>
              <CodeBlock code={JSON.stringify(endpoint.response, null, 2)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CodeBlock({ code, language = 'json' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLang}>{language}</span>
        <button className={styles.copyButton} onClick={handleCopy} type="button">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className={styles.codeContent}><code>{code}</code></pre>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className={styles.page}>
      <Helmet>
        <title>API Documentation | SkillBrick AI</title>
        <meta name="description" content="SkillBrick AI REST API and MCP Server documentation. Integrate AI skills into your applications, agents, and workflows programmatically." />
        <link rel="canonical" href="https://skillbrickai.com/docs" />
        <meta property="og:title" content="API Documentation | SkillBrick AI" />
        <meta property="og:description" content="REST API and MCP Server documentation for integrating AI skills into your applications and agents." />
        <meta property="og:url" content="https://skillbrickai.com/docs" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "name": "SkillBrick AI API Documentation",
            "description": "REST API and MCP Server documentation for integrating AI skills into applications, agents, and workflows.",
            "url": "https://skillbrickai.com/docs",
            "isPartOf": { "@type": "WebSite", "name": "SkillBrick AI", "url": "https://skillbrickai.com/" },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://skillbrickai.com/" },
                { "@type": "ListItem", "position": 2, "name": "API Documentation" }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Book size={24} />
        </div>
        <h1 className={styles.title}>API Documentation</h1>
        <p className={styles.subtitle}>
          Everything you need to integrate with the SkillBrick AI platform. Base URL: <code className={styles.inlineCode}>{BASE_URL}</code>
        </p>
      </div>

      <div className={styles.authInfo}>
        <div className={styles.authInfoHeader}>
          <Lock size={16} />
          <h3>Authentication</h3>
        </div>
        <p>
          Endpoints marked with <Lock size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> require a Bearer token.
          Include it in the <code className={styles.inlineCode}>Authorization</code> header:
        </p>
        <CodeBlock code={'Authorization: Bearer <your-token>'} language="http" />
      </div>

      <nav className={styles.toc}>
        <h3 className={styles.tocTitle}>Sections</h3>
        <div className={styles.tocList}>
          {sections.map((section) => (
            <a key={section.title} href={`#${section.title.toLowerCase()}`} className={styles.tocLink}>
              {section.title}
              <span className={styles.tocBadge}>{section.basePath}</span>
            </a>
          ))}
          <a href="#mcp-server" className={styles.tocLink}>
            MCP Server
            <span className={styles.tocBadge}>AI Agents</span>
          </a>
        </div>
      </nav>

      {sections.map((section) => (
        <section key={section.title} id={section.title.toLowerCase()} className={styles.apiSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <code className={styles.basePath}>{section.basePath}</code>
          </div>
          <div className={styles.endpointList}>
            {section.endpoints.map((endpoint) => (
              <EndpointCard key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} />
            ))}
          </div>
        </section>
      ))}

      <section id="mcp-server" className={styles.apiSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>MCP Server</h2>
          <span className={styles.basePath}>AI Agents</span>
        </div>

        <div className={styles.mcpIntro}>
          <div className={styles.mcpIcon}>
            <Cpu size={20} />
          </div>
          <p>
            SkillBrick AI provides a <strong>Model Context Protocol (MCP) server</strong> that allows
            AI agents like Claude Desktop to directly search, browse, and install skills from the library.
            This enables your AI assistant to dynamically acquire new capabilities on demand.
          </p>
        </div>

        <div className={styles.detailSection}>
          <h4 className={styles.detailTitle}>Available Tools</h4>
          <div className={styles.mcpTools}>
            {mcpTools.map((tool) => (
              <div key={tool.name} className={styles.mcpTool}>
                <code className={styles.mcpToolName}>{tool.name}</code>
                <span className={styles.mcpToolDesc}>{tool.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.detailSection}>
          <h4 className={styles.detailTitle}>Claude Desktop Configuration</h4>
          <p className={styles.detailDescription}>
            Add the following to your Claude Desktop configuration file to enable the SkillBrick AI MCP server:
          </p>
          <CodeBlock code={mcpConfig} />
        </div>

        <div className={styles.detailSection}>
          <h4 className={styles.detailTitle}>Recommended: Background Setup Agent</h4>
          <p className={styles.detailDescription}>
            For the best experience, run a background subagent when you first connect to SkillBrick AI.
            This agent handles initial setup so your main conversation isn't blocked:
          </p>
          <CodeBlock code={`// Suggested subagent prompt for initial SkillBrick AI setup:
//
// "Configure SkillBrick AI for this session. Run these steps in the background:
//
//  1. Use search_skills to find the 'SkillBrick AI Agent' skill and
//     fetch it with get_skill. Apply its instructions for this session.
//
//  2. Use search_skills to find the 'Skill Creator' skill and fetch it.
//     Keep it available in case the user wants to create or publish skills.
//
//  3. Use list_domains to discover what skill categories are available.
//
//  4. Use check_credits to see the current token balance.
//
//  5. Report back: available domains, credit balance, and confirmation
//     that the platform skills are loaded."
//
// This runs as a background task — the user can keep working while
// the agent sets itself up with SkillBrick AI capabilities.`} language="text" />
        </div>
      </section>
    </div>
  );
}

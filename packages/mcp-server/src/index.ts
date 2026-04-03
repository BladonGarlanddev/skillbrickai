#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const DEFAULT_API_URL = "http://localhost:3000";

function getApiUrl(): string {
  return process.env.SKILLBRICK_API_URL || DEFAULT_API_URL;
}

async function apiFetch(path: string, init?: RequestInit): Promise<any> {
  const url = `${getApiUrl()}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Intelligent search helpers
// ---------------------------------------------------------------------------

/** Domain synonym map — maps casual terms to actual domain values */
const DOMAIN_ALIASES: Record<string, string[]> = {
  "Frontend Development": ["frontend", "front-end", "ui", "react", "vue", "angular", "css", "html", "web ui"],
  "Backend Development": ["backend", "back-end", "server", "api", "rest", "graphql", "node", "python", "java", "php", "ruby", "go", "rust", "nestjs", "django", "fastapi", "spring", "laravel", "express", "elixir"],
  "Mobile Development": ["mobile", "ios", "android", "flutter", "react native", "swift", "kotlin", "app"],
  "DevOps": ["devops", "dev ops", "infrastructure", "terraform", "kubernetes", "k8s", "docker", "ci/cd", "cicd", "deployment", "cloud", "aws", "gcp", "azure", "sre", "incident"],
  "Data Science": ["data science", "data", "ml", "machine learning", "ai", "statistics", "r programming", "pandas", "numpy"],
  "AI Engineering": ["ai engineering", "llm", "large language model", "prompt engineering", "langchain", "agent"],
  "Blockchain": ["blockchain", "crypto", "solidity", "ethereum", "smart contract", "web3", "defi"],
  "Writing": ["writing", "copywriting", "content", "editing", "humanize", "rewrite"],
  "Research": ["research", "investigation", "analysis", "academic", "scientific", "paper"],
  "Education": ["education", "teaching", "learning", "tutor", "explain"],
  "Career": ["career", "interview", "job", "resume", "hiring"],
  "Personal Development": ["personal development", "motivation", "coaching", "productivity", "goals"],
  "Creative Writing": ["creative writing", "screenwriting", "storytelling", "fiction", "screenplay"],
  "Game Development": ["game dev", "gamedev", "game development", "unity", "unreal", "godot", "dragonruby"],
  "Design": ["design", "ux", "user experience", "accessibility", "a11y", "wcag", "ui design"],
  "Marketing": ["marketing", "seo", "ppc", "ads", "advertising", "brand", "branding", "social media"],
  "Sales": ["sales", "discovery", "deal", "crm", "prospecting", "b2b"],
  "Content Management": ["cms", "blog", "hugo", "wordpress", "static site"],
  "Software Engineering": ["software engineering", "best practices", "architecture", "design patterns", "code review", "principles"],
  "Development Tools": ["tools", "git", "cli", "terminal", "workflow", "automation", "orchestration"],
  "Productivity": ["productivity", "spreadsheet", "excel", "notion", "organization"],
  "Travel": ["travel", "tourism", "geography"],
};

/** Resolve a natural-language query into structured search params */
function parseIntent(query: string): {
  searchTerms: string;
  inferredDomain: string | null;
  inferredTags: string[];
} {
  const lower = query.toLowerCase();

  // Try to infer domain from the query
  let inferredDomain: string | null = null;
  let bestAliasLen = 0;
  for (const [domain, aliases] of Object.entries(DOMAIN_ALIASES)) {
    for (const alias of aliases) {
      if (lower.includes(alias) && alias.length > bestAliasLen) {
        inferredDomain = domain;
        bestAliasLen = alias.length;
      }
    }
  }

  // Extract likely tag keywords (short single words that might be tags)
  const TAG_CANDIDATES = [
    "react", "vue", "angular", "svelte", "nextjs", "typescript", "javascript",
    "python", "django", "fastapi", "flask", "go", "rust", "java", "kotlin",
    "swift", "flutter", "docker", "kubernetes", "terraform", "aws", "gcp",
    "azure", "postgresql", "mysql", "redis", "graphql", "rest", "grpc",
    "solidity", "ethereum", "testing", "security", "performance", "accessibility",
    "git", "linux", "devops", "mlops", "llm", "langchain", "tailwind",
    "sass", "css", "html", "node", "nestjs", "express", "laravel", "php",
    "ruby", "elixir", "phoenix", "spring", "android", "ios", "mobile",
    "blockchain", "sql", "database", "api", "frontend", "backend",
  ];
  const inferredTags = TAG_CANDIDATES.filter((t) => lower.includes(t));

  return { searchTerms: query, inferredDomain, inferredTags };
}

/** Format a skill result for agent consumption */
function formatSkill(skill: any, includeContent: boolean): string {
  const tags = (skill.tags || []).map((t: any) => t.tag).join(", ");
  const testedOn = (skill.testedOn || []).map((t: any) => t.model).join(", ");
  const upvotes = skill._count?.upvotes ?? 0;

  let out = `## ${skill.name}\n`;
  out += `**ID:** ${skill.id}\n`;
  out += `**Domain:** ${skill.domain}\n`;
  out += `**Description:** ${skill.description}\n`;
  out += `**Author:** ${skill.author?.username || "unknown"}\n`;
  out += `**Installs:** ${skill.installCount} | **Upvotes:** ${upvotes}\n`;
  if (tags) out += `**Tags:** ${tags}\n`;
  if (testedOn) out += `**Tested On:** ${testedOn}\n`;
  if (skill.sourceUrl) out += `**Source:** ${skill.sourceUrl}\n`;

  if (includeContent) {
    out += `\n### Skill Content\n\`\`\`\n${skill.content}\n\`\`\`\n`;
  }

  return out;
}

// ---------------------------------------------------------------------------
// Server setup
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "skillbrickai",
  version: "0.1.0",
});

// ---------------------------------------------------------------------------
// Tool: search_skills — the primary intelligent search
// ---------------------------------------------------------------------------
server.tool(
  "search_skills",
  "Search the SkillBrick AI library for agent skills. Accepts natural language queries like 'python backend testing' or 'help me write better React components'. Returns matching skills with metadata. Use this to find skills by topic, technology, domain, or use case.",
  {
    query: z.string().describe(
      "Natural language search query. Examples: 'kubernetes deployment', 'write better code', 'React Native mobile app', 'prompt engineering'"
    ),
    domain: z.string().optional().describe(
      "Filter by exact domain. If omitted, the domain is auto-inferred from the query. Examples: 'Backend Development', 'DevOps', 'AI Engineering'"
    ),
    tag: z.string().optional().describe(
      "Filter by exact tag. Examples: 'python', 'react', 'kubernetes', 'typescript'"
    ),
    sort_by: z.enum(["newest", "popular", "installs"]).optional().describe(
      "Sort order. 'popular' = most upvoted, 'installs' = most downloaded, 'newest' = most recent. Default: popular"
    ),
    limit: z.number().min(1).max(50).optional().describe(
      "Max results to return (1-50). Default: 10"
    ),
  },
  async ({ query, domain, tag, sort_by, limit }) => {
    const intent = parseIntent(query);
    const params = new URLSearchParams();

    params.set("search", intent.searchTerms);
    params.set("sortBy", sort_by || "popular");
    params.set("limit", String(limit || 10));
    params.set("page", "1");

    // Use explicit domain if provided, otherwise use inferred
    if (domain) {
      params.set("domain", domain);
    } else if (intent.inferredDomain) {
      params.set("domain", intent.inferredDomain);
    }

    // Use explicit tag if provided, otherwise use first inferred tag
    if (tag) {
      params.set("tag", tag);
    } else if (intent.inferredTags.length > 0) {
      params.set("tag", intent.inferredTags[0]);
    }

    try {
      const result = await apiFetch(`/skills?${params.toString()}`);
      const skills = result.data || [];

      if (skills.length === 0) {
        // Retry without domain/tag filter for broader results
        params.delete("domain");
        params.delete("tag");
        const broader = await apiFetch(`/skills?${params.toString()}`);
        const broaderSkills = broader.data || [];

        if (broaderSkills.length === 0) {
          return {
            content: [{
              type: "text" as const,
              text: `No skills found for "${query}". Try a different search term, or use list_domains to see available categories.`,
            }],
          };
        }

        const formatted = broaderSkills.map((s: any) => formatSkill(s, false)).join("\n---\n");
        return {
          content: [{
            type: "text" as const,
            text: `No exact matches for "${query}" in domain "${domain || intent.inferredDomain}". Showing broader results:\n\n${formatted}\n\n**Total available:** ${broader.meta.total}`,
          }],
        };
      }

      const formatted = skills.map((s: any) => formatSkill(s, false)).join("\n---\n");
      return {
        content: [{
          type: "text" as const,
          text: `Found ${result.meta.total} skill(s) matching "${query}".\n\n${formatted}\n\nUse **get_skill** with a skill ID to retrieve the full content.`,
        }],
      };
    } catch (err: any) {
      return { content: [{ type: "text" as const, text: `Error searching skills: ${err.message}` }], isError: true };
    }
  },
);

// ---------------------------------------------------------------------------
// Tool: get_skill — retrieve full skill content by ID
// ---------------------------------------------------------------------------
server.tool(
  "get_skill",
  "Retrieve the full content of a specific skill by its ID. Use this after search_skills to get the actual prompt/instructions you can use.",
  {
    skill_id: z.string().describe("The skill ID (e.g., 'clx...'). Get this from search_skills results."),
  },
  async ({ skill_id }) => {
    try {
      const skill = await apiFetch(`/skills/${skill_id}`);
      return {
        content: [{
          type: "text" as const,
          text: formatSkill(skill, true),
        }],
      };
    } catch (err: any) {
      return { content: [{ type: "text" as const, text: `Error fetching skill: ${err.message}` }], isError: true };
    }
  },
);

// ---------------------------------------------------------------------------
// Tool: list_domains — discover available skill categories
// ---------------------------------------------------------------------------
server.tool(
  "list_domains",
  "List all available skill domains/categories on SkillBrick AI. Use this to discover what kinds of skills are available before searching.",
  {},
  async () => {
    try {
      // Fetch a large batch to extract unique domains
      const result = await apiFetch("/skills?limit=200&sortBy=installs");
      const skills = result.data || [];
      const domainCounts: Record<string, number> = {};
      for (const s of skills) {
        domainCounts[s.domain] = (domainCounts[s.domain] || 0) + 1;
      }

      const sorted = Object.entries(domainCounts).sort((a, b) => b[1] - a[1]);
      const lines = sorted.map(([domain, count]) => `- **${domain}** (${count} skills)`);

      return {
        content: [{
          type: "text" as const,
          text: `## Available Domains\n\n${lines.join("\n")}\n\nUse **search_skills** with a domain to browse skills in a category.`,
        }],
      };
    } catch (err: any) {
      return { content: [{ type: "text" as const, text: `Error listing domains: ${err.message}` }], isError: true };
    }
  },
);

// ---------------------------------------------------------------------------
// Tool: recommend_skills — intelligent recommendation based on a task description
// ---------------------------------------------------------------------------
server.tool(
  "recommend_skills",
  "Describe what you're trying to accomplish and get skill recommendations. Unlike search_skills which matches keywords, this tool interprets your goal and finds the most relevant skills across multiple domains. Example: 'I need to build a REST API with authentication and deploy it to AWS'.",
  {
    task_description: z.string().describe(
      "A natural language description of what you're trying to accomplish. Be specific about technologies, goals, and constraints."
    ),
    max_results: z.number().min(1).max(20).optional().describe("Max skills to recommend (1-20). Default: 5"),
  },
  async ({ task_description, max_results }) => {
    const limit = max_results || 5;
    const intent = parseIntent(task_description);

    // Multi-pass search: query by text, by inferred domain, and by inferred tags
    const searches: Promise<any>[] = [];

    // Pass 1: direct text search
    const p1 = new URLSearchParams({ search: task_description, limit: "20", sortBy: "popular" });
    searches.push(apiFetch(`/skills?${p1.toString()}`).catch(() => ({ data: [] })));

    // Pass 2: domain-scoped search
    if (intent.inferredDomain) {
      const p2 = new URLSearchParams({ domain: intent.inferredDomain, limit: "20", sortBy: "popular" });
      searches.push(apiFetch(`/skills?${p2.toString()}`).catch(() => ({ data: [] })));
    }

    // Pass 3: tag-based searches for top 3 inferred tags
    for (const tag of intent.inferredTags.slice(0, 3)) {
      const p3 = new URLSearchParams({ tag, limit: "10", sortBy: "popular" });
      searches.push(apiFetch(`/skills?${p3.toString()}`).catch(() => ({ data: [] })));
    }

    try {
      const results = await Promise.all(searches);

      // Deduplicate and score
      const seen = new Map<string, { skill: any; score: number }>();
      const lower = task_description.toLowerCase();

      for (let passIndex = 0; passIndex < results.length; passIndex++) {
        const skills = results[passIndex].data || [];
        for (const skill of skills) {
          const existing = seen.get(skill.id);
          const matchScore = scoreSkill(skill, lower, intent);
          // Boost score if found in multiple passes
          const combined = existing
            ? existing.score + matchScore * 0.5
            : matchScore;
          seen.set(skill.id, { skill, score: combined });
        }
      }

      // Sort by score and take top N
      const ranked = [...seen.values()]
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      if (ranked.length === 0) {
        return {
          content: [{
            type: "text" as const,
            text: `No relevant skills found for: "${task_description}". Try rephrasing or use list_domains to explore available categories.`,
          }],
        };
      }

      const formatted = ranked.map(({ skill, score }, i) => {
        const relevance = score > 10 ? "High" : score > 5 ? "Medium" : "Low";
        return `**${i + 1}. [${relevance} relevance]**\n${formatSkill(skill, false)}`;
      }).join("\n---\n");

      return {
        content: [{
          type: "text" as const,
          text: `## Recommended Skills\n\nBased on: "${task_description}"\n\n${formatted}\n\nUse **get_skill** with a skill ID to retrieve the full content.`,
        }],
      };
    } catch (err: any) {
      return { content: [{ type: "text" as const, text: `Error recommending skills: ${err.message}` }], isError: true };
    }
  },
);

/** Score a skill's relevance to a query */
function scoreSkill(
  skill: any,
  lowerQuery: string,
  intent: ReturnType<typeof parseIntent>,
): number {
  let score = 0;
  const name = (skill.name || "").toLowerCase();
  const desc = (skill.description || "").toLowerCase();
  const tags = (skill.tags || []).map((t: any) => t.tag.toLowerCase());
  const domain = (skill.domain || "").toLowerCase();

  // Name match (highest signal)
  const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length > 2);
  for (const word of queryWords) {
    if (name.includes(word)) score += 5;
    if (desc.includes(word)) score += 2;
    if (tags.includes(word)) score += 3;
  }

  // Domain match
  if (intent.inferredDomain && domain === intent.inferredDomain.toLowerCase()) {
    score += 4;
  }

  // Tag overlap
  for (const tag of intent.inferredTags) {
    if (tags.includes(tag)) score += 3;
  }

  // Popularity signals (normalized)
  score += Math.min(skill.installCount / 100, 3);
  score += Math.min((skill._count?.upvotes || 0) / 10, 2);

  return score;
}

// ---------------------------------------------------------------------------
// Connect
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

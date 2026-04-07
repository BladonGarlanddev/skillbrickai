#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_URL = (process.env.SKILLBRICK_API_URL || "https://skillbrickai.com").replace(/\/+$/, "");
const API_TOKEN = process.env.SKILLBRICK_API_TOKEN || "";

async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  const url = `${API_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (API_TOKEN) {
    headers["Authorization"] = `Bearer ${API_TOKEN}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API request failed: ${res.status} ${res.statusText}${body ? ` - ${body}` : ""}`);
  }

  return res.json();
}

function textResult(content: string) {
  return { content: [{ type: "text" as const, text: content }] };
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
      const skill = await apiFetch(`/skills/${encodeURIComponent(skill_id)}`);
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
// Tool: install_skill — install a skill (requires auth)
// ---------------------------------------------------------------------------
server.tool(
  "install_skill",
  "Install a skill from SkillBrick AI. Requires an API token to be configured via SKILLBRICK_API_TOKEN. Returns the skill content/prompt text. If the user has insufficient credits, returns options for earning more.",
  {
    skillId: z.string().describe("The ID of the skill to install"),
  },
  async ({ skillId }) => {
    try {
      if (!API_TOKEN) {
        return textResult("Error: SKILLBRICK_API_TOKEN environment variable is required for installing skills. Set it in your MCP server configuration.");
      }
      const data = await apiFetch(`/skills/${encodeURIComponent(skillId)}/install`, {
        method: "POST",
      });
      return textResult(JSON.stringify(data, null, 2));
    } catch (err) {
      const errMsg = (err as Error).message;
      if (errMsg.includes("INSUFFICIENT_CREDITS") || errMsg.includes("Insufficient") || errMsg.includes("400")) {
        try {
          const jsonMatch = errMsg.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const errorData = JSON.parse(jsonMatch[0]);
            if (errorData.error === "INSUFFICIENT_CREDITS") {
              return textResult(
                `INSUFFICIENT CREDITS\n\n` +
                `The user has ${errorData.currentBalance} credits remaining but needs ${errorData.requiredCredits} to install this skill.\n\n` +
                `Please inform the user of these options to get more credits:\n\n` +
                `1. SUBMIT A SKILL (Free): The user can submit a skill to the SkillBrick AI platform and earn 10 download credits instantly. ` +
                `You can help them do this right now using the "upload_skill" tool.\n\n` +
                `2. SUBSCRIBE: The user can purchase a subscription for monthly credits:\n` +
                `   - Starter ($5/mo): 50 downloads/month\n` +
                `   - Pro ($15/mo): 200 downloads/month\n` +
                `   - Unlimited ($30/mo): Unlimited downloads\n` +
                `   Visit the SkillBrick AI pricing page to subscribe.\n\n` +
                `Ask the user which option they'd prefer.`
              );
            }
          }
        } catch {
          // Fall through to generic error
        }
        return textResult(
          `INSUFFICIENT CREDITS\n\n` +
          `The user does not have enough credits to install this skill.\n\n` +
          `Please inform the user of these options:\n\n` +
          `1. SUBMIT A SKILL (Free): Submit a skill to earn 10 download credits. Use the "upload_skill" tool to help them.\n\n` +
          `2. SUBSCRIBE: Purchase a subscription starting at $5/month for 50 downloads.\n\n` +
          `Use the "check_credits" tool to see their current balance.`
        );
      }
      return textResult(`Error installing skill: ${errMsg}`);
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: check_credits — check download credit balance
// ---------------------------------------------------------------------------
server.tool(
  "check_credits",
  "Check the authenticated user's current download credit balance and see options for earning or purchasing more credits. Use this before installing skills to verify the user has enough credits.",
  {},
  async () => {
    try {
      if (!API_TOKEN) {
        return textResult("Error: SKILLBRICK_API_TOKEN environment variable is required. Set it in your MCP server configuration.");
      }
      const [balance, pricing] = await Promise.all([
        apiFetch("/tokens/balance") as Promise<{ balance: number }>,
        apiFetch("/tokens/pricing") as Promise<Record<string, unknown>>,
      ]);
      return textResult(JSON.stringify({
        currentBalance: balance.balance,
        costPerInstall: 1,
        remainingInstalls: balance.balance,
        ...(balance.balance <= 5 ? {
          lowBalanceWarning: `Only ${balance.balance} install(s) remaining.`,
          earnMore: {
            submitSkill: "Submit a skill to earn 10 credits instantly. Use the upload_skill tool.",
            subscribe: "Subscribe starting at $5/month for 50 downloads/month.",
          },
        } : {}),
        pricing,
      }, null, 2));
    } catch (err) {
      return textResult(`Error checking credits: ${(err as Error).message}`);
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: list_collections — browse skill collections
// ---------------------------------------------------------------------------
server.tool(
  "list_collections",
  "Browse all skill collections on SkillBrick AI. Returns collections with names, descriptions, and skill counts.",
  {},
  async () => {
    try {
      const data = await apiFetch("/collections");
      return textResult(JSON.stringify(data, null, 2));
    } catch (err) {
      return textResult(`Error listing collections: ${(err as Error).message}`);
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: get_collection — get a specific collection
// ---------------------------------------------------------------------------
server.tool(
  "get_collection",
  "Get a specific collection with all its skills. Returns the collection details and nested skill objects.",
  {
    collectionId: z.string().describe("The ID of the collection to retrieve"),
  },
  async ({ collectionId }) => {
    try {
      const data = await apiFetch(`/collections/${encodeURIComponent(collectionId)}`);
      return textResult(JSON.stringify(data, null, 2));
    } catch (err) {
      return textResult(`Error fetching collection: ${(err as Error).message}`);
    }
  }
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

// ---------------------------------------------------------------------------
// Tool: upload_skill — upsert a single skill (requires auth)
// ---------------------------------------------------------------------------
server.tool(
  "upload_skill",
  "Upload or update a skill on SkillBrick AI. If a skill with the same name already exists for your account, it will be updated only if the content has changed. Returns whether the skill was created, updated, or unchanged. Requires SKILLBRICK_API_TOKEN.",
  {
    name: z.string().describe("Skill name/title"),
    description: z.string().describe("One-line description of what the skill does"),
    content: z.string().describe("The full skill/prompt content"),
    domain: z.string().describe("Skill domain/category (e.g. coding, writing, research)"),
    tags: z.array(z.string()).optional().describe("Tags for discoverability"),
    testedOn: z.array(z.string()).optional().describe("AI models this skill has been tested on"),
  },
  async (params) => {
    try {
      if (!API_TOKEN) {
        return textResult("Error: SKILLBRICK_API_TOKEN environment variable is required for uploading skills. Set it in your MCP server configuration.");
      }
      const data = await apiFetch("/skills/upsert", {
        method: "PUT",
        body: JSON.stringify(params),
      });
      return textResult(JSON.stringify(data, null, 2));
    } catch (err) {
      return textResult(`Error uploading skill: ${(err as Error).message}`);
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: sync_skills — bulk upsert (requires auth)
// ---------------------------------------------------------------------------
server.tool(
  "sync_skills",
  "Bulk-sync multiple skills to SkillBrick AI in one call. Each skill is created if new, updated if content changed, or skipped if unchanged. Returns a summary of what happened. Requires SKILLBRICK_API_TOKEN.",
  {
    skills: z.array(z.object({
      name: z.string().describe("Skill name/title"),
      description: z.string().describe("One-line description"),
      content: z.string().describe("The full skill/prompt content"),
      domain: z.string().describe("Skill domain/category"),
      tags: z.array(z.string()).optional().describe("Tags for discoverability"),
      testedOn: z.array(z.string()).optional().describe("AI models tested on"),
    })).describe("Array of skills to sync"),
  },
  async ({ skills }) => {
    try {
      if (!API_TOKEN) {
        return textResult("Error: SKILLBRICK_API_TOKEN environment variable is required for syncing skills. Set it in your MCP server configuration.");
      }
      const data = await apiFetch("/skills/bulk-sync", {
        method: "PUT",
        body: JSON.stringify({ skills }),
      });
      return textResult(JSON.stringify(data, null, 2));
    } catch (err) {
      return textResult(`Error syncing skills: ${(err as Error).message}`);
    }
  }
);

// ---------------------------------------------------------------------------
// Tool: my_skills — list authenticated user's skills (requires auth)
// ---------------------------------------------------------------------------
server.tool(
  "my_skills",
  "List all skills owned by the authenticated user, with version numbers and content hashes. Useful for checking what you've already uploaded. Requires SKILLBRICK_API_TOKEN.",
  {},
  async () => {
    try {
      if (!API_TOKEN) {
        return textResult("Error: SKILLBRICK_API_TOKEN environment variable is required. Set it in your MCP server configuration.");
      }
      const data = await apiFetch("/skills/mine");
      return textResult(JSON.stringify(data, null, 2));
    } catch (err) {
      return textResult(`Error listing your skills: ${(err as Error).message}`);
    }
  }
);

// ---------------------------------------------------------------------------
// Connect
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error starting MCP server:", err);
  process.exit(1);
});

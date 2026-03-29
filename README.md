# Collective

A community library for AI skills. Browse, copy, and stack prompt-based skills that make AI agents smarter in specific domains.

## What is Collective?

Collective is a web platform where people publish **skills** — distilled, domain-specific knowledge encoded as prompts — that anyone can drop into their own AI agent environment to improve its behavior.

A skill is not code or an API integration. It is accumulated human knowledge about how an AI should behave to be successful in a given domain. For example, a _Frontend Design_ skill guides an agent toward better visual hierarchy, spacing, and component decisions. Without it, most agents produce mediocre UI. With it, they don't.

Skills are:
- **Freeform by default** — primarily Markdown, no rigid structure required
- **Portable** — copy or download and paste into any agent environment
- **Composable** — stack multiple skills together for broader capability
- **Community-authored** — anyone can contribute

## Philosophy

Knowledge transfer has always been humanity's defining challenge. We told stories. We wrote them down. We printed them at scale. We put them on the internet. AI is the next bridge.

Collective is not an evolution of that chain — it is a bridge within it. Individual AI sessions accumulate knowledge through human collaboration. That knowledge evaporates when the session ends. Collective is the place where it doesn't.

Think of it as a **library for AI** — a living, community-maintained repository where human and AI collaboration deposits knowledge, and where any AI can draw from it.

The brand motif reflects this: **nodes** represent knowledge created through human and AI collaboration; **edges** represent the transmission of that knowledge between AI systems. Collective is the graph.

## Audience

Collective is intentionally approachable. The target audience spans:
- Developers building agent workflows who want proven behavioral building blocks
- Non-technical users who have picked up AI tools and want to improve their agents without writing code

The interface should feel like a well-designed document, not a developer dashboard.

## Skill Format

Skills are Markdown files. Structure is encouraged but not enforced. The recommended format includes optional YAML frontmatter for discoverability:

```markdown
---
name: Frontend Design
description: Guides the agent toward better visual hierarchy, spacing, and component decisions
tags: [frontend, css, ui, design]
tested_on: [claude-sonnet-4-6, gpt-4o]
---

[Skill body — the actual prompt/behavioral instructions]
```

Frontmatter enables filtering, tagging, related skill discovery, and conflict detection. Skills without frontmatter are still valid and publishable.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js or React |
| Build tool | Vite |
| Package manager | pnpm |
| Backend | NestJS |
| Styling | SCSS |
| Component primitives | Radix UI |

## Roadmap

### Phase 1 — Web Application
- Browse and discover skills by domain and tags
- Skill detail page with copy/download
- Creator profiles
- Submit a skill
- Quality signals: ratings, usage count, verified/curated badges
- Related skills
- Collections / curated lists
- Community: discussion space, skill requests, skill-level discussion

### Phase 2 — MCP Server & Programmatic Installation
- MCP server as a two-way bridge: pull skills into any agent environment, push project showcases back out
- CLI and package-registry-style installation (npm-like)
- Project showcase with MCP-powered auto-drafting (AI reads your project and drafts the showcase post)
- Improvement suggestions (PR-like community edits to skills)
- Verified expert badges

## Design

The website should feel like a well-designed document — Google Docs meets a thoughtful whitepaper. Light themed throughout. Typography-first. Generous whitespace. Approachable enough that a non-technical user browsing for "something to make my AI better at writing emails" feels at home.

Design assets are maintained in `/design-reference` (provided by Figma). That folder is a reference for how the website should look and function — it is not a technical implementation guide.

See [`docs/design-brief.md`](docs/design-brief.md) for the full brief provided to Figma.

## Market Context

The current ecosystem for agent tools consists of:
- **MCP server directories** (Smithery, Glama, mcp.so) — free and open but focused on tool integrations, not behavioral skills; flat directories with no quality layer or creator monetization
- **OpenAI GPT Store** — paid (ChatGPT subscription), locked to ChatGPT, not usable in custom agent code
- **OpenClaw Marketplace** — paid, tied to the OpenClaw runtime
- **LangChain Hub** — prompt sharing but framework-specific and technically focused
- **PromptBase / FlowGPT** — prompt marketplaces but not framed around agent behavior or composability

**The free, open, community-curated, framework-agnostic, composable skill library niche is unoccupied.**

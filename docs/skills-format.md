# Skill Format

Skills are the core unit of Collective. This document defines what a skill is and how it should be structured.

---

## What is a Skill?

A skill is a portable unit of domain expertise encoded as a prompt. It is not code, not an API, and not a tool integration. It is accumulated human knowledge about how an AI should behave in a given domain.

Skills are placed into an agent's context (system prompt or equivalent) to improve its behavior in a specific area. Multiple skills can be stacked together.

---

## Format

Skills are **Markdown files**. Structure is optional but strongly encouraged for discoverability and platform features.

### Recommended Structure

```markdown
---
name: Frontend Design
description: Guides the agent toward better visual hierarchy, spacing, and component decisions
tags: [frontend, css, ui, design]
tested_on: [claude-sonnet-4-6, gpt-4o]
---

[Skill body — the actual behavioral instructions]
```

### Frontmatter Fields

| Field | Required | Description |
|---|---|---|
| `name` | Recommended | Human-readable skill name |
| `description` | Recommended | One-line summary of what the skill does |
| `tags` | Recommended | Domain and topic tags for discoverability |
| `tested_on` | Optional | AI models this skill has been validated against |

Skills without frontmatter are valid. The platform will surface structured skills more prominently as a natural quality signal.

---

## Composability

Skills are designed to be stacked. A user might combine a _Frontend Design_ skill with an _Accessibility_ skill for broader coverage.

### Conflict Risk

Stacking skills can produce contradictory instructions (e.g., "always use Tailwind" vs. "never use CSS frameworks"). This is the primary failure mode of composition.

Mitigation approaches:
- **User education** — document common conflicts
- **Community-reported conflicts** — flag known incompatibilities on skill pages
- **Auditing service** — planned feature that analyzes a stack of skills for semantic conflicts before applying them

### Related Skills

The skill detail page will surface related skills based on shared tags and semantic similarity. This helps users discover complementary skills and understand the broader knowledge graph around a domain.

---

## Quality Signals

The platform uses multiple signals to surface high-quality skills:

- **Usage count** — how many times the skill has been downloaded or copied
- **Community ratings** — explicit user ratings
- **Verified/curated badge** — editorially reviewed by the Collective team
- **Structured metadata** — skills with complete frontmatter rank higher in discovery

---

## Versioning

Models change. A skill tuned for one model may behave differently on another. Contributors are encouraged to:
- Populate the `tested_on` field accurately
- Update skills when model behavior changes
- Note major revisions in the skill body or via platform versioning (planned)

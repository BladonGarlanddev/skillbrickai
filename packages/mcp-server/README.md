# @skillbrickai/mcp-server

MCP (Model Context Protocol) server that lets AI agents search and download skills from SkillBrick AI without human intervention.

## Setup

```bash
cd packages/mcp-server
pnpm install
pnpm build
```

## Configuration

Set the API URL via environment variable:

```
SKILLBRICK_API_URL=https://api.skillbrick.ai
```

Defaults to `http://localhost:3000` for local development.

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "skillbrickai": {
      "command": "node",
      "args": ["path/to/packages/mcp-server/build/index.js"],
      "env": {
        "SKILLBRICK_API_URL": "https://api.skillbrick.ai"
      }
    }
  }
}
```

### Claude Code

Add to `.mcp.json` in the project root:

```json
{
  "mcpServers": {
    "skillbrickai": {
      "command": "node",
      "args": ["./packages/mcp-server/build/index.js"],
      "env": {
        "SKILLBRICK_API_URL": "https://api.skillbrick.ai"
      }
    }
  }
}
```

## Tools

### `search_skills`
Search the skill library with natural language queries. Auto-infers domain and technology from the query.

```
"find React hooks best practices"
"kubernetes deployment automation"
"help me write better Python"
```

### `get_skill`
Retrieve the full content/prompt of a specific skill by ID.

### `list_domains`
List all available skill domains with counts.

### `recommend_skills`
Describe a task and get intelligent skill recommendations. Runs multi-pass search across text, domain, and tags, then scores and ranks results by relevance.

```
"I need to build a REST API with authentication and deploy it to AWS"
```

## How the search works

1. **Intent parsing** — extracts domain and technology tags from natural language
2. **Domain inference** — maps casual terms ("backend", "k8s") to actual domain values
3. **Multi-pass search** — queries by text, inferred domain, and inferred tags in parallel
4. **Relevance scoring** — scores results by name/description/tag match + popularity signals
5. **Fallback broadening** — if filtered search returns nothing, retries without filters

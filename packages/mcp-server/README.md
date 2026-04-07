# @skillbrickai/mcp-server

MCP (Model Context Protocol) server for discovering and installing skills from the [SkillBrick AI](https://skillbrickai.com) platform. This lets AI agents like Claude search, browse, and install skills directly.

## Available Tools

| Tool | Description |
|------|-------------|
| `search_skills` | Search and browse skills by query, domain, tag, or sort order. Auto-infers domain and technology from natural language queries. |
| `get_skill` | Get full skill details including prompt content |
| `install_skill` | Install a skill (requires auth token) |
| `upload_skill` | Upload or update a skill (upsert, requires auth token) |
| `sync_skills` | Bulk-sync multiple skills in one call (requires auth token) |
| `my_skills` | List all skills owned by the authenticated user |
| `check_credits` | Check download credit balance |
| `list_collections` | Browse skill collections |
| `get_collection` | Get a collection with all its skills |
| `list_domains` | List available skill domains/categories |
| `recommend_skills` | Intelligent skill recommendations based on a task description |

## Setup

### Build

```bash
pnpm install
pnpm --filter @skillbrickai/mcp-server build
```

### Claude Desktop

Add to your Claude Desktop config file (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "skillbrickai": {
      "command": "node",
      "args": ["C:/Users/user/Documents/skillbrickai/packages/mcp-server/dist/index.js"],
      "env": {
        "SKILLBRICK_API_URL": "https://skillbrickai.com",
        "SKILLBRICK_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add skillbrick -- node C:/Users/user/Documents/skillbrickai/packages/mcp-server/dist/index.js
```

Or via npx (once published):

```bash
claude mcp add skillbrick -- npx @skillbrickai/mcp-server
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SKILLBRICK_API_URL` | Base URL for the SkillBrick API | `https://skillbrickai.com` |
| `SKILLBRICK_API_TOKEN` | API auth token (required for `install_skill`, `upload_skill`, `sync_skills`, `my_skills`, `check_credits`) | _(none)_ |

## How the search works

1. **Intent parsing** -- extracts domain and technology tags from natural language
2. **Domain inference** -- maps casual terms ("backend", "k8s") to actual domain values
3. **Multi-pass search** -- queries by text, inferred domain, and inferred tags in parallel
4. **Relevance scoring** -- scores results by name/description/tag match + popularity signals
5. **Fallback broadening** -- if filtered search returns nothing, retries without filters

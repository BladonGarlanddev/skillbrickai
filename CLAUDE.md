# SkillBrick AI - Claude Code Guidelines

## Alignment Check

Before executing any action that modifies state (editing files, running commands, deleting data, running migrations, modifying DB, etc.), ask yourself:

1. **Did the user explicitly ask me to do this?**
2. **Or is this a necessary intermediate step toward something they explicitly asked for?**

If the answer to both is **no**, STOP. Explain what you found and what you *could* do, then wait for instructions. Do not assume the user wants you to "fix" something just because you identified it.

This applies especially to:
- Deleting or modifying database records
- Removing files or directories
- Running destructive git operations
- Changing configuration that affects running services
- Any action beyond the scope of what was requested

**When you catch yourself about to act without authorization:** pause, state what you were about to do and why, and ask the user if they want you to proceed.

## MCP Setup Tool (`get_started`)

The `get_started` tool in `packages/mcp-server/src/server.ts` is the onboarding entry point for new SkillBrick AI users. It is the only tool visible before onboarding completes — all other MCP tools are gated behind it. When called, it delivers platform skills, credit system docs, contribution guidelines, multi-project management guidance, and behavioral rules. It also unlocks the full tool set. See the tool handler (around line 320) for the complete onboarding content.

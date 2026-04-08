import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Copy, Check, Search, Download, Code, Cpu, BookOpen, Users, Puzzle } from 'lucide-react';
import styles from './GuidePage.module.scss';

function CodeBlock({ lang, children }: { lang: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLang}>{lang}</span>
        <button className={styles.copyButton} onClick={copy}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className={styles.codeContent}><code>{children}</code></pre>
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className={styles.page}>
      <Helmet>
        <title>Getting Started Guide | SkillBrick AI</title>
        <meta name="description" content="Learn how to use SkillBrick AI in your projects. Browse and copy skills, integrate via REST API, or connect your AI agent with the MCP server." />
        <link rel="canonical" href="https://skillbrickai.com/guide" />
        <meta property="og:title" content="Getting Started Guide | SkillBrick AI" />
        <meta property="og:description" content="Learn how to use SkillBrick AI — browse skills, integrate via API, or connect your AI agent with the MCP server." />
        <meta property="og:url" content="https://skillbrickai.com/guide" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "Getting Started with SkillBrick AI",
            "description": "Learn how to use SkillBrick AI to discover, install, and integrate AI skills into your projects and AI agents.",
            "url": "https://skillbrickai.com/guide",
            "step": [
              { "@type": "HowToStep", "name": "Browse the Library", "text": "Explore skills across domains — from writing to code review to research synthesis.", "url": "https://skillbrickai.com/browse" },
              { "@type": "HowToStep", "name": "Copy the Prompt", "text": "Each skill is a carefully crafted prompt. Copy it with a single click." },
              { "@type": "HowToStep", "name": "Use in Your AI Agent", "text": "Paste as a system prompt in Claude, ChatGPT, Gemini, or any LLM. Or use the MCP server for automatic integration." }
            ],
            "isPartOf": { "@type": "WebSite", "name": "SkillBrick AI", "url": "https://skillbrickai.com/" }
          })}
        </script>
      </Helmet>

      <div className={styles.header}>
        <h1 className={styles.title}>Using SkillBrick AI in Your Projects</h1>
        <p className={styles.subtitle}>
          SkillBrick AI is a community library of reusable AI skills. Here's how to find, install, and integrate skills into your workflow.
        </p>
      </div>

      {/* Table of Contents */}
      <nav className={styles.toc}>
        <div className={styles.tocLabel}>In this guide</div>
        <ul className={styles.tocList}>
          <li><a href="#what-is-a-skill" className={styles.tocLink}>What is a Skill?</a></li>
          <li><a href="#browse-and-copy" className={styles.tocLink}>Browse & Copy Skills</a></li>
          <li><a href="#mcp-server" className={styles.tocLink}>MCP Server for AI Agents</a></li>
          <li><a href="#rest-api" className={styles.tocLink}>REST API Integration</a></li>
          <li><a href="#contributing" className={styles.tocLink}>Contributing Skills</a></li>
          <li><a href="#use-cases" className={styles.tocLink}>Example Use Cases</a></li>
        </ul>
      </nav>

      {/* What is a Skill */}
      <section id="what-is-a-skill" className={styles.section}>
        <h2 className={styles.sectionTitle}>What is a Skill?</h2>
        <p className={styles.content}>
          A <strong>skill</strong> is a reusable system prompt or instruction set that gives an AI agent specialized capabilities. Instead of writing prompts from scratch every time, you can install a community-tested skill and immediately get expert-level behavior from your AI.
        </p>
        <p className={styles.content}>
          Skills cover domains like coding, writing, research, education, productivity, and more. Each skill includes the full prompt text, metadata about which models it's been tested on, community ratings, and tags to help you find the right one.
        </p>

        <div className={styles.cards}>
          <div className={styles.card}>
            <h4><span className={styles.cardIcon}><Code size={16} /></span> Coding</h4>
            <p>Code review, debugging, SQL optimization, security auditing, architecture guidance</p>
          </div>
          <div className={styles.card}>
            <h4><span className={styles.cardIcon}><BookOpen size={16} /></span> Writing</h4>
            <p>Technical docs, email composition, academic writing, content strategy</p>
          </div>
          <div className={styles.card}>
            <h4><span className={styles.cardIcon}><Search size={16} /></span> Research</h4>
            <p>Deep research, paper synthesis, data analysis, fact-checking</p>
          </div>
          <div className={styles.card}>
            <h4><span className={styles.cardIcon}><Users size={16} /></span> Education</h4>
            <p>Socratic tutoring, math coaching, language learning, debate practice</p>
          </div>
          <div className={styles.card}>
            <h4><span className={styles.cardIcon}><Puzzle size={16} /></span> Productivity</h4>
            <p>GTD workflows, meeting summaries, task management, interview prep</p>
          </div>
          <div className={styles.card}>
            <h4><span className={styles.cardIcon}><Cpu size={16} /></span> Creative</h4>
            <p>Creative writing, songwriting, image prompts, storytelling, game mastering</p>
          </div>
        </div>
      </section>

      {/* Browse & Copy */}
      <section id="browse-and-copy" className={styles.section}>
        <h2 className={styles.sectionTitle}>Browse & Copy Skills</h2>
        <p className={styles.sectionIntro}>
          The simplest way to use SkillBrick AI — find a skill, copy its prompt, and paste it into your AI tool of choice.
        </p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4>Find a skill</h4>
              <p>
                Go to the <Link to="/browse" className={styles.link}>Browse page</Link> and search by keyword, filter by domain, or sort by popularity. Every skill shows which AI models it's been tested on.
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4>Read the full prompt</h4>
              <p>Click into any skill to see its complete prompt text, author, tags, and install count. Review the prompt to make sure it fits your needs.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4>Copy and use</h4>
              <p>
                Copy the skill's prompt content and paste it as a <strong>system prompt</strong> in your AI tool. Works with Claude, ChatGPT, Gemini, or any LLM that accepts system instructions.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.infoBox}>
          <strong>Where to paste a skill prompt:</strong>
          <br />
          <strong>Claude</strong> — Project Knowledge or system prompt in the API<br />
          <strong>ChatGPT</strong> — Custom Instructions or GPT Builder<br />
          <strong>API calls</strong> — The <code className={styles.inlineCode}>system</code> field in your messages array<br />
          <strong>Claude Code</strong> — Add to your <code className={styles.inlineCode}>CLAUDE.md</code> file or use the MCP server
        </div>
      </section>

      {/* MCP Server */}
      <section id="mcp-server" className={styles.section}>
        <h2 className={styles.sectionTitle}>MCP Server for AI Agents</h2>
        <p className={styles.sectionIntro}>
          The SkillBrick MCP server lets AI agents discover and install skills directly, without any manual copy-pasting. Your agent gets tools to search, browse, and fetch skill content on demand.
        </p>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>What is MCP?</h3>
          <p className={styles.content}>
            <strong>Model Context Protocol (MCP)</strong> is an open standard that lets AI assistants connect to external tools and data sources. When you add the SkillBrick MCP server, your AI agent can query the skill library as part of its workflow — searching for relevant skills, reading their contents, and using them in context.
          </p>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Setup with Claude Desktop</h3>
          <p className={styles.content}>
            Add this to your Claude Desktop config file (<code className={styles.inlineCode}>claude_desktop_config.json</code>):
          </p>
          <CodeBlock lang="json">{`{
  "mcpServers": {
    "skillbrick": {
      "command": "npx",
      "args": ["@skillbrickai/mcp-server"],
      "env": {
        "SKILLBRICK_API_URL": "https://skillbrickai.com",
        "SKILLBRICK_API_TOKEN": "your-token-here"
      }
    }
  }
}`}</CodeBlock>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Setup with Claude Code</h3>
          <CodeBlock lang="bash">{`claude mcp add skillbrick -- npx @skillbrickai/mcp-server`}</CodeBlock>
          <p className={styles.content}>
            Set environment variables for the API URL and auth token:
          </p>
          <CodeBlock lang="bash">{`export SKILLBRICK_API_URL="https://skillbrickai.com"
export SKILLBRICK_API_TOKEN="your-token-here"`}</CodeBlock>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Available Tools</h3>
          <div className={styles.toolList}>
            <div className={styles.tool}>
              <span className={styles.toolName}>search_skills</span>
              <span className={styles.toolDesc}>Search by keyword, domain, or tag with natural language queries.</span>
            </div>
            <div className={styles.tool}>
              <span className={styles.toolName}>recommend_skills</span>
              <span className={styles.toolDesc}>Describe a task and get ranked skill recommendations.</span>
            </div>
            <div className={styles.tool}>
              <span className={styles.toolName}>get_skill</span>
              <span className={styles.toolDesc}>Fetch the full prompt content of a skill by ID.</span>
            </div>
            <div className={styles.tool}>
              <span className={styles.toolName}>install_skill</span>
              <span className={styles.toolDesc}>Install a skill (costs 1 token, requires auth). Returns the prompt content.</span>
            </div>
            <div className={styles.tool}>
              <span className={styles.toolName}>upload_skill</span>
              <span className={styles.toolDesc}>Create or update a skill on the platform (requires auth).</span>
            </div>
            <div className={styles.tool}>
              <span className={styles.toolName}>sync_skills</span>
              <span className={styles.toolDesc}>Bulk upload or update multiple skills at once (requires auth).</span>
            </div>
            <div className={styles.tool}>
              <span className={styles.toolName}>my_skills</span>
              <span className={styles.toolDesc}>List your uploaded skills with version and hash info.</span>
            </div>
            <div className={styles.tool}>
              <span className={styles.toolName}>check_credits</span>
              <span className={styles.toolDesc}>Check your download credit balance.</span>
            </div>
            <div className={styles.tool}>
              <span className={styles.toolName}>list_collections</span>
              <span className={styles.toolDesc}>Browse curated skill collections.</span>
            </div>
            <div className={styles.tool}>
              <span className={styles.toolName}>get_collection</span>
              <span className={styles.toolDesc}>Get a collection with all its skills.</span>
            </div>
            <div className={styles.tool}>
              <span className={styles.toolName}>list_domains</span>
              <span className={styles.toolDesc}>List all available skill categories.</span>
            </div>
          </div>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Recommended: Background Setup Agent</h3>
          <p className={styles.content}>
            For the best experience, have your agent run a <strong>background subagent</strong> when it first connects to SkillBrick AI. This handles initial configuration without blocking your conversation:
          </p>
          <CodeBlock lang="text">{`Suggested subagent prompt:

"Configure SkillBrick AI for this session. Run these steps in the background:

 1. Fetch the 'SkillBrick AI Agent' skill and apply its instructions.
    This teaches you how to use the platform effectively.

 2. Fetch the 'Skill Creator' skill and keep it available in case
    the user wants to create or publish new skills.

 3. Run list_domains to discover available skill categories.

 4. Run check_credits to see the current token balance.

 5. Report back: available domains, credit balance, and confirmation
    that the platform skills are loaded."

This runs as a background task — you can keep working while
the agent sets itself up with SkillBrick AI capabilities.`}</CodeBlock>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Example Agent Conversation</h3>
          <p className={styles.content}>
            Once connected, your agent can use skills naturally in conversation:
          </p>
          <CodeBlock lang="text">{`You: "I need to review this SQL query for performance issues"

Agent: Let me search for a relevant skill.
       [calls search_skills with query="SQL optimization"]
       Found "SQL Expert Assistant" — let me fetch it.
       [calls get_skill with skillId="clx..."]

       Using the SQL Expert skill, here's my review:
       ...`}</CodeBlock>
        </div>
      </section>

      {/* REST API */}
      <section id="rest-api" className={styles.section}>
        <h2 className={styles.sectionTitle}>REST API Integration</h2>
        <p className={styles.sectionIntro}>
          Build SkillBrick AI into your own applications with the REST API. Fetch skills programmatically, search the library, or build custom integrations.
        </p>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Base URL</h3>
          <CodeBlock lang="text">{`https://skillbrickai.com/api`}</CodeBlock>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Authentication</h3>
          <p className={styles.content}>
            Public endpoints (browsing, searching) require no auth. Creating skills and installing them requires a Bearer token from <code className={styles.inlineCode}>POST /auth/login</code> or <code className={styles.inlineCode}>POST /auth/register</code>.
          </p>
          <CodeBlock lang="bash">{`# Register and get a token
curl -X POST https://skillbrickai.com/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email": "you@example.com", "username": "yourname", "password": "yourpassword"}'

# Response: { "accessToken": "eyJ...", "user": { ... } }`}</CodeBlock>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Search Skills</h3>
          <CodeBlock lang="bash">{`# Search by keyword
curl "https://skillbrickai.com/skills?search=code+review"

# Filter by domain
curl "https://skillbrickai.com/skills?domain=coding&sortBy=popular"

# Filter by tag
curl "https://skillbrickai.com/skills?tag=security&limit=5"`}</CodeBlock>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Get a Skill</h3>
          <CodeBlock lang="bash">{`# Get full skill details including prompt content
curl "https://skillbrickai.com/skills/SKILL_ID"

# Response includes: name, slug, description, content (the prompt),
# contentHash, version, domain, author, tags, testedOn, installCount`}</CodeBlock>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Install a Skill</h3>
          <CodeBlock lang="bash">{`# Install a skill (costs 1 token, requires auth)
curl -X POST "https://skillbrickai.com/skills/SKILL_ID/install" \\
  -H "Authorization: Bearer YOUR_TOKEN"

# Response: { "message": "Skill installed successfully", "content": "You are a..." }`}</CodeBlock>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Upsert a Skill</h3>
          <p className={styles.content}>
            Create or update a skill by name. If the content hasn't changed (compared by hash), the update is skipped. Content changes auto-increment the version.
          </p>
          <CodeBlock lang="bash">{`curl -X PUT "https://skillbrickai.com/skills/upsert" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My Skill", "description": "...", "content": "...", "domain": "coding"}'

# Response: { "action": "created", "version": 1, "skill": { ... } }
# On re-run with same content: { "action": "unchanged", "version": 1, ... }
# On re-run with new content: { "action": "updated", "version": 2, ... }`}</CodeBlock>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Bulk Sync Skills</h3>
          <p className={styles.content}>
            Sync multiple skills at once. Each skill is created, updated, or skipped based on its content hash.
          </p>
          <CodeBlock lang="bash">{`curl -X PUT "https://skillbrickai.com/skills/bulk-sync" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"skills": [{"name": "Skill A", "description": "...", "content": "...", "domain": "coding"}, {"name": "Skill B", "description": "...", "content": "...", "domain": "writing"}]}'

# Response: { "summary": { "created": 1, "updated": 0, "unchanged": 1, "total": 2 } }`}</CodeBlock>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Use in JavaScript/TypeScript</h3>
          <CodeBlock lang="typescript">{`// Fetch a skill and use it as a system prompt
const res = await fetch('https://skillbrickai.com/skills/SKILL_ID');
const skill = await res.json();

// Use with Anthropic SDK
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic();

const message = await client.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  system: skill.content,
  messages: [{ role: 'user', content: 'Review this code...' }],
});`}</CodeBlock>
        </div>

        <div className={styles.subsection}>
          <h3 className={styles.subsectionTitle}>Use in Python</h3>
          <CodeBlock lang="python">{`import requests
import anthropic

# Fetch a skill
skill = requests.get('https://skillbrickai.com/skills/SKILL_ID').json()

# Use with Anthropic SDK
client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    system=skill["content"],
    messages=[{"role": "user", "content": "Review this code..."}],
)`}</CodeBlock>
        </div>

        <p className={styles.content}>
          For the full API reference with all endpoints, request schemas, and response examples, see the <Link to="/docs" className={styles.link}>API Documentation</Link>.
        </p>
      </section>

      {/* Contributing */}
      <section id="contributing" className={styles.section}>
        <h2 className={styles.sectionTitle}>Contributing Skills</h2>
        <p className={styles.sectionIntro}>
          SkillBrick AI is community-powered. Share your best prompts and help others build better AI workflows.
        </p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4>Create an account</h4>
              <p><Link to="/auth" className={styles.link}>Register</Link> to get started. New accounts receive 30 tokens and an Early Adopter badge.</p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4>Write your skill</h4>
              <p>
                Go to the <Link to="/submit" className={styles.link}>Contribute page</Link>. Give your skill a name, description, and the full prompt content. Choose a domain, add tags, and note which AI models you've tested it on.
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4>Earn tokens and badges</h4>
              <p>You earn <strong>10 tokens</strong> for each skill you publish. Your first skill earns you the Contributor badge. As your skills get upvoted, your community score grows.</p>
            </div>
          </div>
        </div>

        <div className={styles.infoBox}>
          <strong>Tips for great skills:</strong><br />
          Write clear, specific system prompts — not vague instructions. Include the role, guidelines, output format, and constraints. Test on at least 2 different AI models before publishing. Look at popular skills on the <Link to="/browse" className={styles.link}>Browse page</Link> for inspiration.
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className={styles.section}>
        <h2 className={styles.sectionTitle}>Example Use Cases</h2>

        <div className={styles.cards}>
          <div className={styles.card}>
            <h4><Download size={16} /> Team Skill Library</h4>
            <p>Curate a collection of skills for your engineering team. Everyone uses the same code review, documentation, and testing prompts for consistency.</p>
          </div>
          <div className={styles.card}>
            <h4><Cpu size={16} /> Agent Pipelines</h4>
            <p>Build multi-step agent workflows that pull different skills at each stage — research, then analysis, then writing — all from the SkillBrick library.</p>
          </div>
          <div className={styles.card}>
            <h4><Code size={16} /> IDE Integration</h4>
            <p>Use the MCP server with Claude Code to give your coding assistant access to specialized skills like SQL optimization or security review on demand.</p>
          </div>
          <div className={styles.card}>
            <h4><BookOpen size={16} /> Learning & Education</h4>
            <p>Set up Socratic tutoring, math coaching, or language learning skills for students. Each skill provides a tested, structured teaching approach.</p>
          </div>
          <div className={styles.card}>
            <h4><Puzzle size={16} /> Custom GPTs & Assistants</h4>
            <p>Use skill prompts as the foundation for custom ChatGPT GPTs, Claude Projects, or any AI assistant builder. Start from community-tested prompts.</p>
          </div>
          <div className={styles.card}>
            <h4><Users size={16} /> Open Source Projects</h4>
            <p>Include a SkillBrick skill in your project's CLAUDE.md or .cursorrules file to give contributors' AI assistants domain-specific knowledge.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

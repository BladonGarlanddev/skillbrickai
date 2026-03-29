import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.showcaseSkill.deleteMany();
  await prisma.showcase.deleteMany();
  await prisma.skillRequestReply.deleteMany();
  await prisma.skillRequest.deleteMany();
  await prisma.post.deleteMany();
  await prisma.collectionSkill.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.improvementSuggestion.deleteMany();
  await prisma.upvote.deleteMany();
  await prisma.tokenTransaction.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.skillTestedOn.deleteMany();
  await prisma.skillTag.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 12);

  // Create users
  const sarah = await prisma.user.create({
    data: {
      email: 'sarah@example.com',
      username: 'sarahchen',
      passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      bio: 'Product designer focused on AI tooling and design systems. Building bridges between human intent and machine understanding.',
      communityScore: 1240,
      tokenBalance: 42,
      isEarlyAdopter: true,
    },
  });

  const marcus = await prisma.user.create({
    data: {
      email: 'marcus@example.com',
      username: 'marcusrivera',
      passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      bio: 'Technical writer and documentation specialist. Teaching AI to write like humans do.',
      communityScore: 856,
      tokenBalance: 25,
      isEarlyAdopter: true,
    },
  });

  const aisha = await prisma.user.create({
    data: {
      email: 'aisha@example.com',
      username: 'aishapatel',
      passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      bio: 'Research scientist with a focus on information synthesis and knowledge graphs.',
      communityScore: 1890,
      tokenBalance: 55,
      isEarlyAdopter: true,
    },
  });

  const james = await prisma.user.create({
    data: {
      email: 'james@example.com',
      username: 'jamesliu',
      passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      bio: 'Senior engineer passionate about code quality and developer experience.',
      communityScore: 2341,
      tokenBalance: 18,
      isEarlyAdopter: true,
    },
  });

  const elena = await prisma.user.create({
    data: {
      email: 'elena@example.com',
      username: 'elenarodriguez',
      passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
      bio: 'Legal operations specialist',
      communityScore: 432,
      tokenBalance: 20,
      isEarlyAdopter: true,
    },
  });

  const priya = await prisma.user.create({
    data: {
      email: 'priya@example.com',
      username: 'priyasharma',
      passwordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      bio: 'Database architect',
      communityScore: 1567,
      tokenBalance: 35,
      isEarlyAdopter: false,
    },
  });

  // Create badges
  await prisma.badge.createMany({
    data: [
      { userId: sarah.id, type: 'EARLY_ADOPTER' },
      { userId: sarah.id, type: 'CONTRIBUTOR' },
      { userId: sarah.id, type: 'CURATOR' },
      { userId: sarah.id, type: 'MR_POPULAR' },
      { userId: marcus.id, type: 'EARLY_ADOPTER' },
      { userId: marcus.id, type: 'CONTRIBUTOR' },
      { userId: aisha.id, type: 'EARLY_ADOPTER' },
      { userId: aisha.id, type: 'CONTRIBUTOR' },
      { userId: james.id, type: 'EARLY_ADOPTER' },
      { userId: james.id, type: 'CONTRIBUTOR' },
      { userId: james.id, type: 'HELPER' },
      { userId: james.id, type: 'VERIFIED_EXPERT' },
      { userId: elena.id, type: 'EARLY_ADOPTER' },
      { userId: priya.id, type: 'CONTRIBUTOR' },
      { userId: priya.id, type: 'HELPER' },
      { userId: priya.id, type: 'VERIFIED_EXPERT' },
    ],
  });

  // Create skills
  const skill1 = await prisma.skill.create({
    data: {
      name: 'Empathetic Email Composition',
      description: 'Write professional emails that balance clarity with warmth, suitable for sensitive workplace conversations.',
      content: `You are helping compose professional emails that require both clarity and emotional intelligence.

## Core Principles

1. **Lead with empathy**: Acknowledge the recipient's perspective or situation before making requests
2. **Be specific and concrete**: Avoid vague language; state exactly what you need or are offering
3. **Provide context**: Explain the "why" behind requests to help recipients prioritize
4. **Offer optionality**: When asking for something, acknowledge constraints and offer alternatives
5. **Close with appreciation**: Thank recipients for their time and consideration

## Tone Guidelines

- Use "I" statements when discussing impacts or needs
- Avoid passive voice in critical information
- Keep sentences under 20 words when possible
- Use paragraph breaks generously—aim for 2-3 sentences per paragraph
- Default to warmth, but respect formal contexts when appropriate

## Structure Template

**Opening**: Brief greeting + immediate context or acknowledgment
**Body**: The request, update, or information—broken into digestible pieces
**Closing**: Clear next steps + appreciation

## Red Flags to Avoid

- Don't apologize excessively (once is enough)
- Avoid hedging language like "just wondering" or "if you get a chance"
- Never use all caps or excessive exclamation marks
- Don't introduce new topics in the closing

When composing, always ask yourself: "What does this person need to know, and what would make them feel respected in receiving it?"`,
      domain: 'Writing',
      authorId: marcus.id,
      installCount: 3420,
      createdAt: new Date('2026-02-14'),
      tags: { create: [{ tag: 'writing' }, { tag: 'communication' }, { tag: 'workplace' }] },
      testedOn: { create: [{ model: 'Claude 3.5 Sonnet' }, { model: 'GPT-4' }, { model: 'Gemini Pro' }] },
    },
  });

  const skill2 = await prisma.skill.create({
    data: {
      name: 'API Documentation Reviewer',
      description: 'Review API documentation for completeness, clarity, and developer experience.',
      content: `You are reviewing API documentation with the goal of ensuring it is complete, clear, and developer-friendly.

## Review Checklist

### Completeness
- [ ] All endpoints are documented
- [ ] Request parameters include type, requirement status, and defaults
- [ ] Response schemas are complete with example values
- [ ] Error responses are documented with codes and meanings
- [ ] Authentication requirements are clearly stated
- [ ] Rate limits and quotas are specified

### Clarity
- [ ] Examples use realistic, production-like data (not foo/bar)
- [ ] Code samples are syntax-highlighted and copy-pasteable
- [ ] Complex concepts have accompanying diagrams or analogies
- [ ] Jargon is either avoided or immediately defined

### Developer Experience
- [ ] Quick start guide exists and takes < 5 minutes
- [ ] Common use cases are documented as tutorials
- [ ] Error messages link back to relevant documentation
- [ ] Changelog exists and uses semantic versioning

## Review Structure

For each endpoint or section reviewed, provide:

1. **Summary**: One-line assessment (Complete | Needs Work | Missing)
2. **Strengths**: What's done well
3. **Issues**: Specific gaps or unclear sections
4. **Recommendations**: Concrete improvements with examples`,
      domain: 'API Documentation',
      authorId: james.id,
      installCount: 2187,
      createdAt: new Date('2026-02-20'),
      tags: { create: [{ tag: 'documentation' }, { tag: 'api' }, { tag: 'code review' }] },
      testedOn: { create: [{ model: 'Claude 3.5 Sonnet' }, { model: 'GPT-4o' }] },
    },
  });

  const skill3 = await prisma.skill.create({
    data: {
      name: 'Research Paper Synthesizer',
      description: 'Distill academic papers into clear summaries highlighting methodology, findings, and implications.',
      content: `You are synthesizing academic research papers into accessible summaries for non-specialist readers.

## Synthesis Framework

### 1. Core Question
Start by identifying: What problem is this paper trying to solve?

### 2. Methodology (3-4 sentences)
- What did they do?
- What data or materials did they use?
- What was the sample size or scope?

### 3. Key Findings (bullet points)
List the 3-5 most important discoveries or conclusions. Use plain language.

### 4. Implications
Answer: "So what?" Why does this matter to the field or to practitioners?

### 5. Limitations
What are the acknowledged constraints or gaps in the research?

## Language Guidelines

- Replace jargon with everyday equivalents, or define it on first use
- Use active voice ("The researchers found" not "It was found")
- When citing statistics, provide context (e.g., "25% higher, compared to...")

A good synthesis allows a smart generalist to understand what was done and why, evaluate whether the conclusions are justified, and decide whether to read the full paper.`,
      domain: 'Research',
      authorId: aisha.id,
      installCount: 4521,
      createdAt: new Date('2026-01-28'),
      tags: { create: [{ tag: 'research' }, { tag: 'academia' }, { tag: 'synthesis' }] },
      testedOn: { create: [{ model: 'Claude 3.5 Sonnet' }, { model: 'GPT-4' }, { model: 'Claude 3 Opus' }] },
    },
  });

  const skill4 = await prisma.skill.create({
    data: {
      name: 'React Component Code Reviewer',
      description: 'Review React components for best practices, accessibility, performance, and maintainability.',
      content: `You are reviewing React components with a focus on code quality, accessibility, and maintainability.

## Review Categories

### 1. Component Design
- Is the component doing one thing well?
- Are props well-typed and documented?
- Is the API intuitive?

### 2. Performance
- Are there unnecessary re-renders?
- Should any values be memoized?
- Are lists using stable keys?

### 3. Accessibility
- Is semantic HTML used appropriately?
- Are ARIA attributes necessary and correct?
- Is keyboard navigation supported?

### 4. Code Quality
- Are hooks used correctly?
- Is state colocated with usage?
- Are effects minimal and well-justified?

## Review Format

**Quick Assessment**: Production Ready | Minor Issues | Needs Work | Refactor Recommended
**Strengths** (2-3 bullet points)
**Issues** (organized by severity: Critical, Important, Minor)
**Recommended Changes** (code examples when helpful)`,
      domain: 'Code Review',
      authorId: james.id,
      installCount: 5632,
      createdAt: new Date('2026-02-10'),
      tags: { create: [{ tag: 'react' }, { tag: 'code review' }, { tag: 'javascript' }] },
      testedOn: { create: [{ model: 'Claude 3.5 Sonnet' }, { model: 'GPT-4o' }] },
    },
  });

  const skill5 = await prisma.skill.create({
    data: {
      name: 'Data Storyteller',
      description: 'Transform datasets and analyses into compelling narratives that drive decision-making.',
      content: `You are translating data analysis into clear, compelling stories that drive action.

## Storytelling Framework

### 1. The Hook (1-2 sentences)
Lead with the most surprising or important finding.

### 2. Context (1 paragraph)
What question were you trying to answer? Why does it matter?

### 3. The Findings (narrative + visuals)
Walk through the insights in a logical sequence. Each finding should have a clear headline supported by specific numbers.

### 4. The "So What" (implications)
Translate findings into business impact.

### 5. Recommended Actions
Provide 3-5 specific, concrete next steps prioritized by impact and effort.

## Data Communication Principles

- Show, don't just tell: Use visuals to make patterns obvious
- Compare to context: Always provide a baseline or benchmark
- Acknowledge uncertainty: Note confidence intervals, sample sizes, or limitations
- Use precise language: "Increased by 23%" not "went up a lot"`,
      domain: 'Data Analysis',
      authorId: aisha.id,
      installCount: 2893,
      createdAt: new Date('2026-02-05'),
      tags: { create: [{ tag: 'data analysis' }, { tag: 'storytelling' }, { tag: 'business' }] },
      testedOn: { create: [{ model: 'Claude 3.5 Sonnet' }, { model: 'GPT-4' }] },
    },
  });

  const skill6 = await prisma.skill.create({
    data: {
      name: 'Design System Auditor',
      description: 'Audit design systems for consistency, completeness, and usability across components and documentation.',
      content: `You are auditing a design system to ensure it is consistent, complete, and usable by product teams.

## Audit Framework

### 1. Foundation Audit
**Colors** - Named semantically, meet WCAG AA contrast, dark mode variants
**Typography** - Logical scale, line heights specified, responsive behavior
**Spacing** - Consistent ratio, semantic names
**Iconography** - Consistent stroke width, clear naming, accessibility labels

### 2. Component Audit
For each component, verify: all variants documented, props/API explained, accessibility features noted, code examples provided, do's and don'ts illustrated.

### 3. Consistency Check
Naming conventions uniform, spacing consistent, border radius consistent, shadow usage systematic, animation durations follow a scale.

## Audit Report Format

**Executive Summary** - Maturity level, top 3 strengths, top 3 gaps
**Detailed Findings** - Critical issues, improvements, nice-to-haves
**Recommendations** - Prioritized by impact and effort`,
      domain: 'Frontend Design',
      authorId: sarah.id,
      installCount: 3156,
      createdAt: new Date('2026-01-18'),
      tags: { create: [{ tag: 'design systems' }, { tag: 'frontend' }, { tag: 'design' }] },
      testedOn: { create: [{ model: 'Claude 3.5 Sonnet' }, { model: 'GPT-4o' }] },
    },
  });

  const skill7 = await prisma.skill.create({
    data: {
      name: 'Content Strategy Framework',
      description: 'Develop content strategies that align with business goals and user needs.',
      content: `You are developing content strategies that connect business objectives with user needs.

## Strategy Framework

### 1. Discovery Phase
Business context, audience research, competitive landscape.

### 2. Content Audit
Evaluate existing content for performance, accuracy, gaps, and redundancy.

### 3. Strategic Pillars
Define 3-5 core themes that align with business objectives, address user needs, differentiate from competitors, and are sustainable long-term.

### 4. Content Types & Formats
Map content types to audience needs, journey stage, distribution channels, and resource constraints.

### 5. Governance & Operations
Editorial calendar, creation workflow, quality standards, measurement process.

Great content strategy starts with user needs, is opinionated but flexible, can be explained in 2 minutes, and includes a measurement plan from day one.`,
      domain: 'Content Strategy',
      authorId: marcus.id,
      installCount: 1876,
      createdAt: new Date('2026-02-22'),
      tags: { create: [{ tag: 'content strategy' }, { tag: 'marketing' }, { tag: 'planning' }] },
      testedOn: { create: [{ model: 'Claude 3.5 Sonnet' }, { model: 'GPT-4' }] },
    },
  });

  const skill8 = await prisma.skill.create({
    data: {
      name: 'User Interview Synthesizer',
      description: 'Synthesize user interviews into actionable insights and opportunity areas.',
      content: `You are synthesizing user research interviews into clear insights that drive product decisions.

## Synthesis Process

### 1. Initial Coding
Tag: pain points, workarounds, moments of delight, unmet needs, behavioral patterns, surprising statements.

### 2. Pattern Recognition
Group related codes into themes. Look for frequency, strong emotion, similar descriptions, contradictions to assumptions.

### 3. Insight Formation
[User Segment] + [Behavior/Need] + [Context] + [Why It Matters]

### 4. Opportunity Framing
Current State → Pain Points → Desired Outcome → Opportunity

## Output Format

**Executive Summary** - Participants, key themes, top 3 insights, recommended focus areas
**Detailed Insights** - Theme, supporting evidence (quotes), affected segments, business impact
**Opportunity Areas** - Ranked by impact, frequency, strategic alignment`,
      domain: 'UX Research',
      authorId: sarah.id,
      installCount: 2634,
      createdAt: new Date('2026-01-30'),
      tags: { create: [{ tag: 'user research' }, { tag: 'UX' }, { tag: 'synthesis' }] },
      testedOn: { create: [{ model: 'Claude 3.5 Sonnet' }, { model: 'GPT-4' }] },
    },
  });

  const skill9 = await prisma.skill.create({
    data: {
      name: 'Accessibility Audit Checklist',
      description: 'Comprehensive accessibility review covering WCAG guidelines and inclusive design principles.',
      content: `You are auditing a digital product for accessibility, covering WCAG 2.1 Level AA compliance.

## Audit Categories

### Perceivable
Color & contrast (4.5:1 minimum), alt text, captions, heading hierarchy.

### Operable
Keyboard navigation, focus order, skip links, time limits, motion preferences.

### Understandable
Language identification, consistent navigation, clear labels, helpful error messages.

### Robust
Valid HTML, correct ARIA usage, no duplicate IDs.

## Testing Approach
1. Automated Testing (axe DevTools)
2. Keyboard Testing (no mouse)
3. Screen Reader Testing (NVDA/JAWS/VoiceOver)
4. Zoom Testing (200% and 400%)

## Severity: Blocker → High → Medium → Low

Remember: Accessibility is not a checklist—it's about ensuring all users can successfully accomplish their goals.`,
      domain: 'Frontend Design',
      authorId: sarah.id,
      installCount: 4102,
      createdAt: new Date('2026-02-01'),
      tags: { create: [{ tag: 'accessibility' }, { tag: 'a11y' }, { tag: 'WCAG' }, { tag: 'design' }] },
      testedOn: { create: [{ model: 'Claude 3.5 Sonnet' }, { model: 'GPT-4o' }] },
    },
  });

  // Create upvotes (rough counts matching design ref)
  // We'll just create the counts as installCount/upvotes are tracked on the skill

  // Create collections
  const col1 = await prisma.collection.create({
    data: {
      name: 'Frontend Developer Essential Pack',
      description: 'Must-have skills for modern frontend development - from code review to design systems to accessibility.',
      authorId: sarah.id,
      createdAt: new Date('2026-02-15'),
      skills: {
        create: [
          { skillId: skill4.id },
          { skillId: skill6.id },
          { skillId: skill9.id },
        ],
      },
    },
  });

  const col2 = await prisma.collection.create({
    data: {
      name: 'Content Creation Toolkit',
      description: 'Everything you need for writing, editing, and publishing great content.',
      authorId: marcus.id,
      createdAt: new Date('2026-02-20'),
      skills: {
        create: [
          { skillId: skill1.id },
          { skillId: skill7.id },
        ],
      },
    },
  });

  // Create discussion posts
  await prisma.post.create({
    data: {
      title: 'How do you handle context window limits when using large skills?',
      body: "I've been using some of the longer research and documentation skills, and I'm hitting context limits on GPT-4. Has anyone found good strategies for breaking these down or working around the limitation?",
      authorId: marcus.id,
      category: 'HELP',
      createdAt: new Date('2026-03-12'),
      replies: {
        create: [
          {
            body: "I usually extract just the core principles section and use that for shorter tasks. The full skill is great for complex work, but for quick iterations I've found trimming it helps.",
            authorId: sarah.id,
            category: 'HELP',
            createdAt: new Date('2026-03-13'),
          },
        ],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: 'Feature idea: Skill versioning',
      body: "Would be great to have versioning on skills so we can track improvements and potentially roll back if a change doesn't work well. Similar to how packages work in npm.",
      authorId: james.id,
      category: 'IDEAS',
      createdAt: new Date('2026-03-11'),
    },
  });

  // Create skill requests
  await prisma.skillRequest.create({
    data: {
      title: 'Legal Document Reviewer',
      description: 'Need a skill for reviewing contracts and legal documents for common issues, plain language violations, and missing standard clauses.',
      authorId: elena.id,
      status: 'OPEN',
      createdAt: new Date('2026-03-10'),
      replies: {
        create: [
          {
            body: "This sounds like it would need domain expertise. Have you looked at the API Documentation Reviewer? Some of the patterns might translate.",
            authorId: sarah.id,
            createdAt: new Date('2026-03-13'),
          },
        ],
      },
    },
  });

  await prisma.skillRequest.create({
    data: {
      title: 'SQL Query Optimizer',
      description: 'A skill that reviews SQL queries for performance issues, suggests indexes, and identifies N+1 problems.',
      authorId: james.id,
      status: 'FULFILLED',
      createdAt: new Date('2026-03-08'),
      replies: {
        create: [
          {
            body: 'I just published one! Check it out:',
            authorId: priya.id,
            skillId: skill4.id,
            createdAt: new Date('2026-03-12'),
          },
        ],
      },
    },
  });

  // Create showcases
  await prisma.showcase.create({
    data: {
      title: 'Built an AI-powered documentation generator',
      description: 'Used the API Documentation Reviewer and Research Paper Synthesizer skills to build a tool that generates comprehensive API docs from code comments.',
      authorId: sarah.id,
      createdAt: new Date('2026-03-09'),
      skills: {
        create: [
          { skillId: skill2.id },
          { skillId: skill3.id },
        ],
      },
    },
  });

  await prisma.showcase.create({
    data: {
      title: 'Automated email response system for support',
      description: 'Integrated the Empathetic Email Composition skill into our customer support workflow. Response time decreased by 40% while maintaining quality and customer satisfaction scores.',
      authorId: marcus.id,
      createdAt: new Date('2026-03-07'),
      skills: {
        create: [
          { skillId: skill1.id },
        ],
      },
    },
  });

  // Token transactions for Sarah
  await prisma.tokenTransaction.createMany({
    data: [
      { userId: sarah.id, amount: 30, type: 'ACCOUNT_CREATED', createdAt: new Date('2026-01-15') },
      { userId: sarah.id, amount: 10, type: 'SKILL_POSTED', skillId: skill6.id, createdAt: new Date('2026-01-18') },
      { userId: sarah.id, amount: 10, type: 'SKILL_POSTED', skillId: skill8.id, createdAt: new Date('2026-01-30') },
      { userId: sarah.id, amount: 10, type: 'SKILL_POSTED', skillId: skill9.id, createdAt: new Date('2026-02-01') },
      { userId: sarah.id, amount: -1, type: 'SKILL_INSTALLED', skillId: skill4.id, createdAt: new Date('2026-03-10') },
    ],
  });

  console.log('Seed complete!');
  console.log(`Created ${6} users, ${9} skills, ${2} collections, ${2} posts, ${2} skill requests, ${2} showcases`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

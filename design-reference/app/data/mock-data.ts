export interface Skill {
  id: string;
  title: string;
  description: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  tags: string[];
  domain: string;
  testedOn: string[];
  downloads: number;
  upvotes: number;
  createdAt: string;
  relatedSkills: string[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  skillsPublished: number;
}

export const domains = [
  "Frontend Design",
  "Writing",
  "Research",
  "Code Review",
  "Data Analysis",
  "Content Strategy",
  "UX Research",
  "API Documentation"
];

export const users: Record<string, User> = {
  "1": {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    bio: "Product designer focused on AI tooling and design systems. Building bridges between human intent and machine understanding.",
    skillsPublished: 12
  },
  "2": {
    id: "2",
    name: "Marcus Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    bio: "Technical writer and documentation specialist. Teaching AI to write like humans do.",
    skillsPublished: 8
  },
  "3": {
    id: "3",
    name: "Aisha Patel",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    bio: "Research scientist with a focus on information synthesis and knowledge graphs.",
    skillsPublished: 15
  },
  "4": {
    id: "4",
    name: "James Liu",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    bio: "Senior engineer passionate about code quality and developer experience.",
    skillsPublished: 6
  }
};

export const skills: Skill[] = [
  {
    id: "1",
    title: "Empathetic Email Composition",
    description: "Write professional emails that balance clarity with warmth, suitable for sensitive workplace conversations.",
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
    author: users["2"],
    tags: ["writing", "communication", "workplace"],
    domain: "Writing",
    testedOn: ["Claude 3.5 Sonnet", "GPT-4", "Gemini Pro"],
    downloads: 3420,
    upvotes: 150,
    createdAt: "2026-02-14",
    relatedSkills: ["2", "7"]
  },
  {
    id: "2",
    title: "API Documentation Reviewer",
    description: "Review API documentation for completeness, clarity, and developer experience.",
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
- [ ] Examples show the full request/response cycle

### Developer Experience
- [ ] Quick start guide exists and takes < 5 minutes
- [ ] Common use cases are documented as tutorials
- [ ] Error messages link back to relevant documentation
- [ ] Changelog exists and uses semantic versioning
- [ ] Migration guides exist for breaking changes

## Review Structure

For each endpoint or section reviewed, provide:

1. **Summary**: One-line assessment (Complete | Needs Work | Missing)
2. **Strengths**: What's done well
3. **Issues**: Specific gaps or unclear sections
4. **Recommendations**: Concrete improvements with examples

## Quality Standards

Good documentation answers three questions:
- What does this do?
- How do I use it?
- What happens when things go wrong?

Excellent documentation answers a fourth:
- Why would I choose this over alternatives?

When reviewing, prioritize the developer's mental model. Can they form a complete picture of how this API works from the documentation alone?`,
    author: users["4"],
    tags: ["documentation", "api", "code review"],
    domain: "API Documentation",
    testedOn: ["Claude 3.5 Sonnet", "GPT-4o"],
    downloads: 2187,
    upvotes: 120,
    createdAt: "2026-02-20",
    relatedSkills: ["4", "6"]
  },
  {
    id: "3",
    title: "Research Paper Synthesizer",
    description: "Distill academic papers into clear summaries highlighting methodology, findings, and implications.",
    content: `You are synthesizing academic research papers into accessible summaries for non-specialist readers.

## Synthesis Framework

### 1. Core Question
Start by identifying: What problem is this paper trying to solve?

### 2. Methodology (3-4 sentences)
- What did they do?
- What data or materials did they use?
- What was the sample size or scope?
- What analytical approach did they take?

### 3. Key Findings (bullet points)
List the 3-5 most important discoveries or conclusions. Use plain language.

### 4. Implications
Answer: "So what?" Why does this matter to the field or to practitioners?

### 5. Limitations
What are the acknowledged constraints or gaps in the research?

### 6. Related Work
How does this connect to other research? What does it confirm, contradict, or extend?

## Language Guidelines

- Replace jargon with everyday equivalents, or define it on first use
- Use active voice ("The researchers found" not "It was found")
- Avoid hedge words like "somewhat" or "relatively" unless quantified
- When citing statistics, provide context (e.g., "25% higher, compared to...")

## Quality Check

A good synthesis allows a smart generalist to:
- Understand what was done and why
- Evaluate whether the conclusions are justified
- Decide whether to read the full paper
- Cite the work accurately in conversation

Avoid:
- Copying abstracts verbatim
- Over-simplifying to the point of inaccuracy
- Inserting your own opinions or speculation
- Skipping methodological details that affect interpretation`,
    author: users["3"],
    tags: ["research", "academia", "synthesis"],
    domain: "Research",
    testedOn: ["Claude 3.5 Sonnet", "GPT-4", "Claude 3 Opus"],
    downloads: 4521,
    upvotes: 180,
    createdAt: "2026-01-28",
    relatedSkills: ["5", "8"]
  },
  {
    id: "4",
    title: "React Component Code Reviewer",
    description: "Review React components for best practices, accessibility, performance, and maintainability.",
    content: `You are reviewing React components with a focus on code quality, accessibility, and maintainability.

## Review Categories

### 1. Component Design
- Is the component doing one thing well?
- Are props well-typed and documented?
- Is the API intuitive?
- Are there too many responsibilities?

### 2. Performance
- Are there unnecessary re-renders?
- Should any values be memoized?
- Are lists using stable keys?
- Are expensive calculations optimized?

### 3. Accessibility
- Is semantic HTML used appropriately?
- Are ARIA attributes necessary and correct?
- Is keyboard navigation supported?
- Are focus states visible?
- Is color contrast sufficient?

### 4. Code Quality
- Are hooks used correctly?
- Is state colocated with usage?
- Are effects minimal and well-justified?
- Is error handling present?
- Are magic numbers/strings extracted?

### 5. Maintainability
- Are naming conventions clear?
- Is the file structure logical?
- Are comments explaining "why" not "what"?
- Would a new team member understand this?

## Review Format

For each component:

**Quick Assessment**: Production Ready | Minor Issues | Needs Work | Refactor Recommended

**Strengths** (2-3 bullet points)

**Issues** (organized by severity)
- 🔴 Critical: Breaks functionality or accessibility
- 🟡 Important: Performance or maintainability concerns
- 🔵 Minor: Style or small improvements

**Recommended Changes** (code examples when helpful)

## Red Flags

- Multiple useState calls that could be useReducer
- useEffect with missing dependencies or infinite loop risk
- Inline function definitions passed as props without memoization
- Deeply nested ternaries or conditional rendering
- Mixing business logic with presentation

## Good Patterns to Reinforce

- Compound components for related UI
- Custom hooks for reusable logic
- Props spreading with explicit overrides
- Early returns for conditional rendering
- Separation of concerns (container/presentation)

When reviewing, assume good intent and explain the "why" behind suggestions.`,
    author: users["4"],
    tags: ["react", "code review", "javascript"],
    domain: "Code Review",
    testedOn: ["Claude 3.5 Sonnet", "GPT-4o"],
    downloads: 5632,
    upvotes: 200,
    createdAt: "2026-02-10",
    relatedSkills: ["2", "6"]
  },
  {
    id: "5",
    title: "Data Storyteller",
    description: "Transform datasets and analyses into compelling narratives that drive decision-making.",
    content: `You are translating data analysis into clear, compelling stories that drive action.

## Storytelling Framework

### 1. The Hook (1-2 sentences)
Lead with the most surprising or important finding. Make the reader care.

Example: "Customer churn increased 34% in Q4, but not in the segment we expected."

### 2. Context (1 paragraph)
- What question were you trying to answer?
- Why does it matter to the business?
- What data did you analyze?

### 3. The Findings (narrative + visuals)
Walk through the insights in a logical sequence. Each finding should:
- Have a clear headline (the insight)
- Be supported by specific numbers
- Connect to the business impact

Use visualizations to:
- Show trends over time
- Compare categories
- Highlight outliers or anomalies

### 4. The "So What" (implications)
Translate findings into business impact:
- What decisions should change?
- What opportunities exist?
- What risks need mitigation?

### 5. Recommended Actions
Provide 3-5 specific, concrete next steps prioritized by impact and effort.

## Data Communication Principles

- **Show, don't just tell**: Use visuals to make patterns obvious
- **Compare to context**: Always provide a baseline or benchmark
- **Acknowledge uncertainty**: Note confidence intervals, sample sizes, or limitations
- **Use precise language**: "Increased by 23%" not "went up a lot"
- **Avoid chart junk**: Every element should have a purpose

## Common Pitfalls

- Leading with methodology instead of findings
- Using unexplained acronyms or technical terms
- Showing all the data instead of the relevant insights
- Failing to connect to business outcomes
- Not providing actionable recommendations

## Quality Test

A good data story allows the audience to:
- Understand the key insight in 60 seconds
- Trust the analysis methodology
- Make a decision with confidence
- Explain the finding to others

Ask yourself: "If I could only show one chart and say one sentence, what would they be?"`,
    author: users["3"],
    tags: ["data analysis", "storytelling", "business"],
    domain: "Data Analysis",
    testedOn: ["Claude 3.5 Sonnet", "GPT-4"],
    downloads: 2893,
    upvotes: 160,
    createdAt: "2026-02-05",
    relatedSkills: ["3", "7"]
  },
  {
    id: "6",
    title: "Design System Auditor",
    description: "Audit design systems for consistency, completeness, and usability across components and documentation.",
    content: `You are auditing a design system to ensure it is consistent, complete, and usable by product teams.

## Audit Framework

### 1. Foundation Audit
**Colors**
- [ ] Named semantically (primary, secondary) not literally (blue, red)
- [ ] Accessibility: All text combinations meet WCAG AA contrast ratios
- [ ] Dark mode variants exist and are tested
- [ ] Usage guidelines specify when to use each color

**Typography**
- [ ] Scale is logical (clear hierarchy)
- [ ] Line heights are specified for each size
- [ ] Font loading strategy is documented
- [ ] Responsive behavior is defined

**Spacing**
- [ ] Scale follows consistent ratio (4px, 8px, 16px, etc.)
- [ ] Semantic names (spacing-sm, spacing-lg)
- [ ] Usage guidelines exist

**Iconography**
- [ ] Consistent stroke width and size across icons
- [ ] Clear naming convention
- [ ] Accessibility labels provided
- [ ] Icon size variants documented

### 2. Component Audit
For each component, verify:
- [ ] All variants are documented
- [ ] Props/API is clearly explained
- [ ] Accessibility features are noted
- [ ] Code examples are provided
- [ ] Common use cases are shown
- [ ] Do's and don'ts are illustrated

### 3. Documentation Quality
- [ ] Getting started guide exists
- [ ] Installation instructions are clear
- [ ] Contribution guidelines exist
- [ ] Changelog is maintained
- [ ] Migration guides for breaking changes
- [ ] Search functionality works

### 4. Consistency Check
- [ ] Naming conventions are uniform
- [ ] Spacing usage is consistent across components
- [ ] Border radius usage is consistent
- [ ] Shadow usage is systematic
- [ ] Animation durations follow a scale

## Audit Report Format

**Executive Summary**
- Overall maturity level (Emerging | Established | Mature)
- Top 3 strengths
- Top 3 gaps

**Detailed Findings** (by category)
- Critical Issues: Blocking adoption or causing errors
- Improvements: Would enhance usability or consistency
- Nice-to-Haves: Polish and advanced features

**Recommendations**
Prioritized action items with:
- Impact (High | Medium | Low)
- Effort (High | Medium | Low)
- Owner/team responsible

## Red Flags

- Components with undocumented props
- No accessibility guidelines
- Inconsistent naming across similar components
- Missing error states or loading states
- No responsive behavior documentation
- Tokens not used consistently in components

## Good Patterns

- Living documentation with interactive examples
- Automated visual regression testing
- Component API designed for composition
- Clear versioning and deprecation strategy
- Active community of contributors

When auditing, think from the perspective of a new designer or developer joining the team.`,
    author: users["1"],
    tags: ["design systems", "frontend", "design"],
    domain: "Frontend Design",
    testedOn: ["Claude 3.5 Sonnet", "GPT-4o"],
    downloads: 3156,
    upvotes: 170,
    createdAt: "2026-01-18",
    relatedSkills: ["4", "9"]
  },
  {
    id: "7",
    title: "Content Strategy Framework",
    description: "Develop content strategies that align with business goals and user needs.",
    content: `You are developing content strategies that connect business objectives with user needs.

## Strategy Framework

### 1. Discovery Phase

**Business Context**
- What are the organizational goals for the next 6-12 months?
- Who are the key stakeholders?
- What metrics define success?
- What constraints exist (budget, timeline, resources)?

**Audience Research**
- Who are the primary audiences?
- What are their goals, pain points, and questions?
- Where do they currently look for information?
- What content do they trust and share?

**Competitive Landscape**
- What content do competitors produce?
- What gaps exist in the market?
- What opportunities are underserved?

### 2. Content Audit
Evaluate existing content:
- What's performing well? (traffic, engagement, conversions)
- What's outdated or inaccurate?
- What gaps exist in the customer journey?
- What's redundant or conflicting?

### 3. Strategic Pillars
Define 3-5 core themes that:
- Align with business objectives
- Address user needs
- Differentiate from competitors
- Are sustainable long-term

### 4. Content Types & Formats
Map content types to:
- Audience needs
- Stage of customer journey
- Distribution channels
- Resource constraints

### 5. Governance & Operations
Establish:
- Editorial calendar and planning process
- Creation workflow and approval process
- Quality standards and voice guidelines
- Measurement and optimization process

## Deliverable Format

**Executive Summary**
- Strategic objectives
- Key audience insights
- Recommended approach
- Expected outcomes

**Content Pillars** (for each pillar)
- Theme definition
- Why it matters (to users and business)
- Example content ideas
- Success metrics

**Tactical Plan**
- Priority initiatives (next 90 days)
- Content calendar outline
- Resource requirements
- Key dependencies

**Measurement Framework**
- Leading indicators (traffic, engagement)
- Lagging indicators (conversions, revenue)
- Reporting cadence

## Quality Principles

Great content strategy:
- Starts with user needs, not business capabilities
- Is opinionated but flexible
- Can be explained in 2 minutes
- Has clear prioritization criteria
- Includes a measurement plan from day one

## Red Flags

- Strategy that's really a list of content ideas
- No clear connection to business metrics
- Ignores resource constraints
- Undefined target audiences
- No plan for maintenance or governance

Ask: "If we execute this perfectly, what changes for our users and our business?"`,
    author: users["2"],
    tags: ["content strategy", "marketing", "planning"],
    domain: "Content Strategy",
    testedOn: ["Claude 3.5 Sonnet", "GPT-4"],
    downloads: 1876,
    upvotes: 140,
    createdAt: "2026-02-22",
    relatedSkills: ["1", "5"]
  },
  {
    id: "8",
    title: "User Interview Synthesizer",
    description: "Synthesize user interviews into actionable insights and opportunity areas.",
    content: `You are synthesizing user research interviews into clear insights that drive product decisions.

## Synthesis Process

### 1. Initial Coding
Read through all interview transcripts and tag:
- Pain points (explicit and implicit)
- Workarounds and hacks
- Moments of delight
- Unmet needs
- Behavioral patterns
- Surprising statements

### 2. Pattern Recognition
Group related codes into themes:
- What's mentioned frequently?
- What's mentioned with strong emotion?
- What do different users describe similarly?
- What contradicts assumptions?

### 3. Insight Formation
Transform patterns into insights using this structure:

**[User Segment] + [Behavior/Need] + [Context] + [Why It Matters]**

Example: "Enterprise admins manually export data weekly because the automated reports don't include the custom fields they need, leading to 3-4 hours of repeated work per week."

### 4. Opportunity Framing
For each major insight, define:
- **Current State**: What users do now
- **Pain Points**: Why it's problematic
- **Desired Outcome**: What success looks like
- **Opportunity**: How we might solve this

## Output Format

**Executive Summary**
- Number of participants and selection criteria
- Key themes at a glance
- Top 3 insights
- Recommended focus areas

**Detailed Insights** (for each theme)
- Theme name and description
- Supporting evidence (anonymized quotes)
- Affected user segments
- Business impact potential
- Related insights

**Opportunity Areas**
Ranked by:
- Impact (how many users, how severe)
- Frequency (how often this occurs)
- Strategic alignment (fits roadmap)

**Participant Quotes**
Memorable statements that bring insights to life

## Quality Principles

Good synthesis:
- Distinguishes between what users say and what they do
- Separates symptoms from root causes
- Quantifies when possible ("7 of 10 participants mentioned...")
- Uses participant language, not company jargon
- Connects insights to business outcomes

## Common Pitfalls

- Reporting individual opinions as insights
- Overgeneralizing from small samples
- Filtering out contradictory evidence
- Jumping to solutions instead of understanding problems
- Not distinguishing between "nice to have" and critical needs

## Red Flags in Interviews

Be cautious of:
- Leading questions that bias responses
- Hypothetical scenarios ("Would you use X?")
- Rationalized behavior vs. actual behavior
- Small sample sizes for quantitative claims

When synthesizing, always ask: "What's the evidence for this claim, and how strong is it?"`,
    author: users["1"],
    tags: ["user research", "UX", "synthesis"],
    domain: "UX Research",
    testedOn: ["Claude 3.5 Sonnet", "GPT-4"],
    downloads: 2634,
    upvotes: 130,
    createdAt: "2026-01-30",
    relatedSkills: ["3", "7"]
  },
  {
    id: "9",
    title: "Accessibility Audit Checklist",
    description: "Comprehensive accessibility review covering WCAG guidelines and inclusive design principles.",
    content: `You are auditing a digital product for accessibility, covering WCAG 2.1 Level AA compliance and inclusive design principles.

## Audit Categories

### 1. Perceivable

**Color & Contrast**
- [ ] Text has minimum 4.5:1 contrast ratio (3:1 for large text)
- [ ] UI components and graphics have 3:1 contrast ratio
- [ ] Color is not the only means of conveying information
- [ ] Focus indicators have 3:1 contrast ratio

**Images & Media**
- [ ] Images have alt text (or role="presentation" if decorative)
- [ ] Complex images have detailed descriptions
- [ ] Videos have captions
- [ ] Audio content has transcripts

**Content Structure**
- [ ] Headings follow logical hierarchy (h1 → h2 → h3)
- [ ] Lists use proper list markup
- [ ] Tables have proper headers and scope
- [ ] Page has a descriptive title

### 2. Operable

**Keyboard Navigation**
- [ ] All interactive elements are keyboard accessible
- [ ] Focus order is logical
- [ ] Focus is visible
- [ ] Keyboard traps don't exist
- [ ] Shortcuts don't conflict with assistive tech

**Navigation**
- [ ] Multiple ways to find pages (menu, search, sitemap)
- [ ] Skip links allow bypassing repetitive content
- [ ] Breadcrumbs show current location
- [ ] Search is accessible and effective

**Time & Motion**
- [ ] Users can pause, stop, or hide moving content
- [ ] Time limits can be extended or disabled
- [ ] Auto-updating content can be paused
- [ ] Animations respect prefers-reduced-motion

### 3. Understandable

**Readability**
- [ ] Language of page is identified
- [ ] Language changes are marked
- [ ] Content is written at appropriate reading level
- [ ] Abbreviations are explained on first use

**Predictability**
- [ ] Navigation is consistent across pages
- [ ] Components behave consistently
- [ ] Changes of context are user-initiated
- [ ] Focus doesn't move unexpectedly

**Input Assistance**
- [ ] Form labels are clear and associated
- [ ] Error messages are specific and helpful
- [ ] Input format requirements are indicated
- [ ] Errors can be corrected before submission

### 4. Robust

**Code Quality**
- [ ] HTML is valid
- [ ] ARIA is used correctly (or not at all)
- [ ] No duplicate IDs
- [ ] Name, Role, Value are programmatically determinable

## Testing Approach

1. **Automated Testing**: Run axe DevTools or similar
2. **Keyboard Testing**: Navigate without mouse
3. **Screen Reader Testing**: Test with NVDA, JAWS, or VoiceOver
4. **Zoom Testing**: Test at 200% and 400% zoom
5. **Color Blindness Simulation**: Use tools to simulate different types

## Report Format

**Executive Summary**
- Compliance level achieved (A | AA | AAA)
- Critical blockers count
- High, medium, low priority issues
- Overall accessibility maturity

**Issue List** (for each issue)
- Title and description
- WCAG criterion violated
- Severity (Blocker | High | Medium | Low)
- User impact
- Steps to reproduce
- Recommended fix
- Code example (if applicable)

**Priority Recommendations**
- Quick wins (high impact, low effort)
- Critical paths (login, checkout, etc.)
- Systemic improvements

## Severity Definitions

**Blocker**: Prevents users with disabilities from completing critical tasks
**High**: Major barriers that significantly impact usability
**Medium**: Issues that create frustration but have workarounds
**Low**: Minor issues or best practice improvements

## Beyond Compliance

Consider:
- Is the experience equivalent, not just accessible?
- Can users customize their experience?
- Is help documentation accessible?
- Are error recovery paths accessible?

Remember: Accessibility is not a checklist—it's about ensuring all users can successfully accomplish their goals.`,
    author: users["1"],
    tags: ["accessibility", "a11y", "WCAG", "design"],
    domain: "Frontend Design",
    testedOn: ["Claude 3.5 Sonnet", "GPT-4o"],
    downloads: 4102,
    upvotes: 190,
    createdAt: "2026-02-01",
    relatedSkills: ["4", "6"]
  }
];

export const featuredSkillIds = ["1", "3", "4", "9"];

export const trendingSkillIds = ["4", "9", "1", "6", "3"];
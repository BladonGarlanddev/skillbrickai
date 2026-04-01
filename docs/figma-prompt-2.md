# SkillBrick AI — Figma Prompt 2

## Context

SkillBrick AI is a community library for AI skills — prompt-based behavioral guides that people drop into their agent environments to improve how their AI behaves in specific domains. The visual language is established: light themed, document-style, clean and minimal, warm but not cozy. Think a well-designed whitepaper or Google Docs. No dark mode, no heavy dashboard energy, no neon.

This prompt covers the community layer, authentication, reputation systems, and several new page types. All new screens should feel continuous with the established visual language.

---

## Reputation Systems

There are three distinct systems that together form a user's standing on the platform. They should feel coherent but serve different purposes.

### 1. Community Score

A running score that reflects a user's overall quality of contribution to the platform — analogous to Reddit karma. It is a single integer displayed prominently on the user profile and subtly beside their username in discussions and skill cards.

**Earns score:**
- Upvotes received on published skills
- Upvotes received on discussion posts and replies
- Skill requests fulfilled (someone used the skill you linked)
- Improvement suggestions accepted by a skill author
- Collections that get followed by others

**Does not earn score:**
- Posting alone (quality matters, not volume)
- Token transactions

The score should be displayed as a plain number — no progress bars, no level labels. Something like `◆ 1,240` with a small identifying icon. Feels like a quiet signal of trustworthiness, not a leaderboard entry. On the profile page it can be more prominent; beside a username in a discussion thread it should be small and secondary.

Upvote controls on skills, posts, and replies should be minimal — a simple up arrow or a soft "+1" affordance. Not Reddit-style large vote counts dominating the layout. The score accumulates quietly in the background.

### 2. Tokens

Tokens are a separate transactional system for installs and copies — not a reputation signal.

- **Guest (no account):** 10 tokens on arrival
- **Create an account:** 30 tokens + Early Adopter badge
- **Post a skill:** +10 tokens earned
- **Copy or install a skill:** −1 token spent

The token balance is visible only on the user's own profile and in a lightweight token panel accessible from the nav. It should feel like a simple ledger — recent activity (earned X for posting "Frontend Design", spent X on "Accessibility Checker"), current balance, and how to earn more. Not a crypto wallet. Not a progress bar. Plain and readable.

When tokens run out the empty state is friendly, never punishing: *"You've used your free installs. Share a skill to earn more — or create a free account to get 30."*

### 3. Badges

Badges are permanent markers of contribution milestones. Small, tasteful, earned — not a gamification layer.

| Badge | Trigger |
|---|---|
| Early Adopter | Account created during early access |
| Contributor | Published at least one skill |
| Active Community Member | Regular participation in discussions and requests |
| Mr. Popular | A skill reached a high usage threshold |
| Curator | Created a collection |
| Helper | Replied to a skill request with a skill that was used |
| Verified Expert | Domain-verified professional (applied, not automatic) |

Badges appear as a small shelf on the profile page. Beside a username in discussions, show only the single most notable badge — small, icon or short label, never noisy. Tooltips on hover explain what the badge means.

---

## Pages to Design

---

### 1. Login / Sign Up

Clean, minimal, centered on the page. Feels like the cover of a document, not a corporate login wall.

Two states — Log In and Sign Up — toggled with a simple tab or switch, no separate pages.

**Log In state:**
- Email and password fields
- OAuth buttons: GitHub and Google (developers expect GitHub; general users expect Google)
- Forgot password link, understated

**Sign Up state:**
- Email and password fields
- OAuth buttons: same as above
- A single incentive line that feels worth reading, not marketing copy: *"Start with 30 free installs and an Early Adopter badge."*
- The Early Adopter badge should appear visually here — small but real, make it feel like something worth having

No sidebars, no marketing illustrations, no testimonials. The logo, the form, and the one good reason to sign up.

---

### 2. User Profile (expanded)

The profile is both a personal library and a community identity. Two views: own profile (sees tokens) and others' profiles (no token info).

**Layout sections top to bottom:**
- Avatar, display name, short bio
- Community score (prominent, simple: `◆ 1,240`)
- Badge shelf — a small horizontal row of earned badges with tooltips on hover
- Token balance — own profile only, below badges, not louder than the score
- Tab row: Skills | Collections | Activity
  - **Skills tab:** published skills in bibliography style — title, one-line description, usage count, community score for that skill
  - **Collections tab:** collections listed with title and skill count
  - **Activity tab:** skills improved (accepted suggestions), requests fulfilled, notable upvoted posts

---

### 3. Token Panel

A lightweight dropdown or slide-out accessible from the nav (e.g., a token count in the top bar that opens on click).

Contents:
- Current balance (large, clear)
- How to earn more: two or three line items — "Post a skill → +10", "Create an account → +30"
- Recent activity: a short log — "Earned 10 · Posted Frontend Design", "Spent 1 · Installed Accessibility Checker"

Feels like a simple bank statement. No visual flair.

---

### 4. Community — Discussion Space

A general forum. Feels like a well-organized comment section or a community noticeboard — not a Reddit clone, not a Slack channel.

**Browse view:**
- List of posts: title, author (with community score and optional badge), category tag, reply count, timestamp
- Category filter tabs at the top: General · Help · Ideas · Show & Tell
- A "New Post" button, understated

**Post view:**
- Title and body at the top — document-style, readable
- Author info: avatar, name, community score, badge
- Upvote control — minimal, a soft up arrow beside the post
- Threaded replies kept shallow (one level of nesting max)
- Each reply shows author, community score, upvote control, timestamp

---

### 5. Community — Skill Requests

A dedicated page for skills that don't exist yet.

**Browse view:**
- List of requests: title, short description, author, status (Open / Fulfilled), reply count
- Filter: All · Open · Fulfilled
- A "Request a Skill" button

**Request detail view:**
- The request: domain, what behavior is needed, what problem it solves
- Replies below — free-form, conversational
- When a reply contains a link to a SkillBrick AI skill, it renders as an **inline skill card preview**: compact, shows skill name, one-line description, author, tags, and a copy button
- No claiming, no assigning — just replies and the organic emergence of fulfilled requests
- Fulfilled state: a light visual treatment on the request header (a soft label "Fulfilled" — not archived, still fully readable)

**States to show:**
- Empty request (no replies)
- Request with text replies
- Request with a reply containing an inline skill card preview
- Fulfilled request

---

### 6. Community — Project Showcase

Users share what they built using SkillBrick AI skills.

**Browse view:**
- Showcase cards: project title, author (with score), skills used (small linked chips), one-line description
- Filter by skill or domain

**Showcase detail view:**
- Project title and description (document-style, readable)
- Skills used: linked chip tags — each clicking through to that skill's detail page
- Optional screenshots or images
- Author info with score and badge
- Upvote control

**Submission form:**
- Title, description, skills used (searchable chip input), optional image upload
- A secondary option below the form, clearly marked as coming soon: *"Have your AI draft this for you — install the SkillBrick AI MCP server"* with a placeholder state that anticipates Phase 2 without being confusing now

---

### 7. Improvement Suggestions

Accessible from each skill detail page via a subtle "Suggest an Improvement" link — not a primary CTA.

**Suggestion view:**
- The current skill content on the left (or top on mobile), the proposed edit on the right (or below)
- For small changes, a simple text area is fine — no need for a full diff view unless the change is large
- A short note field: "Why are you suggesting this change?"
- Submit button, understated

**Author review state:**
- Notification that a suggestion exists
- Side-by-side or before/after view
- Accept / Reject / Comment — three clear actions, no ambiguity
- Accepted suggestions appear on the contributor's activity tab: "Contributed to Frontend Design"

---

### 8. Collections

**Collection detail page:**
- Title and optional description at the top
- Skills listed in catalog style below — same as browse view skill cards
- Author info, follower count (contributes to curator's community score), share link

**Create / edit flow:**
- Feels like opening a new document: give it a title, optionally add a description, then search and add skills
- Minimal, no friction

---

## Upvote Treatment (Global)

Upvotes appear on: skills, discussion posts, replies, showcases.

The control should be consistent and minimal across all contexts:
- A small up arrow icon
- A number beside it (starts at 0, increments on tap)
- Filled/colored state when the user has upvoted
- Never dominates the layout — always secondary to the content

The community score accumulates from these silently in the background. The UI doesn't need to explain the connection every time — trust the user to figure it out.

---

## Feeling Notes

The community layer should feel like a **reading room with a noticeboard**. People leave useful things, ask questions, occasionally show off something they're proud of. It is calm, purposeful, and unhurried.

Reputation (score, badges, tokens) should feel like honest signals, not game mechanics. The goal is trust and recognition — not engagement loops. If it ever starts to feel like a leaderboard or a points grind, pull back.

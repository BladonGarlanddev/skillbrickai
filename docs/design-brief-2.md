# Collective — Design Brief 2

This brief extends the original design brief. All visual direction from Brief 1 applies — light themed, document-style, clean, minimal, approachable. This brief covers the community layer, authentication, and the token/badge system.

---

## Token System

Collective uses tokens to encourage contribution rather than restrict access. The philosophy is generous: the platform wants people to use skills freely, and tokens are a gentle nudge toward giving back — not a paywall.

### Token Allocation
- **Guest (not logged in):** 10 tokens on arrival, no account required
- **New account:** 30 tokens + Early Adopter badge
- **Posting a skill:** +10 tokens earned

### What a Token Does
One token = one skill copy or install. When a guest or user copies/downloads a skill, one token is spent.

### Design Tone
The token system should never feel punishing or anxious. It should feel like a library card — a light civic contract, not a meter running out. Token counts are visible but not loud. Running low is a gentle prompt to contribute, not a hard stop.

When tokens are exhausted, the CTA should read something like: *"You've used your free installs. Share a skill to earn more — or create a free account to get 30."* Friendly. No guilt.

---

## Badge System

Badges are lightweight reputation markers displayed on user profiles and skill cards. They should feel like honest recognition, not gamification noise. Small, tasteful, legible at a glance.

### Badges (initial set)

| Badge | Trigger |
|---|---|
| Early Adopter | Created account during early access period |
| Contributor | Published at least one skill |
| Active Community Member | Regular participation in discussions and requests |
| Mr. Popular | Has a skill that reached a high usage threshold |
| Curator | Created a collection |
| Helper | Replied to a skill request with a skill that was used |
| Verified Expert | Domain-verified professional (applied, not automatic) |

Badges appear on:
- User profile pages (full display)
- Skill cards (author's most notable badge, small)
- Discussion posts (beside the username, subtle)

---

## Pages to Design

---

### 1. Login / Sign Up Screen

Clean, minimal, centered. Feels like the cover page of the document — not a corporate login wall.

- Two states: Log In and Sign Up, toggled simply (no separate pages needed)
- Sign Up should surface the token incentive: *"Create a free account and get 30 installs + an Early Adopter badge"*
- Auth options: email/password + OAuth (GitHub, Google at minimum — developers expect GitHub)
- No marketing copy, no distractions. Just the form, the logo, and the incentive line.
- Early Adopter badge should be shown visually as part of the sign-up prompt — make it feel like something worth having

---

### 2. User Profile (expanded from Brief 1)

The profile is both a personal library and a community identity.

**Sections:**
- Avatar, display name, short bio
- Badge shelf — displayed prominently but not loudly. A small row of earned badges with tooltips on hover.
- Token balance — visible on own profile only. Shown as a simple count, not a progress bar.
- Published skills — listed like a bibliography: title, one-line description, usage count
- Collections they've created
- Activity: skills they've improved (PRs accepted), requests they've fulfilled

---

### 3. Token & Earnings UI

A lightweight panel — likely accessible from the nav or profile — that shows:
- Current token balance
- How tokens are earned (post a skill → +10, create account → 30)
- Recent token activity (earned X for posting "Frontend Design", spent X on installs)

This should feel like a simple ledger, not a crypto wallet. Plain, readable, understated.

---

### 4. Community — Discussion Space

A general forum area. Feels like a well-organized comment section, not a Reddit clone.

- Posts have a title, body, author with badge, timestamp
- Threaded replies, kept shallow (no deep nesting)
- Categories or tags for organization (e.g., "General", "Help", "Ideas", "Show & Tell")
- The tone should feel like a community noticeboard, not a message board with upvote culture

---

### 5. Community — Skill Requests

A dedicated area for posting skills that are needed.

- Each request is a short post: what domain, what behavior, what problem it solves
- Replies are unstructured — conversational, natural language
- When someone replies with a link to a skill they created, it renders as an inline skill card preview (title, description, author, tags — compact)
- No formal assignment, claiming, or bounty mechanics — purely organic

**States to show:**
- Open request with no replies
- Open request with replies including a skill card preview
- Request marked as fulfilled (light visual treatment, not archived — still readable)

---

### 6. Community — Project Showcase

Users share projects they built with Collective skills.

- Each showcase has: project title, short description, skills used (linked), screenshots or text, author
- Skills used are displayed as small linked chips — clicking goes to that skill's page
- Showcase cards on browse pages show: title, author, skills used, one-line description

**Two creation modes:**
- **Manual:** User fills out a simple form (title, description, skills used, optional images)
- **MCP-drafted:** *(Phase 2)* User triggers from their agent environment; the AI reads project context and pre-fills the form. User reviews and publishes. The UI should have a placeholder/empty state that anticipates this flow even in Phase 1.

---

### 7. Improvement Suggestions (PR-style)

A way for community members to propose edits to an existing skill.

- On each skill detail page: a subtle "Suggest an Improvement" link
- Opens a simple diff-style editor: original on one side, proposed edit on the other (or a simple text area for smaller changes)
- Author receives a notification and can Accept, Reject, or Comment
- Accepted suggestions give the contributor a note on their profile ("contributed to X skills")
- Should feel like a collaborative document edit, not a code review

---

### 8. Collections Page

- A user's collections are listed on their profile
- Each collection has its own page: title, description, list of skills in catalog style
- Collections are browsable/searchable from the main discover page
- Creating a collection should feel like making a new document — give it a title, add skills

---

## Feeling Notes for This Brief

The community layer should feel like a **reading room with a noticeboard** — a calm space where people leave useful things for each other, ask questions, and occasionally show off something they're proud of. Not a social network. Not a forum. Something quieter and more purposeful.

Badges and tokens should be rewards that feel earned, not mechanics that feel manipulative. Small, honest, legible.

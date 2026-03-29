# Community

Community is a first-class product goal for Collective — not a tab bolted on after the fact. The platform should feel alive: active discussions, visible demand, people sharing what they built. This document covers the planned community features and their intent.

---

## Discussion Space

A general community discussion area. Broad, unstructured, for conversation that doesn't fit neatly on a specific skill page. Think of it as the town square.

---

## Skill-Level Discussion

Each skill has its own discussion thread. This is where users share experiences, report model compatibility, flag issues, and have conversations specific to that skill. It keeps feedback close to the content it's about.

---

## Skill Requests

Users can post requests for skills that don't exist yet. Fulfillment is intentionally unstructured — anyone can reply, and replies can include a natural-language link to a skill they created in response.

Linked skills render as inline skill card previews within the reply. No formal claim or assignment system — the community self-organizes.

This is a flywheel: visible demand drives creation, creators have a motivated audience, and new users see active community before they've contributed anything.

---

## Improvement Suggestions

A lightweight PR-like mechanism for existing skills. Community members can propose edits to a skill's content. The original author reviews and approves or rejects.

This keeps skills alive and accurate as models evolve without requiring the original author to do all the maintenance. It also gives engaged community members a meaningful way to contribute without publishing their own skill.

---

## Project Showcase

Users can share broader projects where they used one or more Collective skills — not just "I tried this skill" but "here's what I built with it."

**MCP-powered drafting:** The intended flow is that a user has the Collective MCP server installed in their agent environment. When they want to showcase a project, the AI reads their project context and auto-drafts the showcase post. The user reviews and publishes. This eliminates the friction of manual writeups and grounds the showcase in the actual project.

This makes the MCP server a two-way bridge: pull skills into the agent environment, push showcases back out to the community.

Showcases are attached to the skill pages they reference, serving as social proof and real-world validation for prospective users.

---

## Collections

Users curate named lists of skills — "My Agent Stack", "Writing Tools", "Full-Stack Dev Setup". Collections are shareable and browsable. Curation is a community act: it surfaces quality, creates composable bundles, and gives non-creators a meaningful way to contribute.

---

## Verified Experts

Domain professionals can apply for a verified badge in specific domains. A working frontend designer verifying a frontend design skill carries more weight than usage counts alone. Solves the quality signal problem more credibly at scale.

---

## Skill Subscriptions

Users can follow a skill to receive notifications when it is updated. As models evolve, skills need maintenance — subscriptions keep authors accountable and invested users informed.

---

## Community Score

A running score analogous to Reddit karma. Reflects quality of contribution, displayed on profiles and subtly beside usernames in discussions.

Earned from: upvotes on skills, upvotes on posts/replies, fulfilled skill requests, improvement suggestions accepted, collections that get followed. Posting alone does not earn score — quality matters, not volume.

Displayed as a plain number (e.g., `◆ 1,240`). Quiet and secondary in discussions; more prominent on profiles.

---

## Token System

Tokens encourage contribution rather than restrict access. The intent is a gentle civic contract — not a paywall.

| Event | Tokens |
|---|---|
| Guest (no account) | 10 on arrival |
| Create account | 30 + Early Adopter badge |
| Post a skill | +10 earned |
| Copy / install a skill | −1 spent |

When tokens run out, the prompt is friendly: *"Share a skill to earn more — or create a free account to get 30."* Not a hard stop.

---

## Badge System

| Badge | Trigger |
|---|---|
| Early Adopter | Account created during early access |
| Contributor | Published at least one skill |
| Active Community Member | Regular participation in discussions and requests |
| Mr. Popular | Skill reached high usage threshold |
| Curator | Created a collection |
| Helper | Replied to a skill request with a skill that was used |
| Verified Expert | Domain-verified professional (applied, not automatic) |

---

## Launch Priority

| Feature | Priority |
|---|---|
| Discussion space | Launch |
| Skill requests | Launch |
| Skill-level discussion | Launch |
| Collections | Launch |
| Project showcase (manual) | Post-launch |
| Project showcase (MCP-powered) | Phase 2 (with MCP server) |
| Improvement suggestions | Post-launch |
| Verified experts | Post-launch |
| Skill subscriptions | Post-launch |

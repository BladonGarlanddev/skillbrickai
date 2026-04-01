# Architecture

## Overview

SkillBrick AI is a pnpm monorepo with two applications and one shared package.

```
skillbrickai/
├── apps/
│   ├── web/                  # React frontend
│   └── api/                  # NestJS backend
├── packages/
│   └── shared/               # Shared TypeScript types and DTOs
├── docker-compose.yml        # Local PostgreSQL
├── pnpm-workspace.yaml
└── .env.example
```

---

## Apps

### `apps/web` — Frontend

| Concern | Choice |
|---|---|
| Framework | React 19 |
| Build | Vite |
| Routing | React Router v7 |
| Components | Radix UI primitives |
| Styling | SCSS modules + global SCSS |
| HTTP client | Axios |
| State | Zustand (global), TanStack Query (server state) |
| Forms | React Hook Form + Zod |
| Package name | `@skillbrickai/web` |

**Directory structure:**
```
apps/web/
├── src/
│   ├── components/
│   │   ├── ui/               # Radix-based primitive wrappers (Button, Dialog, etc.)
│   │   └── [feature]/        # Feature-specific components
│   ├── pages/                # Route-level page components
│   ├── hooks/                # Shared custom hooks
│   ├── lib/
│   │   ├── api.ts            # Axios instance + request helpers
│   │   └── utils.ts
│   ├── stores/               # Zustand stores
│   ├── styles/
│   │   ├── _variables.scss   # Design tokens (maps from CSS custom properties)
│   │   ├── _mixins.scss
│   │   ├── _reset.scss
│   │   ├── _typography.scss
│   │   └── index.scss        # Global entry point
│   ├── types/                # Frontend-local types (re-exports from @skillbrickai/shared)
│   ├── routes.ts
│   └── main.tsx
├── vite.config.ts
├── tsconfig.json
└── package.json
```

**Styling approach:**

SCSS modules for component-scoped styles. Global SCSS for base, typography, and tokens. Design tokens are defined as CSS custom properties in `_variables.scss`, mirroring the values in the design reference's `theme.css`. Radix components are unstyled primitives — all visual styling is written in SCSS.

```scss
// _variables.scss
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --muted: #f5f5f5;
  --muted-foreground: #737373;
  --border: rgba(0, 0, 0, 0.06);
  --radius: 0.5rem;
  // ... (full set from design reference theme.css)
}
```

---

### `apps/api` — Backend

| Concern | Choice |
|---|---|
| Framework | NestJS |
| ORM | Prisma |
| Database | PostgreSQL 16 (Docker) |
| Auth | Passport.js + JWT + OAuth (GitHub, Google) |
| Validation | class-validator + class-transformer |
| API docs | @nestjs/swagger (OpenAPI) |
| Package name | `@skillbrickai/api` |

**Directory structure:**
```
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/             # JWT, OAuth strategies, guards
│   │   ├── users/            # User CRUD, profile
│   │   ├── skills/           # Skill CRUD, search, tagging
│   │   ├── collections/      # Collection CRUD
│   │   ├── community/        # Discussion, requests, showcases
│   │   ├── tokens/           # Token ledger, transactions
│   │   ├── badges/           # Badge assignment logic
│   │   └── upvotes/          # Upvote handling + score calculation
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/          # Exception filters
│   │   ├── guards/
│   │   └── interceptors/
│   └── main.ts
├── tsconfig.json
└── package.json
```

---

## Package

### `packages/shared` — Shared Types

Shared TypeScript types, enums, and Zod schemas used by both `web` and `api`. Avoids duplicating DTO definitions.

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── skill.ts
│   │   ├── user.ts
│   │   ├── token.ts
│   │   ├── badge.ts
│   │   └── community.ts
│   └── index.ts
└── package.json
```

---

## Database Schema

Core entities and their relationships.

```prisma
model User {
  id             String    @id @default(cuid())
  email          String    @unique
  username       String    @unique
  avatarUrl      String?
  bio            String?
  communityScore Int       @default(0)
  tokenBalance   Int       @default(0)
  isEarlyAdopter Boolean   @default(false)
  createdAt      DateTime  @default(now())

  skills         Skill[]
  badges         Badge[]
  collections    Collection[]
  upvotes        Upvote[]
  tokenLedger    TokenTransaction[]
  posts          Post[]
  requests       SkillRequest[]
  showcases      Showcase[]
  suggestions    ImprovementSuggestion[]
}

model Skill {
  id           String   @id @default(cuid())
  name         String
  description  String
  content      String   @db.Text
  authorId     String
  installCount Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  author       User     @relation(fields: [authorId], references: [id])
  tags         SkillTag[]
  upvotes      Upvote[]
  collections  CollectionSkill[]
  showcases    ShowcaseSkill[]
  suggestions  ImprovementSuggestion[]
}

model Badge {
  id        String    @id @default(cuid())
  userId    String
  type      BadgeType
  earnedAt  DateTime  @default(now())

  user      User      @relation(fields: [userId], references: [id])
}

enum BadgeType {
  EARLY_ADOPTER
  CONTRIBUTOR
  ACTIVE_COMMUNITY_MEMBER
  MR_POPULAR
  CURATOR
  HELPER
  VERIFIED_EXPERT
}

model TokenTransaction {
  id        String            @id @default(cuid())
  userId    String
  amount    Int               // positive = earned, negative = spent
  type      TokenTransactionType
  skillId   String?           // related skill if applicable
  createdAt DateTime          @default(now())

  user      User              @relation(fields: [userId], references: [id])
}

enum TokenTransactionType {
  ACCOUNT_CREATED
  SKILL_POSTED
  SKILL_INSTALLED
  ADMIN_GRANT
}

model Upvote {
  id         String     @id @default(cuid())
  userId     String
  targetType UpvoteTarget
  targetId   String     // polymorphic — skillId, postId, etc.
  createdAt  DateTime   @default(now())

  user       User       @relation(fields: [userId], references: [id])
  skill      Skill?     @relation(fields: [targetId], references: [id])

  @@unique([userId, targetType, targetId])
}

enum UpvoteTarget {
  SKILL
  POST
  REPLY
  SHOWCASE
}

model Collection {
  id          String   @id @default(cuid())
  name        String
  description String?
  authorId    String
  createdAt   DateTime @default(now())

  author      User     @relation(fields: [authorId], references: [id])
  skills      CollectionSkill[]
}

model CollectionSkill {
  collectionId String
  skillId      String
  addedAt      DateTime @default(now())

  collection   Collection @relation(fields: [collectionId], references: [id])
  skill        Skill      @relation(fields: [skillId], references: [id])

  @@id([collectionId, skillId])
}

model Post {
  id        String      @id @default(cuid())
  title     String?
  body      String      @db.Text
  authorId  String
  category  PostCategory
  parentId  String?     // for replies
  createdAt DateTime    @default(now())

  author    User        @relation(fields: [authorId], references: [id])
  parent    Post?       @relation("replies", fields: [parentId], references: [id])
  replies   Post[]      @relation("replies")
}

enum PostCategory {
  GENERAL
  HELP
  IDEAS
  SHOW_AND_TELL
}

model SkillRequest {
  id          String              @id @default(cuid())
  title       String
  description String              @db.Text
  authorId    String
  status      SkillRequestStatus  @default(OPEN)
  createdAt   DateTime            @default(now())

  author      User                @relation(fields: [authorId], references: [id])
  replies     SkillRequestReply[]
}

enum SkillRequestStatus {
  OPEN
  FULFILLED
}

model SkillRequestReply {
  id         String       @id @default(cuid())
  requestId  String
  authorId   String
  body       String       @db.Text
  skillId    String?      // if reply links to a skill
  createdAt  DateTime     @default(now())

  request    SkillRequest @relation(fields: [requestId], references: [id])
}

model Showcase {
  id          String   @id @default(cuid())
  title       String
  description String   @db.Text
  authorId    String
  createdAt   DateTime @default(now())

  author      User     @relation(fields: [authorId], references: [id])
  skills      ShowcaseSkill[]
}

model ShowcaseSkill {
  showcaseId String
  skillId    String

  showcase   Showcase @relation(fields: [showcaseId], references: [id])
  skill      Skill    @relation(fields: [skillId], references: [id])

  @@id([showcaseId, skillId])
}

model ImprovementSuggestion {
  id              String           @id @default(cuid())
  skillId         String
  authorId        String
  proposedContent String           @db.Text
  note            String?
  status          SuggestionStatus @default(PENDING)
  createdAt       DateTime         @default(now())

  skill           Skill            @relation(fields: [skillId], references: [id])
  author          User             @relation(fields: [authorId], references: [id])
}

enum SuggestionStatus {
  PENDING
  ACCEPTED
  REJECTED
}

model SkillTag {
  skillId String
  tag     String

  skill   Skill  @relation(fields: [skillId], references: [id])

  @@id([skillId, tag])
}
```

---

## Auth Flow

1. User signs in via GitHub/Google (OAuth) or email/password
2. NestJS issues a signed JWT (httpOnly cookie, 7 day expiry)
3. All protected API routes use a `JwtAuthGuard`
4. On first OAuth login, user is created, token balance set to 30, Early Adopter badge assigned (during early access window)
5. Guest sessions track token usage via a short-lived anonymous token stored in localStorage (balance starts at 10, decremented client-side, validated server-side on install)

---

## API Design

REST. NestJS controllers map to resource routes. Swagger auto-generated at `/api/docs`.

```
POST   /auth/login
POST   /auth/register
GET    /auth/github
GET    /auth/google
POST   /auth/logout

GET    /skills               ?search=&tags=&sort=&page=
POST   /skills
GET    /skills/:id
PATCH  /skills/:id
DELETE /skills/:id
POST   /skills/:id/install   (decrements token)
POST   /skills/:id/upvote

GET    /users/:id
PATCH  /users/me
GET    /users/:id/skills
GET    /users/:id/collections

GET    /collections
POST   /collections
GET    /collections/:id
PATCH  /collections/:id
POST   /collections/:id/skills

GET    /community/posts      ?category=
POST   /community/posts
GET    /community/posts/:id
POST   /community/posts/:id/replies
POST   /community/posts/:id/upvote

GET    /requests
POST   /requests
GET    /requests/:id
POST   /requests/:id/replies
PATCH  /requests/:id/status

GET    /showcases
POST   /showcases
GET    /showcases/:id

GET    /skills/:id/suggestions
POST   /skills/:id/suggestions
PATCH  /skills/:id/suggestions/:suggestionId

GET    /tokens/balance
GET    /tokens/history
```

---

## Local Development

```bash
# 1. Copy env
cp .env.example .env

# 2. Start database
pnpm db:up

# 3. Install dependencies
pnpm install

# 4. Run migrations
pnpm db:migrate

# 5. Start everything
pnpm dev
```

Frontend runs on `http://localhost:5176`
API runs on `http://localhost:3000`
Swagger docs at `http://localhost:3000/api/docs`

---

## Deployment

Hybrid model: static frontend hosted on Cloudflare, backend self-hosted locally via tunnel.

### Frontend — Cloudflare Pages

The Vite-built React SPA is deployed to **Cloudflare Pages**.

- Connect the repo to Cloudflare Pages
- Build command: `pnpm --filter @skillbrickai/web build`
- Output directory: `apps/web/dist`
- Environment variable: `VITE_API_URL` → the tunnel subdomain (e.g. `https://api.yourdomain.com`)

The frontend must read the API base URL from `import.meta.env.VITE_API_URL` so it works in both local dev and production.

### Backend — Local machine + Cloudflare Tunnel

The NestJS API and PostgreSQL database run on a local machine. **Cloudflare Tunnel** (`cloudflared`) exposes the API to the internet without port forwarding or dynamic DNS.

- Install `cloudflared` and authenticate with your Cloudflare account
- Create a named tunnel and map it to a subdomain (e.g. `api.yourdomain.com`)
- Point the tunnel at `http://localhost:3000`
- Cloudflare handles HTTPS termination automatically

### CORS

The API must allow requests from the Cloudflare Pages domain. Configure CORS in NestJS to accept the production frontend origin.

### Why this setup

- **Cost:** $0/month beyond the domain name. Cloudflare Pages and Tunnels are free tier.
- **Simplicity:** No cloud VMs to manage. The backend runs alongside the dev environment.
- **Security:** No exposed ports or firewall changes. Tunnel handles ingress.
- **Migration path:** If the backend needs to move to the cloud later, only the tunnel target changes — the frontend and DNS stay the same.

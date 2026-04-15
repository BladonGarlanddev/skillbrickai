-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('EARLY_ADOPTER', 'CONTRIBUTOR', 'ACTIVE_COMMUNITY_MEMBER', 'MR_POPULAR', 'CURATOR', 'HELPER', 'VERIFIED_EXPERT');

-- CreateEnum
CREATE TYPE "TokenTransactionType" AS ENUM ('ACCOUNT_CREATED', 'SKILL_POSTED', 'SKILL_INSTALLED', 'ADMIN_GRANT');

-- CreateEnum
CREATE TYPE "UpvoteTarget" AS ENUM ('SKILL', 'POST', 'REPLY', 'SHOWCASE');

-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('GENERAL', 'HELP', 'IDEAS', 'SHOW_AND_TELL');

-- CreateEnum
CREATE TYPE "SkillRequestStatus" AS ENUM ('OPEN', 'FULFILLED');

-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "communityScore" INTEGER NOT NULL DEFAULT 0,
    "tokenBalance" INTEGER NOT NULL DEFAULT 0,
    "isEarlyAdopter" BOOLEAN NOT NULL DEFAULT false,
    "githubId" TEXT,
    "googleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "installCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillTag" (
    "skillId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "SkillTag_pkey" PRIMARY KEY ("skillId","tag")
);

-- CreateTable
CREATE TABLE "SkillTestedOn" (
    "skillId" TEXT NOT NULL,
    "model" TEXT NOT NULL,

    CONSTRAINT "SkillTestedOn_pkey" PRIMARY KEY ("skillId","model")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "BadgeType" NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "TokenTransactionType" NOT NULL,
    "skillId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upvote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetType" "UpvoteTarget" NOT NULL,
    "targetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionSkill" (
    "collectionId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionSkill_pkey" PRIMARY KEY ("collectionId","skillId")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "category" "PostCategory" NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "status" "SkillRequestStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillRequestReply" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "skillId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SkillRequestReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Showcase" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Showcase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowcaseSkill" (
    "showcaseId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "ShowcaseSkill_pkey" PRIMARY KEY ("showcaseId","skillId")
);

-- CreateTable
CREATE TABLE "ImprovementSuggestion" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "proposedContent" TEXT NOT NULL,
    "note" TEXT,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImprovementSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_userId_type_key" ON "Badge"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_userId_targetType_targetId_key" ON "Upvote"("userId", "targetType", "targetId");

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillTag" ADD CONSTRAINT "SkillTag_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillTestedOn" ADD CONSTRAINT "SkillTestedOn_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenTransaction" ADD CONSTRAINT "TokenTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionSkill" ADD CONSTRAINT "CollectionSkill_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionSkill" ADD CONSTRAINT "CollectionSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillRequest" ADD CONSTRAINT "SkillRequest_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillRequestReply" ADD CONSTRAINT "SkillRequestReply_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "SkillRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showcase" ADD CONSTRAINT "Showcase_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowcaseSkill" ADD CONSTRAINT "ShowcaseSkill_showcaseId_fkey" FOREIGN KEY ("showcaseId") REFERENCES "Showcase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowcaseSkill" ADD CONSTRAINT "ShowcaseSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImprovementSuggestion" ADD CONSTRAINT "ImprovementSuggestion_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImprovementSuggestion" ADD CONSTRAINT "ImprovementSuggestion_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

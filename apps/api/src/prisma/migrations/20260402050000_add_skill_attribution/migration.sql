-- AlterTable
ALTER TABLE "Skill" ADD COLUMN "originalAuthorName" TEXT,
ADD COLUMN "originalAuthorUrl" TEXT,
ADD COLUMN "sourceUrl" TEXT,
ADD COLUMN "claimedById" TEXT,
ADD COLUMN "claimedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_claimedById_fkey" FOREIGN KEY ("claimedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

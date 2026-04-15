-- AlterEnum
ALTER TYPE "BadgeType" ADD VALUE 'PATRON';

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Donation_stripeSessionId_key" ON "Donation"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_stripePaymentIntentId_key" ON "Donation"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "Donation_userId_idx" ON "Donation"("userId");

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

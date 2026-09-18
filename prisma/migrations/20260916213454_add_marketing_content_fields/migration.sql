-- AlterEnum
ALTER TYPE "TourCategory" ADD VALUE 'STREET_FOOD_TOUR';

-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "daysOffered" TEXT,
ADD COLUMN     "dietaryInfo" TEXT,
ADD COLUMN     "durationLabel" TEXT,
ADD COLUMN     "groupSizeLabel" TEXT,
ADD COLUMN     "highlights" TEXT[],
ADD COLUMN     "language" TEXT,
ADD COLUMN     "meetingPoint" TEXT,
ADD COLUMN     "priceIsFrom" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priceOnRequest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startingTime" TEXT,
ADD COLUMN     "tourType" TEXT,
ADD COLUMN     "validityLabel" TEXT,
ADD COLUMN     "weatherPolicy" TEXT,
ADD COLUMN     "whatToExpectFood" TEXT,
ADD COLUMN     "whatToExpectHistory" TEXT,
ADD COLUMN     "whatToWear" TEXT,
ADD COLUMN     "whatsIncluded" TEXT,
ADD COLUMN     "whatsNotIncluded" TEXT,
ADD COLUMN     "whoShouldTakeIt" TEXT;

-- AlterTable
ALTER TABLE "TransferRoute" ADD COLUMN     "durationLabel" TEXT;

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

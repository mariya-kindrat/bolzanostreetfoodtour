-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "coverImageAlt" TEXT,
ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('PDF', 'YOUTUBE', 'WEBSITE', 'IMAGE');

-- AlterTable
ALTER TABLE "ActionResource" ADD COLUMN     "resourceType" "ResourceType" NOT NULL DEFAULT 'WEBSITE';

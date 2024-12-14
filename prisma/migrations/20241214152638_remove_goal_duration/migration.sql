/*
  Warnings:

  - You are about to drop the column `duration` on the `Roadmap` table. All the data in the column will be lost.
  - You are about to drop the column `durationUnit` on the `Roadmap` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Roadmap" DROP COLUMN "duration",
DROP COLUMN "durationUnit";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 10;

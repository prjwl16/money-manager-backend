/*
  Warnings:

  - You are about to drop the column `createdById` on the `groups` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_createdById_fkey";

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "createdById",
ADD COLUMN     "createdBy" UUID;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

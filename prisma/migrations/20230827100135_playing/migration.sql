/*
  Warnings:

  - You are about to drop the `_UserTogroups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserTogroups" DROP CONSTRAINT "_UserTogroups_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserTogroups" DROP CONSTRAINT "_UserTogroups_B_fkey";

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "createdById" UUID;

-- DropTable
DROP TABLE "_UserTogroups";

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

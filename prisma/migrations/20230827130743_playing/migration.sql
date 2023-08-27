/*
  Warnings:

  - The primary key for the `userInGroups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `groupsId` on the `userInGroups` table. All the data in the column will be lost.
  - Added the required column `groupId` to the `userInGroups` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "userInGroups" DROP CONSTRAINT "userInGroups_groupsId_fkey";

-- AlterTable
ALTER TABLE "userInGroups" DROP CONSTRAINT "userInGroups_pkey",
DROP COLUMN "groupsId",
ADD COLUMN     "groupId" UUID NOT NULL,
ADD CONSTRAINT "userInGroups_pkey" PRIMARY KEY ("userId", "groupId");

-- AddForeignKey
ALTER TABLE "userInGroups" ADD CONSTRAINT "userInGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

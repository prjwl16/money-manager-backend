/*
  Warnings:

  - You are about to drop the column `groupsId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_groupsId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "groupsId",
ADD COLUMN     "groupId" UUID;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

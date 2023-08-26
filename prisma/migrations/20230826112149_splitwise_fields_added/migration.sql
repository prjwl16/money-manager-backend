/*
  Warnings:

  - A unique constraint covering the columns `[splitwiseUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "splitwiseAccessToken" TEXT,
ADD COLUMN     "splitwiseUserId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_splitwiseUserId_key" ON "User"("splitwiseUserId");

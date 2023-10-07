/*
  Warnings:

  - Added the required column `transactionId` to the `BaseTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BaseTransaction" ADD COLUMN     "transactionId" INTEGER NOT NULL;

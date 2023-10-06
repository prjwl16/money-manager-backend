/*
  Warnings:

  - You are about to drop the column `isRecurringTransaction` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "isRecurringTransaction",
ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false;

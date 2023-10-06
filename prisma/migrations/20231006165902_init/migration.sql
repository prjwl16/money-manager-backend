/*
  Warnings:

  - You are about to drop the column `numberOfOccurances` on the `RecurringTransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RecurringTransaction" DROP COLUMN "numberOfOccurances",
ADD COLUMN     "numberOfOccurrences" INTEGER DEFAULT 0;

/*
  Warnings:

  - You are about to drop the column `recurringId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_recurringId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "recurringId",
ADD COLUMN     "recurringTransactionId" INTEGER;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recurringTransactionId_fkey" FOREIGN KEY ("recurringTransactionId") REFERENCES "RecurringTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

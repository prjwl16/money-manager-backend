/*
  Warnings:

  - You are about to drop the `BaseTransaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accountId` to the `RecurringTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `RecurringTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BaseTransaction" DROP CONSTRAINT "BaseTransaction_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "BaseTransaction" DROP CONSTRAINT "BaseTransaction_recurringTransactionId_fkey";

-- AlterTable
ALTER TABLE "RecurringTransaction" ADD COLUMN     "accountId" INTEGER NOT NULL,
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "BaseTransaction";

-- AddForeignKey
ALTER TABLE "RecurringTransaction" ADD CONSTRAINT "RecurringTransaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTransaction" ADD CONSTRAINT "RecurringTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

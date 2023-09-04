/*
  Warnings:

  - You are about to drop the column `createdById` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `paidById` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updatedByIds` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `usersInTransactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_paidById_fkey";

-- DropForeignKey
ALTER TABLE "usersInTransactions" DROP CONSTRAINT "usersInTransactions_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "usersInTransactions" DROP CONSTRAINT "usersInTransactions_userId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "createdById",
DROP COLUMN "paidById",
DROP COLUMN "updatedByIds";

-- DropTable
DROP TABLE "usersInTransactions";

-- CreateTable
CREATE TABLE "userTransaction" (
    "userId" INTEGER NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "splitShare" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "splitPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "userTransaction_pkey" PRIMARY KEY ("userId","transactionId")
);

-- AddForeignKey
ALTER TABLE "userTransaction" ADD CONSTRAINT "userTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userTransaction" ADD CONSTRAINT "userTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

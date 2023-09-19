-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "TransactionAction" AS ENUM ('INCOME', 'EXPENSE', 'SUBSCRIPTION', 'SELF_TRANSFER');

-- CreateEnum
CREATE TYPE "subscriptionPeriod" AS ENUM ('ONETIME', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CASH', 'BANK', 'CREDIT_CARD', 'DEBIT_CARD', 'LOAN');

-- CreateEnum
CREATE TYPE "currency" AS ENUM ('INR', 'USD');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "googleId" TEXT,
    "avatar" TEXT,
    "swUserId" INTEGER,
    "swAccessToken" TEXT,
    "doneSetup" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "type" "TransactionAction" NOT NULL DEFAULT 'EXPENSE',
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "currency" NOT NULL DEFAULT 'INR',
    "name" TEXT,
    "description" TEXT,
    "date" TIMESTAMP(3),
    "place" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringPeriod" "subscriptionPeriod" NOT NULL DEFAULT 'ONETIME',
    "recurringPeriodCount" INTEGER DEFAULT 0,
    "recurringStartDate" TIMESTAMP(3),
    "recurringEndDate" TIMESTAMP(3),
    "swExpenseId" INTEGER,
    "swGroupId" INTEGER,
    "createdBy" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountType" NOT NULL DEFAULT 'CASH',
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "swId" INTEGER,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "avatar" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGroup" (
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,
    "swUserId" INTEGER,
    "swGroupId" INTEGER,

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("userId","groupId")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_swUserId_key" ON "User"("swUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_swExpenseId_key" ON "Transaction"("swExpenseId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_swGroupId_key" ON "Transaction"("swGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_swId_key" ON "Category"("swId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userTransaction" ADD CONSTRAINT "userTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userTransaction" ADD CONSTRAINT "userTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_phone_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "phone" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_phone_fkey" FOREIGN KEY ("phone") REFERENCES "User"("phone") ON DELETE RESTRICT ON UPDATE CASCADE;

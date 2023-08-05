-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "type" SET DEFAULT 'CASH';

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

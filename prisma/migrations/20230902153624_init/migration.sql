/*
  Warnings:

  - You are about to drop the column `default` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "default",
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

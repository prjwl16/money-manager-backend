-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "phone" INTEGER NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "action" VARCHAR(255) NOT NULL,
    "date" VARCHAR(255),
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "particular" VARCHAR(255),
    "phone" INTEGER NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_phone_fkey" FOREIGN KEY ("phone") REFERENCES "User"("phone") ON DELETE RESTRICT ON UPDATE CASCADE;

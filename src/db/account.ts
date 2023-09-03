import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAccounts = async (userId: number) => {
  return prisma.account.findMany({ where: { userId: userId } })
}

export const addAccounts = async (accountObject: Prisma.AccountCreateManyInput[]) => {
  return prisma.account.createMany({ data: accountObject })
}

export const getAccountByName = async (userId: number, name: string) => {
  return prisma.account.findMany({ where: { userId: userId, name: name } })
}

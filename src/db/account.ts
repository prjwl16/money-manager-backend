import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAccounts = async (userId: string) => {
  return prisma.account.findMany({ where: { userId: userId } })
}

export const addAccount = async (accountObject: any) => {
  return prisma.account.create({ data: accountObject })
}

export const getAccountByName = async (name: string) => {
  return prisma.account.findUnique({ where: { name: name } })
}

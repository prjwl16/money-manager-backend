import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getGroupByName = async (name: string) => {
  return prisma.groups.findFirst({ where: { name: name } })
}

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getGroupByName = async (name: string) => {
  return prisma.group.findFirst({ where: { name: name } })
}

export const createGroup = async (userId: number, name: string, description: string) => {
  return prisma.group.create({
    data: {
      name: name,
      description: description,
      members: {
        create: {
          userId: userId,
        },
      },
      createdByUser: {
        connect: {
          id: userId,
        },
      },
    },
  })
}

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
          id: userId,
        },
      },
      admin: {
        connect: {
          id: userId,
        },
      },
    },
  })
}

export const getGroupByUserId = async (userId: number) => {
  return prisma.group.findFirst({ where: { members: { some: { id: userId } } } })
}

export const addUserToGroup = async (userId: number, groupId: number) => {
  console.log('userId', userId)
  console.log('groupId', groupId)
  return prisma.group.update({
    where: { id: groupId },
    data: {
      members: {
        connect: {
          id: userId,
        },
      },
    },
  })
}

import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const addCategory = async (category: Prisma.CategoryCreateInput) => {
  return prisma.category
    .create({
      data: category,
    })
    .catch((err) => {
      console.log('ERR', err)
      return err
    })
}

export const getCategory = async (userId: number, page: number) => {
  if (page) return prisma.category.findMany({ skip: (page - 1) * 10, take: 10, where: { userId: userId } })
  return prisma.category.findMany({ where: { isDefault: true }, select: { id: true, name: true } })
}

export const addManyCategories = async (categories: Prisma.CategoryCreateInput[]) => {
  return prisma.category.createMany({ data: categories })
}

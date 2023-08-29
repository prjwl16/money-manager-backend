import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const addCategory = async (categoryObj: any) => {
  return prisma.category
    .create({
      data: {
        title: categoryObj.title,
        userId: categoryObj.userId,
      },
    })
    .catch((err) => {
      console.log('ERR', err)
      return err
    })
}

const getCategory = async (userId: string) => {
  return prisma.category.findMany({ where: { userId: userId } })
}

export { addCategory, getCategory }

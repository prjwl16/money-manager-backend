import { Prisma, PrismaClient } from '@prisma/client'
import logger from '../utils/logger.ts'

export const addCategories = () => {
  console.log('Adding categories')
  const prisma = new PrismaClient()
  type Category = Prisma.CategoryCreateInput
  const categories: Category[] = [
    {
      name: 'Groceries',
      isDefault: true,
    },
    {
      name: 'Subscriptions',
      isDefault: true,
    },
    {
      name: 'Household',
      isDefault: true,
    },
    {
      name: 'Transportation',
      isDefault: true,
    },
    {
      name: 'Insurance',
      isDefault: true,
    },
    {
      name: 'Rent',
      isDefault: true,
    },
    {
      name: 'Bills',
      isDefault: true,
    },
    {
      name: 'Entertainment',
      isDefault: true,
    },
    {
      name: 'Shopping',
      isDefault: true,
    },
    {
      name: 'Health',
      isDefault: true,
    },
  ]
  prisma.category
    .createMany({ data: categories })
    .then((res) => {
      logger.info(`Added ${res.count} categories`)
    })
    .catch((err) => {
      logger.error(`Error adding categories: ${err}`)
    })
}

import { Prisma } from '@prisma/client'

export const defaultCategories: Prisma.CategoryCreateManyInput[] = [
  {
    name: 'Food',
  },
  {
    name: 'Travel',
  },
  {
    name: 'Shopping',
  },
  {
    name: 'Entertainment',
  },
  {
    name: 'Bills',
  },
  {
    name: 'Others',
  },
]

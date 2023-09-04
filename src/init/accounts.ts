import { Prisma, PrismaClient } from '@prisma/client'
import logger from '../utils/logger.js'

export const addDefaultAccounts = (userId: string) => {
  const prisma = new PrismaClient()
  const accounts: Prisma.AccountCreateInput[] = [
    {
      name: 'cash',
      type: 'CASH',
      balance: 0,
    },
    {
      name: 'bank',
      type: 'BANK',
      balance: 0,
      isDefault: true,
    },
  ]

  // prisma.account
  //   .createMany({ data: accounts, skipDuplicates: true })
  //   .catch((err) => {
  //     logger.error('Failed to add accounts: ', err)
  //   })
  //   .then(() => {
  //     logger.info('Successfully added accounts')
  //   })
}

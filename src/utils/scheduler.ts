import prisma from '../../prisma/client.js'
import moment from 'moment'
import { calculateNextExecutionDate, getMomentPeriods } from './utils.js'
import { Prisma } from '@prisma/client'

export const fetchAndAddTransactions = async () => {
  try {
    const transactions = await prisma.recurringTransaction.findMany({
      where: {
        nextExecutionDate: {
          gte: new Date(moment().startOf('day').toDate()),
          lt: new Date(moment().endOf('day').toDate()),
        },
        isActive: true,
      },
    })

    const transactionsToBeUpdated: Prisma.RecurringTransactionUpdateManyMutationInput[] = []

    console.log('transactions: ', transactions)
    console.log('transactions.length: ', transactions.length)

    //calculate nextExecutionDate and add transaction to database
    for (const transaction of transactions) {
      const recurringPeriod = getMomentPeriods(transaction.recurringPeriod)
      const nextExecutionDate = calculateNextExecutionDate(transaction.nextExecutionDate, 1, recurringPeriod)
      //check if nextExecutionDate is greater than endDate and if so, set isActive to false using updateMany
      //add nextExecutionDate to remaining transactions
      if (transaction.endDate && nextExecutionDate > transaction.endDate) {
        transactionsToBeUpdated.push({
          ...transaction,
          isActive: false,
        })
      } else {
        transactionsToBeUpdated.push({
          ...transaction,
          nextExecutionDate: nextExecutionDate,
        })
      }

      console.log('transaction: ', transactionsToBeUpdated)

      //update recurringTransaction table

      // await prisma.recurringTransaction.updateMany({
      //   data: transactionsToBeUpdated,
      // })
    }
  } catch (e) {
    console.log('ERR: ', e)
    throw e || 'Failed to add transaction'
  }
}

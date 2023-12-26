import prisma from '../../prisma/client.js'
import moment from 'moment'
import { calculateNextExecutionDate, getMomentPeriods, parseTransactionFromRecurringTransaction } from './utils.js'
import { Prisma } from '@prisma/client'

//TODO: handle errors better and maintain logs

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

    const transactionsToBeUpdated: Prisma.RecurringTransactionUncheckedUpdateManyInput[] = []

    console.log('transactions: ', transactions)
    console.log('transactions.length: ', transactions.length)

    //calculate nextExecutionDate and add transaction to database
    prisma
      .$transaction(async (prisma) => {
        const updateRecurringTransactions = []
        const newTransactionsToBeAdded = []

        for (const transaction of transactions) {
          const recurringPeriod = getMomentPeriods(transaction.recurringPeriod)
          const nextExecutionDate = calculateNextExecutionDate(transaction.nextExecutionDate, 1, recurringPeriod)
          //check if nextExecutionDate is greater than endDate and if so, set isActive to false using updateMany
          //add nextExecutionDate to remaining transactions
          let transactionToBeUpdated = {}
          if (transaction.endDate && nextExecutionDate > transaction.endDate) {
            transactionToBeUpdated = {
              id: transaction.id,
              isActive: false,
            }
          } else {
            newTransactionsToBeAdded.push(parseTransactionFromRecurringTransaction([transaction])[0])
            transactionToBeUpdated = {
              id: transaction.id,
              nextExecutionDate: nextExecutionDate,
            }
          }

          updateRecurringTransactions.push(
            prisma.recurringTransaction.update({
              where: {
                id: transaction.id,
              },
              data: transactionToBeUpdated,
            })
          )
          console.log('transaction: ', transactionsToBeUpdated)
        }
        await Promise.all(updateRecurringTransactions).catch((e) => {
          console.log('error: ', e)
        })
        await prisma.transaction.createMany({
          data: newTransactionsToBeAdded,
        })
      })
      .catch((e) => {
        console.log('error adding transactions: ', e)
      })
  } catch (e) {
    console.log('ERR: ', e)
    throw e || 'Failed to add transaction'
  }
}

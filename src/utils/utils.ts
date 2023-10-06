import prisma from '../../prisma/client.js'
import moment from 'moment/moment.js'

export const verifyAccount = async (accountId: number, userId: number) => {
  const account = await prisma.account.findUnique({
    where: {
      id: accountId,
    },
  })
  if (!account) throw Error('Account not found')
  if (account.userId !== userId) throw Error('Account does not belong to user')
}

export const verifyCategory = async (categoryId: number, userId: number) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  })
  if (!category) throw Error('Category not found')
  if (category.userId && category.userId !== userId) throw Error('Category does not belong to user')
}
export const calculateEndDate = (
  endDate: Date,
  startDate: Date,
  numberOfOccurrences: number,
  recurringPeriod: 'days' | 'weeks' | 'months' | 'years'
) => {
  if (endDate) return new Date(endDate)

  if (numberOfOccurrences && recurringPeriod) {
    startDate = startDate ? startDate : new Date()
    const endDate = moment(startDate).add(numberOfOccurrences, recurringPeriod).toDate()
    return endDate
  }
}

export const calculateNextExecutionDate = (
  startDate: Date,
  numberOfOccurrences: number,
  recurringPeriod: 'days' | 'weeks' | 'months' | 'years'
) => {
  startDate = startDate ? startDate : new Date()
  const nextExecutionDate = moment(startDate).add(numberOfOccurrences, recurringPeriod).toDate()
  return nextExecutionDate
}

export const calculateNumberOfOccurrences = (
  endDate: Date,
  startDate: Date,
  recurringPeriod: 'days' | 'weeks' | 'months' | 'years'
) => {
  if (endDate) {
    const numberOfOccurrences = moment(endDate).diff(startDate, recurringPeriod)
    return numberOfOccurrences
  }
}

export const getMomentPeriods = (
  recurringPeriod: 'ONETIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY'
) => {
  let period = 'days' as 'days' | 'weeks' | 'months' | 'years'
  switch (recurringPeriod) {
    case 'DAILY':
      period = 'days'
      break
    case 'WEEKLY':
      period = 'weeks'
      break
    case 'MONTHLY':
      period = 'months'
      break
    case 'YEARLY':
      period = 'years'
      break
  }
  return period
}

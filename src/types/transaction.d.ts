export type TransactionMember = {
  userId: number
  splitPaid: number
  splitShare: number
}

export type TransactionFilterType = {
  id: number
  type?: 'INCOME' | 'EXPENSE' | 'SELF_TRANSFER' | 'INVESTMENT'
  name?: string
  amount?: number
  currency?: 'INR' | 'USD'
  date?: Date
  isRecurring?: boolean
  userId: number
  toDate?: Date
  fromDate?: Date
  offset?: number
  order: {
    date: 'asc' | 'desc'
    createdAt: 'asc' | 'desc'
    amount: 'asc' | 'desc'
  }
}

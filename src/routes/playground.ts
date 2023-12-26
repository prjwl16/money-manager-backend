import { Router } from 'express'
import prisma from '../prisma/client.js'
import { fetchAndAddTransactions } from '../utils/scheduler.js'
import { addTransaction } from './transaction.js'

const router = Router()

router.get('/', async (_req, res) => {
  const { id } = res.locals.user

  //add recurring transactions

  await fetchAndAddTransactions()

  return res.send({
    success: true,
    data: '',
    error: null,
  })
})

router.post('/txn/addmany', async (req, res) => {
  try {
    const body = req.body
    const response = []
    for (const transaction of body) {
      response.push(await addTransaction(transaction, res.locals.user.id))
    }
    return res.send({
      success: true,
      data: response,
    })
  } catch (e) {
    console.log('Error: ', e.message)
    return res.boom.badRequest(e || 'Failed to add transaction')
  }
})

export { router as playgroundRouter }

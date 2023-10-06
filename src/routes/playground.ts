import { Router } from 'express'
import prisma from '../../prisma/client.js'
import { fetchAndAddTransactions } from '../utils/scheduler.js'

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

export { router as playgroundRouter }

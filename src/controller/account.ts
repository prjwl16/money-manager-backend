import { Request, Response } from 'express'
import { addAccount, getAccounts } from '../db/account.js'

export const get = async (req: Request, res: Response) => {
  try {
    const { id } = res.locals.user
    const response = await getAccounts(id)
    return res.send({
      success: true,
      data: response,
      message: 'Accounts fetched successfully',
    })
  } catch (err) {
    console.log('ERR', err)
    return res.send({
      success: false,
      error: err,
    })
  }
}

export const add = async (req: Request, res: Response) => {
  try {
    const body = req.body
    const accountObject = {
      name: body.name,
      userId: res.locals.user.id,
      type: body.type,
      balance: body.balance,
    }

    console.log('Adding account: ', accountObject)
    const response = await addAccount(accountObject)
    return res.send({
      success: true,
      data: response,
      message: 'Account added successfully',
    })
  } catch (err) {
    console.log('ERR', err)
    return res.send({
      success: false,
      error: err,
    })
  }
}

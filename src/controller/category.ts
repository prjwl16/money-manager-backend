import { Request, Response } from 'express'
import { addCategory, getCategory } from '../db/category.js'

export const add = async (req: Request, res: Response) => {
  try {
    const body = req.body
    const categoryObject = {
      title: body.name,
      userId: res.locals.user.id,
    }

    console.log('Adding category: ', categoryObject)
    const response = await addCategory(categoryObject)
    return res.send({
      success: true,
      data: response,
      message: 'Category added successfully',
    })
  } catch (err) {
    console.log('ERR', err)
    return res.send({
      success: false,
      error: err,
    })
  }
}

export const fetch = async (req: Request, res: Response) => {
  try {
    const { id } = res.locals.user
    const response = await getCategory(id)
    return res.send({
      success: true,
      data: response,
      message: 'Category fetched successfully',
    })
  } catch (err) {
    console.log('ERR', err)
    return res.send({
      success: false,
      error: err,
    })
  }
}

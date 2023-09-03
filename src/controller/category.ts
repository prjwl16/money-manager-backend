import { Request, Response } from 'express'
import { addCategory, getCategory } from '../db/category.js'
import { Prisma } from '@prisma/client'

export const get = async (req: Request, res: Response) => {
  try {
    const { id } = res.locals.user
    const page = parseInt(req.params.page) || 0

    const response = await getCategory(id, page)
    return res.send({
      success: true,
      data: response,
      message: 'Category fetched successfully',
    })
  } catch (err) {
    console.log('ERR fetching category', err)
    return res.boom.badRequest('Failed to fetch category', { success: false })
  }
}

export const add = async (req: Request, res: Response) => {
  try {
    const body = req.body
    const categoryObject: Prisma.CategoryCreateInput = {
      name: body.name,
      user: {
        connect: {
          id: res.locals.user.id,
        },
      },
    }
    const response = await addCategory(categoryObject)
    return res.send({
      success: true,
      data: response,
      message: 'Category added successfully',
    })
  } catch (err) {
    console.log('ERR adding category', err)
    return res.boom.badRequest('Failed to add category', { success: false })
  }
}

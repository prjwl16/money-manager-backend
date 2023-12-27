import { Router } from 'express'
import { Request, Response } from 'express'
import prisma from '../client.js'
import { defaultCategories } from '../utils/defaultCategories.js'

const router = Router()

const categoryModule = {
  async getCategories(req: Request, res: Response) {
    const { id } = res.locals.user
    try {
      const categories = await prisma.category.findMany({})
      return res.send({
        success: true,
        data: categories,
        error: null,
      })
    } catch (err) {
      return res.send({
        success: false,
        data: null,
        error: 'Failed to get categories',
      })
    }
  },

  async addDefaultCategories(req: Request, res: Response) {
    try {
      const category = await prisma.category.createMany({
        data: defaultCategories,
      })
      return res.send({
        success: true,
        data: category,
        error: null,
      })
    } catch (err) {
      return res.send({
        success: false,
        data: null,
        error: 'Failed to add category',
      })
    }
  },

  async addUserCategory(req: Request, res: Response) {
    try {
      const { id } = res.locals.user
      const data = req.body
      const category = await prisma.category.create({
        data: {
          ...data,
          user: {
            connect: {
              id,
            },
          },
        },
      })
      return res.send({
        success: true,
        data: category,
        error: null,
      })
    } catch (err) {
      return res.send({
        success: false,
        data: null,
        error: 'Failed to add category',
      })
    }
  },
}

router.get('/', categoryModule.getCategories)
router.post('/', categoryModule.addUserCategory)
router.post('/addDefault', categoryModule.addDefaultCategories)

export { router as categoryRouter }

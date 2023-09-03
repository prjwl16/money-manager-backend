import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import logger from '../utils/logger.js'
import { getUserByEmail } from '../db/user.js'
import config from 'config'
import { Prisma } from '@prisma/client'

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
      const token = bearerHeader.split(' ')[1]
      try {
        const secret: string = config.get('jwt.secret')
        const data = jwt.verify(token, secret)
        if (typeof data === 'string') throw Error('Invalid token provided')
        const user = await getUserByEmail(data.email)
        if (!user) throw Error('User not found')
        res.locals = {
          user,
        }
      } catch (err) {
        return res.boom.badRequest('Invalid token provided')
      }
      next()
    } else {
      res.boom.badRequest('Token not provided')
    }
  } catch (err) {
    res.boom.badImplementation("It's on us.!", { success: false })
  }
}

export const createToken = (id: number, email?: string | null, phone?: string | null, role?: string) => {
  try {
    const payload = {
      id,
      email,
      role,
    }
    const secret: string = config.get('jwt.secret')
    const token = jwt.sign(payload, secret, {
      expiresIn: '30d',
    })
    return token
  } catch (e) {
    logger.error(e)
    throw Error('token')
  }
}

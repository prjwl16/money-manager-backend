import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import logger from '@utils/logger.js'
import { Request } from '../types/Request.js'

const secret: string = process.env.SECRET_KEY || 'nodeSecret'
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split('')[1]
    try {
      const payload = jwt.verify(token, secret)
      req['user'] = payload
    } catch (err) {
      logger.error(err)
      res
        .send({
          error: 'Token not valid',
        })
        .status(403)
    }
    next()
  } else {
    res
      .send({
        error: 'Token not provided',
      })
      .status(403)
  }
}

export const createToken = (email: String) => {
  const expiresIn = 3 * 30 * 24 * 60 * 60
  const payload = {
    email,
  }
  const token = jwt.sign(payload, secret, {
    expiresIn,
  })
  return token
}

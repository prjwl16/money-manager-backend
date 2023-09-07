import { body, check, ResultFactory, validationResult } from 'express-validator'
import { NextFunction, Request, Response } from 'express'
import { error } from 'winston'
import { getUserByEmail, getUserByPhone } from '../../db/user.js'
import { errors } from '../../constants/errors.js'

export const addSignUpValidation = [
  // Express Validator checks go here
  check('phone').isLength({ min: 10, max: 10 }).withMessage('Phone number must be of 10 digits'),
  check('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
]

export const validateRequest = async (req: Request, res: Response, next: NextFunction) => {
  const errorsResult = validationResult(req).array()
  if (errorsResult.length) {
    return res.send({
      message: 'Bad Request',
      errorsResult,
    })
  }
  next()
}

export const signUpValidate = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.email) {
    const user = await getUserByEmail(req.body.email)
    if (user) {
      return res.status(406).send(errors.USER_EXISTS)
    }
  }
  if (req.body.phone) {
    const user = await getUserByPhone(req.body.phone)
    if (user) {
      return res.status(406).send(errors.USER_EXISTS)
    }
  }
  next()
}

export const singInValidate = [
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('phone').optional().isLength({ min: 10, max: 10 }).withMessage('Phone number must be of 10 digits'),
  check('email').optional().isEmail().withMessage('Invalid email provided'),
]

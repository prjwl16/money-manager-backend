import express from 'express'
const baseRouter = express()
import authRouter from './auth.js'

baseRouter.use('/auth', authRouter)

export default baseRouter

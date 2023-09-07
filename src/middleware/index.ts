import express, { Express } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import morgan from 'morgan'
import boom from 'express-boom'

export const Middlewares = (app: Express) => {
  app.use(boom())
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())

  app.use(passport.initialize())

  //Keep it, it's important -> and learn session
  // app.use(
  //   session({
  //     resave: false,
  //     saveUninitialized: true,
  //     secret: 'idk,I must read the docs',
  //   })
  // )

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  }
}

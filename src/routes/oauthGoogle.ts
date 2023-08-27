import { Request, Response, Router } from 'express'
import passport from 'passport'
import { createToken } from '../middleware/jwt.js'
import { handleGoogleCallBack } from '../controller/oauthController.js'

const router = Router()

const SERVER_URL = process.env.SERVER_URL
const FRONTEND_URL = process.env.FRONTEND_URL

const successRedirectUrl = `${SERVER_URL}/oauth/google/success`
const failedRedirectUrl = `${SERVER_URL}/oauth/google/failed`

router.get('/', passport.authenticate('google'))

router.get(
  '/callback',
  passport.authenticate('google', {
    failureMessage: 'Authentication Failed!',
    failureRedirect: failedRedirectUrl,
    session: false,
  }),
  handleGoogleCallBack
)

export { router as googleRouterAuth }

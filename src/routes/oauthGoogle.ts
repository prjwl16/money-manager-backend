import { Router } from 'express'
import passport from 'passport'
import { handleGoogleCallBack } from '../controller/oauthController.js'
import config from 'config'

const router = Router()

const host: string = config.get('host')
const callBackPath: string = config.get('google.callbackPath')

const failedRedirectUrl = host + callBackPath

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

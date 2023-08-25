import { Request, Response, Router } from 'express'
import passport from 'passport'
import { createToken } from '../middleware/jwt.js'

const router = Router()

const SERVER_URL = process.env.SERVER_URL
const FRONTEND_URL = process.env.FRONTEND_URL

router.get('/google', passport.authenticate('google'))

const successRedirectUrl = `${SERVER_URL}/oauth/google/success`
const failedRedirectUrl = `${SERVER_URL}/oauth/google/failed`

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureMessage: 'Authentication Failed!',
    failureRedirect: failedRedirectUrl,
    session: false,
  }),
  async (req: Request, res: Response) => {
    //create jwt token
    if (req.user) {
      const user = JSON.parse(JSON.stringify(req.user))
      const token = createToken(user.id, user.email, user.phone, user.role)
      res.redirect(`${FRONTEND_URL}/oauth?token=${token}`)
    }
    res.redirect(`${FRONTEND_URL}`)
  }
)

// router.get('/google/success', (req, res) => {
//   console.log('~~~~4~~~~~')
//   console.log('CB body ', req.body)
//   console.log('CB user ', req.user)
//
//   res.redirect(`${FRONTEND_URL}`)
// })
//

router.get('/google/failed', (req, res) => {
  console.log("Failed to authenticate user's google account")
  res.redirect(`${FRONTEND_URL}`)
})

export { router as oauthRouter }

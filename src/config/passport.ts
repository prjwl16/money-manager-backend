import config from 'config'
import passport from 'passport'
import strategy from 'passport-google-oauth20'
import { createUser, getUserByEmail } from '../db/user.js'
import logger from '../utils/logger.js'
import { Prisma } from '@prisma/client'

try {
  const GoogleStrategy = strategy.Strategy
  const host: string = config.get('host')
  const clientId: string = config.get('google.clientId')
  const clientSecret: string = config.get('google.clientSecret')
  const callbackPath: string = host + config.get('google.callbackPath')

  passport.use(
    new GoogleStrategy(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callbackPath,
        passReqToCallback: true,
        scope: ['profile', 'email'],
      },
      async function (_req, _accessToken, _refreshToken, profile, done) {
        if (!profile._json.email) return done(null, false)

        const user = await getUserByEmail(profile._json.email)
        if (user) return done(null, user)

        const userObjectFromGoogle: Prisma.UserCreateInput = {
          googleId: profile.id,
          email: profile._json.email,
          firstName: profile._json.given_name,
          lastName: profile._json.family_name,
          avatar: profile._json.picture,
        }
        const newUser = await createUser(userObjectFromGoogle).catch((err) => {
          console.log('Error creating new user: ', err)
        })
        if (!newUser) return done(null, false)
        return done(null, newUser)
      }
    )
  )
} catch (err) {
  console.log(err)
  logger.error(JSON.stringify(err))
}

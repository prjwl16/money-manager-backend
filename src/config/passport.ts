import passport from 'passport'
import strategy from 'passport-google-oauth20'
import { createUser, getUserByEmail } from '../db/user.js'

const GoogleStrategy = strategy.Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
      passReqToCallback: true,
      scope: ['profile', 'email'],
    },
    async function (req, accessToken, refreshToken, profile, done) {
      if (!profile._json.email) return done(null, false)

      const user = await getUserByEmail(profile._json.email)
      if (user) return done(null, user)

      const userObjectFromGoogle = {
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

//NOTE: No need because session is not used

// passport.serializeUser(function (user, done) {
//   console.log('~~~~2~~~~~')
//   done(null, user)
// })
//
// passport.deserializeUser(function (user, done) {
//   console.log('~~~~3~~~~~')
//   if (user) done(null, user)
// })

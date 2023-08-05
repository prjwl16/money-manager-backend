export const errors = {
  INTERNAL_SERVER_ERROR: {
    code: 502,
    message: "Opps... it's on us. Internal server error",
  },
  SOMETHING_WENT_WRONG: {
    code: 401,
    message: 'Lemme check.. Something went wrong.',
  },
  BAD_REQUEST: {
    code: 402,
    message: 'You messed up...',
  },
  USER_EXISTS: {
    code: 406,
    message: 'We have met already. How about singing in..?',
  },
  TOKEN_CREATION: {
    code: 403,
    message: 'Token creation failed.',
  },
  USER_CREATION_FAIELD: {
    code: 407,
    message: 'User creation failed.',
  },
  USER_NOT_FOUND: {
    code: 406,
    message: "I'm pretty sure we haven't met before. How about signing up..?",
  },
}

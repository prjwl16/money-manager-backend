import swApi from './axios.js'

const currentUser = `/get_current_user`
const getCurrentUser = async (accessToken: string) => {
  const sw = swApi(accessToken)
  return await sw.get(currentUser, {
    params: {
      dated_after: '2023-08-01',
      dated_before: '2023-08-31',
      limit: 20,
    },
  })
}

export { getCurrentUser }

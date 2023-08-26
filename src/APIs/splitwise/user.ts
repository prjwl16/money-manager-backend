import axios from 'axios'

const baseUrl = 'https://secure.splitwise.com/api/v3.0'

axios.defaults.baseURL = baseUrl

const currentUser = `/get_current_user`

const getCurrentUser = async (accessToken: string) => {
  return await axios.get(currentUser, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export { getCurrentUser }

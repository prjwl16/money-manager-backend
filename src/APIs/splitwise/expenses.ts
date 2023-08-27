import swApi from './axios.js'

const getExpensesPath = `/get_expenses`
const getFriendsPath = `/get_friends`
const getGroupsPath = `/get_groups`

export const fetchExpenses = async (accessToken: string, userId: number) => {
  const sw = swApi(accessToken)

  try {
    const { data } = await sw.get(getExpensesPath)
    console.log('Expenses: ', data)

    return data
  } catch (e) {
    console.log('Error: ', e)
  }
}

export const fetchFriends = async (accessToken: string, userId: number) => {
  const sw = swApi(accessToken)
  try {
    const { data } = await sw.get(getFriendsPath)
    return data
  } catch (e) {
    console.log('Error: ', e)
  }
}

export const fetchGroups = async (accessToken: string, userId: number) => {
  const sw = swApi(accessToken)
  try {
    const { data } = await sw.get(getGroupsPath)
    return data
  } catch (e) {
    console.log('Error: ', e)
  }
}

export const fetchFriend = async (accessToken: string, userId: number, friendId: number) => {
  const sw = swApi(accessToken)
  try {
    const { data } = await sw.get(`${getFriendsPath}/${friendId}`)
    return data
  } catch (e) {
    console.log('Error: ', e)
  }
}

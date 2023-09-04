import prisma from '../../prisma/client.js'
import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'

const User = prisma.user

interface updateQuery {
  email?: string
  phone?: string
}

export const getUserByEmail = async (email: string) => {
  console.log('~ Finding user by email: ', email)
  const user = User.findUnique({ where: { email } })
  console.log('User found')
  return user
}
export const getUserByPhone = async (phone: string) => {
  console.log('~ Finding user by phone: ', phone)
  return User.findUnique({ where: { phone } })
}

export const createUser = async (user: Prisma.UserCreateInput) => {
  console.log('~ Creating user: ', user)
  return User.create({ data: user })
}

const _getHashedPassword = async (plainPassword: string) => {
  return await bcrypt.hash(plainPassword, 4)
}

export const validateUser = async (userPassword: string, dbPassword: string) => {
  return await authenticate(userPassword, dbPassword)
}

export const authenticate = async (userPassword: string, dbPassword: string) => {
  return await bcrypt.compare(userPassword, dbPassword)
}

export const updateUser = async (updateQuery: updateQuery, user: Prisma.UserCreateInput) => {
  console.log('~ Updating user: ', user)
  if (updateQuery.email) return User.update({ where: { email: updateQuery.email }, data: user })
  else return User.update({ where: { phone: updateQuery.phone }, data: user })
}

export const updateNewUserSetup = async (userId: number) => {
  return User.update({ where: { id: userId }, data: { doneSetup: true } })
}

//Transaction of a user
//TODO: WIP
export const fetchTransactionOfUser = async (userId: number) => {
  return User.findUnique({
    where: { id: userId },
  })
}

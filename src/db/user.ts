import prisma from '../../prisma/client.js'
import bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'

const User = prisma.user

interface UserData {
  email?: string
  phone?: string
  password?: string
  splitwiseUserId?: number
  splitwiseAccessToken?: string
}

interface updateQuery {
  email?: string
  phone?: string
}

export const getUserByEmail = async (email: string) => {
  console.log('~ Finding user by email: ', email)
  return User.findUnique({ where: { email } })
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

export const markDone = async (userId: number) => {
  return User.update({ where: { id: userId }, data: { doneSetup: true } })
}

//Transaction of a user
export const fetchTransactionOfUser = async (userId: number) => {
  return User.findUnique({
    where: { id: userId },
    select: {
      usersInTransactions: {
        where: { transaction: { isSubscription: true } },
        select: {
          userId: true,
          transactionId: true,
          transaction: {
            select: {
              id: true,
              amount: true,
              description: true,
              date: true,
              type: true,
              currency: true,
              accountId: true,
              name: true,
              active: true,
            },
          },
        },
      },
    },
  })
}

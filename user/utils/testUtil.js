import mongoose from 'mongoose'
import { User } from '../resources/user/user.model'
import { generateToken } from '../utils/auth'
import { connect, options } from './db'

export const routerMatch = (route, router) => {
  const match =
    router.stack &&
    router.stack.find(
      s => s.route.path === route.path && s.route.methods[route.method]
    )

  return match
}

export const createRandomUser = async () => {
  const user = {}

  const token = await generateToken(user)
  return { user, token }
}

export const clearDatabase = async (dbUri, opts = options) => {
  console.log('clear database => ', dbUri)

  async function clearDB() {
    try {
      await User.deleteMany({})

      console.log('all db data removed')
    } catch (err) {
      console.log(err)
    }
  }

  if (mongoose.connection.readyState === 0) {
    try {
      await connect(dbUri, opts)
      await clearDB()
      console.log('clearDB finished')
    } catch (e) {
      console.log('connection error')
      console.error(e)
      throw e
    }
  } else {
    await clearDB()
    console.log('clearDB finished')
  }
}

export const assertRouterMatch = (routes, router) => {
  routes.forEach(route => {
    const match = routerMatch(route, router)
    expect(match).toBeTruthy()
  })
}

export const remove = model =>
  new Promise((resolve, reject) => {
    model.remove(err => {
      if (err) return reject(err)
      resolve()
    })
  })

export const createUser = async (
  name,
  email,
  password,
  roles,
  phone,
  whatsapp,
  contacts
) => {
  try {
    const user = await User.create({
      name,
      email,
      password,
      roles,
      phone,
      whatsapp,
      contacts
    })

    console.log('createUserSeller seller => ', user.name, user.id)
    return user
  } catch (e) {
    console.log('createUserSeller error', e)
    throw e
  }
}

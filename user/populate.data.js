import mongoose from 'mongoose'
import { clearDatabase, createUser } from './utils/testUtil'
import _ from 'lodash'
import { dbUrl } from './utils/db'
import { ROLES } from './resources/user/user.model'

// 'Populate random test data'
const populate = async () => {
  try {
    const users = []

    // clear database
    await clearDatabase(dbUrl)

    // populate users
    let user
    const names = ['yassine', 'amine', 'mohammed', 'islam', 'ali']

    await Promise.all(
      _.map(names, async name => {
        user = await createUser(
          name,
          `${name}@gmail.com`,
          '12345678',
          [ROLES.admin],
          process.env.PHONE,
          process.env.PHONE,
          []
        )
        users.push(user)
      })
    )

    await Promise.all(
      _.map(users, async user => {
        user.contacts = users
        await user.save()
      })
    )

    await mongoose.disconnect()
    console.log('populate finished with sucess ')
  } catch (e) {
    console.log('populate error => ', e)
  }
}

populate()

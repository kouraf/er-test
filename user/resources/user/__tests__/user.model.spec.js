import { ROLES, User } from '../user.model'

describe('User base model tests', () => {
  describe('test user schema', () => {
    test('user model has email field', () => {
      const email = User.schema.obj.email
      expect(email).toEqual({
        type: String,
        required: true,
        unique: true
      })
    }, 30000)

    test('user model has name field', () => {
      const name = User.schema.obj.name
      expect(name).toEqual({
        type: String,
        required: true
      })
    })

    test('user model has roles field', () => {
      const roles = User.schema.obj.roles
      expect(roles).toEqual({
        type: [String],
        enum: Object.values(ROLES)
      })
    })

    test('user model has phone field', () => {
      const phone = User.schema.obj.phone
      expect(phone).toEqual({
        type: String,
        required: false
      })
    })

    test('user model has whatsapp field', () => {
      const whatsapp = User.schema.obj.whatsapp
      expect(whatsapp).toEqual({
        type: String,
        required: false
      })
    })

    test('user model has password field', () => {
      const password = User.schema.obj.password
      expect(password).toEqual({
        type: String,
        required: true
      })
    })
  })
})

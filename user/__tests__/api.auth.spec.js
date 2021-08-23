import request from 'supertest'
import { app } from '../app'
import { generateToken } from '../utils/auth'
import mongoose from 'mongoose'
import { createUser } from '../utils/testUtil'
import { ROLES } from '../resources/user/user.model'

describe('API Authentication:', () => {
  const id = mongoose.Types.ObjectId()
  let userToken
  let user
  beforeEach(async () => {
    user = await createUser(
      'yassine',
      'yassine@gmail.com',
      '12345678',
      [ROLES.admin],
      '213672055900',
      '213672055900',
      []
    )
    userToken = await generateToken(user)
  })

  expect.extend({
    toBeType(received, argument) {
      const initialType = typeof received
      const type =
        initialType === 'object'
          ? Array.isArray(received)
            ? 'array'
            : initialType
          : initialType
      return type === argument
        ? {
            message: () => `expected ${received} to be type ${argument}`,
            pass: true
          }
        : {
            message: () => `expected ${received} to be type ${argument}`,
            pass: false
          }
    }
  })

  describe('authentication ', () => {
    test('credentials malformed - undefined', async () => {
      const response = await request(app).post('/auth')
      console.log(response.body)
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBeType('array')
      expect(response.body.message.length).toBe(2)
    })

    test('credentials malformed - empty', async () => {
      const response = await request(app)
        .post('/auth')
        .send({})
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBeType('array')
      expect(response.body.message.length).toBe(2)
    })

    test('credentials malformed - missing email', async () => {
      const response = await request(app)
        .post('/auth')
        .send({ password: '12345678' })
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBeType('array')
      expect(response.body.message.length).toBe(1)
    })

    test('credentials malformed - email empty', async () => {
      const response = await request(app)
        .post('/auth')
        .send({ password: '12345678', email: '' })
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBeType('array')
      expect(response.body.message.length).toBe(1)
    })

    test('credentials malformed - missing password', async () => {
      const response = await request(app)
        .post('/auth')
        .send({ email: 'yassine@gmail.com' })
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBeType('array')
      expect(response.body.message.length).toBe(1)
    })

    test('credentials malformed - password too short', async () => {
      const response = await request(app)
        .post('/auth')
        .send({ password: '123', email: 'yassine@gmail.com' })
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBeType('array')
      expect(response.body.message.length).toBe(1)
    })

    test('credentials malformed - json ', async () => {
      const response = await request(app)
        .post('/auth')
        .send("{ password: '12345678' email: 'yassine@gmail.com' }")
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBeType('array')
      expect(response.body.message.length).toBe(2)
    })

    test('Should be unauthorized', async () => {
      const response = await request(app).post('/users')
      expect(response.statusCode).toBe(401)
    })

    test('Should be authorized', async () => {
      const res = await request(app)
        .patch(`/users/${id}`)
        .set('Authorization', `Bearer ${userToken}`)

      expect(res.statusCode).not.toBe(401)
      expect(res.statusCode).not.toBe(403)
    })
  })
})

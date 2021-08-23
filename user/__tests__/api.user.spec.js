import request from 'supertest'
import { app } from '../app'
import { createUser } from '../utils/testUtil'
import { generateToken } from '../utils/auth'
import { ROLES } from '../resources/user/user.model'

describe('User API', () => {
  let superAdminToken
  let superAdmin
  beforeEach(async () => {
    superAdmin = await createUser(
      'yassine',
      'yassine@gmail.com',
      '12345678',
      [ROLES.superAdmin],
      '213672055900',
      '213672055900',
      []
    )
    superAdminToken = await generateToken(superAdmin)
  })

  test('Create User', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'name',
        email: 'test@test1.com',
        password: '12345678',
        phone: '213672055900',
        whatsapp: '213672055900',
        roles: [ROLES.buyer]
      })
      .set('Authorization', `Bearer ${superAdminToken}`)

    expect(res).not.toBeNull()
    expect(res.statusCode).toBe(201)
  })

  test('User validation email', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'name',
        email: 'test.com',
        password: '12345678',
        phone: '213672055900',
        whatsapp: '213672055900',
        roles: [ROLES.buyer]
      })
      .set('Authorization', `Bearer ${superAdminToken}`)

    expect(res).not.toBeNull()
    expect(res.statusCode).toBe(422)
  })

  test('User validation phone', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'name',
        email: 'test@test.com',
        password: '12345678',
        phone: '2136720559000',
        whatsapp: '213672055900',
        roles: [ROLES.buyer]
      })
      .set('Authorization', `Bearer ${superAdminToken}`)

    expect(res).not.toBeNull()
    expect(res.statusCode).toBe(422)
  })

  test('Test get user details ', async () => {
    const res = await request(app)
      .get('/users/123')
      .set('Authorization', `Bearer ${superAdminToken}`)
    expect(res).not.toBeNull()
  })
})

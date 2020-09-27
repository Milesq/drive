import mockingoose from 'mockingoose'
import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/model'

describe('login system', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  it("login fails when user data isn't provided or incomplete", async () => {
    await request(app).post('/auth/login').expect(400)
    await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        user: {
          name: 'John',
        },
      })
      .expect(400)
  })

  it('login fails when user password is incorrect', async () => {
    mockingoose(User).toReturn(
      {
        name: 'John',
        pass: 'fly',
      },
      'findOne'
    )

    await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        user: {
          name: 'John',
          pass: 'zaq1@WSX',
        },
      })
      .expect(401)
  })

  it('login is succesfull when correct data is provided', async () => {
    mockingoose(User).toReturn(
      {
        name: 'John',
        pass: 'zaq1@WSX',
      },
      'findOne'
    )

    const response = await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        user: {
          name: 'John',
          pass: 'zaq1@WSX',
        },
      })
      .expect(200)

    expect(response.body?.token).toMatch(
      /^[0-9a-z]+\.[0-9a-z]+\.[0-9a-z]+$/i
    )
  })
})

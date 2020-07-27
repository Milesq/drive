import mockingoose from 'mockingoose'
import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/model'

describe('register system', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  it('register fails when user data is incomplete or not provided', async () => {
    await request(app).post('/auth/register').expect(400)
    await request(app)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send({
        user: {
          name: 'John',
          pass: 'zaq1@WSX',
        },
      })
      .expect(400)
  })

  it('register fails when user data is incorrect', async () => {
    const incorrectData = [
      { name: '$!`"' },
      { pass: '' },
      { phone: 123456789 },
      { phone: '34' },
      { phone: '123456789sadasd' },
      { phone: 'sadasd' },
    ]

    const allExamples = incorrectData.map(
      async incorrect => {
        await request(app)
          .post('/auth/register')
          .set('Content-Type', 'application/json')
          .send({
            user: {
              name: 'John',
              pass: 'zaq1@WSX',
              phone: '123456789',
              ...incorrect,
            },
          })
          .expect(400)
      }
    )

    await Promise.all(allExamples)
  })

  it('register fails when user already exists', async () => {
    mockingoose(User).toReturn({ name: 'foo' })

    const resp = await request(app)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send({
        user: {
          name: 'foo',
          pass: 'zaq1@WSX',
          phone: '123456789',
        },
      })
      .expect(409)

    expect(resp.body?.err).toBeDefined()
  })

  it('register returns token', async () => {
    const response = await request(app)
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send({
        user: {
          name: 'John',
          pass: 'zaq1@WSX',
          phone: '123456789',
        },
      })
      .expect(201)

    expect(response.body?.token).toBeInstanceOf(String)
    expect(response.body?.token).toMatch(
      /^[0-9a-z]+\.[0-9a-z]+\.[0-9a-z]+$/i
    )
  })
})

describe('login system', () => {
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

  it('login is succesfull when correct data is provided', async () => {
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

    expect(response.body?.token).toBeInstanceOf(String)
    expect(response.body?.token).toMatch(
      /^[0-9a-z]+\.[0-9a-z]+\.[0-9a-z]+$/i
    )
  })
})

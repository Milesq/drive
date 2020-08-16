import mockingoose from 'mockingoose'
import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/model'

interface RegisterData {
  name?: string
  pass?: string
  phone?: string
}

describe('register system', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  it("register fails when user data isn't provided or incomplete", async () => {
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

  describe('register fails when user data is incorrect', async () => {
    function sendDamagedRequest(incorrect: RegisterData) {
      return request(app)
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

    it("when name is'not alphanumeric", () =>
      sendDamagedRequest({ name: '$!`"' }))

    it("when pass isn't passed", () =>
      sendDamagedRequest({ pass: '' }))

    it('when phone is too short', () =>
      sendDamagedRequest({ phone: '34' }))

    it('when phone is not number', () =>
      sendDamagedRequest({ phone: '123456789sadasd' }))

    it('when phone is not numeric', () =>
      sendDamagedRequest({ phone: 'sadasd' }))
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

    expect(response.body?.token).toMatch(
      /^[0-9a-z]+\.[0-9a-z]+\.[0-9a-z]+$/i
    )
  })
})

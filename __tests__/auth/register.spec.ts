import mockingoose from 'mockingoose'
import request from 'supertest'
import app from '../../src/app'
import { User } from '../../src/model'

interface RegisterData {
  name?: string
  pass?: string
  phone?: string
}

describe('registration system', () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  it("fails when user data isn't provided or incomplete", async () => {
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

  describe('fails when user data is incorrect', () => {
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

    it("when name isn't alphanumeric", () =>
      sendDamagedRequest({ name: '$!`"' }))

    it("when pass isn't passed", () =>
      sendDamagedRequest({ pass: '' }))

    it('when phone is too short', () =>
      sendDamagedRequest({ phone: '34' }))

    it("when phone isn't number", () =>
      sendDamagedRequest({ phone: '123456789sadasd' }))

    it("when phone isn't numeric", () =>
      sendDamagedRequest({ phone: 'sadasd' }))
  })

  it('fails when user already exists', async () => {
    mockingoose(User).toReturn({ name: 'foo' }, 'findOne')

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

  it('returns token', async () => {
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

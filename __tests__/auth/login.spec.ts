import request from 'supertest'
import app from '../../src/app'

xdescribe('login system', () => {
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

import fs from 'fs'
import jwt from 'jsonwebtoken'
import mockFs from 'mock-fs'
import request from 'supertest'
import app from '../src/app'

describe('Upload endpoint', () => {
  beforeEach(() => {
    mockFs({
      'hello.txt': 'hello world',
    })
  })
  afterEach(() => mockFs.restore())

  it('creates the file when request is correct', async () => {
    const user = 'john'
    const token = jwt.sign({ user }, 'privateKey')

    await request(app)
      .put('/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', 'hello.txt')
      .expect(201)

    expect(
      fs.existsSync(`./static/${user}/hello.txt`)
    ).toBeTruthy()
  })

  it('denied unauthorized user saving files', async () => {
    await request(app)
      .put('/upload')
      .attach('file', 'path/to/file')
      .expect(401)

    expect(
      fs.existsSync('./static/username/file.jpg')
    ).toBeFalsy()
  })
})

// TODO: If file exists, go fuck yourself KYS

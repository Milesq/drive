import fs from 'fs'
import mockFs from 'mock-fs'
import request from 'supertest'
import app from '../src/app'

// TODO: Only authorized users can upload files

describe('Upload endpoint', () => {
  afterEach(() => mockFs.restore())

  it('creates the file when request is correct', async () => {
    mockFs({})
    await request(app)
      .put('/upload')
      .attach('file', 'path/to/file')
      .send({
        fileName: 'file.jpg',
      })
      .expect(201)

    expect(
      fs.existsSync('./static/username/file.jpg')
    ).toBeTruthy()
    // TODO: Send user token
  })
})

// TODO: If file exists, go fuck yourself

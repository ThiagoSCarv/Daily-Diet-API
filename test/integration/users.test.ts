import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../src/app'
import { makeUser } from '../fixtures/userFixture'
import { cleanTestDatabase, destroyTestDatabase } from '../helpers/database'

describe('POST /users', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
    await destroyTestDatabase()
  })

  beforeEach(async () => {
    await cleanTestDatabase()
  })

  it('creates a user, returns 201 and sets an HttpOnly session cookie', async () => {
    const body = makeUser()

    const response = await supertest(app.server).post('/users').send(body)

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({ name: body.name, email: body.email })
    expect(response.body.id).toEqual(expect.any(String))

    const setCookie = response.headers['set-cookie']?.[0] ?? ''
    expect(setCookie).toContain('sessionId=')
    expect(setCookie).toMatch(/HttpOnly/i)
  })

  it('never exposes session_id in the response body', async () => {
    const response = await supertest(app.server).post('/users').send(makeUser())

    expect(response.status).toBe(201)
    expect(response.body).not.toHaveProperty('session_id')
  })

  it('rejects a duplicate email with 409', async () => {
    const body = makeUser()

    await supertest(app.server).post('/users').send(body)
    const second = await supertest(app.server).post('/users').send(body)

    expect(second.status).toBe(409)
  })

  it('rejects an invalid email with 400', async () => {
    const response = await supertest(app.server)
      .post('/users')
      .send(makeUser({ email: 'not-an-email' }))

    expect(response.status).toBe(400)
  })

  it('rejects unknown fields with 400 (strict schema)', async () => {
    const response = await supertest(app.server)
      .post('/users')
      .send({ ...makeUser(), role: 'admin' })

    expect(response.status).toBe(400)
  })
})

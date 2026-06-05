import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { buildApp } from '../../src/app'
import { authenticate } from '../../src/middlewares/authenticate'
import { makeUser } from '../fixtures/userFixture'
import { cleanTestDatabase, destroyTestDatabase } from '../helpers/database'

const app = buildApp()
app.get('/protected', { preHandler: [authenticate] }, async (request) => ({
  id: request.user.id,
}))

async function createUserAndGetCookie(): Promise<string> {
  const response = await supertest(app.server).post('/users').send(makeUser())
  return response.headers['set-cookie']?.[0] ?? ''
}

describe('authenticate middleware', () => {
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

  it('returns 401 when no session cookie is provided', async () => {
    const response = await supertest(app.server).get('/protected')

    expect(response.status).toBe(401)
  })

  it('returns 401 for an unknown session id', async () => {
    const response = await supertest(app.server)
      .get('/protected')
      .set('Cookie', 'sessionId=00000000-0000-0000-0000-000000000000')

    expect(response.status).toBe(401)
  })

  it('allows access and attaches the user for a valid session', async () => {
    const cookie = await createUserAndGetCookie()

    const response = await supertest(app.server)
      .get('/protected')
      .set('Cookie', cookie)

    expect(response.status).toBe(200)
    expect(response.body.id).toEqual(expect.any(String))
  })
})

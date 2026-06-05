import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../src/app'
import { makeMeal } from '../fixtures/mealFixture'
import { makeUser } from '../fixtures/userFixture'
import { cleanTestDatabase, destroyTestDatabase } from '../helpers/database'

async function createSession(overrides: Partial<{ name: string; email: string }> = {}): Promise<string> {
  const res = await supertest(app.server).post('/users').send(makeUser(overrides))
  return res.headers['set-cookie']?.[0] ?? ''
}

beforeAll(async () => {
  await app.ready()
})

beforeEach(async () => {
  await cleanTestDatabase()
})

afterAll(async () => {
  await app.close()
  await destroyTestDatabase()
})

describe('POST /meals', () => {
  it('creates a meal and returns 201', async () => {
    const cookie = await createSession()
    const body = makeMeal()

    const res = await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send(body)

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      name: body.name,
      description: body.description,
      is_on_diet: body.is_on_diet,
    })
    expect(res.body.id).toEqual(expect.any(String))
    expect(res.body.user_id).toEqual(expect.any(String))
    expect(res.body.datetime).toEqual(expect.any(String))
  })

  it('returns 401 without a session cookie', async () => {
    const res = await supertest(app.server).post('/meals').send(makeMeal())
    expect(res.status).toBe(401)
  })

  it('returns 400 when required fields are missing', async () => {
    const cookie = await createSession()
    const res = await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({ name: 'Missing fields' })
    expect(res.status).toBe(400)
  })

  it('returns 400 for unknown fields (strict schema)', async () => {
    const cookie = await createSession()
    const res = await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({ ...makeMeal(), extra: 'field' })
    expect(res.status).toBe(400)
  })
})

describe('GET /meals', () => {
  it('returns 200 with an empty list when no meals exist', async () => {
    const cookie = await createSession()
    const res = await supertest(app.server).get('/meals').set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('returns only the authenticated user\'s meals', async () => {
    const cookieA = await createSession()
    const cookieB = await createSession({ email: 'other@example.com' })

    await supertest(app.server).post('/meals').set('Cookie', cookieA).send(makeMeal({ name: 'Meal A' }))
    await supertest(app.server).post('/meals').set('Cookie', cookieB).send(makeMeal({ name: 'Meal B' }))

    const res = await supertest(app.server).get('/meals').set('Cookie', cookieA)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].name).toBe('Meal A')
  })

  it('returns 401 without a session cookie', async () => {
    const res = await supertest(app.server).get('/meals')
    expect(res.status).toBe(401)
  })
})

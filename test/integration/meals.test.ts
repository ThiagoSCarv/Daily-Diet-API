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

describe('GET /meals/:id', () => {
  it('returns 200 with the meal', async () => {
    const cookie = await createSession()
    const created = await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send(makeMeal())
    const id = created.body.id

    const res = await supertest(app.server).get(`/meals/${id}`).set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(id)
    expect(res.body.name).toBe(makeMeal().name)
  })

  it('returns 404 for a non-existent meal', async () => {
    const cookie = await createSession()
    const res = await supertest(app.server)
      .get('/meals/00000000-0000-0000-0000-000000000000')
      .set('Cookie', cookie)
    expect(res.status).toBe(404)
  })

  it("returns 403 when accessing another user's meal", async () => {
    const cookieA = await createSession()
    const cookieB = await createSession({ email: 'other@example.com' })

    const created = await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookieA)
      .send(makeMeal())
    const id = created.body.id

    const res = await supertest(app.server).get(`/meals/${id}`).set('Cookie', cookieB)
    expect(res.status).toBe(403)
  })

  it('returns 401 without a session cookie', async () => {
    const res = await supertest(app.server).get('/meals/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(401)
  })
})

describe('PUT /meals/:id', () => {
  it('returns 200 with updated meal', async () => {
    const cookie = await createSession()
    const created = await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send(makeMeal())
    const id = created.body.id

    const res = await supertest(app.server)
      .put(`/meals/${id}`)
      .set('Cookie', cookie)
      .send({ name: 'Updated Name', is_on_diet: false })

    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Updated Name')
    expect(res.body.is_on_diet).toBe(false)
    expect(res.body.description).toBe(makeMeal().description)
  })

  it("returns 403 when editing another user's meal", async () => {
    const cookieA = await createSession()
    const cookieB = await createSession({ email: 'other@example.com' })

    const created = await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookieA)
      .send(makeMeal())
    const id = created.body.id

    const res = await supertest(app.server)
      .put(`/meals/${id}`)
      .set('Cookie', cookieB)
      .send({ name: 'Hijacked' })
    expect(res.status).toBe(403)
  })

  it('returns 400 for unknown fields', async () => {
    const cookie = await createSession()
    const created = await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send(makeMeal())
    const id = created.body.id

    const res = await supertest(app.server)
      .put(`/meals/${id}`)
      .set('Cookie', cookie)
      .send({ unknown: 'field' })
    expect(res.status).toBe(400)
  })

  it('returns 401 without a session cookie', async () => {
    const res = await supertest(app.server)
      .put('/meals/00000000-0000-0000-0000-000000000000')
      .send({ name: 'Name' })
    expect(res.status).toBe(401)
  })
})

describe('DELETE /meals/:id', () => {
  it('returns 204 and the meal is no longer retrievable', async () => {
    const cookie = await createSession()
    const created = await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send(makeMeal())
    const id = created.body.id

    const del = await supertest(app.server).delete(`/meals/${id}`).set('Cookie', cookie)
    expect(del.status).toBe(204)

    const get = await supertest(app.server).get(`/meals/${id}`).set('Cookie', cookie)
    expect(get.status).toBe(404)
  })

  it("returns 403 when deleting another user's meal", async () => {
    const cookieA = await createSession()
    const cookieB = await createSession({ email: 'other@example.com' })

    const created = await supertest(app.server)
      .post('/meals')
      .set('Cookie', cookieA)
      .send(makeMeal())
    const id = created.body.id

    const res = await supertest(app.server).delete(`/meals/${id}`).set('Cookie', cookieB)
    expect(res.status).toBe(403)
  })

  it('returns 404 for a non-existent meal', async () => {
    const cookie = await createSession()
    const res = await supertest(app.server)
      .delete('/meals/00000000-0000-0000-0000-000000000000')
      .set('Cookie', cookie)
    expect(res.status).toBe(404)
  })

  it('returns 401 without a session cookie', async () => {
    const res = await supertest(app.server).delete('/meals/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(401)
  })
})

describe('GET /users/metrics', () => {
  it('returns zero metrics when no meals exist', async () => {
    const cookie = await createSession()
    const res = await supertest(app.server).get('/users/metrics').set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ total: 0, on_diet: 0, off_diet: 0, best_streak: 0 })
  })

  it('returns correct counts and best streak', async () => {
    const cookie = await createSession()
    // Sequence (datetime ASC): on, on, off, on, on, on
    // Streak 1: 2, streak 2: 3 → best_streak = 3
    const sequence = [
      { datetime: '2026-06-01T08:00:00.000Z', is_on_diet: true },
      { datetime: '2026-06-02T08:00:00.000Z', is_on_diet: true },
      { datetime: '2026-06-03T08:00:00.000Z', is_on_diet: false },
      { datetime: '2026-06-04T08:00:00.000Z', is_on_diet: true },
      { datetime: '2026-06-05T08:00:00.000Z', is_on_diet: true },
      { datetime: '2026-06-06T08:00:00.000Z', is_on_diet: true },
    ]

    for (const overrides of sequence) {
      await supertest(app.server).post('/meals').set('Cookie', cookie).send(makeMeal(overrides))
    }

    const res = await supertest(app.server).get('/users/metrics').set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ total: 6, on_diet: 5, off_diet: 1, best_streak: 3 })
  })

  it('returns metrics only for the authenticated user', async () => {
    const cookieA = await createSession()
    const cookieB = await createSession({ email: 'other@example.com' })

    await supertest(app.server).post('/meals').set('Cookie', cookieA).send(makeMeal())
    await supertest(app.server).post('/meals').set('Cookie', cookieA).send(makeMeal({ datetime: '2026-06-06T08:00:00.000Z' }))
    await supertest(app.server).post('/meals').set('Cookie', cookieB).send(makeMeal({ is_on_diet: false }))

    const res = await supertest(app.server).get('/users/metrics').set('Cookie', cookieA)
    expect(res.status).toBe(200)
    expect(res.body.total).toBe(2)
    expect(res.body.off_diet).toBe(0)
  })

  it('returns 401 without a session cookie', async () => {
    const res = await supertest(app.server).get('/users/metrics')
    expect(res.status).toBe(401)
  })
})

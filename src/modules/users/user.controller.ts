import type { RouteHandler } from 'fastify'
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from '../../config/constants'
import type { CreateUserInput, UserResponse } from './user.schema'
import { userService } from './user.service'

export const userController = {
  create: (async (request, reply) => {
    const user = await userService.createUser(request.body)

    if (!user.session_id) {
      throw new Error('User was created without a session id')
    }

    reply.setCookie(SESSION_COOKIE, user.session_id, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_SECONDS,
    })

    const body: UserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    }

    return reply.status(201).send(body)
  }) satisfies RouteHandler<{ Body: CreateUserInput }>,
}

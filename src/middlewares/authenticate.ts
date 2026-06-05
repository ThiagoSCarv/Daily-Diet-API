import type { FastifyRequest } from 'fastify'
import { SESSION_COOKIE } from '../config/constants'
import { userModel } from '../modules/users/user.model'

export async function authenticate(request: FastifyRequest) {
  const sessionId = request.cookies[SESSION_COOKIE]

  if (!sessionId) {
    throw request.server.httpErrors.unauthorized('Missing session cookie')
  }

  const user = await userModel.findBySessionId(sessionId)

  if (!user) {
    throw request.server.httpErrors.unauthorized('Invalid session')
  }

  request.user = user
}

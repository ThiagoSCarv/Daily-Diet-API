import { FastifyRequest, FastifyReply } from "fastify";

export async function getUsersCookie(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { sessionId } = request.cookies;

	if (!sessionId) {
		return reply.status(400).send({
			error: "Unauthorized",
		});
	}
}

import { FastifyInstance } from "fastify";
import { knex } from "../../database/knex";
import { z } from "zod";

export async function usersRoutes(app: FastifyInstance) {
	app.post("/", async (request, reply) => {
		const bodySchema = z.object({
			name: z.string().min(3),
			email: z.email(),
		});

		const { name, email } = bodySchema.parse(request.body);

		let sessionId = request.cookies.sessionId;

		if (!sessionId) {
			sessionId = crypto.randomUUID();

			reply.cookie("sessionId", sessionId, {
				path: "/",
			});
		}

		await knex("users").insert({
			id: crypto.randomUUID(),
			name,
			email,
			session_id: sessionId,
		});

		return reply.status(201).send();
	});
}

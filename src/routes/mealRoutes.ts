import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../../database/knex";
import { getUsersCookie } from "../middlewares/getUserCookie";

export async function mealRoute(app: FastifyInstance) {
	app.post("/", { preHandler: [getUsersCookie] }, async (request, reply) => {
		const bodySchema = z.object({
			user_id: z.uuid(),
			name: z.string().min(3),
			description: z.string().min(4),
			inDiet: z.boolean(),
		});

		const { user_id, name, description, inDiet } = bodySchema.parse(
			request.body,
		);

		const user = await knex("users").select().where("id", user_id).first();

		return reply.status(201).send({ user_id, name, description, inDiet, user });
	});
}

import fastify from "fastify";
import { usersRoutes } from "./routes/usersRoutes";
import cookie from "@fastify/cookie";
import { mealRoute } from "./routes/mealRoutes";

export const app = fastify();

app.register(cookie);
app.register(usersRoutes, {
	prefix: "/users",
});
app.register(mealRoute, {
	prefix: "/meals",
});

import { app } from "./app";
import { env } from "./env";

const PORT = env.PORT;

app.listen({ port: PORT }).then(() => {
	console.log(`Server is running on PORT: ${PORT}`);
});

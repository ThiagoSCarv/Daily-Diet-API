import { app } from "./app";

const server = app;

server.listen({ port: 3333 }, () => {
	console.log("Server is running on PORT: 3333");
});

import { z } from "zod";
import { config } from "dotenv";

if (process.env.NODE_ENV === "test") {
	config({ path: ".env.test" });
} else {
	config();
}

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.string(),
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
});

export const env = envSchema.parse(process.env);

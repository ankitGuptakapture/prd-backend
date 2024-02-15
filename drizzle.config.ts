import type { Config } from "drizzle-kit"
import dotenv from "dotenv"
dotenv.config()

export default {
    schema: "./src/schema/schema.ts",
    out: "./src/migrations",
    driver: "pg",
    dbCredentials: {
        connectionString: process.env.DRIZZLE_DATABASE_URL!
    },
    verbose:true

} satisfies Config
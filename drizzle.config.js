import { ENV } from "./src/config/env.js";

// Configuration for drizzle
export default {
    schema: "./src/db/schema.js",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: { url: ENV.DATABASE_URL},
    // npx drizzle-kit generate
    // npx drizzle-kit migrate
};
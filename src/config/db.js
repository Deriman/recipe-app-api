import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { ENV } from "./env.js";
import * as schema from "../db/schema.js";

// Configuration for drizzle and neon database
export const db = drizzle(neon(ENV.DATABASE_URL), { schema });
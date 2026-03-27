import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("\n❌ DATABASE_URL environment variable is not set!");
  console.error("📝 Please set DATABASE_URL in your .env file");
  console.error("   Format: postgresql://user:password@host:port/database\n");
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}

// Validate the DATABASE_URL format
if (!process.env.DATABASE_URL.startsWith('postgresql://') &&
    !process.env.DATABASE_URL.startsWith('postgres://')) {
  console.error("\n❌ Invalid DATABASE_URL format!");
  console.error(`   Current value: ${process.env.DATABASE_URL}`);
  console.error("   Expected format: postgresql://user:password@host:port/database\n");
  throw new Error("Invalid DATABASE_URL format");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
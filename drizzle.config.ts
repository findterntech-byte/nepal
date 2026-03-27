import { defineConfig } from "drizzle-kit";
import dotenv from 'dotenv';
dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://nepal_user:StrongPassword123@72.61.245.133:5432/nepaldatabase",
  },
})

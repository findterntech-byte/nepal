
import { db } from "./db";
import { sql } from "drizzle-orm";

export class DatabaseStorage {
  async executeQuery<T = any>(query: string, params?: any[]): Promise<T[]> {
    try {
      const result = await db.execute(sql.raw(query));
      return result.rows as T[];
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    return await db.transaction(async (tx) => {
      return await callback();
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      await db.execute(sql`SELECT 1`);
      return true;
    } catch (error) {
      console.error("Database health check failed:", error);
      return false;
    }
  }
}

export const databaseStorage = new DatabaseStorage();

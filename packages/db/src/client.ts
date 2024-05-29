import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { getSecretOrEnv } from "@planty/utils";

import * as schema from "./schema";

async function initializeDatabase() {
  const url = await getSecretOrEnv("POSTGRES_URL");

  if (!url) {
    throw new Error("Missing DATABASE_URL");
  }

  const sql = neon(url);
  return drizzle(sql, { schema });
}

export const db = await initializeDatabase();

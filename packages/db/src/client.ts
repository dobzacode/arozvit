import { getSecretOrEnv } from "@arozvit/utils";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

function initializeDatabase() {
  const url = getSecretOrEnv("POSTGRES_URL");

  if (!url) {
    throw new Error("Missing DATABASE_URL");
  }

  const sql = neon(url);
  return drizzle(sql, { schema });
}

export const db = initializeDatabase();

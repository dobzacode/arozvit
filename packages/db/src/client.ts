import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

//eslint-disable-next-line
const url = process.env.POSTGRES_URL;

if (!url) {
  throw new Error("Missing POSTGRES_URL");
}

const sql = neon(url);
export const db = drizzle(sql, { schema });

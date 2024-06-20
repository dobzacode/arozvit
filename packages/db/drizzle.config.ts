import { getSecretOrEnv } from "@arozvit/utils";
import { Config, defineConfig } from "drizzle-kit";

function loadConfig() {
  const DATABASE_URL = getSecretOrEnv("POSTGRES_URL");

  const nonPoolingUrl = DATABASE_URL.replace(":6543", ":5432");

  return defineConfig({
    schema: "./src/schema.ts",
    out: "./supabase/migrations",
    dialect: "postgresql",
    dbCredentials: { url: nonPoolingUrl },
  }) satisfies Config;
}

export default loadConfig();

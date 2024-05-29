import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export const env = createEnv({
  extends: [vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },

  server: {
    POSTGRES_URL: z.string().url(),
    WEBHOOK_SECRET: z.string(),
    CLERK_SECRET_KEY: z.string(),
  },

  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  },

  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  skipValidation:
    !!process.env.CI ||
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === "lint" ||
    process.env.NODE_ENV === "production",
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

async function getSecret(secretName: keyof typeof env): Promise<string> {
  const client = new SecretsManagerClient({
    region: "eu-central-1",
  });

  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: "prod/planty/PGSQL",
        VersionStage: "AWSCURRENT",
      }),
    );

    if (!response || !response.SecretString) {
      throw new Error("Secret not found or SecretString is empty");
    }

    const parsed = JSON.parse(response.SecretString);

    return parsed[secretName];
  } catch (error) {
    throw error;
  }
}

export async function getSecretOrEnv(
  secretName: keyof typeof env,
): Promise<string> {
  const value =
    env.NODE_ENV !== "development"
      ? env[secretName]
      : await getSecret(secretName);

  if (!value) {
    throw new Error(
      `No secret or environment variable found for ${secretName}`,
    );
  }

  return value;
}

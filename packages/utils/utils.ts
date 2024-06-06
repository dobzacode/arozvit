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

export function getSecretOrEnv(secretName: keyof typeof env): string {
  const value = env[secretName];

  if (!value) {
    throw new Error(
      `No secret or environment variable found for ${secretName}`,
    );
  }

  return value;
}

export function translateTimeUnit(frenchUnit: string): string {
  switch (frenchUnit.toLowerCase()) {
    case "jour":
      return "days";
    case "semaine":
      return "weeks";
    case "mois":
      return "months";
    case "année":
      return "years";
    default:
      return frenchUnit;
  }
}

import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { env } from "~/env";

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

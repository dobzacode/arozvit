import type { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

import { eq } from "@planty/db";
import { db } from "@planty/db/client";
import { CreateUserSchema, User } from "@planty/db/schema";
import { getSecretOrEnv } from "@planty/utils";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = await getSecretOrEnv("WEBHOOK_SECRET");

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  //eslint-disable-next-line
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    try {
      await CreateUserSchema.parseAsync(evt.data);
    } catch (error) {
      console.error("Invalid data for user creation/update:", error);
      return new Response("Invalid data provided", {
        status: 400,
      });
    }
  }

  const { type, data } = evt;

  if (type === "user.created") {
    try {
      await db.insert(User).values(data);
      console.log(`User has been created`);
    } catch (error) {
      console.error("Error creating user in DB:", error);
      return new Response("Error occurred while creating user", {
        status: 500,
      });
    }
  }

  if (!data.id) {
    return new Response("Error occurred -- no user ID provided", {
      status: 400,
    });
  }

  if (type === "user.updated") {
    try {
      await db.update(User).set(data).where(eq(User.id, data.id));
    } catch (error) {
      console.error("Error updating user in DB:", error);
      return new Response("Error occurred while updating user", {
        status: 500,
      });
    }
  }

  if (type === "user.deleted") {
    try {
      await db.delete(User).where(eq(User.id, data.id));
      console.log(`User with ID ${data.id} has been deleted`);
    } catch (error) {
      console.error("Error deleting user from DB:", error);
      return new Response("Error occurred while deleting user", {
        status: 500,
      });
    }
  }

  return new Response("", { status: 200 });
}

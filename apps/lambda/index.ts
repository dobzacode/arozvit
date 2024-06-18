import type {
  APIGatewayEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import Expo from "expo-server-sdk";
import moment from "moment";

import { and, eq, lte } from "@planty/db";
import { db } from "@planty/db/client";
import { ExpoPushToken, Plant } from "@planty/db/schema";

const expo = new Expo({
  useFcmV1: true,
});

export const handler = async (
  _: APIGatewayEvent,
  __: Context,
): Promise<APIGatewayProxyResult> => {
  const tokens = await db
    .select({ token: ExpoPushToken.token, userId: ExpoPushToken.userId })
    .from(ExpoPushToken);

  const messages = [];

  for (const token of tokens) {
    if (!Expo.isExpoPushToken(token.token)) {
      console.error(
        `Push token ${token.token as string} is not a valid Expo push token`,
      );
      continue;
    }

    const plantWithWateringNeed = await db
      .select({ nextWatering: Plant.nextWatering })
      .from(Plant)
      .where(
        and(
          eq(Plant.userId, token.userId),
          lte(Plant.nextWatering, moment().toDate()),
        ),
      );

    messages.push({
      to: token.token,
      title:
        plantWithWateringNeed.length > 1
          ? "Des plantes ont besoin d'un arrosage"
          : "Une plante a besoin d'un arrosage",
      body:
        plantWithWateringNeed.length > 1
          ? `${plantWithWateringNeed.length} plantes ont besoin d'un arrosage`
          : `Une plante a besoin d'un arrosage`,
      data: {},
    });
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  await (async () => {
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Notifications sent" }),
  };
};

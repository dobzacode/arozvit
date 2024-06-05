import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";

import { and, eq, lte } from "@planty/db";
import { db } from "@planty/db/client";
import { Plant } from "@planty/db/schema";

const checkWateringNeeds = async () => {
  try {
    const plants = await db
      .select()
      .from(Plant)
      .where(and(eq(Plant.userId, "1"), lte(Plant.nextWatering, new Date())));

    return plants;
  } catch (error) {
    console.error("Error checking watering needs:", error);
  }
};

export const handler = async (
  _: APIGatewayEvent,
  __: Context,
): Promise<APIGatewayProxyResult> => {
  await checkWateringNeeds();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Watering needs checked." }),
  };
};

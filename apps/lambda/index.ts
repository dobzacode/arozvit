import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";

import { eq } from "@planty/db";
import { db } from "@planty/db/client";
import { Plant } from "@planty/db/schema";

function isPlantNeedingWatering(
  lastWatering: Date,
  wateringFrequency: number,
  interval: "jours" | "semaines" | "mois" | "années",
) {
  const now = new Date();
  const daysSinceLastWatering = Math.floor(
    (now.getTime() - lastWatering.getTime()) / (1000 * 60 * 60 * 24),
  );
  switch (interval) {
    case "jours":
      return daysSinceLastWatering >= wateringFrequency;
    case "semaines":
      return daysSinceLastWatering >= wateringFrequency * 7;
    case "mois":
      return daysSinceLastWatering >= wateringFrequency * 30;
    case "années":
      return daysSinceLastWatering >= wateringFrequency * 365;
  }
}

const checkWateringNeeds = async () => {
  try {
    const plants = await db.select().from(Plant);

    for (const plant of plants) {
      const lastWatering = new Date(plant.lastWatering);
      const wateringFrequency = plant.wateringFrequency;
      const interval = plant.wateringInterval;

      const isNeedingWatering = isPlantNeedingWatering(
        lastWatering,
        wateringFrequency,
        interval,
      );

      if (isNeedingWatering) {
        await db
          .update(Plant)
          .set({ needWatering: true })
          .where(eq(Plant.id, plant.id));
        console.log(`Plant ${plant.name} needs watering.`);
      }
    }
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

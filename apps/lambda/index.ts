import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";

import { eq } from "@planty/db";
import { db } from "@planty/db/client";
import { Plant } from "@planty/db/schema";

function isPlantNeedingWatering(
  lastWatering: Date,
  wateringFrequency: number,
  interval: "jours" | "semaines" | "mois" | "années",
): Date | null {
  const now = new Date();
  const daysSinceLastWatering = Math.floor(
    (now.getTime() - lastWatering.getTime()) / (1000 * 60 * 60 * 24),
  );
  switch (interval) {
    case "jours":
      return daysSinceLastWatering >= wateringFrequency ? new Date() : null;
    case "semaines":
      return daysSinceLastWatering >= wateringFrequency * 7 ? new Date() : null;
    case "mois":
      return daysSinceLastWatering >= wateringFrequency * 30
        ? new Date()
        : null;
    case "années":
      return daysSinceLastWatering >= wateringFrequency * 365
        ? new Date()
        : null;
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
          .set({ needWateringSince: new Date() })
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

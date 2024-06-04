import * as SecureStore from "expo-secure-store";

export const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export function isPlantNeedingWatering(
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
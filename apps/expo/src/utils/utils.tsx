import * as SecureStore from "expo-secure-store";
import moment from "moment-timezone";

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

export function calcNextWatering(
  lastWatering: Date,
  wateringFrequency: number,
  interval: "jours" | "semaines" | "mois" | "années",
): Date {
  switch (interval) {
    case "jours":
      return new Date(lastWatering.setDate(lastWatering.getDate() + 1));
    case "semaines":
      return new Date(
        lastWatering.setDate(lastWatering.getDate() + wateringFrequency / 7),
      );
    case "mois":
      return new Date(
        lastWatering.setDate(lastWatering.getDate() + wateringFrequency / 31),
      );
    case "années":
      return new Date(
        lastWatering.setDate(lastWatering.getDate() + wateringFrequency / 365),
      );
  }
}

export function firstLetterCapitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function translateTimeUnit(
  frenchUnit: string,
): "days" | "weeks" | "months" | "years" {
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
      return "days";
  }
}

export function calculateDaysSinceDate(inputDate: Date) {
  const date = moment(inputDate);
  const today = moment();
  const daysDiff = today.diff(date, "days");

  return 1000 - daysDiff * 100 < 500 ? 500 : 1000 - daysDiff * 100;
}

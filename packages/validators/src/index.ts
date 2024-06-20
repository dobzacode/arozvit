import {
  Notification as dbNotification,
  NotificationPlant as dbNotificationPlant,
  Plant as dbPlant,
  User as dbUser,
} from "@arozvit/db/schema";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectPlantSchema = createSelectSchema(dbPlant);

export type Plant = z.infer<typeof selectPlantSchema>;

export const selectNotificationSchema = createSelectSchema(dbNotification);

export const selectUserSchema = createSelectSchema(dbUser);

export type User = z.infer<typeof selectUserSchema>;

export type Notification = z.infer<typeof selectNotificationSchema>;

export const selectNotificationPlantSchema =
  createSelectSchema(dbNotificationPlant);

export type NotificationPlant = z.infer<typeof selectNotificationPlantSchema>;

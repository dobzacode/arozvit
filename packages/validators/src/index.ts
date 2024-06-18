import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import {
  Notification as dbNotification,
  Plant as dbPlant,
} from "@planty/db/schema";

export const selectPlantSchema = createSelectSchema(dbPlant);

export type Plant = z.infer<typeof selectPlantSchema>;

export const selectNotificationSchema = createSelectSchema(dbNotification);

export type Notification = z.infer<typeof selectNotificationSchema>;

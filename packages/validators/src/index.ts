import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { Plant as dbPlant } from "@planty/db/schema";

export const selectPlantSchema = createSelectSchema(dbPlant);

export type Plant = z.infer<typeof selectPlantSchema>;

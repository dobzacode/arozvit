import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const User = pgTable("user", {
  id: text("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  username: varchar("username", { length: 255 }),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const CreateUserSchema = createInsertSchema(User, {
  id: z.string().uuid(),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  username: z.string().min(1).max(255),
  imageUrl: z.string().url().optional(),
});

export const Plant = pgTable("plant", {
  id: uuid("id").primaryKey(),
  userId: text("user_id").references(() => User.id),
  description: text("description"),
  imageUrl: text("image_url"),
  wateringFrequency: integer("watering_frequency"),
  lastWatering: timestamp("last_watering"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const CreatePlantSchema = createInsertSchema(Plant, {
  id: z.string().uuid(),
  userId: z.string().uuid(),
  description: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
  wateringFrequency: z.number().int().min(1),
  lastWatering: z.date().optional(),
});

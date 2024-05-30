import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const User = pgTable("user", {
  id: text("id").primaryKey().notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const CreateUserSchema = createInsertSchema(User, {
  id: z.string(),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  username: z.string().min(1).max(255),
  imageUrl: z.string().url().optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
});

const intervalEnum = pgEnum("interval", [
  "jours",
  "semaines",
  "mois",
  "années",
]);

export const Plant = pgTable("plant", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => User.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  wateringFrequency: integer("watering_frequency").notNull(),
  lastWatering: timestamp("last_watering").defaultNow().notNull(),
  interval: intervalEnum("interval").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const CreatePlantSchema = createInsertSchema(Plant, {
  userId: z.string(),
  name: z.string().min(1).max(90, {
    message: "Le nom de la plante ne doit pas dépasser 90 caractères",
  }),
  description: z
    .string()
    .min(1)
    .max(255, {
      message: "La description ne doit pas dépasser 255 caractères",
    })
    .optional(),
  imageUrl: z.string().url().optional(),
  wateringFrequency: z.number().int().min(1),
  lastWatering: z.date().optional(),
  interval: z.enum(intervalEnum.enumValues),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UserRelations = relations(User, ({ many }) => ({
  plants: many(Plant),
}));

export const PlantRelations = relations(Plant, ({ one }) => ({
  user: one(User, { fields: [Plant.userId], references: [User.id] }),
}));

import { InferSelectModel, relations } from "drizzle-orm";
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

export const ExpoPushToken = pgTable("expo_push_token", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => User.id)
    .notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type ExpoPushToken = InferSelectModel<typeof ExpoPushToken>;

export const CreateExpoPushTokenSchema = createInsertSchema(ExpoPushToken, {
  userId: z.string(),
  token: z.string().min(1).max(255),
});

export const ExpoPushTokenRelations = relations(ExpoPushToken, ({ one }) => ({
  user: one(User, { fields: [ExpoPushToken.userId], references: [User.id] }),
}));

export const User = pgTable("user", {
  id: text("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  username: varchar("username", { length: 255 }),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const CreateUserSchema = createInsertSchema(User, {
  id: z.string(),
  firstName: z.string().min(1).max(255).optional(),
  lastName: z.string().min(1).max(255).optional(),
  username: z.string().min(1).max(255).optional(),
  imageUrl: z.string().url().optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export const UserRelations = relations(User, ({ many }) => ({
  expoPushTokens: many(ExpoPushToken),
}));

export const wateringIntervalEnum = pgEnum("watering_interval", [
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
  species: text("species"),
  description: text("description"),
  imageUrl: text("image_url"),
  dayBetweenWatering: integer("day_between_watering").notNull(),
  lastWatering: timestamp("last_watering", {
    mode: "date",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  nextWatering: timestamp("next_watering", {
    mode: "date",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  wateringInterval: wateringIntervalEnum("watering_interval").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Plant = InferSelectModel<typeof Plant>;

export const CreatePlantSchema = createInsertSchema(Plant, {
  userId: z.string(),
  name: z
    .string()
    .min(1, {
      message: "Le nom de la plante est obligatoire",
    })
    .max(90, {
      message: "Le nom de la plante ne doit pas dépasser 90 caractères",
    }),
  species: z
    .string()
    .max(90, {
      message: "Le nom de l'espèce ne doit pas dépasser 90 caractères",
    })
    .optional(),

  description: z
    .string()
    .max(255, {
      message: "La description ne doit pas dépasser 255 caractères",
    })
    .optional(),
  imageUrl: z.string().url().optional(),
  dayBetweenWatering: z.number().int(),
  lastWatering: z.date(),
  nextWatering: z.date().optional(),
  wateringInterval: z.enum(wateringIntervalEnum.enumValues),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export const PlantRelations = relations(Plant, ({ one }) => ({
  user: one(User, { fields: [Plant.userId], references: [User.id] }),
}));

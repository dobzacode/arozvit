import { InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
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
  notifications: many(Notification),
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

export const PlantRelations = relations(Plant, ({ one, many }) => ({
  user: one(User, { fields: [Plant.userId], references: [User.id] }),
  notificationPlant: many(NotificationPlant),
}));

export const Notification = pgTable("notification", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => User.id)
    .notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Notification = InferSelectModel<typeof Notification>;

export const CreateNotificationSchema = createInsertSchema(Notification, {
  userId: z.string(),
  content: z
    .string()
    .min(1, { message: "Le contenu de la notification est obligatoire" }),
  isRead: z.boolean().optional(),
});

export const NotificationRelations = relations(
  Notification,
  ({ one, many }) => ({
    user: one(User, { fields: [Notification.userId], references: [User.id] }),
    notificationPlant: many(NotificationPlant),
  }),
);

export const NotificationPlant = pgTable(
  "notification_plant",
  {
    notificationId: uuid("notification_id")
      .references(() => Notification.id)
      .notNull(),
    plantId: uuid("plant_id")
      .references(() => Plant.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.notificationId, t.plantId] }),
  }),
);

export const NotificationPlantRelations = relations(
  NotificationPlant,
  ({ one }) => ({
    notification: one(Notification, {
      fields: [NotificationPlant.notificationId],
      references: [Notification.id],
    }),
    plant: one(Plant, {
      fields: [NotificationPlant.plantId],
      references: [Plant.id],
    }),
  }),
);

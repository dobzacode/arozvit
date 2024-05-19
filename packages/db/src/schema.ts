import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const User = pgTable("user", {
  id: varchar("id", { length: 50 }).primaryKey(),
  first_name: varchar("first_name", { length: 255 }),
  last_name: varchar("last_name", { length: 255 }),
  username: varchar("username", { length: 255 }),
  image_url: text("image_url"),
  profile_image_url: text("profile_image_url"),
});

export const CreateUserSchema = createInsertSchema(User);

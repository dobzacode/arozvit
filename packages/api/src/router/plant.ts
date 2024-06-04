import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq } from "@planty/db";
import { CreatePlantSchema, Plant } from "@planty/db/schema";

import { protectedProcedure } from "../trpc";

export const plantRouter = {
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(Plant).where(eq(Plant.userId, ctx.auth.userId));
  }),

  isAnyPlant: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select({ id: Plant.id })
      .from(Plant)
      .where(eq(Plant.userId, ctx.auth.userId));
  }),

  plantWithWateringNeed: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();

    const plants = await ctx.db
      .select()
      .from(Plant)
      .where(eq(Plant.userId, ctx.auth.userId));

    return plants.map((plant) => {
      const daysSinceLastWatering = Math.floor(
        (now.getTime() - plant.lastWatering.getTime()) / (1000 * 60 * 60 * 24),
      );

      const needsWatering = daysSinceLastWatering >= plant.wateringFrequency;

      return { ...plant, needsWatering };
    });
  }),

  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.select().from(Plant).where(eq(Plant.id, input));
  }),

  create: protectedProcedure
    .input(CreatePlantSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Plant).values(input);
    }),

  update: protectedProcedure
    .input(CreatePlantSchema.extend({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.update(Plant).set(input).where(eq(Plant.id, input.id));
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Plant).where(eq(Plant.id, input));
  }),
} satisfies TRPCRouterRecord;

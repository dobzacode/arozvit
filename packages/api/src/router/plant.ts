import type { TRPCRouterRecord } from "@trpc/server";
import moment from "moment-timezone";
import { z } from "zod";

import { and, eq, lte } from "@planty/db";
import { CreatePlantSchema, Plant } from "@planty/db/schema";
import { translateTimeUnit } from "@planty/utils";

import { protectedProcedure } from "../trpc";

export const plantRouter = {
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db
      .select()
      .from(Plant)
      .where(and(eq(Plant.id, input), eq(Plant.userId, ctx.auth.userId)));
  }),

  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(Plant).where(eq(Plant.userId, ctx.auth.userId));
  }),

  listID: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select({ id: Plant.id })
      .from(Plant)
      .where(eq(Plant.userId, ctx.auth.userId));
  }),

  isAnyPlant: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select({ id: Plant.id })
      .from(Plant)
      .where(eq(Plant.userId, ctx.auth.userId));
  }),

  getPlantsWithWateringNeed: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(Plant)
      .where(
        and(
          eq(Plant.userId, ctx.auth.userId),
          lte(Plant.nextWatering, moment().tz("Europe/Paris").toDate()),
        ),
      );
  }),

  waterPlant: protectedProcedure
    .input(z.object({ id: z.string(), lastWatering: z.date().optional() }))
    .mutation(async ({ ctx, input }) => {
      const [actualPlant] = await ctx.db
        .select({
          dayBetweenWatering: Plant.dayBetweenWatering,
          wateringInterval: Plant.wateringInterval,
        })
        .from(Plant)
        .where(eq(Plant.id, input.id));

      if (!actualPlant) {
        throw new Error("Plant not found");
      }

      return ctx.db
        .update(Plant)
        .set({
          lastWatering:
            input.lastWatering ?? moment().tz("Europe/Paris").toDate(),
          nextWatering: moment()
            .tz("Europe/Paris")
            .add({
              [translateTimeUnit(actualPlant.wateringInterval)]:
                actualPlant.dayBetweenWatering,
            })
            .toDate(),
        })
        .where(and(eq(Plant.id, input.id), eq(Plant.userId, ctx.auth.userId)));
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

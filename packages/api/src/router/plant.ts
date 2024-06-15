import type { TRPCRouterRecord } from "@trpc/server";
import moment from "moment-timezone";
import { z } from "zod";

import { and, eq, gte, like, lt, lte } from "@planty/db";
import { CreatePlantSchema, Plant } from "@planty/db/schema";
import { getImage, translateTimeUnit, uploadImage } from "@planty/utils";

import { protectedProcedure } from "../trpc";

export const plantRouter = {
  get: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db
      .select()
      .from(Plant)
      .where(and(eq(Plant.id, input), eq(Plant.userId, ctx.auth.userId)));
  }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(Plant).where(eq(Plant.userId, ctx.auth.userId));
  }),

  getBySearchTerm: protectedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(Plant)
        .where(
          and(eq(Plant.userId, ctx.auth.userId), like(Plant.name, `${input}%`)),
        );
    }),

  getPlantByWateringDay: protectedProcedure
    .input(z.date())
    .query(({ ctx, input }) => {
      console.log(
        moment(input).utcOffset(0).startOf("day").toDate(),
        moment(input).utcOffset(0).add(1, "day").startOf("day").toDate(),
      );

      return ctx.db
        .select()
        .from(Plant)
        .where(
          and(
            eq(Plant.userId, ctx.auth.userId),
            gte(
              Plant.nextWatering,
              moment(input).utcOffset(0).startOf("day").toDate(),
            ),
            lt(Plant.nextWatering, moment(input).add(1, "day").toDate()),
          ),
        );
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
          nextWatering: moment(input.lastWatering)
            .tz("Europe/Paris")
            .add(
              actualPlant.dayBetweenWatering,
              translateTimeUnit(actualPlant.wateringInterval),
            )
            .toDate(),
        })
        .where(and(eq(Plant.id, input.id), eq(Plant.userId, ctx.auth.userId)));
    }),

  create: protectedProcedure
    .input(
      CreatePlantSchema.extend({
        imageObj: z.union([
          z.object({
            base64: z.string(),
            key: z.string(),
          }),
          z.null(),
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.imageObj) return ctx.db.insert(Plant).values(input);
      const {
        imageObj: { base64, key },
        ...props
      } = input;
      try {
        const imageUrl = await uploadImage(base64, key);
        return ctx.db.insert(Plant).values({ ...props, imageUrl });
      } catch (e) {
        console.log(e);
      }
    }),

  update: protectedProcedure
    .input(CreatePlantSchema.extend({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.update(Plant).set(input).where(eq(Plant.id, input.id));
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Plant).where(eq(Plant.id, input));
  }),

  getImage: protectedProcedure
    .input(z.string().nullable())
    .query(async ({ input }) => {
      const url = input ? await getImage(input) : null;
      return url;
    }),
} satisfies TRPCRouterRecord;

import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq } from "@planty/db";
import { CreatePlantSchema, Plant } from "@planty/db/schema";

import { protectedProcedure } from "../trpc";

export const plantRouter = {
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(Plant).where(eq(Plant.userId, ctx.auth.userId));
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

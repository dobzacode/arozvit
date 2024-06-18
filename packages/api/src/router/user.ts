import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq } from "@planty/db";
import { CreateUserSchema, ExpoPushToken, User } from "@planty/db/schema";

import { protectedProcedure } from "../trpc";

export const userRouter = {
  create: protectedProcedure
    .input(CreateUserSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(User).values(input);
    }),

  update: protectedProcedure
    .input(CreateUserSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.update(User).set(input).where(eq(User.id, input.id));
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(User).where(eq(User.id, input));
  }),

  addExpoPushToken: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db
        .select({ id: User.id })
        .from(User)
        .where(eq(User.id, input));
      if (!user[0]) return;
      await ctx.db.insert(ExpoPushToken).values({
        userId: user[0].id,
        token: input,
      });
    }),
} satisfies TRPCRouterRecord;

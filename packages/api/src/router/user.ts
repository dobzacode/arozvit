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
      await ctx.db.insert(ExpoPushToken).values({
        userId: ctx.auth.userId,
        token: input,
      });

      return { message: "Expo Push Token added successfully" };
    }),
} satisfies TRPCRouterRecord;

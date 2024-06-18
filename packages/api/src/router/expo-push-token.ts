import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq } from "@planty/db";
import { ExpoPushToken } from "@planty/db/schema";

import { protectedProcedure } from "../trpc";

export const expoPushTokenRouter = {
  addExpoPushToken: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(ExpoPushToken).values({
        userId: ctx.auth.userId,
        token: input,
      });

      return { message: "Expo Push Token added successfully" };
    }),

  getUserExpoPushTokens: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(ExpoPushToken)
      .where(eq(ExpoPushToken.userId, ctx.auth.userId));
  }),
} satisfies TRPCRouterRecord;

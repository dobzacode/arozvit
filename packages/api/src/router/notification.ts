import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq } from "@planty/db";
import { Notification } from "@planty/db/schema";

import { protectedProcedure } from "../trpc";

export const notificationRouter = {
  getUserNotifications: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.Notification.findMany({
      where: (Notification, { eq }) => eq(Notification.userId, ctx.auth.userId),
      with: {
        notificationPlant: true,
      },
    });
  }),

  markAsRead: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(Notification)
        .set({ isRead: true })
        .where(eq(Notification.id, input));
    }),
} satisfies TRPCRouterRecord;

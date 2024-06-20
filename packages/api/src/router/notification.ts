import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq } from "@arozvit/db";
import { Notification } from "@arozvit/db/schema";

import { protectedProcedure } from "../trpc";

export const notificationRouter = {
  getUserNotifications: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.Notification.findMany({
      where: (Notification, { eq }) => eq(Notification.userId, ctx.auth.userId),
      with: {
        notificationPlant: true,
      },
      orderBy: (comments, { desc }) => desc(comments.createdAt),
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

  isAnyUnread: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select({ id: Notification.id })
      .from(Notification)
      .where(
        and(
          eq(Notification.userId, ctx.auth.userId),
          eq(Notification.isRead, false),
        ),
      );
  }),

  isAnyNotification: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select({ id: Notification.id })
      .from(Notification)
      .where(eq(Notification.userId, ctx.auth.userId));
  }),
} satisfies TRPCRouterRecord;

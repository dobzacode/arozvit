import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@planty/db";
import { Notification } from "@planty/db/schema";

import { protectedProcedure } from "../trpc";

export const notificationRouter = {
  getUserNotifications: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(Notification)
      .where(eq(Notification.userId, ctx.auth.userId));
  }),
} satisfies TRPCRouterRecord;

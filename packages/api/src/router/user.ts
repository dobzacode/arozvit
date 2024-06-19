import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq } from "@planty/db";
import { CreateUserSchema, User } from "@planty/db/schema";
import { getImage, uploadImage } from "@planty/utils";

import { protectedProcedure } from "../trpc";

export const userRouter = {
  create: protectedProcedure
    .input(CreateUserSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(User).values(input);
    }),

  update: protectedProcedure
    .input(
      CreateUserSchema.extend({
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
      if (!input.imageObj)
        return ctx.db
          .update(User)
          .set(input)
          .where(eq(User.id, ctx.auth.userId));
      const {
        imageObj: { base64, key },
        ...props
      } = input;
      try {
        const imageUrl = await uploadImage(base64, key);
        return ctx.db
          .update(User)
          .set({ ...props, imageUrl })
          .where(eq(User.id, input.id));
      } catch (e) {
        console.log(e);
      }
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(User).where(eq(User.id, input));
  }),

  get: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(User).where(eq(User.id, ctx.auth.userId));
  }),

  getImage: protectedProcedure
    .input(z.string().nullable())
    .query(async ({ ctx, input }) => {
      if (!input) return null;
      const data = await ctx.db
        .select({ imageUrl: User.imageUrl })
        .from(User)
        .where(eq(User.id, ctx.auth.userId));
      if (!data[0]?.imageUrl) return null;
      const url = input ? await getImage(data[0].imageUrl) : null;
      return url;
    }),
} satisfies TRPCRouterRecord;

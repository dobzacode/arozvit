import { authRouter } from "./router/auth";
import { expoPushTokenRouter } from "./router/expo-push-token";
import { plantRouter } from "./router/plant";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  expoPushToken: expoPushTokenRouter,
  auth: authRouter,
  user: userRouter,
  plant: plantRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

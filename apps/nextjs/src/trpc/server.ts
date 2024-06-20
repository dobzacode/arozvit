import { getAuth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { cache } from "react";

import { createCaller, createTRPCContext } from "@arozvit/api";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    auth: getAuth(
      new NextRequest("https://notused.com", { headers: headers() }),
    ),
    headers: heads,
  });
});

export const api = createCaller(createContext);

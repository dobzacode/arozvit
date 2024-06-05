    ##### DEPENDENCIES

    FROM --platform=linux/amd64 node:20-alpine AS builder
    RUN apk add --no-cache libc6-compat openssl && apk update

    WORKDIR /app
    RUN yarn global add turbo
    COPY . . 
    RUN turbo prune @planty/nextjs --docker


    FROM --platform=linux/amd64 node:20-alpine AS installer
    RUN apk add --no-cache libc6-compat openssl wget && apk update

    WORKDIR /app

    ENV NODE_ENV production
    ENV CI         true
    ENV SKIP_ENV_VALIDATION true

    ARG ARG_POSTGRES_URL
    ENV POSTGRES_URL=$ARG_POSTGRES_URL

    ARG ARG_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$ARG_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

    COPY .gitignore .gitignore
    COPY --from=builder /app/out/json/ .
    COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
    RUN yarn global add pnpm@9.1.3 && pnpm install --frozen-lockfile

    COPY --from=builder /app/out/full/ .
    COPY turbo.json turbo.json

    RUN NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$ARG_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY pnpm turbo build --filter=@planty/nextjs

    FROM --platform=linux/amd64 node:20-alpine AS runner
    RUN apk add --no-cache libc6-compat openssl && apk update
    WORKDIR /app

    # Don't run production as root
    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs
    USER nextjs
    EXPOSE 3000
    ENV PORT 3000

    ENV NODE_ENV production

    # ENV NEXT_TELEMETRY_DISABLED 1 Optional

    COPY --from=installer /app/apps/nextjs/next.config.js ./
    COPY --from=installer /app/apps/nextjs/package.json ./

    COPY --from=installer --chown=nextjs:nodejs /app/apps/nextjs/.next/standalone ./
    COPY --from=installer --chown=nextjs:nodejs /app/apps/nextjs/.next/static ./apps/nextjs/.next/static
    COPY --from=installer --chown=nextjs:nodejs /app/apps/nextjs/public ./apps/nextjs/public


    CMD node apps/nextjs/server.js
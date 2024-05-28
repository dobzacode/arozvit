    ##### DEPENDENCIES

    FROM --platform=linux/amd64 node:20-alpine AS builder
    RUN apk add --no-cache libc6-compat openssl && apk update

    WORKDIR /app
    RUN yarn global add turbo
    COPY . . 
    RUN turbo prune --scope=@planty/nextjs --docker


    FROM --platform=linux/amd64 node:20-alpine AS installer
    RUN apk add --no-cache libc6-compat openssl wget && apk update

    WORKDIR /app

    ENV NODE_ENV production
    ENV CI         true
    ENV SKIP_ENV_VALIDATION true

    ARG ARG_POSTGRES_URL
    ENV POSTGRES_URL=$ARG_POSTGRES_URL

    COPY .gitignore .gitignore
    COPY --from=builder /app/out/json/ .
    COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
    RUN yarn global add pnpm && pnpm install --frozen-lockfile

    COPY --from=builder /app/out/full/ .
    COPY turbo.json turbo.json

    RUN pnpm turbo build --filter=@planty/nextjs

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
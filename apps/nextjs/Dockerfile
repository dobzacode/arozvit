FROM node:20-alpine AS builder

WORKDIR /app

COPY ../../pnpm-workspace.yaml ../../pnpm-lock.yaml ./
COPY package.json ./
COPY apps/nextjs/package.json ./apps/nextjs/

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter nextjs run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/apps/nextjs/package.json ./

RUN pnpm install --prod --filter nextjs

EXPOSE 3000

CMD ["pnpm", "start"]
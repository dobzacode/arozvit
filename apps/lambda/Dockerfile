    ##### BUILDER
    FROM public.ecr.aws/lambda/nodejs:20 as builder
    RUN npm install --global turbo
    WORKDIR /app
    COPY . .
    RUN turbo prune --filter=@planty/lambda --docker

    ##### INSTALLER
    FROM public.ecr.aws/lambda/nodejs:20 as installer
    WORKDIR /app
    COPY --from=builder /app/out/json/ .
    COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
    RUN npm install --global pnpm@9.1.3 && pnpm install --frozen-lockfile
    COPY --from=builder /app/out/full/ .
    COPY turbo.json turbo.json
    RUN pnpm turbo build --filter=@planty/lambda

    
    FROM public.ecr.aws/lambda/nodejs:20
    WORKDIR ${LAMBDA_TASK_ROOT}
    COPY --from=installer /app/apps/lambda/dist/* ./
    CMD ["index.handler"]
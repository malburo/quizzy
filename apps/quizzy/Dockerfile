# syntax=docker/dockerfile:1.7

FROM node:20.18-alpine AS pruner
WORKDIR /app
RUN npm install -g corepack@latest && corepack enable && corepack prepare pnpm@10.17.0 --activate
COPY . .
RUN pnpm dlx turbo@2.5.0 prune @malburo/quizzy --docker

FROM node:20.18-alpine AS deps
WORKDIR /app
RUN npm install -g corepack@latest && corepack enable && corepack prepare pnpm@10.17.0 --activate
COPY --from=pruner /app/out/json/ ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM node:20.18-alpine AS builder
WORKDIR /app
RUN npm install -g corepack@latest && corepack enable && corepack prepare pnpm@10.17.0 --activate
COPY --from=deps /app/ ./
COPY --from=pruner /app/out/full/ ./
RUN mkdir -p apps/quizzy/public
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm turbo run build --filter=@malburo/quizzy

FROM node:20.18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3001
RUN apk add --no-cache dumb-init \
 && addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/quizzy/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/quizzy/.next/static     ./apps/quizzy/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/quizzy/public           ./apps/quizzy/public
USER nextjs
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/ || exit 1
ARG GIT_SHA=unknown
ARG GIT_REF=unknown
LABEL org.opencontainers.image.source="https://github.com/malburo/portfolio" \
      org.opencontainers.image.description="malburo quizzy — Next.js quiz app" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.revision="${GIT_SHA}" \
      org.opencontainers.image.version="${GIT_REF}"
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "apps/quizzy/server.js"]

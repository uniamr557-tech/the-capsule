# Production Multi-Stage Dockerfile for The Capsule
# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml tsconfig.json ./
COPY packages/ ./packages/
COPY apps/ ./apps/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm run build

# Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV production
ENV PORT 3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/ ./apps/web/
COPY --from=builder /app/packages/ ./packages/

USER nextjs

EXPOSE 3000

CMD ["pnpm", "--filter", "@capsule/web", "start"]

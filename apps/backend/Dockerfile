FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Stage: deps
FROM base AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Copy root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy backend, frontend, and shared package.json files
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies for backend and its workspace dependencies
RUN pnpm install --frozen-lockfile --filter pr-review-backend...

# Stage: builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app ./
# Copy full sources
COPY . .

# Build shared package first
RUN pnpm --filter @pr-review/shared build

# Generate Prisma Client and build backend
WORKDIR /app/apps/backend
RUN npx prisma generate
RUN pnpm build

# Stage: runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/backend/prisma ./prisma
COPY --from=builder /app/apps/backend/prisma/src/generated ./prisma/src/generated

USER nodejs

EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["node", "dist/src/server.js"]
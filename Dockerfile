# Use Node 24 alpine for a small image size
FROM node:24-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files for backend
COPY backend/package.json backend/package-lock.json ./backend/
# Install dependencies
RUN cd backend && npm ci

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/

# Generate Prisma Client
RUN cd backend && npx prisma generate

# Build TypeScript
RUN cd backend && npx tsc

# Production image, copy all the files and run
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-privileged user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built files and necessary artifacts
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/backend/prisma ./backend/prisma
# Copy generated prisma client if it's in src/generated
COPY --from=builder /app/backend/src/generated ./backend/src/generated

USER nodejs

EXPOSE 3000

ENV PORT=3000

WORKDIR /app/backend

ENTRYPOINT ["node", "dist/server.js"]

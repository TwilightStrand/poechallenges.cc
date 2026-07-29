FROM node:24-alpine AS base

# Enable Corepack so pnpm resolves from packageManager in package.json
RUN corepack enable

WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build
# Bundled separately from the Next build: the runner stage has only the
# standalone output, so the migrator ships as one self-contained file.
RUN pnpm run db:migrator

# Production
FROM base AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# The initContainer runs `node dist/migrate.mjs`, which reads the SQL and
# journal from ./drizzle at runtime, so both have to be in the image.
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle

# Guide markdown is read when the page is rendered. It is prerendered at build
# time today, but shipping it keeps that from being load-bearing.
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

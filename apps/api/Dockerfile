FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

# Install deps
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile --filter @azure-vision-catalyst/api

# Build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY tsconfig.base.json ./
COPY apps/api/ ./apps/api/
WORKDIR /app/apps/api
RUN pnpm build

# Runtime
FROM node:20-slim AS runtime
WORKDIR /app
COPY --from=build /app/apps/api/dist ./dist
COPY --from=deps /app/apps/api/node_modules ./node_modules
COPY --from=deps /app/node_modules ./root_modules
COPY apps/api/package.json ./

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]

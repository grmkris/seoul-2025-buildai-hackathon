FROM node:22.10-slim AS base
RUN mkdir /pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable
RUN apt update && \
    apt upgrade -y && \
    apt install build-essential -y && \
    rm -rf /var/lib/apt/lists/*

# Builder stage
FROM base AS builder
WORKDIR /app
COPY apps/api /app/apps/api
COPY packages /app/packages
COPY package.json /app/
COPY pnpm-lock.yaml /app/
COPY pnpm-workspace.yaml /app/

RUN pnpm install --frozen-lockfile --prod

# Runner stage
FROM oven/bun:1 AS runner

WORKDIR /app
USER bun
ENV NODE_ENV=production
# !!! ONLY COPY WHAT IS NEEDED TO RUN IT !!!
COPY --from=builder --chown=bun:bun /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=builder --chown=bun:bun /app/package.json .
COPY --from=builder --chown=bun:bun /app/pnpm-workspace.yaml .
COPY --from=builder --chown=bun:bun /app/apps ./apps
COPY --from=builder --chown=bun:bun /app/packages ./packages

EXPOSE 3000/tcp

WORKDIR /app/apps/api

# Run the app in apps/api using bun run
CMD ["bun", "run", "src/index.ts"]

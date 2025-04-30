# syntax=docker/dockerfile:1

# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src ./src
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine AS runtime

WORKDIR /app

# Copy build artifacts
COPY --from=build /app ./

# Metadata
LABEL org.opencontainers.image.source="https://github.com/Saml1211/PRD-MCP-Server"
LABEL org.opencontainers.image.licenses="MIT"

ENV NODE_ENV=production

# Create non-root user and ensure logging & data directories exist
RUN addgroup -S appgroup \
    && adduser -S appuser -G appgroup \
    && mkdir -p /app/logs /app/data \
    && chown -R appuser:appgroup /app/logs /app/data

USER appuser

# Expose default HTTP port (for glama.ai and other remote hosts)
EXPOSE 3000

# Healthcheck: verify build output exists
HEALTHCHECK --interval=1m --timeout=10s CMD [ -f /app/dist/index.js ] || exit 1

# Environment variable docs:
# - PORT or HTTP_PORT: HTTP server port (default 3000)
# - DB_PATH: Path to SQLite DB file (default: ./data/prd-creator.db)
# Ensure DB_PATH directory is writable by appuser when overriding

# Entry point
ENTRYPOINT ["node", "dist/index.js"]
# ---- Build Stage ----
FROM oven/bun:1.2.2 AS builder

WORKDIR /app

# Copy package.json and bun.lock, install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the app (dist folder will be generated in this step)
RUN bun run build

# ---- Run Stage ----
FROM oven/bun:1.2.2 AS runner

WORKDIR /app

# Copy the already built dist folder from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/bun.lock /app/bun.lock
COPY --from=builder /app/package.json /app/package.json

EXPOSE 3000

CMD ["bun", "run", "dist/app.js"]

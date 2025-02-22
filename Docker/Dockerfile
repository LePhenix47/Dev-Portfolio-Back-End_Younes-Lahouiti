# ---- Build Stage ----
FROM oven/bun:1.2.2 AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN bun install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the app (dist folder will be generated in this step)
RUN bun run app:build

# ---- Run Stage ----
FROM oven/bun:1.2.2 AS runner

WORKDIR /app

# Copy the already built dist folder from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/bun.lock /app/bun.lock
COPY --from=builder /app/package.json /app/package.json

# Copy the docker-compose.yaml file into the image
COPY --from=builder /app/Docker/Docker-compose.yaml /app/Docker-compose.yaml

EXPOSE 3000

CMD ["bun", "run", "app:build-start"]
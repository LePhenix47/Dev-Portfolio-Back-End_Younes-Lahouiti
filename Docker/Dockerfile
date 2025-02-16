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

EXPOSE 3000

CMD ["bun", "run", "dist/app.js"]

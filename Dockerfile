# ---- Build Stage ----
FROM oven/bun:1.2.2 AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json bun.lock ./ 
RUN bun install --frozen-lockfile

# Copy the rest of the app
COPY . ./ 

# Skip running build, we copy pre-built assets from the CI pipeline

# ---- Run Stage ----
FROM oven/bun:1.2.2 AS runner

WORKDIR /app

# Copy only the built app and dependencies from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/bun.lock /app/package.json /app/

# 👇 Copy .env into the final container from the CI pipeline or use a custom path for this
COPY .env .env

EXPOSE 3000

CMD ["bun", "run", "dist/app.js"]

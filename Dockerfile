# ---- Build Stage ----
FROM oven/bun:1.2.2 AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json bun.lock ./ 
RUN bun install --frozen-lockfile

# Copy the rest of the app and build
COPY . ./ 

# 👇 Explicitly copy the .env file
COPY .env .env 

RUN bun build src/app.ts --outdir dist --minify
RUN cat .env  # Debugging: Check if .env is copied

# ---- Run Stage ----
FROM oven/bun:1.2.2 AS runner

WORKDIR /app

# Copy only the built app and dependencies from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/bun.lock /app/package.json /app/

# 👇 Copy .env into the final container
COPY --from=builder /app/.env /app/.env  

EXPOSE 3000

CMD ["bun", "run", "dist/app.js"]

FROM oven/bun:1.2.2

WORKDIR /app

# Copy the rest of the app
COPY . .
RUN bun install --frozen-lockfile

# Build the app (dist folder will be generated in this step)
RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "build:start"]
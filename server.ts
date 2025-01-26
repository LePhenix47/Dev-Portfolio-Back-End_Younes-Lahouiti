import type { ErrorLike } from "bun";

import app from "@src/app";

const server = Bun.serve({
  development: process?.env.NODE_ENV === "development",
  port: process?.env.PORT || 4000,
  fetch: app.fetch,
  error(error: ErrorLike) {
    console.error("Error: " + error.message);
    return new Response("Server Error", { status: 500 });
  },
});

console.log(`Listening on http://localhost:${server.port}`);

import type { ErrorLike } from "bun";

import app from "@src/app";
import env from "./src/env";

const server = Bun.serve({
  development: env.NODE_ENV === "development",
  port: env.PORT || 4000,
  fetch: app.fetch,
  error(error: ErrorLike) {
    console.error("Error: " + error.message);
    return new Response("Server Error", { status: 500 });
  },
});

console.log(`Listening on http://localhost:${server.port}`);

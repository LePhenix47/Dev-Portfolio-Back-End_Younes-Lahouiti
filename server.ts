import type { ErrorLike } from "bun";

import app from "@app";
import env from "@env";

const server = Bun.serve({
  development: env.NODE_ENV === "development",
  port: env.PORT || 4000,
  hostname: "0.0.0.0",
  fetch: app.fetch,
  error(error: ErrorLike) {
    console.error("Error: " + error.message);
    return new Response("Server Error", { status: 500 });
  },
});

console.log(`Server listening on http://localhost:${server.port}`);

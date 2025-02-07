import { OpenAPIHono } from "@hono/zod-openapi";
import defaultHook from "@/src/utils/hono-handlers/default-hook.utils";

/**
 * Creates the main router for the application.
 *
 * @returns {OpenAPIHono} a new instance of OpenAPIHono
 *
 * @see [Stoker](https://github.com/w3cj/stoker)
 */
export function createRouter(): OpenAPIHono {
  const router = new OpenAPIHono({ strict: false, defaultHook });

  return router;
}

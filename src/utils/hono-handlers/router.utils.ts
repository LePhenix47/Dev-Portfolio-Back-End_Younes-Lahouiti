import { OpenAPIHono } from "@hono/zod-openapi";

/**
 * Creates the main router for the application.
 *
 * @returns {OpenAPIHono} a new instance of OpenAPIHono
 */
export function createRouter(): OpenAPIHono {
  const router = new OpenAPIHono({ strict: false });

  return router;
}

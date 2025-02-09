import { logger } from "hono/logger";

import { OpenAPIHono } from "@hono/zod-openapi";

import notFound from "@utils/hono-handlers/not-found.utils";
import onError from "@utils/hono-handlers/on-error.utils";

import { createRouter } from "@utils/hono-handlers/router.utils";
import { configureOpenAPIApp } from "@utils/open-api/open-api.utils";

import contactRouter from "@api/contact/index";
import { configureRateLimiterApp } from "@utils/rate-limiter/rate-limiter.utils";

import { cors } from "hono/cors";

/**
 * Creates the main application instance.
 *
 * This function is responsible for creating an instance of OpenAPIHono and
 * configuring it with the required middleware and routes. The resulting app
 * instance is then returned.
 *
 * @returns {OpenAPIHono} a new instance of OpenAPIHono
 */
function createApp(): OpenAPIHono {
  // ? Doing app.basePath("/api") doesn't work
  const app = createRouter().basePath("/api");

  app.notFound(notFound);
  app.onError(onError);

  app.use("*", cors());

  app.use(logger());

  return app;
}

const app: OpenAPIHono = createApp();

configureOpenAPIApp(app);

// ? Limit to 100 call requests per hour
const ONE_HOUR_IN_MS: number = 60 * 60 * 1_000;
configureRateLimiterApp(app, ONE_HOUR_IN_MS);

export const routesArray = [
  { versioning: "/v1.0", endPointBase: "/contact", router: contactRouter },
] as const;

for (const { versioning, endPointBase, router } of routesArray) {
  app.route(`${versioning}${endPointBase}`, router);
}

export type RPCAppType = (typeof routesArray)[number];

export default app;

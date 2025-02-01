import { logger } from "hono/logger";
import { contactRoute } from "@src/routes/contact.routes";
import { OpenAPIHono } from "@hono/zod-openapi";

import notFound from "@utils/hono-handlers/not-found.utils";
import onError from "@utils/hono-handlers/on-error.utils";
import { createRouter } from "./utils/hono-handlers/router.utils";
import { configureOpenAPIApp } from "./utils/open-api/open-api.utils";

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
  const app = createRouter();

  app.notFound(notFound);
  app.onError(onError);

  app.use(logger());

  return app;
}

const app: OpenAPIHono = createApp();

configureOpenAPIApp(app);
app.route("/contact", contactRoute);

export default app;

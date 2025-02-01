import type { OpenAPIHono } from "@hono/zod-openapi";
import packageJSON from "@/package.json";
import env from "@/src/env";

/**
 * Creates the OpenAPI documentation endpoint for the application.
 *
 * @param {OpenAPIHono} app the application instance
 */
export function configureOpenAPIApp(app: OpenAPIHono) {
  const documentationRoute = "doc" as const;

  app.doc(`/${documentationRoute}`, {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Portfolio contact API documentation",
    },
  });

  console.log(
    `For the documentation of this API, see the http://localhost:${env.PORT}/api/${documentationRoute}`
  );
}

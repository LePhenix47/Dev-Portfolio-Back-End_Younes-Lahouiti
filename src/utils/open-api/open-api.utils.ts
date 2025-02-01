import type { OpenAPIHono } from "@hono/zod-openapi";
import packageJSON from "@/package.json";
import env from "@/src/env";
import { apiReference } from "@scalar/hono-api-reference";

/**
 * Configures the given OpenAPIHono app to include the OpenAPI documentation
 * at the path `/api/doc` and the Scalar API reference at the path `/api/scalar`.
 *
 * @param app - The OpenAPIHono app to configure
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

  const scalarRoute = "scalar" as const;
  app.get(
    `/${scalarRoute}`,
    apiReference({
      theme: env.SCALAR_OPEN_API_THEME,
      spec: {
        url: "/api/doc",
      },
    })
  );

  console.log(
    `For the documentation of this API, see the http://localhost:${env.PORT}/api/${scalarRoute}`
  );
}

import { logger } from "hono/logger";
import { contactRoute } from "@src/routes/contact.routes";
import { OpenAPIHono } from "@hono/zod-openapi";

import notFound from "@utils/hono-handlers/not-found.utils";
import onError from "@utils/hono-handlers/on-error.utils";

const app = new OpenAPIHono().basePath("/api");

app.notFound(notFound);
app.onError(onError);

app.use(logger());

app.route("/contact", contactRoute);

export default app;

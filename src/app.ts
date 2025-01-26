import { Hono } from "hono";
import { logger } from "hono/logger";
import { contactRoute } from "@src/routes/contact.routes";

const app = new Hono().basePath("/api");

app.use(logger());

const apiRoutes = app.route("/contact", contactRoute);

export default app;

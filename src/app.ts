import { Hono } from "hono";
import { logger } from "hono/logger";
import { contactRoute } from "@routes/contact.route";

const app = new Hono().basePath("/api");

app.use(logger());

app.route("/contact", contactRoute);

export default app;

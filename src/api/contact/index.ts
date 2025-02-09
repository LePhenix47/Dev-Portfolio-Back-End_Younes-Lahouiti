import * as contactControllers from "./controllers/contact.controllers";
import * as contactRoutes from "./routes/contact.routes";
import { createRouter } from "@src/utils/hono-handlers/router.utils";

const contactRouter = createRouter().basePath("/v1.0/contact");

// Explicitly map routes to controllers
const routeControllerMap = [
  {
    route: contactRoutes.contactRoute,
    handler: contactControllers.contactController,
  },
];

for (const { route, handler } of routeControllerMap) {
  contactRouter.openapi(route, handler);
}

export default contactRouter;

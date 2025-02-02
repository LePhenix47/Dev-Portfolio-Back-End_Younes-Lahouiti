import * as contactControllers from "./controllers/contact.controllers";
import * as contactRoutes from "./routes/contact.routes";
import { createRouter } from "@src/utils/hono-handlers/router.utils";

const contactRouter = createRouter();

contactRouter.openapi(
  contactRoutes.contactRoute,
  contactControllers.contactController
);

// for (const route of Object.values(contactRoutes)) {
//   // @ts-ignore
//   contactRouter.openapi(route, contactControllers[route.name]);
// }

export default contactRouter;

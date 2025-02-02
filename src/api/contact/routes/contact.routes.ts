// import { createMiddleware } from "hono/factory";

import { z, createRoute } from "@hono/zod-openapi";
import { zValidator } from "@hono/zod-validator";

import * as HttpStatusCodes from "@utils/http/http-status-codes.utils";
import { contactFormSchema } from "@api/contact/schemas/contact.schemas";

const tags: string[] = ["Contact"];

export const contactRoute = createRoute({
  path: "/contact",
  method: "post",
  tags,
  summary: "Send a contact form to the Discord channel",
  description: "Sends a contact form to the Discord channel",
  // In case you need additional middleware, you can add more items in the array
  //   middleware: [zValidator("json", contactFormSchema)] as const,
  request: {
    body: {
      description: "Form to send to the Discord channel",
      content: {
        "application/json": {
          schema: contactFormSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      description: "Form sent successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    [HttpStatusCodes.BAD_REQUEST]: {
      description: "Invalid request body",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
        },
      },
    },
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean(),
            error: z.string(),
          }),
        },
      },
    },
  },
});

export type ContactRouteType = typeof contactRoute;

// import { createMiddleware } from "hono/factory";

import { z, createRoute } from "@hono/zod-openapi";
import { zValidator } from "@hono/zod-validator";

import * as HttpStatusCodes from "@utils/http/http-status-codes.utils";

const tags: string[] = ["Contact"];

const contactFormSchema = z
  .object({
    //*  First and Last Names: No numbers, accents allowed, 2-50 chars
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters long")
      .max(50, "First name must be at most 50 characters long")
      .regex(
        /^[a-zA-ZÀ-ÿ]+(?:['-][a-zA-ZÀ-ÿ]+)*$/,
        "First name contains invalid characters"
      ),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters long")
      .max(50, "Last name must be at most 50 characters long")
      .regex(
        /^[a-zA-ZÀ-ÿ]+(?:['-][a-zA-ZÀ-ÿ]+)*$/,
        "Last name contains invalid characters"
      ),

    // * Email: Valid email format
    email: z.string().email("Invalid email format"),

    // * Project Idea: 50-2 000 chars
    projectIdea: z
      .string()
      .min(50, "Project idea must be at least 50 characters long")
      .max(2_000, "Project idea must be at most 2000 characters long"),
  })
  .openapi("ContactForm");
export type ContactForm = z.infer<typeof contactFormSchema>;

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

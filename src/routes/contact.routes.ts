import env from "@src/env";

import { createRouter } from "@src/utils/hono-handlers/router.utils";

import { createMiddleware } from "hono/factory";

import { z, createRoute } from "@hono/zod-openapi";
import { zValidator } from "@hono/zod-validator";

import type { ContentfulStatusCode } from "hono/utils/http-status";

import * as HttpStatusCodes from "@utils/http/http-status-codes.utils";

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

type ContactForm = z.infer<typeof contactFormSchema>;

const contactRoute = createRoute({
  path: "/contact",
  method: "post",
  tags: ["Contact"],
  summary: "Send a contact form to the Discord channel",
  description: "Sends a contact form to the Discord channel",
  middleware: [zValidator("json", contactFormSchema)] as const,
  request: {
    body: {
      content: {
        "application/json": {
          schema: contactFormSchema,
        },
      },
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
  },
});

const contactRouter = createRouter().openapi(contactRoute, async (c) => {
  try {
    const payLoad: ContactForm = c.req.valid("json");

    const { firstName, lastName, email, projectIdea } = payLoad;

    const discordPostRequestPayload = {
      embeds: [
        {
          title: `Project idea from ${firstName} ${lastName}:`,
          description: projectIdea,
          color: 6448228,
          author: { name: `Email: ${email}` },
        },
      ],
    };

    const discordPostOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(discordPostRequestPayload),
    };

    const webhookUrl = new URL(env?.DISCORD_WEBHOOK_URL!);

    const res = await fetch(webhookUrl, discordPostOptions);
    if (!res.ok) {
      return c.json(
        {
          success: false,
          error: `Failed to send data to Discord. Status: ${res.status}`,
        },
        res.status as ContentfulStatusCode
      );
    }

    const data = await res.json();

    console.log(data);
    return c.json({ message: "Message sent successfully" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "An error occurred" }, 500);
  }
});
export default contactRouter;

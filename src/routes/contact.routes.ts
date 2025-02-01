import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import env from "@src/env";

const contactFormSchema = z.object({
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
});

type ContactForm = z.infer<typeof contactFormSchema>;

export const contactRoute = new Hono();

const route = "/" as const;
contactRoute.post(route, zValidator("json", contactFormSchema), async (c) => {
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

import type { RouteHandler } from "@hono/zod-openapi";
import type {
  ContactForm,
  ContactRouteType,
} from "@api/contact/routes/contact.routes";
import env from "@src/env";

import * as HttpStatusCodes from "@utils/http/http-status-codes.utils";

export const contactController: RouteHandler<ContactRouteType> = async (c) => {
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

    const webhookUrl = new URL(env.DISCORD_WEBHOOK_URL);

    const res = await fetch(webhookUrl, discordPostOptions);
    if (!res.ok) {
      console.error(res);

      return c.json(
        {
          success: false,
          error: `Failed to send data to Discord. Status: ${res.status}`,
        },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    const data: {} = await res.json();

    console.log(data);
    return c.json(
      { message: "Message sent successfully", success: true },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error(error);
    return c.json(
      { success: false, error: "An error occurred" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

import type { OpenAPIHono } from "@hono/zod-openapi";
import { rateLimiter } from "hono-rate-limiter";

/**
 * Configures the given OpenAPIHono app with rate limiting middleware.
 *
 * This function applies rate limiting to the provided app instance, limiting
 * the number of requests each IP can make within a specified time window.
 *
 * @param app - The OpenAPIHono app to configure with rate limiting.
 * @param windowMs - The time window in milliseconds for rate limiting
 *                   (default is 15 minutes).
 * @param limit - The maximum number of requests allowed per IP within the
 *                time window (default is 100).
 *
 * @see [Hono Rate Limiter doc](https://github.com/rhinobase/hono-rate-limiter)
 */
export function configureRateLimiterApp(
  app: OpenAPIHono,
  windowMs: number = 15 * 60 * 1_000,
  limit: number = 100
) {
  app.use(
    rateLimiter({
      windowMs,
      limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
      standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header,
      keyGenerator: (c) => {
        // Get IP (First value from x-forwarded-for, otherwise use direct headers)
        const ip: string =
          c.req.header("x-forwarded-for")?.split(",")[0]?.trim() || // First IP in list
          c.req.header("cf-connecting-ip") ||
          c.req.header("x-real-ip") ||
          c.req.header("forwarded") ||
          "unknown-ip";

        console.log("Rate Limit Key:", ip);
        return ip; // Only using IP for better reliability
      },

      message: {
        success: false,
        message: "Too many requests, try again later",
      },
    })
  );
}

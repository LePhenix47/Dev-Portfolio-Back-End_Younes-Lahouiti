import env from "@/src/env";
import { INTERNAL_SERVER_ERROR, OK } from "@utils/http/http-status-codes.utils";

import type { ErrorHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

/**
 * A Hono error handler that returns a JSON response with a message and a
 * status code. In production, the error stack is not included in the
 * response.
 *
 * @param err the error object
 * @param c the context object
 * @returns a JSON response with a message and a status code
 *
 * @see [Stoker](https://github.com/w3cj/stoker)
 */
const onError: ErrorHandler = (err, c) => {
  const currentStatus =
    "status" in err ? err.status : c.newResponse(null).status;

  const statusCode =
    currentStatus !== OK
      ? (currentStatus as ContentfulStatusCode)
      : (INTERNAL_SERVER_ERROR as ContentfulStatusCode);

  const envVar: string = c.env?.NODE_ENV || env.NODE_ENV;
  return c.json(
    {
      message: err.message,

      stack: envVar === "production" ? undefined : err.stack,
    },
    statusCode
  );
};

export default onError;

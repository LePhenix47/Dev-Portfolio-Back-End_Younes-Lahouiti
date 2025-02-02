import type { NotFoundHandler } from "hono/types";
import { NOT_FOUND_MESSAGE } from "../http/http-status-phrases.utils";
import { NOT_FOUND } from "../http/http-status-codes.utils";

/**
 * Handles any route that is not found. Returns a JSON response with a 404 status
 * code and a message indicating that the route was not found.
 * @param {Context} c The Hono context object.
 * @returns A JSON response indicating that the route was not found.
 *
 * @see [Stoker](https://github.com/w3cj/stoker)
 */
const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      message: `${NOT_FOUND_MESSAGE} - ${c.req.path}`,
    },
    NOT_FOUND
  );
};

export default notFound;

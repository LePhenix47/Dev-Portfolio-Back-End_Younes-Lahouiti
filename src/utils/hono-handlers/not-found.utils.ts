import type { NotFoundHandler } from "hono/types";
import { NOT_FOUND_MESSAGE } from "../http/http-status-phrases.utils";
import { NOT_FOUND } from "../http/http-status-codes.utils";

const notFound: NotFoundHandler = (c) => {
  return c.json(
    {
      message: `${NOT_FOUND_MESSAGE} - ${c.req.path}`,
    },
    NOT_FOUND
  );
};

export default notFound;

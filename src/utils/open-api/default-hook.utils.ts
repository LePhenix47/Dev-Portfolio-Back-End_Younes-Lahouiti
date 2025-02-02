import type { Hook } from "@hono/zod-openapi";

import { UNPROCESSABLE_ENTITY } from "@utils/http/http-status-codes.utils";

/**
 * Default hook for Hono OpenAPI that returns a JSON response with a
 * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422 | 422 Unprocessable Entity}
 * status code **if the `Zod` validation result is not successful**, containing the
 * validation errors.
 *
 * @param result - The result of the validation.
 * @param c - The Hono context.
 * @returns A Hono response.
 *
 *  @see [Stoker default hook](https://github.com/w3cj/stoker/blob/966adae2e1b835724be41495d300705c2ac12eb4/src/openapi/default-hook.ts)
 */
const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        success: result.success,
        error: result.error,
      },
      UNPROCESSABLE_ENTITY
    );
  }
};

export default defaultHook;

import { expect, it, beforeAll, afterAll, describe } from "bun:test";
import { Hono } from "hono";
import contactRouter from "@api/contact/index";
import * as HttpStatusCodes from "@utils/http/http-status-codes.utils";

// Create a test app and mount the router
const app = new Hono();
app.route("/", contactRouter);

beforeAll(() => {
  console.log("Starting Contact API tests...");
});

afterAll(() => {
  console.log("Finished Contact API tests.");
});

describe("Contact endpoint test", () => {
  describe("POST /contact", () => {
    it(`should return ${HttpStatusCodes.UNPROCESSABLE_ENTITY} for an empty contact form`, async () => {
      const res = await app.request("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
      const json = await res.json();
      console.log(json);

      expect(json.success).toBe(false);
      expect(json.error.name).toBe("ZodError");
    });
  });
});

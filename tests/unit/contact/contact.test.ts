import { expect, it, beforeAll, afterAll, describe } from "bun:test";
import { Hono } from "hono";
import contactRouter from "@api/contact/index";
import * as HttpStatusCodes from "@utils/http/http-status-codes.utils";
import env from "@/src/env";

// Create a test app and mount the router
const app = new Hono();
app.route("/", contactRouter);

// ? Stubbing Bun fetch() function to avoid unnecessary calls
globalThis.fetch = async (input: URL | RequestInfo): Promise<Response> => {
  const url = input instanceof URL ? input : new URL(input as string);

  switch (url.href) {
    case env.DISCORD_WEBHOOK_URL: {
      const mockResponse = new Response(
        JSON.stringify({
          success: true,
          message: "Mocked response from external service",
        }),
        { status: 200 }
      );

      return mockResponse;
    }

    default:
      return new Response(null, { status: 404 });
  }
};

beforeAll(() => {
  console.log("Starting Contact API tests...");
});

afterAll(() => {
  console.log("Finished Contact API tests.");
});

// Helper function to check for a specific validation error on a field
const checkValidationError = async (
  body: Record<string, any>,
  fieldName: string,
  expectedMessage: string,
  expectedCode: string
) => {
  const res = await app.request("/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  expect(res.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
  const json = await res.json();

  expect(json.success).toBe(false);
  expect(json.error.name).toBe("ZodError");

  const issue = json.error.issues.find(
    (issue: any) => issue.path[0] === fieldName
  );
  expect(issue).toBeDefined();
  expect(issue.message).toBe(expectedMessage);
  expect(issue.code).toBe(expectedCode);
};

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

      expect(json.success).toBe(false);
      expect(json.error.name).toBe("ZodError");

      // Check required validation errors for each field
      await checkValidationError({}, "firstName", "Required", "invalid_type");
      await checkValidationError({}, "lastName", "Required", "invalid_type");
      await checkValidationError({}, "email", "Required", "invalid_type");
      await checkValidationError({}, "projectIdea", "Required", "invalid_type");
    });

    it("(EDGE CASE) should return specific errors for invalid first name", async () => {
      const body = {
        firstName: "A",
        lastName: "Valid",
        email: "test@example.com",
        projectIdea: "Valid project idea.",
      };
      await checkValidationError(
        body,
        "firstName",
        "First name must be at least 2 characters long",
        "too_small"
      );
    });

    it("(EDGE CASE) should return specific errors for invalid last name", async () => {
      const body = {
        firstName: "Valid",
        lastName: "L",
        email: "test@example.com",
        projectIdea: "Valid project idea.",
      };
      await checkValidationError(
        body,
        "lastName",
        "Last name must be at least 2 characters long",
        "too_small"
      );
    });

    it("(EDGE CASE) should return specific errors for invalid email", async () => {
      const body = {
        firstName: "Valid",
        lastName: "Name",
        email: "invalid-email",
        projectIdea: "Valid project idea.",
      };
      await checkValidationError(
        body,
        "email",
        "Invalid email format",
        "invalid_string"
      );
    });

    it("(EDGE CASE) should return specific errors for short project idea", async () => {
      const body = {
        firstName: "Valid",
        lastName: "Name",
        email: "test@example.com",
        projectIdea: "Short.",
      };
      await checkValidationError(
        body,
        "projectIdea",
        "Project idea must be at least 50 characters long",
        "too_small"
      );
    });

    it("(HAPPY PATH) should process a valid contact form and return a success response", async () => {
      const body = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        projectIdea:
          "A new innovative project idea that is long enough to meet validation requirements, Bun + Hono happy path test.",
      };

      const res = await app.request("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      expect(res.status).toBe(HttpStatusCodes.OK);
      const json = await res.json();

      expect(json.success).toBe(true);
      expect(json.message).toBe("Message sent successfully");
    });
  });
});

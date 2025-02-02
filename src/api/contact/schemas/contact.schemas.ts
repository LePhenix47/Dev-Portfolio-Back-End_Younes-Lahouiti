import { z } from "@hono/zod-openapi";

export const contactFormSchema = z
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

export type ContactForm = z.infer<typeof contactFormSchema>;

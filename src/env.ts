import { z, ZodError } from "zod";

const THEME_IDS = [
  "alternate",
  "default",
  "moon",
  "purple",
  "solarized",
  "bluePlanet",
  "deepSpace",
  "saturn",
  "kepler",
  "elysiajs",
  "fastify",
  "mars",
  "none",
] as const;

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.string(),
  DISCORD_WEBHOOK_URL: z
    .string()
    .regex(
      /^https:\/\/discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/,
      "Invalid Discord webhook URL, please check the URL format."
    ),
  SCALAR_OPEN_API_THEME: z.enum(THEME_IDS).optional(),
});

export type EnvType = z.infer<typeof EnvSchema>;

/**
 * Retrieves environment variables in a type-safe manner by validating them
 * against a predefined schema. If the environment variables do not match
 * the schema, an error is logged.
 *
 * @returns {EnvType | undefined} The parsed and validated environment variables
 * as an object of type `EnvType`, or `undefined` if validation fails.
 */
function getTypeSafeEnv(): EnvType | undefined {
  try {
    const env: EnvType = EnvSchema.parse(process.env);
    return env;
  } catch (err) {
    console.error(
      "✖ An unexpected error occurred while creating the type safe env, some environment variables might be missing or have invalid values:"
    );

    const error = err as ZodError;
    console.error(error.flatten().fieldErrors);
  }
}

const env = getTypeSafeEnv()!;

export default env;

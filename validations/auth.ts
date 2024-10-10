import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const loginValidationSchema = toTypedSchema(
  z.object({
    password: z.string({ message: "The password is required" }),
  }),
);

export const addUserValidationSchema = toTypedSchema(
  z.object({
    username: z
      .string({ message: "The username is required" })
      .min(3, {
        message: "The username must be at least 3 characters",
      })
      .max(16, { message: "The username must be at most 16 characters" }),
  }),
);

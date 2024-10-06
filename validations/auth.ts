import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const loginValidationSchema = toTypedSchema(
  z.object({
    password: z.string({ message: "The password is required" }),
  }),
);

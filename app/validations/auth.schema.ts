import { z } from "zod";

export const loginSchema = z.object({
  password: z.string(),
});

export const addUserSchema = z.object({
  username: z.string().min(3).max(16),
});

export type LoginForm = z.input<typeof loginSchema>;
export type AddUserForm = z.input<typeof addUserSchema>;

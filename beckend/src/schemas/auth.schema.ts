import z from "zod";

export const registerSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email address." }),
  username: z
    .string({ required_error: "Username is required." })
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be at most 20 characters."),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be at least 6 characters.")
    .max(20, "Password must be at most 20 characters."),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email({ message: "Invalid email address." }),
  password: z.string({ required_error: "Password is required." }),
});

const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, "Name must be at least 3 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
  bio: z.string().optional(),
  profilePic: z.string().url("Invalid URL").optional().or(z.literal("")),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  bio: z.string().optional(),
  profilePic: z.string().url("Invalid URL").optional().or(z.literal("")),
});

const postSchema = z.object({
  text: z
    .string({ required_error: "Post text is required" })
    .min(1, "Post text cannot be empty"),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

module.exports = { registerSchema, loginSchema, updateProfileSchema, postSchema };

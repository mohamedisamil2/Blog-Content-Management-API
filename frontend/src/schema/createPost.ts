import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),

  content: z
    .string()
    .min(20, "Content must be at least 20 characters"),

  categoryId: z
    .string()
    .min(1, "Please select a category"),
});
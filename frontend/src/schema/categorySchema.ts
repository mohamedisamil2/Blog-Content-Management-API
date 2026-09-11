import z from "zod";


export const categorySchema = z.object({
    name: z.string().min(5, "The category name must be greater than 5"),
});

export type CreateCategoryData = z.infer<typeof categorySchema>;
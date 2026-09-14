import z from "zod";


export const commentSchema = z.object({
    content: z.string().min(5, "The content must be greater than 5 characters"),
});


export type CreateComment = z.infer<typeof commentSchema>;
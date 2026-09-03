import type { MyContext } from "../../middleware/auth.ts";
import {
    type CreateCommentInput, createCommentService,
    deleteCommentService, getAllcomments, getCommentById,
    type UpdateCommentInput, updateCommentService
} from "../../services/comment.service.ts"
import { requireAuth } from "../../utils/requireAuth.ts";


export const commentResolver = {
    Query: {
        comments: async (_: unknown) => {
           return await getAllcomments();
        },
        comment: async (_parent: unknown, args: { id: string }) => {
           return await getCommentById(args.id);  
        },
    },
    Mutation: {
        createComment: async (_parent: unknown, args: { input: CreateCommentInput }, context: MyContext) => {
            const user = requireAuth(context.user);

            const comment = await createCommentService(args.input, user.id);

            return comment;
        },
        deleteComment: async (_: unknown, args: { id: string }, context: MyContext) => {
            const user = requireAuth(context.user);
            await deleteCommentService(args.id, user.id);
            
            return true;
        },
        updateComment: async (_parent: unknown, args: { id: string, input: UpdateCommentInput }, context: MyContext) => {
            const user = requireAuth(context.user);
            const update = await updateCommentService(args.id, args.input, user.id);
            return update;
        },
    },
}
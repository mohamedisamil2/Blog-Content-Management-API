import {type MyContext } from "../../middleware/auth.ts";
import { Comments } from "../../models/commentModel.ts";
import type { IPost } from "../../models/postModel.ts";
import {
    type CreatePostInput, createPostService, deletePostService, getAllPosts,
    getPostById, type UpdatePostInput, updatePostService
} from "../../services/post.service.ts";
import { requireAdmin } from "../../utils/requireAdmin.ts";



export const postResolver = {
    Mutation: {
        createPost: async (_parent: unknown, args: { input: CreatePostInput}, context: MyContext) => {
            
            const admin = requireAdmin(context.user);

            const post = await createPostService(args.input, admin.id);
            return post;
        },
        updatePost: async (_parent:unknown, args:{id:string, input:UpdatePostInput}, context:MyContext) => {
            const authorId = requireAdmin(context.user);
            const update = await updatePostService(args.id ,authorId.id,args.input, );
            return update;
        },
        deletePost: async (_parent: unknown, args: { id: string }, context: MyContext) => {
            const admin = requireAdmin(context.user);
            const post = await deletePostService(args.id, admin.id);
            return true;
        }
    },
    Query: {
        
        posts: async (_: unknown) => {
            return await getAllPosts();
        },

        post: async (_: unknown, args: { id: string }) => {
            return await getPostById(args.id);
        },
    },
    Post: {   // ← جديد! resolver لحقل فرعي جوا نوع Post نفسه
    comments: async (parent: IPost) => {
      return await Comments.find({ post: parent._id }).populate('author');
    },
  },
}
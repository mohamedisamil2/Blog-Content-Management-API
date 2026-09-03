import{ Comments, type IComment } from "../models/commentModel.ts";
import { ForbiddenError, NotFoundError } from "../utils/errors.ts";
import { getPostById } from "./post.service.ts";

export interface CreateCommentInput{
    content: string,
    postId:string,
}

export interface UpdateCommentInput{
    content: string,
}


export async function createCommentService(input:CreateCommentInput, authorId:string):Promise<IComment> {
    const { content, postId } = input;

    await getPostById(postId);

    const comment = await Comments.create({
        content,
        post: postId,
        author: authorId,
    });
        await comment.populate([
            "author",
                {
                    path: "post",
                    populate: {
                    path: "category",
                    },
                },
            ]);

    return comment;
}

export async function getAllcomments():Promise<IComment[]> {
    
    const comment = await Comments.find().populate("author")
    .populate({
    path: "post",
    populate: {
      path: "category",
    },
  });
    return comment;
}

export async function getCommentById(id:string):Promise<IComment|null> {
    
    const comment = await Comments.findById(id).populate("author")
    .populate({
    path: "post",
    populate: {
      path: "category",
    },
  });

    if (!comment) {
        throw new NotFoundError("comment not found");
    }

    return comment;
}

export async function deleteCommentService(id: string, authorId: string): Promise<void> {
    
    const comment = await getCommentById(id);
    
    if (comment?.author._id.toString() !== authorId) {
        throw new ForbiddenError("you can only delete your own comments");
    }

    await Comments.findByIdAndDelete(id);
}

export async function updateCommentService(id:string, input:UpdateCommentInput, authorId:string):Promise<IComment>{
    
    const commentId = await getCommentById(id);

    if (commentId?.author._id.toString() !== authorId) {
        throw new ForbiddenError("you can update your own comments");
    }

    const updateComment = await Comments.findByIdAndUpdate(
        id, input,
        
        { new: true }
        ).populate(["author",  {
            path: "post",
            populate: {
                path: "category",
            },
        }]);
    
        if (!updateComment) {
            throw new NotFoundError("comment not found");
        }
    
    return updateComment;
}
import { type IPost, Posts } from "../models/postModel.ts";
import { ForbiddenError, NotFoundError } from "../utils/errors.ts";
import { getCategoryById } from "./category.service.ts";


export interface CreatePostInput{
    title: string,
    content: string,
    categoryId:string,
}

export async function createPostService(input: CreatePostInput, authorId: string):Promise<IPost> {
    const { title, content, categoryId } = input;
    
    await getCategoryById(categoryId);

    const post = await Posts.create({
        title,
        content,
        category: categoryId,
        author:authorId,
    });
    await post.populate(["author","category"])
    return post;
}

// Get All Post 
export async function getAllPosts():Promise<IPost[]> { 
    const post = await Posts.find().populate(["author", "category"]);
    return post;
} 

// Get Post By Id
export async function getPostById(id: string): Promise<IPost | null>{
    const post = await Posts.findById(id).populate(["author", "category"]);

    if (!post) {
        throw new NotFoundError("Post not found");
    }

    return post;
}


// Delete Post By Id
export async function deletePostService(id:string, authorId:string):Promise<void> {
    
    const post = await getPostById(id);

    if (post?.author._id.toString() !== authorId) {
        throw new ForbiddenError("you can only delete your own posts")
    }
    
    await Posts.findByIdAndDelete(id).populate("author");

}
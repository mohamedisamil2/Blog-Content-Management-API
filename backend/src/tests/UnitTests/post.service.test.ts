import mongoose from "mongoose";
import { createCatgoryService } from "../../services/category.service.ts";
import { createPostService, deletePostService, getAllPosts, getPostById } from "../../services/post.service.ts";
import { clearTestDB, connectTestDB, disconnectTestDB } from "../setup";
import { Users } from "../../models/userModel";

beforeAll(async () => {
    await connectTestDB();
})
afterAll(async () => {
    await disconnectTestDB();
})
beforeEach(async () => {
    await clearTestDB();
});


describe("createPost", () => {
    test("should create post and return title, content, category name, authorId", async () => {
        
        const user = await Users.create({
            name: "Mohamed",
            email: "test@example.com",
            password: "123456",
            role: "admin",
        });
        const category = await createCatgoryService("apple");

        const categoryId = category._id.toString();

        // const fakeAuthorId = new mongoose.Types.ObjectId().toString();

        const post = await createPostService({
            title: "my post",
            content: "this is my first post",
            categoryId,
        
        },
            user._id.toString()
        );

        expect(post.title).toBe("my post");
        expect(post.content).toBe("this is my first post");
        expect(post.category._id.toString()).toBe(categoryId);
        expect(post.createdAt).toBeDefined();
        expect(post.updatedAt).toBeDefined();
    });
});


describe("deletePost", () => {
    test("should delete post and return true", async () => {
        const user = await Users.create({
            name: "Mohamed",
            email: "test@example.com",
            password: "123456",
            role: "admin",
        });
        const category = await createCatgoryService("apple");

        const categoryId = category._id.toString();

        const post = await createPostService({
            title: "my post",
            content: "this is my first post",
            categoryId,
        },
            user._id.toString()
        );

        const postId = post._id.toString();
        
        const authorId = user._id.toString();

        await expect(deletePostService(postId, authorId)).resolves.not.toThrow();
        
        await expect(getPostById(postId)).rejects.toThrow("Post not found");
    });

    test("should throw forbidden if different user tries to delete", async () => {
        const user = await Users.create({
            name: "Mohamed",
            email: "test@example.com",
            password: "123456",
            role: "admin",
        });
        
        const category = await createCatgoryService("apple");

        const categoryId = category._id.toString();

        const fakeAuthorId = new mongoose.Types.ObjectId().toString();

        const post = await createPostService({
            title: "my post",
            content: "this is my first post",
            categoryId,
        },
            user._id.toString()
        );

        const postId = post._id.toString();

        await expect(deletePostService(postId, fakeAuthorId)).rejects.toThrow("you can only delete your own posts")
    });
});


describe("getAllPosts", () => {
    test("should query all Posts and return posts", async () => {
        const user = await Users.create({
            name: "Mohamed",
            email: "test@example.com",
            password: "123456",
            role: "admin",
        });
        
        const category = await createCatgoryService("apple");

        const categoryId = category._id.toString();

        await createPostService({
            title: "my first post",
            content: "this is my first post",
            categoryId,
        },
            user._id.toString()
        );
        await createPostService({
            title: "my second post",
            content: "this is my second post",
            categoryId,
        },
            user._id.toString()
        );
        await createPostService({
            title: "my third post",
            content: "this is my third post",
            categoryId,
        },
            user._id.toString()
        );
        await createPostService({
            title: "my fourth post",
            content: "this is my fourth first post",
            categoryId,
        },
            user._id.toString()
        );

        const result = await getAllPosts();

        expect(result).toHaveLength(4);
        expect(result.map(post => post.title)).toEqual(expect.arrayContaining(["my first post", "my second post", "my third post", "my fourth post"]))
    });
});


describe("getPostById", () => {
    test("should get post by id and return post ", async () => {
        const user = await Users.create({
            name: "Mohamed",
            email: "test@example.com",
            password: "123456",
            role: "admin",
        });
        
        const category = await createCatgoryService("apple");

        const categoryId = category._id.toString();

        const post = await createPostService({
            title: "my first post",
            content: "this is my first post",
            categoryId,
        },
            user._id.toString()
        );

        const postId = post._id.toString();

        const result = await getPostById(postId);

        expect(result).not.toBeNull();
        expect(result?.title).toBe("my first post");
    });

    test("should throw notFoundError if post not exists", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
       
        await expect(getPostById(fakeId)).rejects.toThrow("Post not found")

    })
})

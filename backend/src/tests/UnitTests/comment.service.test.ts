import mongoose from "mongoose";
import { Users } from "../../models/userModel.ts";
import { createCatgoryService } from "../../services/category.service.ts";
import { createCommentService, deleteCommentService, getAllcomments, getCommentById, updateCommentService } from "../../services/comment.service.ts";
import { createPostService } from "../../services/post.service.ts";
import { clearTestDB, connectTestDB, disconnectTestDB } from "../setup.ts"



beforeAll(async () => {
    await connectTestDB();
});
afterAll(async () => {
    await disconnectTestDB();
});
beforeEach(async () => {
    await clearTestDB();
});


describe("createComment", () => {
    test("should create comment and return content", async () => {
        const user = await Users.create({
            name: "comment test",
            email: "comment@test.com",
            password: "commentTest123",
            role: "user",
        });

        const userId = user._id.toString();

        const category = await createCatgoryService("category");

        const categoryId = category._id.toString();

        const post = await createPostService({
            title: "new comment post",
            content: "this new comment post",
            categoryId,
        }, userId);

        const postId = post._id.toString();

        const comment = await createCommentService({ content: "create new comment", postId }, userId);
        
        const commentId = comment._id.toString();

        expect(comment.content).toBe("create new comment");
        expect(comment._id.toString()).toBe(commentId);
    })
});


describe("updateComment", () => {
    test("should update comment and return updated comment", async () => {
        const user = await Users.create({
            name: "comment test",
            email: "comment@test.com",
            password: "commentTest123",
            role: "user",
        });

        const userId = user._id.toString();

        const category = await createCatgoryService("category");

        const categoryId = category._id.toString();

        const post = await createPostService({
            title: "new comment post",
            content: "this new comment post",
            categoryId,
        }, userId);

        const postId = post._id.toString();

        const comment = await createCommentService({ content: "create new comment", postId }, userId);

        const commentId = comment._id.toString();

        const update = await updateCommentService(
            comment._id.toString(), { content: "update comment" }, user._id.toString(),
        );

        expect(update.content).toBe("update comment");
        expect(update._id.toString()).toBe(commentId)
    });

    test("should throw ForbiddenError if user is not own comment", async () => {
        const user = await Users.create({
            name: "comment test",
            email: "comment@test.com",
            password: "commentTest123",
            role: "user",
        });

        const userId = user._id.toString();
        const fakeUser =new mongoose.Types.ObjectId().toString();

        const category = await createCatgoryService("category");

        const categoryId = category._id.toString();

        const post = await createPostService({
            title: "new comment post",
            content: "this new comment post",
            categoryId,
        }, userId);

        const postId = post._id.toString();

        const comment = await createCommentService({ content: "create new comment", postId }, userId);

        const commentId = comment._id.toString();

        await expect( updateCommentService(
            comment._id.toString(), { content: "update comment" }, fakeUser,
        )).rejects.toThrow("you can update your own comments");
    })
})


describe("getAllComments", () => {
    test("should get all comments and return it", async () => {
        const user = await Users.create({
            name: "comment test",
            email: "comment@test.com",
            password: "commentTest123",
            role: "user",
        });

        const userId = user._id.toString();
        const category = await createCatgoryService("category");

        const categoryId = category._id.toString();

        const post = await createPostService({
            title: "new comment post",
            content: "this new comment post",
            categoryId,
        }, userId);

        const postId = post._id.toString();

        await createCommentService({ content: "create new comment one", postId }, userId);
        await createCommentService({ content: "create new comment two", postId }, userId);
        await createCommentService({ content: "create new comment three", postId }, userId);
        await createCommentService({ content: "create new comment four", postId }, userId);
        await createCommentService({ content: "create new comment five", postId }, userId);
        await createCommentService({ content: "create new comment six", postId }, userId);
    
        const result = await getAllcomments();

        expect(result).toHaveLength(6);
        expect(result.map(comm => comm.content)).toEqual(expect.arrayContaining(["create new comment one", "create new comment two",
            "create new comment three", "create new comment four", "create new comment five", "create new comment six"]));
    })
});


describe("getCoomentById", () => {
    test("should get comment by id and return content", async () => {
        const user = await Users.create({
            name: "comment test",
            email: "comment@test.com",
            password: "commentTest123",
            role: "user",
        });

        const userId = user._id.toString();
        const category = await createCatgoryService("category");

        const categoryId = category._id.toString();

        const post = await createPostService({
            title: "new comment post",
            content: "this new comment post",
            categoryId,
        }, userId);

        const postId = post._id.toString();

        const comment = await createCommentService({ content: "create new comment one", postId }, userId);
    
        const commentId = comment._id.toString();

        const result = await getCommentById(commentId);

        expect(result).not.toBeNull();
        expect(result?.content).toBe("create new comment one")
    });

    test("should throw NotFoundError if comment not exists", async () => {
        const fakeComment = new mongoose.Types.ObjectId().toString();

        await expect(getCommentById(fakeComment)).rejects.toThrow("comment not found");
    });
});


describe("deleteComment", () => {
    test("should delete comment and return true if deleted", async () => {
        const user = await Users.create({
            name: "comment test",
            email: "comment@test.com",
            password: "commentTest123",
            role: "user",
        });

        const userId = user._id.toString();
        const category = await createCatgoryService("category");

        const categoryId = category._id.toString();

        const post = await createPostService({
            title: "new comment post",
            content: "this new comment post",
            categoryId,
        }, userId);

        const postId = post._id.toString();

        const comment = await createCommentService({ content: "create new comment one", postId }, userId);
    
        const commentId = comment._id.toString();

        await expect(deleteCommentService(commentId, userId)).resolves.not.toThrow();
    });

    test("should throw ForbiddenError and return if diff user tries to delete", async () => {
        const user = await Users.create({
            name: "comment test",
            email: "comment@test.com",
            password: "commentTest123",
            role: "user",
        });

        const userId = user._id.toString();
        const category = await createCatgoryService("category");

        const categoryId = category._id.toString();

        const post = await createPostService({
            title: "new comment post",
            content: "this new comment post",
            categoryId,
        }, userId);

        const postId = post._id.toString();

        const comment = await createCommentService({ content: "create new comment one", postId }, userId);
        
        const fakeUser = new mongoose.Types.ObjectId().toString();
        const commentId = comment._id.toString();

        await expect(deleteCommentService(commentId, fakeUser)).rejects.toThrow("you can only delete your own comments")
    });
});
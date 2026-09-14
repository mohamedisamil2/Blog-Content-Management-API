import { graphql } from 'graphql';
import { schema } from '../../graphql/schema';
import { clearTestDB, connectTestDB, disconnectTestDB } from "../setup";
import { Users } from '../../models/userModel';
import { Posts } from '../../models/postModel';
import { Categories } from '../../models/categoryModel';
import { Comments } from '../../models/commentModel';



beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await disconnectTestDB();
});


beforeEach(async () => {
    await clearTestDB();
});


describe("Create Comment (integration)", () => {
    test("should create comment any user", async () => {
        const user = await Users.create({
            name: "Nene User",
            email: "comment@test.com",
            password: "password123",
            role: "user",
        });

        const category = await Categories.create({ name: "tech" });

        const post = await Posts.create({
            title: "Post Comment",
            content: "This my Post",
            category: category._id.toString(),
            author: user._id.toString(),
        });

        const Comment_Mutation = `
        mutation CommentMutation($input:CreateCommentInput!){
            createComment(input: $input) {
                id
                content
                post {
                    title,
                    content,
                    category {
                        name
                    },
                    comments {
                        content
                        author {
                            name
                        },
                    },
                },
                createdAt,
                updatedAt,
            }
        }
        `;

        const result = await graphql({
            schema,
            source: Comment_Mutation,
            variableValues: {
                input: {
                    content: "First comment test",
                    postId: post._id.toString(),
                },
            },
            contextValue: {
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    role: "user",
                },
                req: {} as any,
                res: {} as any,
            },
        });

        expect(result.errors).toBeUndefined();
        expect((result.data?.createComment as any).content).toBe("First comment test")
    });

});


describe("delete Comment (integration)", () => {
    test("should delete comment by userId", async () => {
        const user = await Users.create({
            name: "Nene User",
            email: "comment@test.com",
            password: "password123",
            role: "user",
        });

        const category = await Categories.create({ name: "tech" });

        const post = await Posts.create({
            title: "Post Comment",
            content: "This my Post",
            category: category._id.toString(),
            author: user._id.toString(),
        });
        
        const comment = await Comments.create({
            content: "my delete comment",
            post: post._id.toString(),
            author: user._id.toString(),
        });


        const Delete_Mutation = `
        mutation DeleteCommentMutation($id:ID!){
        deleteComment(id: $id)
        }
        `
        const result = await graphql({
            schema,
            source: Delete_Mutation,
            variableValues: {
                id: comment._id.toString(),
            },
            contextValue: {
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    role: "user",
                },
                req: {} as any,
                res: {} as any,
            },
        });

        expect(result.errors).toBeUndefined();
        expect(result.data?.deleteComment).toBe(true);
    });

    test("should update comment and return updated comment", async () => {
        const user = await Users.create({
            name: "Nene User",
            email: "comment@test.com",
            password: "password123",
            role: "user",
        });

        const category = await Categories.create({ name: "tech" });

        const post = await Posts.create({
            title: "Post Comment",
            content: "This my Post",
            category: category._id.toString(),
            author: user._id.toString(),
        });
        
        const comment = await Comments.create({
            content: "my first comment",
            post: post._id.toString(),
            author: user._id.toString(),
        });

        const Upadate_Mutation = `
            mutation UpdateCommentMutation($id:ID!, $input:UpdateCommentInput!){
                updateComment(id: $id, input: $input) {
                    id
                    content
                    author {
                        id
                        name
                    },
                    post {
                        id
                        title
                        content
                        category {
                            name
                        }
                        comments {
                            content
                        }
                    },
                    createdAt,
                    updatedAt
                }
            }
        `;

        const result = await graphql({
            schema,
            source: Upadate_Mutation,
            variableValues: {
                id: comment._id.toString(),
                input: {
                    content: "My update comment",
                },
            },
            contextValue: {
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    role: "user",
                },
                req: {} as any,
                res: {} as any,
            },
        });

        expect(result.errors).toBeUndefined();
        expect((result.data?.updateComment as any).content).toBe("My update comment")
    });
})
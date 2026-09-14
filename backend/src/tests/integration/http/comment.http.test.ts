import { createApp } from "../../../app";
import type { Express } from "express"
import { clearTestDB, connectTestDB, disconnectTestDB } from "../../setup"
import bcrypt from "bcryptjs";
import request from "supertest";
import { Categories } from "../../../models/categoryModel";
import { Users } from "../../../models/userModel";
import { Posts } from "../../../models/postModel";
import { Comments } from "../../../models/commentModel";

let app:Express

beforeAll(async () => {
    await connectTestDB();
    app = await createApp();
});

afterAll(async () => {
    await disconnectTestDB();
});


beforeEach(async () => {
    await clearTestDB();
});


describe("create comment (http-integration)", () => {
    test("should create comment via real http request", async () => {
        const hashedPassword = await bcrypt.hash("password123", 10);
        const user = await Users.create({
            name: "Category HTTP",
            email: "category-http@test.com",
            password: hashedPassword,
            role: "user"
        });
        
        const Login_User = `
                    mutation LoginMutation($email:String!,$password:String!){
                        login(email: $email, password: $password) {
                            accessToken
                            user {
                                id,
                                name,
                                email
                            }
                        }
                    }
                    `;
                
        const loginResponse = await request(app)
            .post("/graphql")
            .send({
                query: Login_User,
                variables: {
                    email: "category-http@test.com",
                    password: "password123",
                }
            });
                
        const accessToken = loginResponse.body.data.login.accessToken;
        console.log(JSON.stringify(loginResponse.body));
        
        expect(accessToken).toBeDefined();

        const category = await Categories.create({ name: "http-comment" });
        const post = await Posts.create({
            title: "This http request comment",
            content: "My first http request comment",
            category: category._id.toString(),
            author: user._id.toString(),
        });

        const Create_Comment_Mutation = `
            mutation CommentMutation($input:CreateCommentInput!){
                createComment(input: $input) {
                    id,
                    content,
                    post {
                        title,
                        content,
                        category {
                            name
                        },
                        comments {
                            author {
                                name
                            },
                        content
                    },
                },
                createdAt,
                updatedAt,
            }
        }
        `;

        const commentResponse = await request(app)
            .post("/graphql")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                query: Create_Comment_Mutation,
                variables: {
                    input: {
                        content: "Awesome http request comment",
                        postId: post._id.toString(),
                    },
                },
            });
        
        console.log(JSON.stringify(commentResponse.body))
        
        expect(commentResponse.status).toBe(200);
        expect(commentResponse.body.errors).toBeUndefined();
        expect(commentResponse.body.data.createComment.content).toBe("Awesome http request comment")
        expect(commentResponse.body.data.createComment.post.title).toBe("This http request comment")

    });
});


describe("update comment(http)", () => {
    test("should update comment via real http request", async () => {
        const hashedPassword = await bcrypt.hash("password123", 10);
        const user = await Users.create({
            name: "Category HTTP",
            email: "category-http@test.com",
            password: hashedPassword,
            role: "user"
        });
        
        const Login_User = `
                    mutation LoginMutation($email:String!,$password:String!){
                        login(email: $email, password: $password) {
                            accessToken
                            user {
                                id,
                                name,
                                email
                            }
                        }
                    }
                    `;
                
        const loginResponse = await request(app)
            .post("/graphql")
            .send({
                query: Login_User,
                variables: {
                    email: "category-http@test.com",
                    password: "password123",
                }
            });
                
        const accessToken = loginResponse.body.data.login.accessToken;
        console.log(JSON.stringify(loginResponse.body));
        
        expect(accessToken).toBeDefined();

        const category = await Categories.create({ name: "http-comment" });
        const post = await Posts.create({
            title: "This http request comment",
            content: "My first http request comment",
            category: category._id.toString(),
            author: user._id.toString(),
        });

        const comment = await Comments.create({
            content: "http request first comment",
            post: post._id.toString(),
            author: user._id.toString(),
        });


        const Updated_Comment = `
            mutation UpdateCommentMutation($id:ID!, $input:UpdateCommentInput!){
                updateComment(id: $id, input: $input) {
                    id,
                    content,
                    author {
                        id,
                        name
                    },
                    post {
                        id,
                        title,
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
        
        const updateResponse = await request(app)
            .post("/graphql")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                query: Updated_Comment,
                variables: {
                    id: comment._id.toString(),
                    input: {
                        content: "first updated via http request"
                    },
                },
            });
        
        
        console.log(JSON.stringify(updateResponse.body));

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.errors).toBeUndefined();
        expect(updateResponse.body.data.updateComment.content).toBe("first updated via http request")
    });
});


describe("delete comment(http)", () => {
    test("should delete comment via real http requset user ", async () => {
         const hashedPassword = await bcrypt.hash("password123", 10);
        const user = await Users.create({
            name: "Category HTTP",
            email: "category-http@test.com",
            password: hashedPassword,
            role: "user"
        });
        
        const Login_User = `
                    mutation LoginMutation($email:String!,$password:String!){
                        login(email: $email, password: $password) {
                            accessToken
                            user {
                                id,
                                name,
                                email
                            }
                        }
                    }
                    `;
                
        const loginResponse = await request(app)
            .post("/graphql")
            .send({
                query: Login_User,
                variables: {
                    email: "category-http@test.com",
                    password: "password123",
                }
            });
                
        const accessToken = loginResponse.body.data.login.accessToken;
        console.log(JSON.stringify(loginResponse.body));
        
        expect(accessToken).toBeDefined();

        const category = await Categories.create({ name: "http-comment" });
        const post = await Posts.create({
            title: "This http request comment",
            content: "My first http request comment",
            category: category._id.toString(),
            author: user._id.toString(),
        });

        const comment = await Comments.create({
            content: "http request first comment",
            post: post._id.toString(),
            author: user._id.toString(),
        });


        const Delete_Comment = `
            mutation DeleteCommentMutation($id:ID!){
                deleteComment(id: $id)
            }
            `;
        
        const deleteResponse = await request(app)
            .post("/graphql")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                query: Delete_Comment,
                variables: {
                    id: comment._id.toString(),
                },
            });
        
        
        console.log(JSON.stringify(deleteResponse.body));

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.errors).toBeUndefined();
        expect(deleteResponse.body.data.deleteComment).toBe(true);
    })
})

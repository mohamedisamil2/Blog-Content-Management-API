import type { Express } from "express"
import { clearTestDB, connectTestDB, disconnectTestDB } from "../../setup"
import { createApp } from "../../../app";
import { Users } from "../../../models/userModel";
import bcrypt from "bcryptjs";
import request from "supertest";
import { Categories } from "../../../models/categoryModel";
import { Posts } from "../../../models/postModel";

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


describe("create post (http)", () => {
    test("should create post via real admin ", async () => {
        
        const hashedPassword = await bcrypt.hash("password123", 10)
        const admin = await Users.create({
            name: "Admin Http",
            email: "admin-http@test.com",
            password: hashedPassword,
            role: "admin"
        });


        
        const Login_Mutation = `
            mutation LoginMutation($email:String!,$password:String!){
                login(email: $email, password: $password) {
                    accessToken
                    user {
                        id
                        name
                        email
                        role
                    }
                }
            }
            `;
        
            const loginResponse = await request(app)
                .post("/graphql")
                .send({
                    query: Login_Mutation,
                    variables: {
                        email: "admin-http@test.com",
                        password: "password123",
                    },
                });
                
        console.log(JSON.stringify(loginResponse.body, null, 2));  
        const accessToken = loginResponse.body.data?.login.accessToken;
        expect(accessToken).toBeDefined();

        const category = await Categories.create({name:"tech"})

        const Post_Mutation = `
            mutation PostMutation($input:CreatePostInput!){
                createPost(input: $input) {
                    title
                    content
                    author {
                        name
                    }
                    category {
                        name
                    }
                }
            }
        `;

        const postResponse = await request(app)
            .post("/graphql")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                query: Post_Mutation,
                variables: {
                    input: {
                        title: "Http Post",
                        content: "This Http Request",
                        categoryId: category._id.toString(),
                    },
                },
            });
        
        expect(postResponse.status).toBe(200);
        expect(postResponse.body.errors).toBeUndefined();
        expect(postResponse.body.data.createPost.title).toBe("Http Post")
        expect(postResponse.body.data.createPost.author.name).toBe("Admin Http")
        
    });

    test("should reject create post from non-admin user via real HTTP", async () => {
         const hashedPassword = await bcrypt.hash("password123", 10)
        const admin = await Users.create({
            name: "User Http",
            email: "user-http@test.com",
            password: hashedPassword,
            role: "user"
        });


        
        const Login_Mutation = `
            mutation LoginMutation($email:String!,$password:String!){
                login(email: $email, password: $password) {
                    accessToken
                    user {
                        id
                        name
                        email
                        role
                    }
                }
            }
            `;
        
            const loginResponse = await request(app)
                .post("/graphql")
                .send({
                    query: Login_Mutation,
                    variables: {
                        email: "user-http@test.com",
                        password: "password123",
                    },
                });
                
        console.log(JSON.stringify(loginResponse.body, null, 2));  
        const accessToken = loginResponse.body.data?.login.accessToken;
        expect(accessToken).toBeDefined();

        const category = await Categories.create({name:"life-style"})

        const Post_Mutation = `
            mutation PostMutation($input:CreatePostInput!){
                createPost(input: $input) {
                    title
                    content
                    author {
                        name
                    }
                    category {
                        name
                    }
                }
            }
        `;

        const postResponse = await request(app)
            .post("/graphql")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                query: Post_Mutation,
                variables: {
                    input: {
                        title: "Http Post",
                        content: "This Http Request",
                        categoryId: category._id.toString(),
                    },
                },
            });
        
        expect(postResponse.status).toBe(403);
        expect(postResponse.body.errors).toBeDefined();
        expect(postResponse.body.errors[0].extensions.code).toBe("FORBIDDEN")
    })
});

describe("delete Post (http)", () => {
    test("should delete post via real http request", async () => {
        const hashedPassword = await bcrypt.hash("password123", 10)
        const admin = await Users.create({
            name: "Admin Http",
            email: "admin-http@test.com",
            password: hashedPassword,
            role: "admin"
        });
        
        const Login_Mutation = `
            mutation LoginMutation($email:String!,$password:String!){
                login(email: $email, password: $password) {
                    accessToken
                    user {
                        id
                        name
                        email
                        role
                    }
                }
            }
            `;
        
        const loginResponse = await request(app)
            .post("/graphql")
            .send({
                query: Login_Mutation,
                variables: {
                    email: "admin-http@test.com",
                    password: "password123",
                },
            });
                
        console.log(JSON.stringify(loginResponse.body, null, 2));
        const accessToken = loginResponse.body.data.login.accessToken;
        expect(accessToken).toBeDefined();

        const category = await Categories.create({ name: "tech" })

        const post = await Posts.create({
            title: "delete http requset",
            content: "First delete http request",
            category: category._id.toString(),
            author: admin._id.toString(),
        });
        
        const Delete_Post_Mutation = `
            mutation DeletePostMutation($id:ID!){
                deletePost(id: $id)
            }
            `;
        
        const deleteResponse = await request(app)
            .post('/graphql')
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                query: Delete_Post_Mutation,
                variables: {
                    id: post._id.toString(),
                }
            });
        
        expect(deleteResponse.body.errors).toBeUndefined();
        expect(deleteResponse.body.data.deletePost).toBe(true);
    });
    test("should reject delete post from non-admin user via real http request", async () => {
        const hashedPassword = await bcrypt.hash("password123", 10)
        const user = await Users.create({
            name: "user Http",
            email: "user-http@test.com",
            password: hashedPassword,
            role: "user"
        });
        
        const Login_Mutation = `
            mutation LoginMutation($email:String!,$password:String!){
                login(email: $email, password: $password) {
                    accessToken
                    user {
                        id
                        name
                        email
                        role
                    }
                }
            }
            `;
        
        const loginResponse = await request(app)
            .post("/graphql")
            .send({
                query: Login_Mutation,
                variables: {
                    email: "user-http@test.com",
                    password: "password123",
                },
            });
                
        console.log(JSON.stringify(loginResponse.body, null, 2));
        const accessToken = loginResponse.body.data.login.accessToken;
        expect(accessToken).toBeDefined();

        const category = await Categories.create({ name: "test-delete" })

        const post = await Posts.create({
            title: "delete http requset",
            content: "First delete http request",
            category: category._id.toString(),
            author: user._id.toString(),
        });
        
        const Delete_Post_Mutation = `
            mutation DeletePostMutation($id:ID!){
                deletePost(id: $id)
            }
            `;
        
        const deleteResponse = await request(app)
            .post('/graphql')
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                query: Delete_Post_Mutation,
                variables: {
                    id: post._id.toString(),
                }
            });
        
        expect(deleteResponse.status).toBe(403);
        expect(deleteResponse.body.errors).toBeDefined();
        expect(deleteResponse.body.errors[0].extensions.code).toBe("FORBIDDEN");
    });
});


describe("update post (http integration)", () => {
    test("should update post via real http request", async () => {
        const hashedPassword = await bcrypt.hash("password123", 10)
        const admin = await Users.create({
            name: "Admin Http",
            email: "admin-http@test.com",
            password: hashedPassword,
            role: "admin"
        });


        
        const Login_Mutation = `
            mutation LoginMutation($email:String!,$password:String!){
                login(email: $email, password: $password) {
                    accessToken
                    user {
                        id
                        name
                        email
                        role
                    }
                }
            }
            `;
        
            const loginResponse = await request(app)
                .post("/graphql")
                .send({
                    query: Login_Mutation,
                    variables: {
                        email: "admin-http@test.com",
                        password: "password123",
                    },
                });
                
        console.log(JSON.stringify(loginResponse.body, null, 2));  
        const accessToken = loginResponse.body.data?.login.accessToken;
        expect(accessToken).toBeDefined();

        const category = await Categories.create({name:"tech"})
        const post = await Posts.create({
            title: "delete http requset",
            content: "First delete http request",
            category: category._id.toString(),
            author: admin._id.toString(),
        });

        const Update_Post = `
            mutation UpdateMutation($id:ID!,$input:UpdatePostInput!){
                updatePost(id: $id, input: $input) {
                    id
                    title
                    content
                    category {
                        name
                    }
                    author {
                        name,
                    }
                }
            }
            `;
        const updateResponse = await request(app)
            .post("/graphql")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                query: Update_Post,
                variables: {
                    id: post._id.toString(),
                    input: {
                        title: "update post via http request",
                        categoryId: category._id.toString(),
                    }
                },
            });
        
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.errors).toBeUndefined();
        expect(updateResponse.body.data.updatePost.title).toBe("update post via http request");
        

    });
})
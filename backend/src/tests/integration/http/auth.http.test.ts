import request from "supertest"
import type { Express } from "express"
import { clearTestDB, connectTestDB, disconnectTestDB } from "../../setup";
import { createApp } from "../../../app";
import bcrypt from "bcryptjs";
import { Users } from "../../../models/userModel";


let app: Express;

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

describe("Create User(http)", () => {
    test("should create a new user via real HTTP request", async () => {
        const Register_Mutation = `
        mutation RegisterMutation($input:RegisterInput!){
            registerUser(input: $input) {
                accessToken
                user {
                    id,
                    name,
                    email,
                    role
                }
            }
        }
        `;

        const response = await request(app)
            .post("/graphql")
            .send({
                query: Register_Mutation,
                variables: {
                    input: {
                        name: "http test user",
                        email: "http-user@test.com",
                        password: "password123",
                    },
                },
            });
        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.registerUser.accessToken).toBeDefined();
        expect(response.body.data.registerUser.user.email).toBe("http-user@test.com");
    });
});


describe("Login User (http-integration)", () => {
    test("should login via real HTTP request and receive accessToken + refreshToken cookie", async () => {
        
        const hashedPassword = await bcrypt.hash("password123", 10);
        await Users.create({
            name: "http User",
            email: "http-user@test.com",
            password: hashedPassword,
            role: "user",
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

        const response = await request(app)
            .post("/graphql")
            .send({
                query: Login_Mutation,
                variables: {
                    email: "http-user@test.com",
                    password: "password123",
                },
            });
        
        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.login.accessToken).toBeDefined();
        expect(response.body.data.login.user.name).toBe("http User");

        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toContain("refreshToken")

    });
});


describe("Logout User (http)", () => {
    test("should logout via real HTTP request using the refresh Token cookie ", async () => {
         const hashedPassword = await bcrypt.hash("password123", 10);
        await Users.create({
            name: "http User",
            email: "http-user@test.com",
            password: hashedPassword,
            role: "user",
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
                    email: "http-user@test.com",
                    password: "password123",
                },
            });
        
        const cookies = loginResponse.headers["set-cookie"];
        expect(cookies).toBeDefined();

        const Logout_Mutation = `
            mutation LogoutMutation{
                logout
            } 
            `;
        const response = await request(app)
            .post("/graphql")
            .set('Cookie', cookies)
            .send({
                query: Logout_Mutation,
            });
        
        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();
        expect(response.body.data.logout).toBe(true);

        const Refresh_Mutation = `
            mutation RefreshTokenMutation{
                refreshToken {
                    accessToken
                }
            }
            `;
        
        const responseRefresh = await request(app)
            .post("/graphql")
            .set("Cookie",cookies)
            .send({ query: Refresh_Mutation })
        
         expect(responseRefresh.body.errors).toBeDefined();
        expect(responseRefresh.body.errors[0].message).toContain("revoked");
    })
})
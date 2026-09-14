import { createApp } from "../../../app";
import type { Express } from "express"
import { clearTestDB, connectTestDB, disconnectTestDB } from "../../setup"
import bcrypt from "bcryptjs";
import request from "supertest";
import { Users } from "../../../models/userModel";
import { execute } from "graphql";

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


describe("create category (http)", () => {
    test("should create category via real http request", async () => {
        const hashedPassword = await bcrypt.hash("password123", 10);
        const admin = await Users.create({
            name: "Category HTTP",
            email: "category-http@test.com",
            password: hashedPassword,
            role: "admin"
        });

        const Login_Admin = `
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
                query: Login_Admin,
                variables: {
                    email: "category-http@test.com",
                    password: "password123",
                }
            });
        
        const accessToken = loginResponse.body.data.login.accessToken;
        console.log(JSON.stringify(loginResponse.body));

        expect(accessToken).toBeDefined();

        const Create_Category = `
            mutation CreateCategory($name:String!){
                createCategory(name: $name) {
                    name, 
                }
            }
            `;
        
        const categoryResponse = await request(app)
            .post("/graphql")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                query: Create_Category,
                variables: {
                    name: "create category via http"
                }
            });
        
        expect(categoryResponse.status).toBe(200)
        expect(categoryResponse.body.errors).toBeUndefined();
        expect(categoryResponse.body.data.createCategory.name).toBe("create category via http")
    })
})
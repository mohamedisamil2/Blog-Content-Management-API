import { graphql } from 'graphql';
import { schema } from '../../graphql/schema';
import { clearTestDB, connectTestDB, disconnectTestDB } from "../setup"


beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await disconnectTestDB();
});

beforeEach(async () => {
    await clearTestDB();
});


describe("register mutation(integration)", () => {
    test("should register a new user and return access token and user data", async () => {
        const REGISTER_MUTATION = `
            mutation Register($input:RegisterInput!){
                registerUser(input:$input){
                    accessToken
                    user{
                        id
                        name
                        email
                        role
                        createdAt
                    }
                }
            }
        `;
        const result = await graphql({
            schema,
            source: REGISTER_MUTATION,
            variableValues: {
                input: {
                    name: "Integration User",
                    email: "integration@test.com",
                    password: "Password123",
                },
            },
            contextValue: {
                user: null,
                req: { cookies: {} } as any,
                res:{cookie: ()=> {}}as any,
            },
        });

        expect(result.errors).toBeUndefined();
        expect(result.data?.registerUser).toBeDefined();
``
        const registerData = result.data?.registerUser as any;
        expect(registerData.accessToken).toBeDefined();
        expect(registerData.user.email).toBe('integration@test.com');
        expect(registerData.user.role).toBe('user');
    }); 
});


describe("login and logout mutation (intergration)", () => {
    test("should login and then logout successfully", async () => {
        const REGISTER_MUTATION = `
            mutation Register($input:RegisterInput!){
                registerUser(input:$input){
                    accessToken
                    user{
                        id
                        name
                        email
                        role
                        createdAt
                    }
                }
            }
        `;
        await graphql({
            schema,
            source: REGISTER_MUTATION,
            variableValues: {
                input: {
                    name: "Integration User",
                    email: "integration@test.com",
                    password: "Password123",
                },
            },
            contextValue: {
                user: null,
                req: { cookies: {} } as any,
                res: { cookie: () => { } } as any,
            },
        });

        let capturedRefreshToken = "";

        const Login_Mutation = `
        mutation Login($email:String!,$password:String!){
            login(email:$email, password:$password){
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
        const result = await graphql({
            schema,
            source: Login_Mutation,
            variableValues: {
                email: "integration@test.com",
                password: "Password123",
            },
            contextValue: {
                user: null,
                req: { cookies: {} } as any,
                res: {
                    cookie: (name: string, value: string) => {
                        if (name === "refreshToken") {
                            capturedRefreshToken = value;
                        }
                    },
                } as any
            },
        });

        expect(result.errors).toBeUndefined();
        expect(result.data?.login).toBeDefined();
        expect(capturedRefreshToken).toBeTruthy();


        const Logout_Mutation = `
        mutation Logout{
        logout
        }
        ` ;
        const resultLogout = await graphql({
            schema,
            source: Logout_Mutation,
            contextValue: {
                user: null,
                req: {
                    cookies:{refreshToken:capturedRefreshToken}} as any,
                res: { cookie: () => { }, clearCookie:()=> {} } as any,
            },

        })
        expect(resultLogout.errors).toBeUndefined();
        expect(resultLogout.data?.logout).toBe(true);
    });
})
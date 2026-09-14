import { graphql } from 'graphql';
import { schema } from '../../graphql/schema';
import { clearTestDB, connectTestDB, disconnectTestDB } from "../setup";
import { Users } from '../../models/userModel';
import { Categories } from '../../models/categoryModel';


beforeAll(async () => {
    await connectTestDB();
});


afterAll(async () => {
    await disconnectTestDB();
});

beforeEach(async () => {
    await clearTestDB();
});



describe("createPost Mutation (integration)", () => {
    test("should allow admin to create post", async () => {
        const admin = await Users.create({
            name: "Admin Nene",
            email: "post@test.com",
            password: "password123",
            role: "admin",
        });

        const category = await Categories.create({ name: "Tech" });

        const Post_Mutation = `
            mutation PostMutation($input:CreatePostInput!){
                createPost(input: $input) {
                    title,
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

        const result = await graphql({
            schema,
            source: Post_Mutation,
            variableValues: {
                input: {
                    title: "Create post integration",
                    content: "This my first post integration",
                    categoryId: category._id.toString(),
                },
            },
            contextValue: {
                user: {
                    id: admin._id.toString(),
                    email: admin.email,
                    role: "admin",
                },
                req: {} as any,
                res: {} as any,
            },
        });

        expect(result.errors).toBeUndefined();
        expect((result.data?.createPost as any).title).toBe("Create post integration")
        expect((result.data?.createPost as any).content).toBe("This my first post integration")
        expect((result.data?.createPost as any).author.name).toBe("Admin Nene")
    });

    test("should throw FORBIDDEN if user is not admin", async () => {
          const admin = await Users.create({
            name: "Admin Nene",
            email: "post@test.com",
            password: "password123",
            role: "user",
        });

        const category = await Categories.create({ name: "Tech" });

        const Post_Mutation = `
            mutation PostMutation($input:CreatePostInput!){
                createPost(input: $input) {
                    title,
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

        const result = await graphql({
            schema,
            source: Post_Mutation,
            variableValues: {
                input: {
                    title: "Create post integration",
                    content: "This my first post integration",
                    categoryId: category._id.toString(),
                },
            },
            contextValue: {
                user: {
                    id: admin._id.toString(),
                    email: admin.email,
                    role: "user",
                },
                req: {} as any,
                res: {} as any,
            },
        });

        expect(result.errors).toBeDefined();
        expect(result.errors?.[0].extensions?.code).toBe("FORBIDDEN");
    });
});
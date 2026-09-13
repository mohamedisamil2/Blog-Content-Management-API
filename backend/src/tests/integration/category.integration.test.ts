import { Users } from "../../models/userModel";
import { clearTestDB, connectTestDB, disconnectTestDB } from "../setup"
import { graphql } from 'graphql';
import { schema } from '../../graphql/schema';



beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await disconnectTestDB();
});

beforeEach(async () => {
    await clearTestDB();
});


describe("CreateCategory", () => {
    test("should allow admin to create Categories", async () => {
        const admin = await Users.create({
            name: "Admin Nene",
            email: "post@test.com",
            password: "password123",
            role: "admin",
        });

        const Category_Mutation = `
            mutation CreateCategory($name:String!){
                createCategory(name: $name) {
                    name
                }
            }
        `;
        const result = await graphql({
            schema,
            source: Category_Mutation,
            variableValues: {
                name: "tech"
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
        })

        

        expect(result.errors).toBeUndefined();
        expect((result.data?.createCategory as any).name).toBe("tech");
    })
})
import mongoose from "mongoose";
import { createCatgoryService, getAllCategoryService, getCategoryById } from "../../services/category.service.ts";
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


describe("createCategory", () => {
    test("should create a new category name and return name", async () => {
        const result = await createCatgoryService("samsung");
        expect(result.name).toBe("samsung");
    });

    test("should throw an error if category name is already exists", async () => {
        await createCatgoryService("laptop");

        await expect(createCatgoryService("laptop")).rejects.toThrow("Category already exists");
    });
});


describe("getAllCategory", () => {
    test("should query all categories and return categories", async () => {
        await createCatgoryService("apple")
        await createCatgoryService("banana")
        await createCatgoryService("orange")
        await createCatgoryService("juice")

        const result = await getAllCategoryService()

        expect(result).toHaveLength(4);
        expect(result.map(category => category.name)).toEqual(expect.arrayContaining(["apple", "banana", "orange", "juice"]))
    })
    
});

describe("getCategoryById", () => {
    test("should query element by Id and return name ", async () => {
        const createdCategory = await createCatgoryService("today");
        
        const categoryId = createdCategory._id.toString();

        const result = await getCategoryById(categoryId);

        expect(result).not.toBeNull();
        expect(result.name).toBe("today");
        expect(result._id.toString()).toBe(categoryId);
    });
    
    test("should throw NotFoundError if category does not exist", async () => {
        
        const fakeId = new mongoose.Types.ObjectId().toString();
        await expect(getCategoryById(fakeId)).rejects.toThrow("Category not found");
    });
})
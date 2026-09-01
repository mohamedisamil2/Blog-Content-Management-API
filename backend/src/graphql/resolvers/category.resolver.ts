import type { MyContext } from "../../middleware/auth.ts";
import { createCatgoryService, getAllCategoryService, getCategoryById } from "../../services/category.service.ts";


export const categoryResolver = {
    Mutation: {
        createCategory: async (_parent: unknown, args: {  name :string }, context: MyContext) => {
            return await createCatgoryService(args.name);
        }, 
    },
    Query: {
        categories: async (_parent: unknown) => {
            return await getAllCategoryService();
        },
        category: async (_parent: unknown, args: { id: string }) => {
            
            return await getCategoryById(args.id);
        },
    }
}
import { Categories, type ICategory } from "../models/categoryModel.ts";
import { NotFoundError } from "../utils/errors.ts";


export async function createCatgoryService(name:string):Promise<ICategory> {
    const existsCategory = await Categories.findOne({ name });

    if (existsCategory) {
        throw new Error("Category already exists");
    }

    const category = await Categories.create({ name });
    return category;
}


export async function getAllCategoryService():Promise<ICategory[]> {

    const category = await Categories.find();
    return category;
    
}

export async function getCategoryById(id: string): Promise<ICategory> {
  const category = await Categories.findById(id)
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  return category;
}
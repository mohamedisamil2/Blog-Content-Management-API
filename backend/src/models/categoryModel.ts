import { Document, model, Schema } from "mongoose";


export interface ICategory extends Document{
    name: string,
    createdAt:Date,
    updatedAt:Date,
}


const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    }
},
    { timestamps: true },
);

export const Categories = model<ICategory>("Categories", categorySchema);
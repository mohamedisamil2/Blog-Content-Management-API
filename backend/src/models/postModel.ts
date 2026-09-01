import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";



export interface IPost {
    title: string,
    content: string,
    author: mongoose.Types.ObjectId,
    category: mongoose.Types.ObjectId,
    createdAt:Date,
    updatedAt:Date,
}


const postSchema = new Schema<IPost>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref:"Categories",
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
},
    { timestamps: true },
);

export const Posts = model<IPost>("Posts", postSchema);


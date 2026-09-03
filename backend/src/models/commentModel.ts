import mongoose, { Document, model, Schema } from "mongoose";



export interface IComment extends Document{
    content: string,
    author:mongoose.Types.ObjectId,
    post: mongoose.Types.ObjectId,
    createdAt:Date,
    updatedAt:Date,
}


const commentSchema = new Schema<IComment>({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: "Posts",
        required: true,
    },
},
    { timestamps: true },
);

export const Comments = model<IComment>("Comments", commentSchema);
import { Document, model, Schema } from "mongoose";


export interface IUser extends Document{
    name: string,
    email: string,
    password: string,
    createdAt: Date,
}

const userSchema = new Schema<IUser>({

    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    
},
    { timestamps: true },
);

export const Users = model<IUser>("Users", userSchema)
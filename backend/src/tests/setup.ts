import {MongoMemoryServer}from "mongodb-memory-server"
import mongoose from "mongoose";
import { Users } from "../models/userModel.ts";
import { Posts } from "../models/postModel.ts";
import { Categories } from "../models/categoryModel.ts";

let mongoServer: MongoMemoryServer;


// create connection with db 
export async function connectTestDB() {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
}

export async function disconnectTestDB() {
    await mongoose.disconnect();
    await mongoServer.stop();
}

export async function clearTestDB() {
    const collections = mongoose.connection.collections;
    for (const key in collections){
        await collections[key].deleteMany();
    }
}
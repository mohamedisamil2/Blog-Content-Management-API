import { jwtVerify, SignJWT } from "jose";
import type { Request,Response } from "express";

// بيانات المستخدم الحتكون في resolvers
export interface AuthUser{
    id: string,
    email: string,
    role: "admin"|"user",
} 

// شكل الكونتكست الحيشيلو كل ريسولفر
export interface MyContext{
    user: AuthUser | null,
    req:Request,
    res:Response, // جديد - عشان نقدر نحط/نمسح cookies من جوا أي resolver
}

if (!process.env.SECRET_TOKEN) {
  throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
}

const secret = new TextEncoder().encode(process.env.SECRET_TOKEN);
console.log('AUTH SECRET LENGTH:', process.env.SECRET_TOKEN?.length); 

export async function createContext({req,res}:{req:Request, res:Response} ): Promise <MyContext> {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
        return {user: null,req,res}
    }

    try {
        const { payload } = await jwtVerify(token, secret);

        return {
            user: {
                id: payload.id as string,
                email: payload.email as string,
                role: payload.role as 'admin' | 'user',
            },
            req,
            res,
        }
    } catch (error) {
        return { user: null, req,res };
        
    }
}
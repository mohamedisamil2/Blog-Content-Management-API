import {type IUser, Users } from "../models/userModel.ts";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, isTokenRevoked, revokedToken, verifyToken } from "./token.service.ts";
import { AuthenticationError, ValidationError } from "../utils/errors.ts";

interface CreateUserInput {
    name: string;
    email: string;
    password: string;
};


interface AuthResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

// login interface
interface LoginInput{
    email: string;
    password: string;
}

// Create New User Account
export async function createUser(input:CreateUserInput):Promise<AuthResult> {

    const { name, email, password } = input;

    // 1. Check if user already exists
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const user = await Users.create({
        name,
        email,
        password: hashedPassword,
    });
    
    const accessToken = await generateAccessToken({ _id: user._id.toString(), email: user.email });
    const refreshToken = await generateRefreshToken({ _id: user._id.toString(), email: user.email });

    // 4. Return user
    return { user, accessToken, refreshToken };

  
} 


// get user by id
export async function getUserById(
  id: string,
): Promise<IUser | null> {
  const user = await Users.findById(id);

  return user;
}


// Login User
export async function loginUser(input: LoginInput): Promise<AuthResult> {
    const { email, password } = input;

    const user = await Users.findOne({ email });

    if (!user) {
        throw new ValidationError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ValidationError("The password does not match ")
    }

    const accessToken = await generateAccessToken({_id: user._id.toString(), email: user.email });
    const refreshToken = await generateRefreshToken({ _id: user._id.toString(), email: user.email });

    // 4. Return user
    return { user, accessToken, refreshToken };
}


// LogOut User
export async function logoutUser(refreshToken:string | undefined):Promise<void> {
    
    if (!refreshToken) {
        throw new AuthenticationError('No Active Session found')
    }

    const { jti, exp } = await verifyToken(refreshToken);

    if (!jti) {
        throw new AuthenticationError('Invalid session token');
    }
    const expiresAt = new Date(exp * 1000);
    
    await revokedToken(jti , expiresAt);
}


// Refresh Access Token
export async function refreshAccessToken(refreshToken:string | undefined):Promise<string> {
    
    if (!refreshToken) {
    throw new AuthenticationError('No active session found');
  }

    const { id, email, jti } = await verifyToken(refreshToken);

     if (!jti) {
    throw new AuthenticationError('Invalid session token');
    }
    
    const revoked = await isTokenRevoked(jti);
    if (revoked) {
        throw new AuthenticationError('Session has been revoked');
    }

    const newAccessToken = await generateAccessToken({ _id: id, email });

    return newAccessToken;

}
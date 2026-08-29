import { AuthenticationError } from "./errors.ts";
import type{ AuthUser } from "../middleware/auth.ts";


export function requireAuth ( user: AuthUser | null): AuthUser {
    if (!user) {
        throw new AuthenticationError();
    }
    return user;
}
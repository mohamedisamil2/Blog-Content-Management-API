import { AuthUser } from "../middleware/auth";
import { AuthenticationError, ForbiddenError } from "./errors";



export function requireAdmin(user:AuthUser| null):AuthUser {
    if (!user) {
        throw new AuthenticationError();
    }

    if (user.role !== "admin") {
        throw new ForbiddenError("Only admin can be perform this action")
    }
    return user;
}
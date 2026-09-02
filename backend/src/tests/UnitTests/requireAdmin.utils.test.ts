import { AuthenticationError, ForbiddenError } from "../../utils/errors.ts";
import { requireAdmin } from "../../utils/requireAdmin.ts";




describe("requireAdmin", () => {
    test("should return the user if admin", () => {
        const admin = { id: "123", name: "Admin User", email: "admin@test.com", role: "admin" as const };
        expect(requireAdmin(admin)).toBe(admin)
    });
    
    test("should throw authentication error if user null", () => {
        expect(() => requireAdmin(null)).toThrow(AuthenticationError);
    });

    test("should throw forbidden error if user not admin", () => {
        const regularUser = { id: "123", name: "username", email: "user@test.com", role: "user" as const };
        expect(() => requireAdmin(regularUser)).toThrow(ForbiddenError);
    });

})

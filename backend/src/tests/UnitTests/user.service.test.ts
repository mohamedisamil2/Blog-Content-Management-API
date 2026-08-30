import { isTokenRevoked, verifyToken } from "../../services/token.service";
import { createUser, loginUser, logoutUser, refreshAccessToken} from "../../services/user.service.ts";
import { ValidationError } from "../../utils/errors";
import { clearTestDB, connectTestDB, disconnectTestDB } from "../setup.ts"




beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await disconnectTestDB();
});

beforeEach(async () => {
    await clearTestDB();
});


describe("createUser", () => {
    test("should create a new user and return user, accessToken, refreshToken", async () => {
        const result = await createUser(
            {
                name: "testuser",
                email: "testuser@gmail.com",
                password: "testuser123"
            });
        
        expect(result.user.name).toBe("testuser");
        expect(result.user.email).toBe("testuser@gmail.com");
        expect(result.accessToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
    });

  it('should throw an error if email is already in use', async () => {
    await createUser({
      name: 'First User',
      email: 'duplicate@test.com',
      password: 'password123',
    });

    await expect(
      createUser({
        name: 'Second User',
        email: 'duplicate@test.com',
        password: 'anotherpassword',
      })
    ).rejects.toThrow('User already exists');
  });
});


describe("loginUser", () => {
    test("should login user and retun name ,email, accessToken, RefreshToken", async () => {
        await createUser({
            name:"Elnene",
            email: "testuser@gmail.com",
            password: "testuser123",
        });
        const login = await loginUser({
            email: "testuser@gmail.com",
            password: "testuser123",
        });
        expect(login.user.email).toBe("testuser@gmail.com");
        expect(login.accessToken).toBeDefined()
        expect(login.refreshToken).toBeDefined()

    });

    test("should throw an erro if password does not matches", async () => {
        await createUser({
            name:"Elnene",
            email: "testuser@gmail.com",
            password: "testuser12",
        })
        await expect(
            loginUser({
                email: "testuser@gmail.com",
                password: "testuser125",
            })
        ).rejects.toThrow(ValidationError)
    });
});


describe("logoutUser", () => {
    test("should logout user without throwing ", async () => {
        await createUser({
            name: "Elnene",
            email: "testuser@gmail.com",
            password: "testuser123",
        });

        const { refreshToken } = await loginUser({
            email: "testuser@gmail.com",
            password: "testuser123",
        })

        await expect(logoutUser(refreshToken)).resolves.not.toThrow();
        
    });

    test("should revoke the refresh token after logout", async () => {
        await createUser({
            name: "Elnene1",
            email: "testuser1@gmail.com",
            password: "testuser123",
        });
        const { refreshToken } = await loginUser({
            email: "testuser1@gmail.com",
            password: "testuser123",
        });

        const { jti } = await verifyToken(refreshToken);
        if (!jti) {
            throw new Error('jti is missing from token'); // احتياطي، مش متوقع يحصل فعليًا هنا
        }


        await logoutUser(refreshToken);

        const revoked = await isTokenRevoked(jti);

        expect(revoked).toBe(true);


    });
    
});

describe("refreshAccessToken", () => {
    test("should refresh access token and return new access token", async () => {
        await createUser({
            name: "Elnene1",
            email: "testuser1@gmail.com",
            password: "testuser123",
        });
        const { refreshToken } = await loginUser({
            email: "testuser1@gmail.com",
            password: "testuser123",
        });

        const newAccessToken = await refreshAccessToken(refreshToken)

        expect(newAccessToken).toBeDefined();
    });
})
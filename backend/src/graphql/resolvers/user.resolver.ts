import type{ MyContext } from "../../middleware/auth.ts";
import { createUser, getUserById, loginUser, logoutUser, refreshAccessToken } from "../../services/user.service.ts";



export const userResolver = {
    Mutation: {
       register: async(_parent:unknown, args:{input:{name:string, email:string, password:string}}, context:MyContext) =>{
            const { user, accessToken, refreshToken } = await createUser(args.input);

            // The refresh token goes into the httpOnly cookie
            context.res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            // The access token is returned normally in the response
            return {
                accessToken,
                user
            }
        },
        login: async (_parent: unknown, args: { email: string, password: string }, context: MyContext) => {
            const { user, accessToken, refreshToken } = await loginUser(args)
            
            // The refresh token goes into the httpOnly cookie
            context.res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            // The access token is returned normally in the response
            return {
                accessToken,
                user
            }

        },
        logout: async (_parent: unknown, _args: unknown, context: MyContext) => {
            await logoutUser(context.req.cookies?.refreshToken);
            context.res.clearCookie('refreshToken');
            return true;
        },
        // resolvers/user.resolver.ts
refreshToken: async (_parent: unknown, _args: unknown, context: MyContext) => {
  const accessToken = await refreshAccessToken(context.req.cookies?.refreshToken);
  return { accessToken };  // ✅ لف الـ string في object
},
    },
    
     Query: {
    user: async (
      _: unknown,
      args: { id: string },
    ) => {
      return getUserById(args.id);
    },
  },
}
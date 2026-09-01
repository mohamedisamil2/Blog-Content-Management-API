import express from "express"
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server"
import {schema} from "./graphql/schema.ts"
import { expressMiddleware } from "@as-integrations/express5";
import { createContext } from "./middleware/auth.ts";

export async function createApp() {
    const app = express();
    const apolloServer = new ApolloServer({
        schema,
        csrfPrevention: {
            requestHeaders: ['x-apollo-operation-name', 'apollo-require-preflight', 'authorization'],
        },
        formatError: (formattedError, error) => {
        console.error(error)
        return formattedError; 
    }, })
    
    await apolloServer.start();

    app.use(cookieParser())
    app.use('/graphql', express.json(),expressMiddleware(apolloServer, {context:async ({req,res}) =>  createContext({req,res})}))

    return app;
}




import { InMemoryCache } from "@apollo/client";
import { ApolloClient, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql",
    credentials:"include",
});


const authClient = new SetContextLink((prevContext) => {
    const token = localStorage.getItem("accessToken");
    return {
        headers: {
            ...prevContext.headers,
            authorization: token ? `Bearer ${token}`: "",
        },
    };
});


export const client = new ApolloClient({
    link: authClient.concat(httpLink),
    cache: new InMemoryCache(),
});
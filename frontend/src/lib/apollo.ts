import { ApolloClient, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { CombinedGraphQLErrors,InMemoryCache } from "@apollo/client";
// import { onError } from '@apollo/client/link/error';
// import {from} from "@apollo/client"
import { refreshAccessToken } from "../utils/refreshToken";
import { ErrorLink } from "@apollo/client/link/error";

import { from, EMPTY } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";

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

// error
const errorLink = new ErrorLink(({ error, operation, forward }) => {
    console.log('errorLink triggered:', error);   // ← جديد
  if (!CombinedGraphQLErrors.is(error)) {
     console.log('Not a CombinedGraphQLErrors, skipping');   // ← جديد

// error
const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (!CombinedGraphQLErrors.is(error)) {

    return;
  }

  for (const err of error.errors) {
    if (err.extensions?.code === "UNAUTHENTICATED") {
      
      return from(refreshAccessToken()).pipe(
        switchMap((newToken) => {

          // حفظ التوكن الجديد
          localStorage.setItem("accessToken", newToken);

          // تعديل request القديم بالتوكن الجديد
          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              authorization: `Bearer ${newToken}`,
            },
          }));

          // إعادة إرسال request القديم
          return forward(operation);
        }),

        catchError(() => {
          // refreshToken نفسه فشل
          localStorage.removeItem("accessToken");

          window.location.href = "/login";

          return EMPTY;
        })
      );
    }
  }

  return;
});;


export const client = new ApolloClient({
    link:errorLink.concat(authClient).concat(httpLink),
    cache: new InMemoryCache(),
});



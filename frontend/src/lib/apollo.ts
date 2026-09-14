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

<<<<<<< Updated upstream
=======
// error
const errorLink = new ErrorLink(({ error, operation, forward }) => {
    console.log('errorLink triggered:', error);   // ← جديد
  if (!CombinedGraphQLErrors.is(error)) {
     console.log('Not a CombinedGraphQLErrors, skipping');   // ← جديد
    return;
  }

  for (const err of error.errors) {
    if (err.extensions?.code === "UNAUTHENTICATED") {
      
      return from(refreshAccessToken()).pipe(
        switchMap((newToken) => {
            console.log('Got new token:', newToken);
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

>>>>>>> Stashed changes

export const client = new ApolloClient({
    link: authClient.concat(httpLink),
    cache: new InMemoryCache(),
});
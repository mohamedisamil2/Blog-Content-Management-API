import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag"

const typeDefs = gql`
type Query {
    sayHi:String!
}
`
const resolvers = {
    Query: {
      sayHi:() => "hello world"
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
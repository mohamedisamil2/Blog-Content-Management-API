export const userTypeDefs = `#graphql 

type User {
  id:ID!
  name:String!
  email:String!
  createdAt: String!
}

type AuthPayload{
    accessToken:String!
    user:User!
}

type RefreshPayload{
    accessToken: String!
}

type Query{
    users:[User]
    user(id:ID!):User!
}

type Mutation{
    register(input:RegisterInput!):AuthPayload!
    login(email:String!, password:String!):AuthPayload!
    logout:Boolean!
    refreshToken:RefreshPayload!
}

input RegisterInput{
    name:String!
    email:String!
    password:String!
}


`
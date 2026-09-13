export const userTypeDefs = `#graphql 

enum Role {
  admin
  user
}

type User {
  id:ID!
  name:String!
  email:String!
  role:Role!
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
    me:User
}

type Mutation{
    registerUser(input:RegisterInput!):AuthPayload!
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


export const categoryTypeDefs = `#graphql

type Category{
    id:ID!
    name:String!
    createdAt:String!
}

type Query{
    categories:[Category!]!
    category(id:ID!):Category!
}

type Mutation{
    createCategory(name:String!):Category!
}

`


export const postTypeDefs = `#graphql

type Post{
    id:ID!
    title:String!
    content:String!
    category:Category!
    author:User!
    comments: [Comment!]!   
    createdAt:String!
    updatedAt:String!
}

type Query{
    posts:[Post!]!
    post(id:ID!):Post!
}

type Mutation{
    createPost(input:CreatePostInput!):Post!
    deletePost(id:ID!):Boolean!
    updatePost(id:ID!, input:UpdatePostInput!):Post!
}

input CreatePostInput{
    title:String!
    content:String!
    categoryId:ID!
}

input UpdatePostInput{
    title:String
    content:String
    categoryId:ID
}
`
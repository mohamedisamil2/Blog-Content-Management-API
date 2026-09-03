
export const commentTypeDefs = `#graphql

type Comment{
    id:ID!
    content:String!
    author:User!
    post:Post!
    createdAt:String!
    updatedAt:String!
}

type Query{
    comments:[Comment!]!
    comment(id:ID!):Comment!
    commentByPostId(postId:ID!):[Comment!]!
}

type Mutation{
  createComment(input:CreateCommentInput!):Comment!
  deleteComment(id:ID!):Boolean!
  updateComment(id:ID!, input:UpdateCommentInput!):Comment!
}

input CreateCommentInput{
    content:String!
    postId:ID!
}

input UpdateCommentInput{
    content:String
}

`
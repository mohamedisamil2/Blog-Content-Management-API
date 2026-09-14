import { gql } from "@apollo/client";


export const Create_Comment = gql`
mutation CommentMutation($input:CreateCommentInput!){
  createComment(input: $input) {
    id,
    content,
    post {
      title,
      content,
      category {
        name
      },
      comments {
        content
        author {
          id
          name
        },
      },
    },
      createdAt,
      updatedAt,
  }
}
`;

export const DeleteComment = gql`
mutation DeleteCommentMutation($id:ID!){
  deleteComment(id: $id)
}
`;

export const Update_Comment = gql`
mutation UpdateCommentMutation($id:ID!, $input:UpdateCommentInput!){
  updateComment(id: $id, input: $input) {
    id,
    content,
    author {
      id,
      name
    },
    post {
      id,
      title,
      content
      category {
        name
      }
      comments {
        id,
        content
        author{
          id,
          name,
        }
      }
    },
    createdAt,
    updatedAt
  }
}
`;
import { gql } from "@apollo/client";


export const CreatePostMutat = gql`
mutation PostMutation($input:CreatePostInput!){
  createPost(input: $input) {
    title,
    content
    author {
      name
    }
    category {
      name
    }
  }
}

`;

export const DeletePost = gql`
mutation DeletePostMutation($id:ID!){
  deletePost(id: $id)
}
`;

export const UpdatePost = gql`
mutation UpdateMutation($id:ID!,$input:UpdatePostInput!){
  updatePost(id: $id, input: $input) {
    id,
    title,
    content,
    category {
      name
    }
    author {
      name,
    }
  }
}
`;


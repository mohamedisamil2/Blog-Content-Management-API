import { gql } from "@apollo/client";



export const GetAllComment = gql`
query CommentQuery{
  comments{
    id,
    content,
    author {
      id,
      name
    },
    post {
      id,
      title,
      category {
        id,
        name
      }
    }
    
  }
}
`;

export const GetCommentId = gql`
query GetCommentQuery($id: ID!){
  comment(id: $id) {
    id,
    content,
    author {
      name
    }
    post {
      id,
      title,
      content,
      comments {
        content,
      }
      category {
        name
      }
    }
  }
}
`;
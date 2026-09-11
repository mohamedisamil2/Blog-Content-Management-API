import { gql } from "@apollo/client";


export const PostQuery = gql`
query Posts{
    posts {
    id,
    title,
    content
    author {
      name
    }
    category {
      name
    }
    createdAt
    updatedAt
  }
}

`;

export const GetPostId = gql`
query Post($id:ID!){
  post(id:$id){
    id
    title
    content
    author {
      name 
    }
    category {
      name 
    }
    comments {
      id
      content
      author {
        id
        name 
      }
      createdAt
    }
  }
}
`;
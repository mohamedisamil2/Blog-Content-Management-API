import { gql } from "@apollo/client";


export const GetAllCategories = gql`
query CategoriesQuery{
  categories {
    id
    name
    createdAt
  }
}
`;

export const GetCategoryId = gql`
query CategoryQuery($id: ID!){
  category(id: $id) {
    id
    name
    createdAt
  }
}`;
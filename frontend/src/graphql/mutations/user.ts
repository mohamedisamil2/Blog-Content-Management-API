import {gql}from "@apollo/client"

export const Login_Mutation = gql`
mutation Login($email:String!, $password:String!){
    login(email:$email,password:$password){
        accessToken
        user{
            id,
            name,
            email,
            role,
        }
    }
}
`;

export const RegisterMutation = gql`
mutation Register($input:RegisterInput!){
    registerUser(input:$input){
        accessToken
        user {
            id,
            name,
            email,
            createdAt
        }
    }
}
`;


export const LogoutMutation = gql`
mutation Logout{
    logout
}
`;
import { gql } from 'apollo-angular';

/**
 * Fragment for Role fields
 */
const FRAGMENT_ROLE = gql`
  fragment RoleFields on Role {
    id
    name
    description
    createdAt
    updatedAt
  }
`;

/**
 * Get all roles query
 */
const GET_ROLES = gql`
  query getRoles {
    roles(order: { name: ASC }) {
      ...RoleFields
    }
  }
  ${FRAGMENT_ROLE}
`;

/**
 * Get role by ID query
 */
const GET_ROLE = gql`
  query getRole($id: Int!) {
    roles(where: { id: { eq: $id } }) {
      ...RoleFields
      users {
        id
        firstName
        lastName
        email
      }
    }
  }
  ${FRAGMENT_ROLE}
`;

/**
 * Add role mutation
 */
const ADD_ROLE = gql`
  mutation addRole($input: RoleMutationInput!) {
    addRole(input: $input) {
      ...RoleFields
    }
  }
  ${FRAGMENT_ROLE}
`;

/**
 * Update role mutation
 */
const UPDATE_ROLE = gql`
  mutation updateRole($input: RoleMutationInput!) {
    updateRole(input: $input) {
      ...RoleFields
    }
  }
  ${FRAGMENT_ROLE}
`;

/**
 * Delete role mutation
 */
const DELETE_ROLE = gql`
  mutation deleteRole($id: Int!) {
    deleteRole(id: $id)
  }
`;

export { FRAGMENT_ROLE, GET_ROLES, GET_ROLE, ADD_ROLE, UPDATE_ROLE, DELETE_ROLE };

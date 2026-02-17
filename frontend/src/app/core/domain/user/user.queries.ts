import { gql } from 'apollo-angular';

/**
 * Fragment for User fields
 */
const FRAGMENT_USER = gql`
  fragment UserFields on User {
    id
    keycloakId
    username
    email
    firstName
    lastName
    phone
    isActive
    lastLoginAt
    branchId
    roleId
    createdAt
    updatedAt
  }
`;

/**
 * Get all users query
 */
const GET_USERS = gql`
  query getUsers {
    users(where: { isActive: { eq: true } }) {
      nodes {
        ...UserFields
        branch {
          id
          name
          code
        }
        role {
          id
          name
          description
        }
      }
    }
  }
  ${FRAGMENT_USER}
`;

/**
 * Get user by ID query
 */
const GET_USER = gql`
  query getUser($id: Int!) {
    users(where: { id: { eq: $id } }) {
      ...UserFields
      branch {
        id
        name
        code
        address
        city
        phone
        email
      }
      role {
        id
        name
        description
      }
    }
  }
  ${FRAGMENT_USER}
`;

/**
 * Get user by Keycloak ID query
 */
const GET_USER_BY_KEYCLOAK_ID = gql`
  query getUserByKeycloakId($keycloakId: String!) {
    users(where: { keycloakId: { eq: $keycloakId } }) {
      ...UserFields
      branch {
        id
        name
        code
      }
      role {
        id
        name
        description
      }
    }
  }
  ${FRAGMENT_USER}
`;

/**
 * Get users by branch ID query
 */
const GET_USERS_BY_BRANCH = gql`
  query getUsersByBranch($branchId: Int!) {
    users(where: { branchId: { eq: $branchId }, isActive: { eq: true } }) {
      ...UserFields
      role {
        id
        name
      }
    }
  }
  ${FRAGMENT_USER}
`;

/**
 * Get users by role ID query
 */
const GET_USERS_BY_ROLE = gql`
  query getUsersByRole($roleId: Int!) {
    users(where: { roleId: { eq: $roleId }, isActive: { eq: true } }) {
      ...UserFields
      branch {
        id
        name
      }
    }
  }
  ${FRAGMENT_USER}
`;

/**
 * Add user mutation
 */
const ADD_USER = gql`
  mutation addUser($input: UserMutationInput!) {
    addUser(input: $input) {
      ...UserFields
    }
  }
  ${FRAGMENT_USER}
`;

/**
 * Update user mutation
 */
const UPDATE_USER = gql`
  mutation updateUser($input: UserMutationInput!) {
    updateUser(input: $input) {
      ...UserFields
      branch {
        id
        name
      }
      role {
        id
        name
      }
    }
  }
  ${FRAGMENT_USER}
`;

/**
 * Delete user mutation (soft delete)
 */
const DELETE_USER = gql`
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;

/**
 * Deactivate user mutation
 */
const DEACTIVATE_USER = gql`
  mutation deactivateUser($id: Int!) {
    deactivateUser(id: $id) {
      ...UserFields
    }
  }
  ${FRAGMENT_USER}
`;

/**
 * Activate user mutation
 */
const ACTIVATE_USER = gql`
  mutation activateUser($id: Int!) {
    activateUser(id: $id) {
      ...UserFields
    }
  }
  ${FRAGMENT_USER}
`;

export {
  FRAGMENT_USER,
  GET_USERS,
  GET_USER,
  GET_USER_BY_KEYCLOAK_ID,
  GET_USERS_BY_BRANCH,
  GET_USERS_BY_ROLE,
  ADD_USER,
  UPDATE_USER,
  DELETE_USER,
  DEACTIVATE_USER,
  ACTIVATE_USER,
};

import { gql } from 'apollo-angular';

/**
 * ISOLATED TEST FOR GET_CURRENT_USER QUERY
 * This file tests if the query syntax is valid
 */

export const TEST_CURRENT_USER = gql`
  query getCurrentUser {
    currentUser {
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
`;

console.log('TEST_CURRENT_USER query loaded successfully:', TEST_CURRENT_USER);

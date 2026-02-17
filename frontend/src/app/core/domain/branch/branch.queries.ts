import { gql } from 'apollo-angular';

/**
 * Fragment for Branch fields
 */
const FRAGMENT_BRANCH = gql`
  fragment BranchFields on Branch {
    id
    name
    code
    address
    city
    phone
    email
    isActive
    createdAt
    updatedAt
  }
`;

/**
 * Get all branches query
 */
const GET_BRANCHES = gql`
  query getBranches {
    branches(where: { isActive: { eq: true } }, order: { name: ASC }) {
      nodes {
        ...BranchFields
      }
    }
  }
  ${FRAGMENT_BRANCH}
`;

/**
 * Get all branches (including inactive)
 */
const GET_ALL_BRANCHES = gql`
  query getAllBranches {
    branches(order: { name: ASC }) {
      nodes {
        ...BranchFields
      }
    }
  }
  ${FRAGMENT_BRANCH}
`;

/**
 * Get branch by ID query
 */
const GET_BRANCH = gql`
  query getBranch($id: Int!) {
    branches(where: { id: { eq: $id } }) {
      ...BranchFields
      users {
        id
        firstName
        lastName
        email
      }
    }
  }
  ${FRAGMENT_BRANCH}
`;

/**
 * Add branch mutation
 */
const ADD_BRANCH = gql`
  mutation addBranch($input: BranchMutationInput!) {
    addBranch(input: $input) {
      ...BranchFields
    }
  }
  ${FRAGMENT_BRANCH}
`;

/**
 * Update branch mutation
 */
const UPDATE_BRANCH = gql`
  mutation updateBranch($input: BranchMutationInput!) {
    updateBranch(input: $input) {
      ...BranchFields
    }
  }
  ${FRAGMENT_BRANCH}
`;

/**
 * Delete branch mutation
 */
const DELETE_BRANCH = gql`
  mutation deleteBranch($id: Int!) {
    deleteBranch(id: $id)
  }
`;

export {
  FRAGMENT_BRANCH,
  GET_BRANCHES,
  GET_ALL_BRANCHES,
  GET_BRANCH,
  ADD_BRANCH,
  UPDATE_BRANCH,
  DELETE_BRANCH,
};

import { gql } from 'apollo-angular';

/**
 * Fragment for Category fields
 */
const FRAGMENT_CATEGORY = gql`
  fragment CategoryFields on Category {
    id
    name
    description
    createdAt
    updatedAt
  }
`;

/**
 * Get all categories query
 */
const GET_CATEGORIES = gql`
  query getCategories {
    categories(order: { name: ASC }) {
      nodes {
        ...CategoryFields
      }
    }
  }
  ${FRAGMENT_CATEGORY}
`;

/**
 * Get category by ID query
 */
const GET_CATEGORY = gql`
  query getCategory($id: Int!) {
    categories(where: { id: { eq: $id } }) {
      nodes {
        ...CategoryFields
      }
    }
  }
  ${FRAGMENT_CATEGORY}
`;

/**
 * Add category mutation
 */
const ADD_CATEGORY = gql`
  mutation addCategory($input: CategoryMutationInput!) {
    addCategory(input: $input) {
      ...CategoryFields
    }
  }
  ${FRAGMENT_CATEGORY}
`;

/**
 * Update category mutation
 */
const UPDATE_CATEGORY = gql`
  mutation updateCategory($input: CategoryMutationInput!) {
    updateCategory(input: $input) {
      ...CategoryFields
    }
  }
  ${FRAGMENT_CATEGORY}
`;

/**
 * Delete category mutation
 */
const DELETE_CATEGORY = gql`
  mutation deleteCategory($id: Int!) {
    deleteCategory(id: $id)
  }
`;

export {
  FRAGMENT_CATEGORY,
  GET_CATEGORIES,
  GET_CATEGORY,
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
};

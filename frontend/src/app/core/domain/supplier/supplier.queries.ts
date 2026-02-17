import { gql } from 'apollo-angular';

/**
 * Fragment for Supplier fields
 */
const FRAGMENT_SUPPLIER = gql`
  fragment SupplierFields on Supplier {
    id
    name
    contactPerson
    phone
    email
    address
    category
    rating
    isActive
    createdAt
    updatedAt
  }
`;

/**
 * Get all suppliers query
 */
const GET_SUPPLIERS = gql`
  query getSuppliers {
    suppliers(where: { isActive: { eq: true } }, order: { name: ASC }) {
      nodes {
        ...SupplierFields
      }
    }
  }
  ${FRAGMENT_SUPPLIER}
`;

/**
 * Get all suppliers (including inactive)
 */
const GET_ALL_SUPPLIERS = gql`
  query getAllSuppliers {
    suppliers(order: { name: ASC }) {
      nodes {
        ...SupplierFields
      }
    }
  }
  ${FRAGMENT_SUPPLIER}
`;

/**
 * Get supplier by ID query
 */
const GET_SUPPLIER = gql`
  query getSupplier($id: Int!) {
    suppliers(where: { id: { eq: $id } }) {
      ...SupplierFields
    }
  }
  ${FRAGMENT_SUPPLIER}
`;

/**
 * Search suppliers
 */
const SEARCH_SUPPLIERS = gql`
  query searchSuppliers($search: String!) {
    suppliers(
      where: {
        or: [
          { name: { contains: $search } }
          { email: { contains: $search } }
          { phone: { contains: $search } }
        ]
        isActive: { eq: true }
      }
      order: { name: ASC }
    ) {
      nodes {
        ...SupplierFields
      }
    }
  }
  ${FRAGMENT_SUPPLIER}
`;

/**
 * Add supplier mutation
 */
const ADD_SUPPLIER = gql`
  mutation addSupplier($input: SupplierMutationInput!) {
    addSupplier(input: $input) {
      ...SupplierFields
    }
  }
  ${FRAGMENT_SUPPLIER}
`;

/**
 * Update supplier mutation
 */
const UPDATE_SUPPLIER = gql`
  mutation updateSupplier($input: SupplierMutationInput!) {
    updateSupplier(input: $input) {
      ...SupplierFields
    }
  }
  ${FRAGMENT_SUPPLIER}
`;

/**
 * Delete supplier mutation
 */
const DELETE_SUPPLIER = gql`
  mutation deleteSupplier($id: Int!) {
    deleteSupplier(id: $id)
  }
`;

export {
  FRAGMENT_SUPPLIER,
  GET_SUPPLIERS,
  GET_ALL_SUPPLIERS,
  GET_SUPPLIER,
  SEARCH_SUPPLIERS,
  ADD_SUPPLIER,
  UPDATE_SUPPLIER,
  DELETE_SUPPLIER,
};

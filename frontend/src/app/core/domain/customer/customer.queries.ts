import { gql } from 'apollo-angular';

/**
 * Fragment for Customer fields
 */
const FRAGMENT_CUSTOMER = gql`
  fragment CustomerFields on Customer {
    id
    name
    phone
    email
    address
    customerType
    isActive
    createdAt
    updatedAt
  }
`;

/**
 * Get all customers query
 */
const GET_CUSTOMERS = gql`
  query getCustomers {
    customers(where: { isActive: { eq: true } }, order: { name: ASC }) {
      nodes {
        ...CustomerFields
      }
    }
  }
  ${FRAGMENT_CUSTOMER}
`;

/**
 * Get all customers (including inactive)
 */
const GET_ALL_CUSTOMERS = gql`
  query getAllCustomers {
    customers(order: { name: ASC }) {
      nodes {
        ...CustomerFields
      }
    }
  }
  ${FRAGMENT_CUSTOMER}
`;

/**
 * Get customer by ID query
 */
const GET_CUSTOMER = gql`
  query getCustomer($id: Int!) {
    customers(where: { id: { eq: $id } }) {
      nodes {
        ...CustomerFields
      }
    }
  }
  ${FRAGMENT_CUSTOMER}
`;

/**
 * Search customers
 */
const SEARCH_CUSTOMERS = gql`
  query searchCustomers($search: String!) {
    customers(
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
        ...CustomerFields
      }
    }
  }
  ${FRAGMENT_CUSTOMER}
`;

/**
 * Add customer mutation
 */
const ADD_CUSTOMER = gql`
  mutation addCustomer($input: CustomerMutationInput!) {
    addCustomer(input: $input, logInfo: $logInfo) {
      ...CustomerFields
    }
  }
  ${FRAGMENT_CUSTOMER}
`;

/**
 * Update customer mutation
 */
const UPDATE_CUSTOMER = gql`
  mutation updateCustomer($input: CustomerMutationInput!) {
    updateCustomer(input: $input, logInfo: $logInfo) {
      ...CustomerFields
    }
  }
  ${FRAGMENT_CUSTOMER}
`;

/**
 * Delete customer mutation
 */
const DELETE_CUSTOMER = gql`
  mutation deleteCustomer($id: Int!) {
    deleteCustomer(id: $id, logInfo: $logInfo)
  }
`;

export {
  FRAGMENT_CUSTOMER,
  GET_CUSTOMERS,
  GET_ALL_CUSTOMERS,
  GET_CUSTOMER,
  SEARCH_CUSTOMERS,
  ADD_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER,
};

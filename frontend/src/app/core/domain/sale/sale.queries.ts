import { gql } from 'apollo-angular';

/**
 * Fragment for Sale Item fields
 */
const FRAGMENT_SALE_ITEM = gql`
  fragment SaleItemFields on SaleItem {
    id
    saleId
    productId
    quantity
    unitPrice
    subtotal
  }
`;

/**
 * Fragment for Sale fields
 */
const FRAGMENT_SALE = gql`
  fragment SaleFields on Sale {
    id
    saleNumber
    customerId
    branchId
    attendantUserId
    totalAmount
    paymentMethod
    status
    saleDate
    createdAt
    updatedAt
  }
`;

/**
 * Get all sales query
 */
const GET_SALES = gql`
  query getSales {
    sales(order: { saleDate: DESC }) {
      nodes {
        ...SaleFields
        customer {
          id
          name
          email
        }
        branch {
          id
          name
        }
        attendantUser {
          id
          firstName
          lastName
        }
      }
    }
  }
  ${FRAGMENT_SALE}
`;

/**
 * Get sale by ID query
 */
const GET_SALE = gql`
  query getSale($id: Int!) {
    sales(where: { id: { eq: $id } }) {
      nodes {
        ...SaleFields
        customer {
          id
          name
          email
          phone
          customerType
        }
        branch {
          id
          name
          code
        }
        attendantUser {
          id
          firstName
          lastName
          email
        }
        items {
          ...SaleItemFields
          product {
            id
            name
            sku
            price
          }
        }
      }
    }
  }
  ${FRAGMENT_SALE}
  ${FRAGMENT_SALE_ITEM}
`;

/**
 * Get sales by branch query
 */
const GET_SALES_BY_BRANCH = gql`
  query getSalesByBranch($branchId: Int!) {
    sales(where: { branchId: { eq: $branchId } }, order: { saleDate: DESC }) {
      ...SaleFields
      customer {
        id
        name
      }
      attendantUser {
        id
        firstName
        lastName
      }
    }
  }
  ${FRAGMENT_SALE}
`;

/**
 * Get sales by customer query
 */
const GET_SALES_BY_CUSTOMER = gql`
  query getSalesByCustomer($customerId: Int!) {
    sales(where: { customerId: { eq: $customerId } }, order: { saleDate: DESC }) {
      ...SaleFields
      branch {
        id
        name
      }
      attendantUser {
        id
        firstName
        lastName
      }
    }
  }
  ${FRAGMENT_SALE}
`;

/**
 * Get sales by date range query
 */
const GET_SALES_BY_DATE_RANGE = gql`
  query getSalesByDateRange($startDate: DateTime!, $endDate: DateTime!) {
    sales(
      where: { saleDate: { gte: $startDate, lte: $endDate } }
      order: { saleDate: DESC }
    ) {
      ...SaleFields
      customer {
        id
        name
      }
      branch {
        id
        name
      }
    }
  }
  ${FRAGMENT_SALE}
`;

/**
 * Add sale mutation - accepts items array, backend calculates totals
 */
const ADD_SALE = gql`
  mutation addSale($input: SaleMutationInput!) {
    addSale(input: $input, logInfo: $logInfo) {
      ...SaleFields
      items {
        ...SaleItemFields
      }
    }
  }
  ${FRAGMENT_SALE}
  ${FRAGMENT_SALE_ITEM}
`;

/**
 * Update sale mutation
 */
const UPDATE_SALE = gql`
  mutation updateSale($input: SaleMutationInput!) {
    updateSale(input: $input) {
      ...SaleFields
    }
  }
  ${FRAGMENT_SALE}
`;

/**
 * Delete sale mutation
 */
const DELETE_SALE = gql`
  mutation deleteSale($id: Int!) {
    deleteSale(id: $id)
  }
`;

export {
  FRAGMENT_SALE,
  FRAGMENT_SALE_ITEM,
  GET_SALES,
  GET_SALE,
  GET_SALES_BY_BRANCH,
  GET_SALES_BY_CUSTOMER,
  GET_SALES_BY_DATE_RANGE,
  ADD_SALE,
  UPDATE_SALE,
  DELETE_SALE,
};

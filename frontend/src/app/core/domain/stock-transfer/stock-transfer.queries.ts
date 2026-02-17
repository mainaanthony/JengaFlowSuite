import { gql } from 'apollo-angular';

/**
 * Fragment for Stock Transfer Item fields
 */
const FRAGMENT_STOCK_TRANSFER_ITEM = gql`
  fragment StockTransferItemFields on StockTransferItem {
    id
    stockTransferId
    productId
    quantity
  }
`;

/**
 * Fragment for Stock Transfer fields
 */
const FRAGMENT_STOCK_TRANSFER = gql`
  fragment StockTransferFields on StockTransfer {
    id
    transferNumber
    fromBranchId
    toBranchId
    requestedByUserId
    approvedByUserId
    status
    requestedDate
    completedDate
    notes
    createdAt
    updatedAt
  }
`;

/**
 * Get all stock transfers query
 */
const GET_STOCK_TRANSFERS = gql`
  query getStockTransfers {
    stockTransfers(order: { requestedDate: DESC }) {
      nodes {
        ...StockTransferFields
        fromBranch {
          id
          name
        }
        toBranch {
          id
          name
        }
        requestedByUser {
          id
          firstName
          lastName
        }
        approvedByUser {
          id
          firstName
          lastName
        }
      }
    }
  }
  ${FRAGMENT_STOCK_TRANSFER}
`;

/**
 * Get stock transfer by ID query
 */
const GET_STOCK_TRANSFER = gql`
  query getStockTransfer($id: Int!) {
    stockTransfers(where: { id: { eq: $id } }) {
      ...StockTransferFields
      fromBranch {
        id
        name
        code
      }
      toBranch {
        id
        name
        code
      }
      requestedByUser {
        id
        firstName
        lastName
        email
      }
      approvedByUser {
        id
        firstName
        lastName
      }
      items {
        ...StockTransferItemFields
        product {
          id
          name
          sku
        }
      }
    }
  }
  ${FRAGMENT_STOCK_TRANSFER}
  ${FRAGMENT_STOCK_TRANSFER_ITEM}
`;

/**
 * Get stock transfers by branch query
 */
const GET_STOCK_TRANSFERS_BY_BRANCH = gql`
  query getStockTransfersByBranch($branchId: Int!) {
    stockTransfers(
      where: {
        or: [{ fromBranchId: { eq: $branchId } }, { toBranchId: { eq: $branchId } }]
      }
      order: { requestedDate: DESC }
    ) {
      nodes {
        ...StockTransferFields
        fromBranch {
          id
          name
        }
        toBranch {
          id
          name
        }
      }
    }
  }
  ${FRAGMENT_STOCK_TRANSFER}
`;

/**
 * Get stock transfers by status query
 */
const GET_STOCK_TRANSFERS_BY_STATUS = gql`
  query getStockTransfersByStatus($status: StockTransferStatus!) {
    stockTransfers(where: { status: { eq: $status } }, order: { requestedDate: DESC }) {
      nodes {
        ...StockTransferFields
        fromBranch {
          id
          name
        }
        toBranch {
          id
          name
        }
      }
    }
  }
  ${FRAGMENT_STOCK_TRANSFER}
`;

/**
 * Add stock transfer mutation
 */
const ADD_STOCK_TRANSFER = gql`
  mutation addStockTransfer($input: StockTransferMutationInput!) {
    addStockTransfer(input: $input) {
      ...StockTransferFields
    }
  }
  ${FRAGMENT_STOCK_TRANSFER}
`;

/**
 * Update stock transfer mutation
 */
const UPDATE_STOCK_TRANSFER = gql`
  mutation updateStockTransfer($input: StockTransferMutationInput!) {
    updateStockTransfer(input: $input) {
      ...StockTransferFields
    }
  }
  ${FRAGMENT_STOCK_TRANSFER}
`;

/**
 * Delete stock transfer mutation
 */
const DELETE_STOCK_TRANSFER = gql`
  mutation deleteStockTransfer($id: Int!) {
    deleteStockTransfer(id: $id)
  }
`;

export {
  FRAGMENT_STOCK_TRANSFER,
  FRAGMENT_STOCK_TRANSFER_ITEM,
  GET_STOCK_TRANSFERS,
  GET_STOCK_TRANSFER,
  GET_STOCK_TRANSFERS_BY_BRANCH,
  GET_STOCK_TRANSFERS_BY_STATUS,
  ADD_STOCK_TRANSFER,
  UPDATE_STOCK_TRANSFER,
  DELETE_STOCK_TRANSFER,
};

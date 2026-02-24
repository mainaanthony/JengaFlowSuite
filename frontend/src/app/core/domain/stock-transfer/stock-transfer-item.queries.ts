import { gql } from 'apollo-angular';

/**
 * GraphQL fragment for StockTransferItem
 */
export const FRAGMENT_STOCK_TRANSFER_ITEM = gql`
  fragment StockTransferItemFields on StockTransferItem {
    id
    stockTransferId
    productId
    quantityRequested
    quantityTransferred
    createdAt
    updatedAt
  }
`;

/**
 * Mutation to add a new stock transfer item
 */
export const ADD_STOCK_TRANSFER_ITEM = gql`
  mutation AddStockTransferItem($input: StockTransferItemMutationInput!) {
    addStockTransferItem(input: $input, logInfo: $logInfo) {
      ...StockTransferItemFields
    }
  }
  ${FRAGMENT_STOCK_TRANSFER_ITEM}
`;

/**
 * Mutation to update an existing stock transfer item
 */
export const UPDATE_STOCK_TRANSFER_ITEM = gql`
  mutation UpdateStockTransferItem($input: StockTransferItemMutationInput!) {
    updateStockTransferItem(input: $input, logInfo: $logInfo) {
      ...StockTransferItemFields
    }
  }
  ${FRAGMENT_STOCK_TRANSFER_ITEM}
`;

/**
 * Mutation to delete a stock transfer item
 */
export const DELETE_STOCK_TRANSFER_ITEM = gql`
  mutation DeleteStockTransferItem($id: Int!) {
    deleteStockTransferItem(id: $id, logInfo: $logInfo)
  }
`;

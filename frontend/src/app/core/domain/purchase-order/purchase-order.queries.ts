import { gql } from 'apollo-angular';

/**
 * Purchase Order Item Fragment
 */
export const FRAGMENT_PURCHASE_ORDER_ITEM = gql`
  fragment PurchaseOrderItemFields on PurchaseOrderItem {
    id
    purchaseOrderId
    productId
    quantity
    unitPrice
    totalPrice
  }
`;

/**
 * Purchase Order Fragment
 */
export const FRAGMENT_PURCHASE_ORDER = gql`
  fragment PurchaseOrderFields on PurchaseOrder {
    id
    poNumber
    supplierId
    createdByUserId
    approvedByUserId
    totalAmount
    status
    expectedDeliveryDate
    deliveredDate
    notes
    createdAt
    updatedAt
    deletedAt
  }
`;

/**
 * Get Purchase Order by ID
 */
export const GET_PURCHASE_ORDER = gql`
  ${FRAGMENT_PURCHASE_ORDER}
  query GetPurchaseOrder($id: Int!) {
    purchaseOrder(id: $id) {
      ...PurchaseOrderFields
    }
  }
`;

/**
 * Get All Purchase Orders
 */
export const GET_PURCHASE_ORDERS = gql`
  ${FRAGMENT_PURCHASE_ORDER}
  query GetPurchaseOrders {
    purchaseOrders {
      ...PurchaseOrderFields
    }
  }
`;

/**
 * Add Purchase Order - accepts items array, backend calculates totals
 */
export const ADD_PURCHASE_ORDER = gql`
  ${FRAGMENT_PURCHASE_ORDER}
  ${FRAGMENT_PURCHASE_ORDER_ITEM}
  mutation AddPurchaseOrder($input: PurchaseOrderMutationInput!, $logInfo: EntityLogInfo!) {
    addPurchaseOrder(input: $input, logInfo: $logInfo) {
      ...PurchaseOrderFields
      items {
        ...PurchaseOrderItemFields
      }
    }
  }
`;

/**
 * Update Purchase Order
 */
export const UPDATE_PURCHASE_ORDER = gql`
  ${FRAGMENT_PURCHASE_ORDER}
  mutation UpdatePurchaseOrder($input: PurchaseOrderMutationInput!) {
    updatePurchaseOrder(input: $input) {
      ...PurchaseOrderFields
    }
  }
`;

/**
 * Delete Purchase Order
 */
export const DELETE_PURCHASE_ORDER = gql`
  mutation DeletePurchaseOrder($id: Int!) {
    deletePurchaseOrder(id: $id)
  }
`;

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
    createdBy
    createdAt
    updatedBy
    updatedAt
  }
`;

/**
 * Get Purchase Order by ID
 */
export const GET_PURCHASE_ORDER = gql`
  query GetPurchaseOrder($id: Int!) {
    purchaseOrder(id: $id) {
      ...PurchaseOrderFields
    }
  }
  ${FRAGMENT_PURCHASE_ORDER}
`;

/**
 * Get All Purchase Orders
 */
export const GET_PURCHASE_ORDERS = gql`
  query GetPurchaseOrders {
    purchaseOrders {
      nodes {
        ...PurchaseOrderFields
      }
    }
  }
  ${FRAGMENT_PURCHASE_ORDER}
`;

/**
 * Add Purchase Order - accepts items array, backend calculates totals
 */
export const ADD_PURCHASE_ORDER = gql`
  mutation AddPurchaseOrder($input: PurchaseOrderMutationInput!) {
    addPurchaseOrder(input: $input) {
      ...PurchaseOrderFields
      items {
        ...PurchaseOrderItemFields
      }
    }
  }
  ${FRAGMENT_PURCHASE_ORDER}
  ${FRAGMENT_PURCHASE_ORDER_ITEM}
`;

/**
 * Update Purchase Order
 */
export const UPDATE_PURCHASE_ORDER = gql`
  mutation UpdatePurchaseOrder($input: PurchaseOrderMutationInput!) {
    updatePurchaseOrder(input: $input) {
      ...PurchaseOrderFields
    }
  }
  ${FRAGMENT_PURCHASE_ORDER}
`;

/**
 * Delete Purchase Order
 */
export const DELETE_PURCHASE_ORDER = gql`
  mutation DeletePurchaseOrder($id: Int!) {
    deletePurchaseOrder(id: $id)
  }
`;

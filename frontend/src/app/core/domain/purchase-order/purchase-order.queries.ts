import { gql } from 'apollo-angular';

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
 * Add Purchase Order
 */
export const ADD_PURCHASE_ORDER = gql`
  ${FRAGMENT_PURCHASE_ORDER}
  mutation AddPurchaseOrder($input: PurchaseOrderMutationInput!) {
    addPurchaseOrder(input: $input) {
      ...PurchaseOrderFields
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

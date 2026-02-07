import { gql } from 'apollo-angular';

/**
 * GraphQL fragment for GoodsReceivedNoteItem
 */
export const FRAGMENT_GOODS_RECEIVED_NOTE_ITEM = gql`
  fragment GoodsReceivedNoteItemFields on GoodsReceivedNoteItem {
    goodsReceivedNoteItemId
    goodsReceivedNoteId
    purchaseOrderItemId
    productId
    quantityReceived
    quantityRejected
    unitPrice
    totalAmount
    expiryDate
    batchNumber
    remarks
    createdBy
    createdAt
    modifiedBy
    modifiedAt
  }
`;

/**
 * GraphQL fragment for GoodsReceivedNote
 */
export const FRAGMENT_GOODS_RECEIVED_NOTE = gql`
  fragment GoodsReceivedNoteFields on GoodsReceivedNote {
    goodsReceivedNoteId
    grnNumber
    purchaseOrderId
    supplierId
    branchId
    receivedDate
    status
    totalAmount
    remarks
    receivedBy
    approvedBy
    approvedDate
    createdBy
    createdAt
    modifiedBy
    modifiedAt
    items {
      ...GoodsReceivedNoteItemFields
    }
  }
  ${FRAGMENT_GOODS_RECEIVED_NOTE_ITEM}
`;

/**
 * Query to get a single goods received note by ID
 */
export const GET_GOODS_RECEIVED_NOTE = gql`
  query GetGoodsReceivedNote($id: String!) {
    goodsReceivedNote(goodsReceivedNoteId: $id) {
      ...GoodsReceivedNoteFields
    }
  }
  ${FRAGMENT_GOODS_RECEIVED_NOTE}
`;

/**
 * Query to get all goods received notes
 */
export const GET_GOODS_RECEIVED_NOTES = gql`
  query GetGoodsReceivedNotes {
    goodsReceivedNotes {
      ...GoodsReceivedNoteFields
    }
  }
  ${FRAGMENT_GOODS_RECEIVED_NOTE}
`;

/**
 * Mutation to add a new goods received note
 */
export const ADD_GOODS_RECEIVED_NOTE = gql`
  mutation AddGoodsReceivedNote($input: GoodsReceivedNoteInput!) {
    addGoodsReceivedNote(goodsReceivedNote: $input) {
      ...GoodsReceivedNoteFields
    }
  }
  ${FRAGMENT_GOODS_RECEIVED_NOTE}
`;

/**
 * Mutation to update an existing goods received note
 */
export const UPDATE_GOODS_RECEIVED_NOTE = gql`
  mutation UpdateGoodsReceivedNote($input: GoodsReceivedNoteInput!) {
    updateGoodsReceivedNote(goodsReceivedNote: $input) {
      ...GoodsReceivedNoteFields
    }
  }
  ${FRAGMENT_GOODS_RECEIVED_NOTE}
`;

/**
 * Mutation to delete a goods received note
 */
export const DELETE_GOODS_RECEIVED_NOTE = gql`
  mutation DeleteGoodsReceivedNote($id: String!) {
    deleteGoodsReceivedNote(goodsReceivedNoteId: $id)
  }
`;

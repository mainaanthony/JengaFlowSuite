import { gql } from 'apollo-angular';

/**
 * GraphQL fragment for GoodsReceivedNoteItem
 */
export const FRAGMENT_GOODS_RECEIVED_NOTE_ITEM = gql`
  fragment GoodsReceivedNoteItemFields on GoodsReceivedNoteItem {
    id
    goodsReceivedNoteId
    productId
    quantityOrdered
    quantityReceived
    remarks
    createdAt
    updatedAt
  }
`;

/**
 * Mutation to add a new goods received note item
 */
export const ADD_GOODS_RECEIVED_NOTE_ITEM = gql`
  mutation AddGoodsReceivedNoteItem($input: GoodsReceivedNoteItemMutationInput!) {
    addGoodsReceivedNoteItem(input: $input, logInfo: $logInfo) {
      ...GoodsReceivedNoteItemFields
    }
  }
  ${FRAGMENT_GOODS_RECEIVED_NOTE_ITEM}
`;

/**
 * Mutation to update an existing goods received note item
 */
export const UPDATE_GOODS_RECEIVED_NOTE_ITEM = gql`
  mutation UpdateGoodsReceivedNoteItem($input: GoodsReceivedNoteItemMutationInput!) {
    updateGoodsReceivedNoteItem(input: $input, logInfo: $logInfo) {
      ...GoodsReceivedNoteItemFields
    }
  }
  ${FRAGMENT_GOODS_RECEIVED_NOTE_ITEM}
`;

/**
 * Mutation to delete a goods received note item
 */
export const DELETE_GOODS_RECEIVED_NOTE_ITEM = gql`
  mutation DeleteGoodsReceivedNoteItem($id: Int!) {
    deleteGoodsReceivedNoteItem(id: $id, logInfo: $logInfo)
  }
`;

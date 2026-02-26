import { GoodsReceivedNoteStatus } from '../../enums/goods-received-note-status';
import { PurchaseOrder } from '../purchase-order/purchase-order';
import { User } from '../user/user';

/**
 * Represents a Goods Received Note Item
 */
export interface GoodsReceivedNoteItem {
  /** ID */
  id: number;

  /** Goods Received Note ID */
  goodsReceivedNoteId: number;

  /** Product ID */
  productId: number;

  /** Quantity Ordered */
  quantityOrdered: number;

  /** Quantity Received */
  quantityReceived: number;

  /** Remarks */
  remarks?: string | null;

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;
}

/**
 * Represents a Goods Received Note
 */
export interface GoodsReceivedNote {
  /** ID */
  id: number;

  /** GRN Number - unique identifier */
  grnNumber: string;

  /** Purchase Order ID - FK to PurchaseOrder */
  purchaseOrderId: number;

  /** Received By User ID - FK to User */
  receivedByUserId: number;

  /** Received Date */
  receivedDate: Date;

  /** Notes */
  notes?: string | null;

  /** Status */
  status: GoodsReceivedNoteStatus;

  /** Purchase Order - optional navigation property */
  purchaseOrder?: PurchaseOrder;

  /** Received By User */
  receivedByUser?: User;

  /** Items - GRN items */
  items?: GoodsReceivedNoteItem[];

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;
}

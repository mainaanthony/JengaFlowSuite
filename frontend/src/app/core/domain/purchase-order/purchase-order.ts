import { Supplier } from '../supplier/supplier';
import { User } from '../user/user';
import { OrderStatus } from '../../enums/order-status';

/**
 * Represents a Purchase Order Item
 */
export interface PurchaseOrderItem {
  /** ID */
  id: number;

  /** Purchase Order ID */
  purchaseOrderId: number;

  /** Product ID */
  productId: number;

  /** Quantity */
  quantity: number;

  /** Unit Price */
  unitPrice: number;

  /** Total Price */
  totalPrice: number;

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;
}

/**
 * Represents a Purchase Order
 */
export interface PurchaseOrder {
  /** ID */
  id: number;

  /** PO Number - unique identifier */
  poNumber: string;

  /** Supplier ID - FK to Supplier */
  supplierId: number;

  /** Created By User ID - FK to User */
  createdByUserId: number;

  /** Approved By User ID - FK to User */
  approvedByUserId?: number | null;

  /** Total Amount */
  totalAmount: number;

  /** Status */
  status: OrderStatus;

  /** Expected Delivery Date */
  expectedDeliveryDate: Date;

  /** Delivered Date */
  deliveredDate?: Date | null;

  /** Notes */
  notes?: string | null;

  /** Supplier */
  supplier?: Supplier;

  /** Created By User */
  createdByUser?: User;

  /** Approved By User */
  approvedByUser?: User | null;

  /** Items - purchase order items */
  items?: PurchaseOrderItem[];

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;
}

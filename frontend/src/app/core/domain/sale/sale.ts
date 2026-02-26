import { Customer } from '../customer/customer';
import { Branch } from '../branch/branch';
import { User } from '../user/user';
import { PaymentMethod, OrderStatus } from '../../enums/enums.barrel';

/**
 * Represents a Sale Item
 */
export interface SaleItem {
  /** ID */
  id: number;

  /** Sale ID */
  saleId: number;

  /** Product ID */
  productId: number;

  /** Quantity */
  quantity: number;

  /** Unit Price */
  unitPrice: number;

  /** Subtotal */
  subtotal: number;

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;
}

/**
 * Represents a Sale
 */
export interface Sale {
  /** ID */
  id: number;

  /** Sale Number - unique sale identifier */
  saleNumber: string;

  /** Customer ID - FK to Customer */
  customerId: number;

  /** Branch ID - FK to Branch */
  branchId: number;

  /** Attendant User ID - FK to User */
  attendantUserId: number;

  /** Total Amount */
  totalAmount: number;

  /** Payment Method */
  paymentMethod: PaymentMethod;

  /** Status */
  status: OrderStatus;

  /** Sale Date */
  saleDate: Date;

  /** Customer - associated customer */
  customer?: Customer;

  /** Branch - associated branch */
  branch?: Branch;

  /** Attendant User - user who processed the sale */
  attendantUser?: User;

  /** Items - sale items/line items */
  items?: SaleItem[];

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;

  /** Deleted At */
  deletedAt?: Date | null;
}

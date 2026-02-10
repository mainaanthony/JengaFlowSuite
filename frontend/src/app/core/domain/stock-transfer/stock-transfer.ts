import { Branch } from '../branch/branch';
import { User } from '../user/user';
import { StockTransferStatus } from '../../enums/stock-transfer-status';

/**
 * Represents a Stock Transfer Item
 */
export interface StockTransferItem {
  /** ID */
  id: number;

  /** Stock Transfer ID */
  stockTransferId: number;

  /** Product ID */
  productId: number;

  /** Quantity Requested */
  quantityRequested: number;

  /** Quantity Transferred */
  quantityTransferred?: number | null;

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;
}

/**
 * Represents a Stock Transfer
 */
export interface StockTransfer {
  /** ID */
  id: number;

  /** Transfer Number - unique identifier */
  transferNumber: string;

  /** From Branch ID - source branch */
  fromBranchId: number;

  /** To Branch ID - destination branch */
  toBranchId: number;

  /** Requested By User ID - FK to User */
  requestedByUserId: number;

  /** Approved By User ID - FK to User */
  approvedByUserId?: number | null;

  /** Status */
  status: StockTransferStatus;

  /** Requested Date */
  requestedDate: Date;

  /** Completed Date */
  completedDate?: Date | null;

  /** Notes */
  notes?: string | null;

  /** From Branch */
  fromBranch?: Branch;

  /** To Branch */
  toBranch?: Branch;

  /** Requested By User */
  requestedByUser?: User;

  /** Approved By User */
  approvedByUser?: User | null;

  /** Items - transfer items */
  items?: StockTransferItem[];

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;

  /** Deleted At */
  deletedAt?: Date | null;
}

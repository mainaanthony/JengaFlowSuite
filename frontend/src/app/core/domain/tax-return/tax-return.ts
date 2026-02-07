import { User } from '../domain.barrel';
import { TaxReturnStatus, TaxType } from '../../enums/enums.barrel';

/**
 * Represents a Tax Return
 */
export interface TaxReturn {
  /** ID */
  id: number;

  /** Period - e.g., "December 2023" */
  period: string;

  /** Tax Type */
  taxType: TaxType;

  /** Amount */
  amount: number;

  /** Status */
  status: TaxReturnStatus;

  /** Due Date */
  dueDate: Date;

  /** Submitted Date */
  submittedDate?: Date | null;

  /** Submitted By User ID - FK to User */
  submittedByUserId?: number | null;

  /** Reference Number */
  referenceNumber?: string | null;

  /** Submitted By User */
  submittedByUser?: User | null;

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;

  /** Deleted At */
  deletedAt?: Date | null;
}

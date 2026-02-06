import { CustomerType } from '../../enums/customer-type';

/**
 * Represents a Customer
 */
export interface Customer {
  /** ID */
  id: number;

  /** Name - customer name */
  name: string;

  /** Email - customer email */
  email?: string | null;

  /** Phone - customer phone */
  phone?: string | null;

  /** Address - customer address */
  address?: string | null;

  /** Customer Type */
  customerType: CustomerType;

  /** Is Active - is the customer active */
  isActive?: boolean;

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;

  /** Deleted At */
  deletedAt?: Date | null;
}

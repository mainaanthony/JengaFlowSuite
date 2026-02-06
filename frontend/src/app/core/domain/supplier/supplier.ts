/**
 * Represents a Supplier
 */
export interface Supplier {
  /** ID */
  id: number;

  /** Name - supplier name */
  name: string;

  /** Contact Person - main contact */
  contactPerson?: string | null;

  /** Phone - contact phone */
  phone: string;

  /** Email - contact email */
  email: string;

  /** Address - supplier address */
  address?: string | null;

  /** Category - supplier category/type */
  category?: string | null;

  /** Rating - supplier rating (0-5) */
  rating?: number;

  /** Is Active - is the supplier active */
  isActive?: boolean;

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;

  /** Deleted At */
  deletedAt?: Date | null;
}

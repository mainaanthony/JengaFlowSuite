/**
 * Represents a Product Category
 */
export interface Category {
  /** ID */
  id: number;

  /** Name - category name */
  name: string;

  /** Description - category description */
  description?: string | null;

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;

  /** Deleted At */
  deletedAt?: Date | null;
}

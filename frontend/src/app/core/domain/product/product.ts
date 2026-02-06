import { Category } from '../category/category';

/**
 * Represents a Product
 */
export interface Product {
  /** ID */
  id: number;

  /** Name - product name */
  name: string;

  /** SKU - stock keeping unit */
  sku: string;

  /** Brand - product brand */
  brand?: string | null;

  /** Category ID - FK to Category */
  categoryId?: number | null;

  /** Price - unit price */
  price: number;

  /** Description - product description */
  description?: string | null;

  /** Is Active - is the product active */
  isActive?: boolean;

  /** Category - associated category */
  category?: Category | null;

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;

  /** Deleted At */
  deletedAt?: Date | null;
}

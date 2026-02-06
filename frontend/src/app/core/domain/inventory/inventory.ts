/**
 * Represents Inventory
 */
export interface Inventory {
  /** ID */
  id: number;

  /** Product ID */
  productId: number;

  /** Branch ID */
  branchId: number;

  /** Quantity */
  quantity: number;

  /** Reorder Level */
  reorderLevel?: number;

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;
}

import { Inventory, User} from '../domain.barrel';

/**
 * Represents a Branch/Location
 */
export interface Branch {
  /** ID */
  id: number;

  /** Name - branch name */
  name: string;

  /** Code - branch code/identifier */
  code: string;

  /** Address - physical address */
  address?: string | null;

  /** City - city location */
  city?: string | null;

  /** Phone - contact phone */
  phone?: string | null;

  /** Email - contact email */
  email?: string | null;

  /** Is Active - is the branch active */
  isActive?: boolean;

  /** Users - users assigned to this branch */
  users?: User[];

  /** Inventory Records - inventory at this branch */
  inventoryRecords?: Inventory[]; // Changed from Inventory[] to any[] to avoid circular dependency

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;

  /** Deleted At */
  deletedAt?: Date | null;
}

import { User } from "../domain.barrel";

/**
 * Represents a Role
 */
export interface Role {
  /** ID */
  id: number;

  /** Name - role name */
  name: string;

  /** Description - role description */
  description?: string | null;

  /** Users - users with this role */
  users?: User[];

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;

  /** Deleted At */
  deletedAt?: Date | null;
}

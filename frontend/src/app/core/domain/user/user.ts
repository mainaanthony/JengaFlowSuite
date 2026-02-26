import { Branch } from "../branch/branch";
import { Role } from "../role/role";

/**
 * Represents a User Account
 */
export interface User {
  /** ID */
  id: number;

  /** Keycloak ID - external identity provider reference */
  keycloakId?: string;

  /** Username */
  username?: string;

  /** Email - email address */
  email?: string;

  /** First Name - given name */
  firstName?: string;

  /** Last Name - surname or family name */
  lastName?: string;

  /** Phone Number */
  phone?: string | null;

  /** Is Active - is the user's account active */
  isActive?: boolean;

  /** Last Login At - timestamp of last login */
  lastLoginAt?: Date | null;

  /** Branch ID - FK to Branch */
  branchId?: number;

  /** Role ID - FK to Role */
  roleId?: number;

  /** Branch - associated branch */
  branch?: Branch; // Branch type - use full type from branch.barrel when needed

  /** Role - associated role */
  role?: Role; // Role type - use full type from role.barrel when needed

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;

  /** Deleted At */
  deletedAt?: Date | null;
}

/**
 * User View Model with computed properties
 */
export interface UserViewModel extends User {
  /** Sortable Name - computed full name */
  sortableName?: string;

  /** Full Name - computed */
  fullName?: string;
}

/**
 * User Access Level enum
 */
export enum UserAccessLevel {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  VIEWER = 'VIEWER',
}

/**
 * User Access Type enum
 */
export enum UserAccessType {
  FULL = 'FULL',
  LIMITED = 'LIMITED',
  READ_ONLY = 'READ_ONLY',
}

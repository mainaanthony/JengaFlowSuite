/**
 * Represents a Driver
 */
export interface Driver {
  /** ID */
  id: number;

  /** Name - driver name */
  name: string;

  /** Phone - contact phone */
  phone: string;

  /** License Number - driver's license */
  licenseNumber?: string | null;

  /** Vehicle - vehicle description */
  vehicle: string;

  /** Vehicle Registration - license plate */
  vehicleRegistration?: string | null;

  /** Status - driver status */
  status?: string; // Available, On Delivery, Off Duty

  /** Rating - driver rating (0-5) */
  rating?: number;

  /** Is Active - is the driver active */
  isActive?: boolean;

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;

  /** Deleted At */
  deletedAt?: Date | null;
}

/**
 * Driver Status enum
 */
export enum DriverStatus {
  Available = 'Available',
  OnDelivery = 'On Delivery',
  OffDuty = 'Off Duty',
}

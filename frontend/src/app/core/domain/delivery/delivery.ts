import { DeliveryStatus, Priority } from '../../enums/enums.barrel';
import { Sale } from '../sale/sale';
import { Customer } from '../customer/customer';
import { Driver } from '../driver/driver';

/**
 * Represents a Delivery Item
 */
export interface DeliveryItem {
  /** ID */
  id: number;

  /** Delivery ID */
  deliveryId: number;

  /** Product ID */
  productId: number;

  /** Quantity */
  quantity: number;

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;
}

/**
 * Represents a Delivery
 */
export interface Delivery {
  /** ID */
  id: number;

  /** Delivery Number - unique identifier */
  deliveryNumber: string;

  /** Sale ID - optional FK to Sale */
  saleId?: number | null;

  /** Customer ID - FK to Customer */
  customerId: number;

  /** Driver ID - FK to Driver */
  driverId: number;

  /** Delivery Address */
  deliveryAddress: string;

  /** Contact Phone */
  contactPhone?: string | null;

  /** Status */
  status: DeliveryStatus;

  /** Priority */
  priority: Priority;

  /** Scheduled Date */
  scheduledDate: Date;

  /** Delivered Date */
  deliveredDate?: Date | null;

  /** Notes */
  notes?: string | null;

  /** Customer - associated customer */
  customer?: Customer;

  /** Driver - assigned driver */
  driver?: Driver;

  /** Sale - associated sale (if any) */
  sale?: Sale; // Sale type

  /** Items - delivery items */
  items?: DeliveryItem[];

  /** Created At */
  createdAt?: Date;

  /** Updated At */
  updatedAt?: Date;

  /** Deleted At */
  deletedAt?: Date | null;
}

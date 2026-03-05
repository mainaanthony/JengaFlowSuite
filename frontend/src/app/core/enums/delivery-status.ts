/**
 * Delivery status enum - matches backend Api.Enums.DeliveryStatus
 */
export enum DeliveryStatus {
  Scheduled = 'SCHEDULED',
  InProgress = 'IN_PROGRESS',
  Delivered = 'DELIVERED',
  Failed = 'FAILED',
  Cancelled = 'CANCELLED',
}

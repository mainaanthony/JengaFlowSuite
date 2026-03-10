// ---- List/Display View Models ----

export interface DeliveryListItem {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  driver: string;
  driverVehicle: string;
  status: 'Scheduled' | 'In Progress' | 'Delivered' | 'Failed' | 'Cancelled';
  priority: 'High' | 'Normal' | 'Low';
  scheduled: string;
}

export interface DriverListItem {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: 'Available' | 'On Delivery' | 'Off Duty' | string;
  activeDeliveries: number;
  rating: number;
}

// ---- Form View Models ----

export interface DeliveryOrder {
  id: string;
  // Delivery Info
  deliveryType: string;
  priority: string;
  deliveryDate: Date;
  preferredTime?: string;
  estimatedDuration: number;

  // Customer
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryInstructions?: string;
  contactPerson: string;
  contactPhone: string;

  // Package
  packageWeight: number;
  packageDimensions: string;
  packageValue: number;
  requiresSignature: boolean;
  fragileItem: boolean;
  hazardousMaterial: boolean;
  cashOnDelivery: boolean;
  deliveryInsurance: boolean;
  gpsTracking: boolean;

  // Assignment
  assignedDriver?: string;
  assignedVehicle?: string;
  deliveryRoute?: string;
  smsNotification: boolean;
  emailNotification: boolean;
  additionalNotes?: string;
}

export interface DriverFormData {
  id: string;
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  idNumber: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;

  // Employment
  employeeId?: string;
  hireDate: Date;
  employmentType: string;
  monthlySalary: number;
  department: string;
  supervisor?: string;
  status: string;

  // License & Vehicle
  licenseNumber: string;
  licenseClass?: string;
  licenseExpiryDate?: Date;
  assignedVehicle?: string;
  vehicleType?: string;
  maxDeliveriesPerDay: number;

  // Documents
  documents?: {
    profilePhoto?: File | null;
    idCopy?: File | null;
    licenseCopy?: File | null;
    contract?: File | null;
  };
  additionalNotes?: string;
}

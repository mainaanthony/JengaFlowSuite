// ---- List/Display View Models ----

export interface Transaction {
  id: string;
  customer: string;
  items: number;
  total: number;
  paymentMethod: 'Cash' | 'M-Pesa' | 'Card';
  status: 'Completed' | 'Processing' | 'Pending';
  time: string;
  attendant: string;
}

export interface PendingOrder {
  id: string;
  customer: string;
  items: number;
  total: number;
  deadline: string;
  status: 'Pending Confirmation' | 'Ready for Pickup' | 'On Hold';
}

export interface SaleCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
}

export interface SaleProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface SaleTransaction {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  cartItems: CartItem[];
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  paymentMethod: string;
  amountPaid: number;
  balance: number;
  notes: string;
  timestamp: Date;
  attendant: string;
}

// ---- Form View Models ----

export interface CustomerFormData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  idPassport: string;
  // Address Info
  streetAddress: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  // Business Info
  companyName: string;
  kraPin: string;
  vatNumber: string;
  businessType: string;
  // Account Settings
  customerType: string;
  creditLimit: number;
  discountRate: number;
  paymentTerms: string;
  notes: string;
}

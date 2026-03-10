// ---- List/Display View Models ----

export interface PurchaseOrderListItem {
  id: string;
  supplier: string;
  items: number;
  total: number;
  status: 'Pending Approval' | 'Approved' | 'Delivered';
  created: string;
  expectedDelivery: string;
}

export interface SupplierListItem {
  id: string;
  name: string;
  contact: string;
  phone: string;
  category: string;
  rating: number;
  status: 'Active' | 'Inactive';
}

export interface GRNListItem {
  id: string;
  poNumber: string;
  supplier: string;
  items: number;
  receivedDate: string;
  status: string;
}

export interface DashboardPurchaseOrder {
  id: string;
  supplier: string;
  amount: number;
  status: string;
  date: string;
}

export interface LowStockItem {
  name: string;
  current: number;
  total: number;
  branch: string;
}

// ---- Form View Models ----

export interface POSupplier {
  id: string;
  name: string;
  category: string;
  paymentTerms: string;
}

export interface POItem {
  id: string;
  productId: number;
  name: string;
  sku: string;
  description: string;
  specifications: string;
  quantity: number;
  unitPrice: number;
  urgency: string;
  total: number;
}

export interface PurchaseOrderFormData {
  poNumber: string;
  supplier: string;
  supplierDetails: POSupplier | null;
  paymentTerms: string;
  requestedBy: string;
  branch: string;
  priority: string;
  expectedDelivery: string;
  deliveryAddress: string;
  budgetCode: string;
  approver: string;
  items: POItem[];
  subtotal: number;
  vat: number;
  total: number;
  publicNotes: string;
  internalNotes: string;
  attachments: File[];
}

export interface SupplierFormData {
  id: string;
  companyName: string;
  tradingName?: string;
  registrationNumber: string;
  taxId: string;
  category: string;

  // Contact Information
  primaryContact: string;
  primaryPhone: string;
  primaryEmail: string;
  secondaryContact?: string;
  secondaryPhone?: string;
  secondaryEmail?: string;

  // Address
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;

  // Banking Details
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode?: string;
  swiftCode?: string;

  // Business Details
  businessType: string;
  yearsInBusiness: number;
  website?: string;

  // Payment Terms
  paymentTerms: string;
  creditLimit: number;
  currency: string;

  // Documents
  documents?: {
    businessLicense?: File | null;
    taxCertificate?: File | null;
    bankStatement?: File | null;
  };

  // Additional
  notes?: string;
  rating: number;
  status: 'Active' | 'Inactive' | 'Pending Verification';
}

export interface GRNItem {
  id: string;
  product: string;
  sku: string;
  ordered: number;
  received: number;
  condition: string;
  status: string;
  notes: string;
}

export interface GRNData {
  grnNumber: string;
  receivedDate: string;
  purchaseOrder: string;
  supplier: string;
  receivedBy: string;
  warehouseLocation: string;
  generalNotes: string;
  items: GRNItem[];
}

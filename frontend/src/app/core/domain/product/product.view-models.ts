// ---- List/Display View Models ----

export interface InventoryProductView {
  id: string;
  name: string;
  brand: string;
  sku: string;
  category: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  main: number;
  westlands: number;
  eastleigh: number;
  total: number;
  price: number;
}

// ---- Form View Models ----

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  stock: number;
}

export interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  sku: string;
  barcode: string;
  tags: string[];
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  minimumStock: number;
  storageLocation: string;
  supplier: string;
  weight: number;
  dimensions: { length: number; width: number; height: number };
  taxable: boolean;
  trackInventory: boolean;
  allowBackorders: boolean;
  requiresSerialNumber: boolean;
  hasExpiryDate: boolean;
  hasVariants: boolean;
  variants: ProductVariant[];
  isDraft?: boolean;
}

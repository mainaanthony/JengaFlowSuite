import { DropdownOption } from '../../../shared/input-dropdown/input-dropdown.component';

// ---- Stock Transfer View Models ----

export interface TransferProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
}

export interface TransferProductData {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

export interface TransferData {
  fromBranch: DropdownOption | null;
  toBranch: DropdownOption | null;
  transferType: DropdownOption;
  priorityLevel: DropdownOption;
  requestedBy: string;
  expectedDate: string;
  reason: string;
  additionalNotes: string;
  selectedProducts: TransferProductData[];
}

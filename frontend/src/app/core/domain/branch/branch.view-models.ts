import { DropdownOption } from '../../../shared/input-dropdown/input-dropdown.component';

// ---- List/Display View Models ----

export interface BranchStat {
  label: string;
  value: string | number;
  delta?: number;
  icon: string;
}

export interface BranchListItem {
  id: string;
  name: string;
  code: string;
  location: string;
  phone: string;
  email: string;
  manager: string;
  staff: number;
  revenue: string;
  products: number;
  customers: number;
  status: 'Active' | 'Inactive' | 'Under Renovation';
}

export interface BranchPerformance {
  branch: string;
  manager: string;
  revenue: string;
  deltaPercent: number;
}

export interface StaffAllocation {
  branch: string;
  established: string;
  staff: number;
  status: 'Active' | 'Under Renovation';
}

export interface BranchInventoryItem {
  category: string;
  mainBranch: number;
  westlandsBranch: number;
  eastleighBranch: number;
  industrialArea: number;
  total: number;
}

// ---- Form View Models ----

export interface OperatingHours {
  day: string;
  open: boolean;
  startTime: string;
  endTime: string;
}

export interface BranchFormData {
  id: string;
  name: string;
  code: string;
  type: string;
  phone: string;
  email: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  streetAddress: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;
  operatingHours: OperatingHours[];
  servicesOffered: string[];
  status: string;
  createdAt: string;
}

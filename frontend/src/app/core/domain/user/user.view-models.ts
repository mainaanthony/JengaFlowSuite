// ---- List/Display View Models ----

export interface UserListItem {
  id: string;
  initials: string;
  name: string;
  role: string;
  branch: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

export interface RoleListItem {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  status: 'success' | 'failed';
}

export interface UserStat {
  label: string;
  value: number | string;
  delta?: string;
  deltaType?: 'positive' | 'negative';
}

export interface Permission {
  id: string;
  name: string;
  category: 'core' | 'admin';
}

export interface RoleSubmission {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
}

// ---- Form View Models ----

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  role: string;
  department: string;
  branch: string;
  startDate: string;
  permissions: string[];
  profilePictureUrl: string;
  additionalNotes: string;
  accountActive: boolean;
}

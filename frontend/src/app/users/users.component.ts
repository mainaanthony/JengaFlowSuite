import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { CardComponent } from '../shared/card/card.component';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { ButtonSolidComponent } from '../shared/button-solid/button-solid.component';

// Data Models
interface User {
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

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
}

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  status: 'success' | 'failed';
}

interface UserStat {
  label: string;
  value: number | string;
  delta?: string;
  deltaType?: 'positive' | 'negative';
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    StatCardComponent,
    ButtonSolidComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  // Active tab tracking
  activeTab: string = 'all-users';
  searchControl = new FormControl('');

  // Stats
  stats: UserStat[] = [
    { label: 'Total Users', value: 19, delta: '+2 this month', deltaType: 'positive' },
    { label: 'Active Users', value: 16, delta: '84% of total users', deltaType: 'positive' },
    { label: 'User Roles', value: 5, delta: 'Different permission levels', deltaType: 'positive' },
    { label: 'Online Now', value: 7, delta: 'Currently active', deltaType: 'positive' }
  ];

  // Users list
  users: User[] = [
    {
      id: 'USR-001',
      initials: 'JM',
      name: 'John Mwangi',
      role: 'Owner',
      branch: 'All Branches',
      email: 'john.mwangi@jengaflow.com',
      phone: '+254-700-123456',
      status: 'active',
      lastLogin: '2024-01-15 09:30'
    },
    {
      id: 'USR-002',
      initials: 'MN',
      name: 'Mary Njeru',
      role: 'Branch Manager',
      branch: 'Main Branch',
      email: 'mary.njeru@jengaflow.com',
      phone: '+254-722-987654',
      status: 'active',
      lastLogin: '2024-01-15 08:45'
    },
    {
      id: 'USR-003',
      initials: 'PK',
      name: 'Peter Kamau',
      role: 'Sales Agent',
      branch: 'Westlands',
      email: 'peter.kamau@jengaflow.com',
      phone: '+254-733-456789',
      status: 'active',
      lastLogin: '2024-01-14 17:20'
    },
    {
      id: 'USR-004',
      initials: 'GW',
      name: 'Grace Wanjiku',
      role: 'Accountant',
      branch: 'All Branches',
      email: 'grace.wanjiku@jengaflow.com',
      phone: '+254-712-654321',
      status: 'inactive',
      lastLogin: '2024-01-10 14:15'
    },
    {
      id: 'USR-005',
      initials: 'DK',
      name: 'Daniel Kipchoge',
      role: 'Sales Agent',
      branch: 'Eastleigh',
      email: 'daniel.kipchoge@jengaflow.com',
      phone: '+254-701-234567',
      status: 'active',
      lastLogin: '2024-01-15 10:02'
    }
  ];

  filteredUsers: User[] = [];

  // Roles
  roles: Role[] = [
    {
      id: 'ROLE-001',
      name: 'Owner',
      description: 'Full system access and management',
      userCount: 1,
      permissions: ['All Permissions']
    },
    {
      id: 'ROLE-002',
      name: 'Branch Manager',
      description: 'Manage specific branch operations',
      userCount: 3,
      permissions: ['Inventory Management', 'Sales Management', 'User Management', 'Reports']
    },
    {
      id: 'ROLE-003',
      name: 'Accountant',
      description: 'Financial operations and tax management',
      userCount: 2,
      permissions: ['Financial Reports', 'Tax Management', 'Procurement', 'Audit Logs']
    },
    {
      id: 'ROLE-004',
      name: 'Sales Agent',
      description: 'Handle sales and customer interactions',
      userCount: 5,
      permissions: ['POS System', 'Customer Management', 'Inventory View', 'Sales Reports']
    },
    {
      id: 'ROLE-005',
      name: 'Shop Attendant',
      description: 'Basic sales and inventory operations',
      userCount: 8,
      permissions: ['POS System', 'Basic Inventory', 'Customer Service']
    }
  ];

  // Activity logs
  activityLogs: ActivityLog[] = [
    {
      id: 'LOG-001',
      user: 'John Mwangi',
      action: 'Login',
      resource: 'Dashboard',
      timestamp: '2024-01-15 09:30:15',
      status: 'success'
    },
    {
      id: 'LOG-002',
      user: 'Mary Njeru',
      action: 'Updated Inventory',
      resource: 'Stock Management',
      timestamp: '2024-01-15 09:28:42',
      status: 'success'
    },
    {
      id: 'LOG-003',
      user: 'Peter Kamau',
      action: 'Created Sale',
      resource: 'POS System',
      timestamp: '2024-01-15 09:25:18',
      status: 'success'
    },
    {
      id: 'LOG-004',
      user: 'Grace Wanjiku',
      action: 'Failed Login Attempt',
      resource: 'Authentication',
      timestamp: '2024-01-15 09:20:33',
      status: 'failed'
    },
    {
      id: 'LOG-005',
      user: 'Daniel Kipchoge',
      action: 'Generated Report',
      resource: 'Reports',
      timestamp: '2024-01-15 09:15:47',
      status: 'success'
    }
  ];

  constructor() {}

  ngOnInit() {
    this.filteredUsers = [...this.users];
    this.setupSearch();
  }

  setupSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(searchTerm => {
        this.filterUsers(searchTerm || '');
      });
  }

  filterUsers(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) ||
      user.id.toLowerCase().includes(term)
    );
  }

  // Tab switching
  setTab(tab: string) {
    this.activeTab = tab;
    this.searchControl.setValue('');
  }

  // User management
  addUser() {
    console.log('Adding new user...');
  }

  editUser(user: User) {
    console.log('Editing user:', user.name);
  }

  deleteUser(user: User) {
    console.log('Deleting user:', user.name);
    this.users = this.users.filter(u => u.id !== user.id);
    this.filterUsers(this.searchControl.value || '');
  }

  toggleUserStatus(user: User) {
    user.status = user.status === 'active' ? 'inactive' : 'active';
    console.log(`User ${user.name} status changed to ${user.status}`);
  }

  // Role management
  manageRoles() {
    console.log('Managing roles...');
  }

  editRole(role: Role) {
    console.log('Editing role:', role.name);
  }

  // Activity logs
  viewActivityLogs() {
    console.log('Viewing activity logs...');
  }

  exportLogs() {
    console.log('Exporting activity logs...');
  }

  // Utility methods
  getRoleColor(role: string): string {
    const roleColors: { [key: string]: string } = {
      'Owner': '#7c3aed',
      'Branch Manager': '#3b82f6',
      'Sales Agent': '#f59e0b',
      'Accountant': '#10b981',
      'Shop Attendant': '#06b6d4'
    };
    return roleColors[role] || '#6b7280';
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getActionClass(status: string): string {
    return status.toLowerCase();
  }
}

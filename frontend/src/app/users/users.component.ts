import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

import { CardComponent } from '../shared/card/card.component';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { ButtonSolidComponent } from '../shared/button-solid/button-solid.component';
import { AppTableComponent, ColumnConfig, TableAction, TableActionEvent } from '../shared/app-table/app-table.component';
import { ManageRolesModalComponent } from './manage-roles-modal/manage-roles-modal.component';
import { AddUserModalComponent } from './add-user-modal/add-user-modal.component';
import { UserRepository, RoleRepository, User as DomainUser, Role as DomainRole } from '../core/domain/domain.barrel';

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
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    StatCardComponent,
    ButtonSolidComponent,
    AppTableComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Active tab tracking
  activeTab: string = 'all-users';
  searchControl = new FormControl('');

  // Table configuration
  userColumns: ColumnConfig[] = [];
  userActions: TableAction[] = [];
  filteredUsers: User[] = [];
  loading = false;

  // Stats
  stats: UserStat[] = [
    { label: 'Total Users', value: 0, delta: '+2 this month', deltaType: 'positive' },
    { label: 'Active Users', value: 0, delta: '84% of total users', deltaType: 'positive' },
    { label: 'User Roles', value: 0, delta: 'Different permission levels', deltaType: 'positive' },
    { label: 'Online Now', value: 0, delta: 'Currently active', deltaType: 'positive' }
  ];

  // Users list
  users: User[] = [];

  // Roles
  roles: Role[] = [];

   // Users list
  // users: User[] = [
  //   {
  //     id: 'USR-001',
  //     initials: 'JM',
  //     name: 'John Mwangi',
  //     role: 'Owner',
  //     branch: 'All Branches',
  //     email: 'john.mwangi@jengaflow.com',
  //     phone: '+254-700-123456',
  //     status: 'active',
  //     lastLogin: '2024-01-15 09:30'
  //   },
  //   {
  //     id: 'USR-002',
  //     initials: 'MN',
  //     name: 'Mary Njeru',
  //     role: 'Branch Manager',
  //     branch: 'Main Branch',
  //     email: 'mary.njeru@jengaflow.com',
  //     phone: '+254-722-987654',
  //     status: 'active',
  //     lastLogin: '2024-01-15 08:45'
  //   },
  //   {
  //     id: 'USR-003',
  //     initials: 'PK',
  //     name: 'Peter Kamau',
  //     role: 'Sales Agent',
  //     branch: 'Westlands',
  //     email: 'peter.kamau@jengaflow.com',
  //     phone: '+254-733-456789',
  //     status: 'active',
  //     lastLogin: '2024-01-14 17:20'
  //   },
  //   {
  //     id: 'USR-004',
  //     initials: 'GW',
  //     name: 'Grace Wanjiku',
  //     role: 'Accountant',
  //     branch: 'All Branches',
  //     email: 'grace.wanjiku@jengaflow.com',
  //     phone: '+254-712-654321',
  //     status: 'inactive',
  //     lastLogin: '2024-01-10 14:15'
  //   },
  //   {
  //     id: 'USR-005',
  //     initials: 'DK',
  //     name: 'Daniel Kipchoge',
  //     role: 'Sales Agent',
  //     branch: 'Eastleigh',
  //     email: 'daniel.kipchoge@jengaflow.com',
  //     phone: '+254-701-234567',
  //     status: 'active',
  //     lastLogin: '2024-01-15 10:02'
  //   }
  // ];

  // // Roles
  // roles: Role[] = [
  //   {
  //     id: 'ROLE-001',
  //     name: 'Owner',
  //     description: 'Full system access and management',
  //     userCount: 1,
  //     permissions: ['All Permissions']
  //   },
  //   {
  //     id: 'ROLE-002',
  //     name: 'Branch Manager',
  //     description: 'Manage specific branch operations',
  //     userCount: 3,
  //     permissions: ['Inventory Management', 'Sales Management', 'User Management', 'Reports']
  //   },
  //   {
  //     id: 'ROLE-003',
  //     name: 'Accountant',
  //     description: 'Financial operations and tax management',
  //     userCount: 2,
  //     permissions: ['Financial Reports', 'Tax Management', 'Procurement', 'Audit Logs']
  //   },
  //   {
  //     id: 'ROLE-004',
  //     name: 'Sales Agent',
  //     description: 'Handle sales and customer interactions',
  //     userCount: 5,
  //     permissions: ['POS System', 'Customer Management', 'Inventory View', 'Sales Reports']
  //   },
  //   {
  //     id: 'ROLE-005',
  //     name: 'Shop Attendant',
  //     description: 'Basic sales and inventory operations',
  //     userCount: 8,
  //     permissions: ['POS System', 'Basic Inventory', 'Customer Service']
  //   }
  // ];

  // Activity logs - Dummy data commented out, TODO: Implement activity logging service
  /*
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
  */
  activityLogs: ActivityLog[] = [];

  constructor(
    private dialog: MatDialog,
    private userRepository: UserRepository,
    private roleRepository: RoleRepository
  ) {
    this.initializeTableConfig();
  }

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers() {
    this.loading = true;
    this.userRepository.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users: DomainUser[]) => {
          this.users = users.map(user => this.mapDomainUserToUIUser(user));
          this.filteredUsers = [...this.users];
          this.updateStats();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.loading = false;
        }
      });
  }

  loadRoles() {
    this.roleRepository.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (roles: DomainRole[]) => {
          this.roles = roles.map(role => ({
            id: role.id.toString(),
            name: role.name,
            description: role.description || '',
            userCount: 0, // TODO: Calculate from users
            permissions: [] // TODO: Parse from role permissions
          }));
        },
        error: (error) => {
          console.error('Error loading roles:', error);
        }
      });
  }

  mapDomainUserToUIUser(domainUser: DomainUser): User {
    const initials = this.getInitials(domainUser.firstName, domainUser.lastName);
    const fullName = `${domainUser.firstName} ${domainUser.lastName}`;
    
    return {
      id: `USR-${domainUser.id.toString().padStart(3, '0')}`,
      initials: initials,
      name: fullName,
      role: domainUser.role?.name || 'N/A',
      branch: domainUser.branch?.name || 'N/A',
      email: domainUser.email || 'N/A',
      phone: domainUser.phone || 'N/A',
      status: domainUser.isActive ? 'active' : 'inactive',
      lastLogin: domainUser.lastLoginAt ? new Date(domainUser.lastLoginAt).toLocaleString() : 'Never'
    };
  }

  getInitials(firstName?: string, lastName?: string): string {
    const first = firstName?.charAt(0).toUpperCase() || '';
    const last = lastName?.charAt(0).toUpperCase() || '';
    return `${first}${last}`;
  }

  updateStats() {
    const totalUsers = this.users.length;
    const activeUsers = this.users.filter(u => u.status === 'active').length;
    
    this.stats = [
      { label: 'Total Users', value: totalUsers, delta: '+2 this month', deltaType: 'positive' },
      { label: 'Active Users', value: activeUsers, delta: `${Math.round((activeUsers / totalUsers) * 100)}% of total users`, deltaType: 'positive' },
      { label: 'User Roles', value: this.roles.length, delta: 'Different permission levels', deltaType: 'positive' },
      { label: 'Online Now', value: 0, delta: 'Currently active', deltaType: 'positive' }
    ];
  }

  initializeTableConfig() {
    // Define table columns
    this.userColumns = [
      {
        key: 'name',
        label: 'User',
        width: '250px',
        type: 'text',
        subText: 'id'
      },
      {
        key: 'role',
        label: 'Role',
        width: '140px',
        type: 'enum',
        enumValues: [
          { value: 'Owner', label: 'Owner', color: '#7c3aed' },
          { value: 'Branch Manager', label: 'Branch Manager', color: '#3b82f6' },
          { value: 'Sales Agent', label: 'Sales Agent', color: '#f59e0b' },
          { value: 'Accountant', label: 'Accountant', color: '#10b981' },
          { value: 'Shop Attendant', label: 'Shop Attendant', color: '#06b6d4' }
        ]
      },
      {
        key: 'branch',
        label: 'Branch',
        width: '150px',
        type: 'text'
      },
      {
        key: 'email',
        label: 'Contact',
        width: '220px',
        type: 'text',
        subText: 'phone'
      },
      {
        key: 'status',
        label: 'Status',
        width: '120px',
        type: 'enum',
        enumValues: [
          { value: 'active', label: 'Active', color: '#10b981' },
          { value: 'inactive', label: 'Inactive', color: '#ef4444' }
        ]
      },
      {
        key: 'lastLogin',
        label: 'Last Login',
        width: '180px',
        type: 'text'
      }
    ];

    // Define table actions
    this.userActions = [
      { id: 'edit', label: 'Edit User', icon: 'edit', color: 'primary' },
      { id: 'toggle', label: 'Toggle Status', icon: 'swap_horiz', color: 'accent' },
      { id: 'delete', label: 'Delete User', icon: 'delete', color: 'warn' }
    ];
  }

  onTableAction(event: TableActionEvent) {
    const user = event.row as User;
    switch (event.action) {
      case 'edit':
        this.editUser(user);
        break;
      case 'toggle':
        this.toggleUserStatus(user);
        break;
      case 'delete':
        this.deleteUser(user);
        break;
    }
  }

  onTableSearch(searchTerm: string) {
    this.searchControl.setValue(searchTerm);
  }

  onFilter() {
    console.log('Filter clicked');
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
    const dialogRef = this.dialog.open(AddUserModalComponent, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(); // Reload users after adding
      }
    });
  }

  editUser(user: User) {
    // Extract user ID from display format (USR-001 -> 1)
    const userId = user.id.replace('USR-', '');
    
    this.userRepository.get(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (domainUser: DomainUser) => {
          const dialogRef = this.dialog.open(AddUserModalComponent, {
            width: '900px',
            maxHeight: '90vh',
            disableClose: false,
            data: { user: domainUser } // Pass user data for editing
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.loadUsers(); // Reload users after editing
            }
          });
        },
        error: (error: any) => {
          console.error('Error loading user for edit:', error);
        }
      });
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      // Extract user ID from display format (USR-001 -> 1)
      const userId = user.id.replace('USR-', '');
      
      this.userRepository.delete(userId, { description: `Deleted user ${user.name}` })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log(`User ${user.name} deleted successfully`);
            this.loadUsers(); // Reload users after deletion
          },
          error: (error: any) => {
            console.error('Error deleting user:', error);
          }
        });
    }
  }

  toggleUserStatus(user: User) {
    // Extract user ID from display format (USR-001 -> 1)
    const userId = user.id.replace('USR-', '');
    
    this.userRepository.get(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (domainUser: DomainUser) => {
          const updatedUser = {
            ...domainUser,
            isActive: !domainUser.isActive
          };
          
          this.userRepository.update(updatedUser, { description: `Toggled status for user ${user.name}` })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                console.log(`User ${user.name} status toggled successfully`);
                this.loadUsers(); // Reload users after status change
              },
              error: (error: any) => {
                console.error('Error toggling user status:', error);
              }
            });
        },
        error: (error: any) => {
          console.error('Error loading user for status toggle:', error);
        }
      });
  }

  // Role management
  manageRoles() {
    const dialogRef = this.dialog.open(ManageRolesModalComponent, {
      width: '1000px',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New role created:', result);
        // Handle the new role creation (e.g., save to backend, update UI)
      }
    });
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

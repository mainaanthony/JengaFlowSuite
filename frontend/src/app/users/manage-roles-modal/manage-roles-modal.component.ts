import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RoleRepository, Role as DomainRole } from '../../core/domain/domain.barrel';

interface Permission {
  id: string;
  name: string;
  category: 'core' | 'admin';
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
}

interface RoleSubmission {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
}

@Component({
  selector: 'manage-roles-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './manage-roles-modal.component.html',
  styleUrls: ['./manage-roles-modal.component.scss']
})
export class ManageRolesModalComponent implements OnInit {
  activeTab: 'existing' | 'create' = 'existing';

  // Permissions list
  permissions: Permission[] = [
    // Core Modules
    { id: 'dashboard-access', name: 'Dashboard Access', category: 'core' },
    { id: 'inventory-mgmt', name: 'Inventory Management', category: 'core' },
    { id: 'sales-pos', name: 'Sales & POS', category: 'core' },
    { id: 'procurement', name: 'Procurement', category: 'core' },
    { id: 'delivery-mgmt', name: 'Delivery Management', category: 'core' },
    // Administration
    { id: 'reports-analytics', name: 'Reports & Analytics', category: 'admin' },
    { id: 'user-mgmt', name: 'User Management', category: 'admin' },
    { id: 'branch-mgmt', name: 'Branch Management', category: 'admin' },
    { id: 'system-settings', name: 'System Settings', category: 'admin' }
  ];

  // Existing roles
  roles: Role[] = [
    {
      id: 'super-admin',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      userCount: 2,
      permissions: [
        'dashboard-access',
        'inventory-mgmt',
        'sales-pos',
        'procurement',
        'delivery-mgmt',
        'reports-analytics',
        'user-mgmt',
        'branch-mgmt',
        'system-settings'
      ]
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Administrative access with most permissions',
      userCount: 5,
      permissions: [
        'dashboard-access',
        'inventory-mgmt',
        'sales-pos',
        'procurement',
        'delivery-mgmt',
        'reports-analytics',
        'user-mgmt',
        'branch-mgmt'
      ]
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Management level access to core operations',
      userCount: 8,
      permissions: [
        'dashboard-access',
        'inventory-mgmt',
        'sales-pos',
        'procurement',
        'delivery-mgmt',
        'reports-analytics'
      ]
    },
    {
      id: 'sales-associate',
      name: 'Sales Associate',
      description: 'Sales focused permissions with limited access',
      userCount: 15,
      permissions: ['dashboard-access', 'sales-pos']
    }
  ];

  // Create role form
  createRoleForm: FormGroup;
  selectedPermissions: Set<string> = new Set();
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ManageRolesModalComponent>,
    private roleRepository: RoleRepository
  ) {
    this.createRoleForm = this.formBuilder.group({
      roleName: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit() {}

  setTab(tab: 'existing' | 'create') {
    this.activeTab = tab;
    if (tab === 'create') {
      this.selectedPermissions.clear();
      this.createRoleForm.reset();
    }
  }

  // Permission management
  togglePermission(permissionId: string) {
    if (this.selectedPermissions.has(permissionId)) {
      this.selectedPermissions.delete(permissionId);
    } else {
      this.selectedPermissions.add(permissionId);
    }
  }

  isPermissionSelected(permissionId: string): boolean {
    return this.selectedPermissions.has(permissionId);
  }

  getPermissionsByCategory(category: 'core' | 'admin'): Permission[] {
    return this.permissions.filter(p => p.category === category);
  }

  // Role actions
  editRole(role: Role) {
    console.log('Edit role:', role);
    // In a real scenario, this would open an edit modal or switch to edit mode
  }

  deleteRole(role: Role) {
    if (confirm(`Are you sure you want to delete the "${role.name}" role?`)) {
      const index = this.roles.findIndex(r => r.id === role.id);
      if (index > -1) {
        this.roles.splice(index, 1);
      }
    }
  }

  // Create role
  createRole() {
    if (this.createRoleForm.valid && this.selectedPermissions.size > 0) {
      this.loading = true;

      const roleData: Partial<DomainRole> = {
        name: this.createRoleForm.get('roleName')?.value,
        description: this.createRoleForm.get('description')?.value
      };

      const logInfo = {
        description: `Created role ${roleData.name}`
      };

      this.roleRepository.create(roleData, logInfo).subscribe({
        next: (result) => {
          console.log('Role created:', result);
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error creating role:', error);
          alert('Failed to create role. Please try again.');
          this.loading = false;
        }
      });
    }
  }

  private generateRoleId(): string {
    return 'role-' + Date.now();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

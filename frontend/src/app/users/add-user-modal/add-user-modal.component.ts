import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

interface Permission {
  id: string;
  name: string;
  category: 'core' | 'admin';
}

interface UserData {
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

@Component({
  selector: 'add-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss']
})
export class AddUserModalComponent implements OnInit {
  currentStep: 1 | 2 | 3 | 4 = 1;
  completedSteps = new Set<number>();

  // Form groups for each tab
  basicInfoForm: FormGroup;
  employmentForm: FormGroup;
  permissionsForm: FormGroup;
  additionalForm: FormGroup;

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

  // Dropdown options
  roles = [
    { id: 'owner', name: 'Owner' },
    { id: 'admin', name: 'Admin' },
    { id: 'manager', name: 'Manager' },
    { id: 'sales-associate', name: 'Sales Associate' },
    { id: 'shop-attendant', name: 'Shop Attendant' }
  ];

  departments = [
    { id: 'sales', name: 'Sales' },
    { id: 'inventory', name: 'Inventory' },
    { id: 'procurement', name: 'Procurement' },
    { id: 'delivery', name: 'Delivery' },
    { id: 'finance', name: 'Finance' },
    { id: 'admin', name: 'Administration' }
  ];

  branches = [
    { id: 'main', name: 'Main Branch' },
    { id: 'westlands', name: 'Westlands Branch' },
    { id: 'eastleigh', name: 'Eastleigh Branch' },
    { id: 'industrial', name: 'Industrial Area' }
  ];

  selectedPermissions: Set<string> = new Set();

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddUserModalComponent>
  ) {
    this.basicInfoForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      employeeId: ['']
    });

    this.employmentForm = this.formBuilder.group({
      role: ['', [Validators.required]],
      department: ['', [Validators.required]],
      branchAssignment: ['', [Validators.required]],
      startDate: ['', [Validators.required]]
    });

    this.permissionsForm = this.formBuilder.group({});

    this.additionalForm = this.formBuilder.group({
      profilePictureUrl: [''],
      additionalNotes: [''],
      accountActive: [true]
    });
  }

  ngOnInit() {}

  setStep(step: 1 | 2 | 3 | 4) {
    if (this.canProceedToStep(step)) {
      this.currentStep = step;
    }
  }

  canProceedToStep(step: 1 | 2 | 3 | 4): boolean {
    if (step === 1) return true;
    if (step === 2) return this.basicInfoForm.valid;
    if (step === 3) return this.basicInfoForm.valid && this.employmentForm.valid;
    if (step === 4) return this.basicInfoForm.valid && this.employmentForm.valid;
    return false;
  }

  isStepActive(step: number): boolean {
    return this.currentStep === step;
  }

  isStepCompleted(step: number): boolean {
    return this.completedSteps.has(step);
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

  // Navigation
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep = (this.currentStep - 1) as 1 | 2 | 3 | 4;
    }
  }

  nextStep() {
    if (this.canProceedToStep(this.currentStep + 1 as 1 | 2 | 3 | 4)) {
      this.completedSteps.add(this.currentStep);
      this.currentStep = (this.currentStep + 1) as 1 | 2 | 3 | 4;
    }
  }

  // Add user
  addUser() {
    if (this.basicInfoForm.valid && this.employmentForm.valid && this.additionalForm.valid) {
      const userData: UserData = {
        firstName: this.basicInfoForm.get('firstName')?.value,
        lastName: this.basicInfoForm.get('lastName')?.value,
        email: this.basicInfoForm.get('emailAddress')?.value,
        phone: this.basicInfoForm.get('phoneNumber')?.value,
        employeeId: this.basicInfoForm.get('employeeId')?.value || this.generateEmployeeId(),
        role: this.employmentForm.get('role')?.value,
        department: this.employmentForm.get('department')?.value,
        branch: this.employmentForm.get('branchAssignment')?.value,
        startDate: this.employmentForm.get('startDate')?.value,
        permissions: Array.from(this.selectedPermissions),
        profilePictureUrl: this.additionalForm.get('profilePictureUrl')?.value,
        additionalNotes: this.additionalForm.get('additionalNotes')?.value,
        accountActive: this.additionalForm.get('accountActive')?.value
      };

      console.log('Adding new user:', userData);
      this.dialogRef.close(userData);
    }
  }

  private generateEmployeeId(): string {
    return 'EMP-' + Date.now().toString().slice(-6);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

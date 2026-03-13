import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InputTextComponent, InputTextConfig } from '../../shared/input-text/input-text.component';
import { InputDropdownComponent, DropdownOption, DropdownConfig } from '../../shared/input-dropdown/input-dropdown.component';
import { AppModalComponent, AppModalConfig, ModalButton } from '../../shared/modals/app-modal.component';
import { UserRepository, RoleRepository, BranchRepository, User as DomainUser } from '../../core/domain/domain.barrel';
import { Permission, UserFormData } from '../../core/domain/user/user.view-models';

@Component({
  selector: 'add-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, InputTextComponent, InputDropdownComponent],
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss']
})
export class AddUserModalComponent implements OnInit, AfterViewInit {
  @ViewChild('userFormTemplate') userFormTemplate!: TemplateRef<any>;
  currentStep: 1 | 2 | 3 | 4 = 1;
  completedSteps = new Set<number>();
  modalInstance: any = null;

  // Form groups for each tab
  basicInfoForm: FormGroup;
  employmentForm: FormGroup;
  permissionsForm: FormGroup;
  additionalForm: FormGroup;

  // Input Text Configurations
  firstNameConfig: InputTextConfig = {
    placeholder: 'Enter first name',
    label: 'First Name',
    required: true,
    clearable: true
  };

  lastNameConfig: InputTextConfig = {
    placeholder: 'Enter last name',
    label: 'Last Name',
    required: true,
    clearable: true
  };

  emailConfig: InputTextConfig = {
    placeholder: 'Enter email address',
    label: 'Email Address',
    type: 'email',
    required: true,
    clearable: true
  };

  phoneConfig: InputTextConfig = {
    placeholder: 'Enter phone number',
    label: 'Phone Number',
    clearable: true
  };

  employeeIdConfig: InputTextConfig = {
    placeholder: 'Auto-generated or enter custom ID',
    label: 'Employee ID',
    clearable: true
  };

  startDateConfig: InputTextConfig = {
    placeholder: 'Select start date',
    label: 'Start Date',
    type: 'date',
    required: true,
    clearable: true
  };

  profilePicUrlConfig: InputTextConfig = {
    placeholder: 'Enter profile picture URL',
    label: 'Profile Picture URL',
    clearable: true
  };

  additionalNotesConfig: InputTextConfig = {
    placeholder: 'Any additional information about the user',
    label: 'Additional Notes',
    description: true,
    rows: 4,
    clearable: true
  };

  // Dropdown Configurations
  roleDropdownConfig: DropdownConfig = {
    placeholder: 'Select role',
    searchable: true,
    clearable: true
  };

  departmentDropdownConfig: DropdownConfig = {
    placeholder: 'Select department',
    searchable: true,
    clearable: true
  };

  branchDropdownConfig: DropdownConfig = {
    placeholder: 'Select branch',
    searchable: true,
    clearable: true
  };

  // Dropdown Options
  roleOptions: DropdownOption[] = [];
  departmentOptions: DropdownOption[] = [
    { id: 'sales', label: 'Sales', value: 'sales' },
    { id: 'inventory', label: 'Inventory', value: 'inventory' },
    { id: 'procurement', label: 'Procurement', value: 'procurement' },
    { id: 'delivery', label: 'Delivery', value: 'delivery' },
    { id: 'finance', label: 'Finance', value: 'finance' },
    { id: 'admin', label: 'Administration', value: 'admin' }
  ];
  branchOptions: DropdownOption[] = [];

  // Permissions list
  permissions: Permission[] = [
    { id: 'dashboard-access', name: 'Dashboard Access', category: 'core' },
    { id: 'inventory-mgmt', name: 'Inventory Management', category: 'core' },
    { id: 'sales-pos', name: 'Sales & POS', category: 'core' },
    { id: 'procurement', name: 'Procurement', category: 'core' },
    { id: 'delivery-mgmt', name: 'Delivery Management', category: 'core' },
    { id: 'reports-analytics', name: 'Reports & Analytics', category: 'admin' },
    { id: 'user-mgmt', name: 'User Management', category: 'admin' },
    { id: 'branch-mgmt', name: 'Branch Management', category: 'admin' },
    { id: 'system-settings', name: 'System Settings', category: 'admin' }
  ];

  selectedPermissions: Set<string> = new Set();
  editMode = false;
  editingUserId?: number;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: DomainUser },
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    private branchRepository: BranchRepository
  ) {
    this.editMode = !!data?.user;
    if (this.editMode && data.user) {
      this.editingUserId = data.user.id;
    }

    this.basicInfoForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      employeeId: ['']
    });

    this.employmentForm = this.formBuilder.group({
      role: ['', [Validators.required]],
      department: [''],
      branchAssignment: ['', [Validators.required]],
      startDate: ['']
    });

    this.permissionsForm = this.formBuilder.group({});

    this.additionalForm = this.formBuilder.group({
      profilePictureUrl: [''],
      additionalNotes: [''],
      accountActive: [true]
    });
  }

  ngOnInit() {
    this.loadRolesAndBranches();
    if (this.editMode && this.data.user) {
      this.populateFormForEdit(this.data.user);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.openModal();
    });
  }

  openModal(): void {
    const modalConfig: AppModalConfig = {
      title: this.editMode ? 'Edit User' : 'Add New User',
      subtitle: this.editMode ? 'Modify user details' : 'Create a new user account',
      wide: true
    };

    const leftButtons: ModalButton[] = [];
    const rightButtons: ModalButton[] = [];

    if (this.currentStep === 1) {
      leftButtons.push({ label: 'Cancel', action: 'cancel', color: 'default' });
      rightButtons.push({
        label: 'Next',
        action: 'next',
        color: 'primary',
        icon: 'arrow_forward',
        disabled: !this.basicInfoForm.valid
      });
    } else if (this.currentStep < 4) {
      leftButtons.push({ label: 'Back', action: 'previous', color: 'default', icon: 'arrow_back' });
      rightButtons.push({
        label: 'Next',
        action: 'next',
        color: 'primary',
        icon: 'arrow_forward',
        disabled: this.currentStep === 2 && !this.employmentForm.valid
      });
    } else {
      leftButtons.push({ label: 'Back', action: 'previous', color: 'default', icon: 'arrow_back' });
      rightButtons.push({
        label: this.editMode ? 'Update User' : 'Add User',
        action: 'save',
        color: 'primary',
        icon: 'check',
        disabled: !this.basicInfoForm.valid || !this.employmentForm.valid
      });
    }

    const modalDialogRef = this.dialog.open(AppModalComponent, {
      data: {
        config: modalConfig,
        contentTemplate: this.userFormTemplate,
        leftButtons,
        rightButtons
      },
      width: '700px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: false,
      panelClass: 'custom-modal-panel'
    });

    this.modalInstance = modalDialogRef;

    modalDialogRef.componentInstance.buttonClicked.subscribe((action: string) => {
      switch (action) {
        case 'cancel':
          modalDialogRef.close();
          this.dialogRef.close();
          break;
        case 'previous':
          this.previousStep();
          this.updateModal(modalDialogRef);
          break;
        case 'next':
          this.nextStep();
          this.updateModal(modalDialogRef);
          break;
        case 'save':
          this.addUser(modalDialogRef);
          break;
      }
    });

    modalDialogRef.afterClosed().subscribe(() => {
      if (!this.dialogRef.getState()) {
        this.dialogRef.close();
      }
    });
  }

  updateModal(modalDialogRef: MatDialogRef<AppModalComponent>): void {
    const instance = modalDialogRef.componentInstance;
    const leftButtons: ModalButton[] = [];
    const rightButtons: ModalButton[] = [];

    if (this.currentStep === 1) {
      leftButtons.push({ label: 'Cancel', action: 'cancel', color: 'default' });
      rightButtons.push({
        label: 'Next',
        action: 'next',
        color: 'primary',
        icon: 'arrow_forward',
        disabled: !this.basicInfoForm.valid
      });
    } else if (this.currentStep < 4) {
      leftButtons.push({ label: 'Back', action: 'previous', color: 'default', icon: 'arrow_back' });
      rightButtons.push({
        label: 'Next',
        action: 'next',
        color: 'primary',
        icon: 'arrow_forward',
        disabled: this.currentStep === 2 && !this.employmentForm.valid
      });
    } else {
      leftButtons.push({ label: 'Back', action: 'previous', color: 'default', icon: 'arrow_back' });
      rightButtons.push({
        label: this.editMode ? 'Update User' : 'Add User',
        action: 'save',
        color: 'primary',
        icon: 'check',
        disabled: !this.basicInfoForm.valid || !this.employmentForm.valid
      });
    }

    instance.leftButtons = leftButtons;
    instance.rightButtons = rightButtons;
  }

  loadRolesAndBranches(): void {
    this.roleRepository.getAll().subscribe({
      next: (roles) => {
        this.roleOptions = roles.map(r => ({
          id: r.id.toString(),
          label: r.name,
          value: r.id.toString()
        }));
      },
      error: (err) => console.error('Failed to load roles:', err)
    });
    this.branchRepository.getAll().subscribe({
      next: (branches) => {
        this.branchOptions = branches.map(b => ({
          id: b.id.toString(),
          label: b.name,
          value: b.id.toString()
        }));
      },
      error: (err) => console.error('Failed to load branches:', err)
    });
  }

  populateFormForEdit(user: DomainUser): void {
    this.basicInfoForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.email,
      phoneNumber: user.phone || ''
    });
    this.employmentForm.patchValue({
      role: user.roleId?.toString() || '',
      branchAssignment: user.branchId?.toString() || ''
    });
    this.additionalForm.patchValue({
      accountActive: user.isActive
    });
  }

  // Dropdown handlers
  onRoleChange(option: DropdownOption): void {
    this.employmentForm.patchValue({ role: option.value });
  }

  onDepartmentChange(option: DropdownOption): void {
    this.employmentForm.patchValue({ department: option.value });
  }

  onBranchChange(option: DropdownOption): void {
    this.employmentForm.patchValue({ branchAssignment: option.value });
  }

  setStep(step: 1 | 2 | 3 | 4) {
    if (this.canProceedToStep(step)) {
      this.currentStep = step;
      if (this.modalInstance) {
        this.updateModal(this.modalInstance);
      }
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

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep = (this.currentStep - 1) as 1 | 2 | 3 | 4;
    }
  }

  nextStep() {
    if (this.canProceedToStep((this.currentStep + 1) as 1 | 2 | 3 | 4)) {
      this.completedSteps.add(this.currentStep);
      this.currentStep = (this.currentStep + 1) as 1 | 2 | 3 | 4;
    }
  }

  addUser(modalDialogRef?: MatDialogRef<AppModalComponent>) {
    if (this.basicInfoForm.valid && this.employmentForm.valid) {
      this.loading = true;
      if (modalDialogRef) {
        this.setSubmitButtonLoading(modalDialogRef, true);
      }

      const currentUser = this.userRepository.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        alert('Unable to determine current user. Please log in again.');
        this.loading = false;
        if (modalDialogRef) this.setSubmitButtonLoading(modalDialogRef, false);
        return;
      }

      const userData: Partial<DomainUser> = {
        firstName: this.basicInfoForm.get('firstName')?.value,
        lastName: this.basicInfoForm.get('lastName')?.value,
        email: this.basicInfoForm.get('emailAddress')?.value,
        phone: this.basicInfoForm.get('phoneNumber')?.value,
        roleId: parseInt(this.employmentForm.get('role')?.value) || 1,
        branchId: parseInt(this.employmentForm.get('branchAssignment')?.value) || 1,
        isActive: this.additionalForm.get('accountActive')?.value ?? true
      };

      const logInfo = {
        userId: currentUser.id.toString(),
        description: this.editMode ? `Updated user ${userData.firstName} ${userData.lastName}` : `Created user ${userData.firstName} ${userData.lastName}`
      };

      const operation = this.editMode
        ? this.userRepository.update({ ...userData, id: this.editingUserId }, logInfo)
        : this.userRepository.create(userData, logInfo);

      operation.subscribe({
        next: (result) => {
          if (modalDialogRef) {
            this.setSubmitButtonLoading(modalDialogRef, false);
            modalDialogRef.close(result);
          }
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error saving user:', error);
          alert('Failed to save user. Please try again.');
          this.loading = false;
          if (modalDialogRef) this.setSubmitButtonLoading(modalDialogRef, false);
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private setSubmitButtonLoading(modalDialogRef: MatDialogRef<AppModalComponent>, loading: boolean): void {
    const submitBtn = modalDialogRef.componentInstance.rightButtons?.find(b => b.action === 'save');
    if (submitBtn) {
      submitBtn.loading = loading;
    }
  }
}

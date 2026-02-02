import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AppTabsComponent, Tab } from '../../shared/app-tabs/app-tabs.component';
import { InputTextComponent, InputTextConfig } from '../../shared/input-text/input-text.component';
import { InputDropdownComponent, DropdownOption, DropdownConfig } from '../../shared/input-dropdown/input-dropdown.component';
import { AppModalComponent, AppModalConfig, ModalButton } from '../../shared/modals/app-modal.component';

interface Driver {
  id: string;
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  idNumber: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  
  // Employment
  employeeId?: string;
  hireDate: Date;
  employmentType: string;
  monthlySalary: number;
  department: string;
  supervisor?: string;
  status: string;
  
  // License & Vehicle
  licenseNumber: string;
  licenseClass?: string;
  licenseExpiryDate?: Date;
  assignedVehicle?: string;
  vehicleType?: string;
  maxDeliveriesPerDay: number;
  
  // Documents
  documents?: {
    profilePhoto?: File | null;
    idCopy?: File | null;
    licenseCopy?: File | null;
    contract?: File | null;
  };
  additionalNotes?: string;
}

@Component({
  selector: 'app-add-driver-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    AppTabsComponent,
    InputTextComponent,
    InputDropdownComponent
  ],
  templateUrl: './add-driver-modal.component.html',
  styleUrls: ['./add-driver-modal.component.scss']
})
export class AddDriverModalComponent implements OnInit, AfterViewInit {
  @ViewChild('driverFormTemplate') driverFormTemplate!: TemplateRef<any>;
  driverForm!: FormGroup;
  activeTab: string = 'personal';

  tabs: Tab[] = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'employment', label: 'Employment' },
    { id: 'license', label: 'License & Vehicle' },
    { id: 'documents', label: 'Documents' }
  ];

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
    placeholder: 'driver@example.com',
    label: 'Email Address',
    type: 'email',
    clearable: true
  };

  phoneConfig: InputTextConfig = {
    placeholder: '+254 XXX XXX XXX',
    label: 'Phone Number',
    required: true,
    type: 'tel',
    clearable: true
  };

  dobConfig: InputTextConfig = {
    label: 'Date of Birth',
    type: 'date',
    clearable: true
  };

  idNumberConfig: InputTextConfig = {
    placeholder: 'Enter ID number',
    label: 'ID Number',
    required: true,
    clearable: true
  };

  addressConfig: InputTextConfig = {
    placeholder: 'Enter full address',
    label: 'Address',
    required: true,
    description: true,
    rows: 3,
    clearable: true
  };

  emergencyContactNameConfig: InputTextConfig = {
    placeholder: 'Enter emergency contact name',
    label: 'Emergency Contact Name',
    required: true,
    clearable: true
  };

  emergencyContactPhoneConfig: InputTextConfig = {
    placeholder: '+254 XXX XXX XXX',
    label: 'Emergency Contact Phone',
    required: true,
    type: 'tel',
    clearable: true
  };

  employeeIdConfig: InputTextConfig = {
    placeholder: 'Auto-generated if empty',
    label: 'Employee ID',
    clearable: true
  };

  hireDateConfig: InputTextConfig = {
    label: 'Hire Date',
    type: 'date',
    required: true,
    clearable: true
  };

  monthlySalaryConfig: InputTextConfig = {
    placeholder: '0',
    label: 'Monthly Salary (KSH)',
    type: 'number',
    required: true,
    clearable: true
  };

  licenseNumberConfig: InputTextConfig = {
    placeholder: 'Enter license number',
    label: 'License Number',
    required: true,
    clearable: true
  };

  licenseExpiryDateConfig: InputTextConfig = {
    label: 'License Expiry Date',
    type: 'date',
    clearable: true
  };

  maxDeliveriesConfig: InputTextConfig = {
    placeholder: '10',
    label: 'Maximum Deliveries per Day',
    type: 'number',
    required: true,
    clearable: true
  };

  additionalNotesConfig: InputTextConfig = {
    placeholder: 'Any additional notes about the driver...',
    label: 'Additional Notes',
    description: true,
    rows: 4,
    clearable: true
  };

  // Dropdown Options
  employmentTypeOptions: DropdownOption[] = [
    { id: 'fulltime', label: 'Full Time', value: 'Full Time' },
    { id: 'parttime', label: 'Part Time', value: 'Part Time' },
    { id: 'contract', label: 'Contract', value: 'Contract' },
    { id: 'temporary', label: 'Temporary', value: 'Temporary' }
  ];

  departmentOptions: DropdownOption[] = [
    { id: 'delivery', label: 'Delivery', value: 'Delivery' },
    { id: 'warehouse', label: 'Warehouse', value: 'Warehouse' },
    { id: 'logistics', label: 'Logistics', value: 'Logistics' },
    { id: 'operations', label: 'Operations', value: 'Operations' }
  ];

  statusOptions: DropdownOption[] = [
    { id: 'active', label: 'Active', value: 'Active' },
    { id: 'inactive', label: 'Inactive', value: 'Inactive' },
    { id: 'onleave', label: 'On Leave', value: 'On Leave' },
    { id: 'suspended', label: 'Suspended', value: 'Suspended' }
  ];

  licenseClassOptions: DropdownOption[] = [
    { id: 'classa', label: 'Class A', value: 'Class A' },
    { id: 'classb', label: 'Class B', value: 'Class B' },
    { id: 'classc', label: 'Class C', value: 'Class C' },
    { id: 'classd', label: 'Class D', value: 'Class D' },
    { id: 'motorcycle', label: 'Motorcycle', value: 'Motorcycle' }
  ];

  vehicleTypeOptions: DropdownOption[] = [
    { id: 'motorcycle', label: 'Motorcycle', value: 'Motorcycle' },
    { id: 'van', label: 'Van', value: 'Van' },
    { id: 'truck', label: 'Truck', value: 'Truck' },
    { id: 'pickup', label: 'Pickup', value: 'Pickup' },
    { id: 'car', label: 'Car', value: 'Car' }
  ];

  supervisorOptions: DropdownOption[] = [
    { id: 'sup1', label: 'John Kamau - Manager', value: 'John Kamau - Manager' },
    { id: 'sup2', label: 'Mary Njeri - Supervisor', value: 'Mary Njeri - Supervisor' },
    { id: 'sup3', label: 'David Ochieng - Lead', value: 'David Ochieng - Lead' },
    { id: 'sup4', label: 'Grace Wanjiku - Coordinator', value: 'Grace Wanjiku - Coordinator' }
  ];

  vehicleOptions: DropdownOption[] = [
    { id: 'veh1', label: 'KCB 123A - Toyota Hilux', value: 'KCB 123A - Toyota Hilux' },
    { id: 'veh2', label: 'KCD 456B - Isuzu D-Max', value: 'KCD 456B - Isuzu D-Max' },
    { id: 'veh3', label: 'KCE 789C - Honda CRF250', value: 'KCE 789C - Honda CRF250' },
    { id: 'veh4', label: 'KCF 012D - Nissan NV200', value: 'KCF 012D - Nissan NV200' }
  ];

  // Dropdown Configurations
  employmentTypeDropdownConfig: DropdownConfig = {
    placeholder: 'Select employment type',
    searchable: true,
    clearable: true
  };

  departmentDropdownConfig: DropdownConfig = {
    placeholder: 'Select department',
    searchable: true,
    clearable: true
  };

  statusDropdownConfig: DropdownConfig = {
    placeholder: 'Select status',
    searchable: true,
    clearable: true
  };

  licenseClassDropdownConfig: DropdownConfig = {
    placeholder: 'Select license class',
    searchable: true,
    clearable: true
  };

  vehicleTypeDropdownConfig: DropdownConfig = {
    placeholder: 'Select vehicle type',
    searchable: true,
    clearable: true
  };

  supervisorDropdownConfig: DropdownConfig = {
    placeholder: 'Select supervisor',
    searchable: true,
    clearable: true
  };

  vehicleDropdownConfig: DropdownConfig = {
    placeholder: 'Select vehicle',
    searchable: true,
    clearable: true
  };

  uploadedFiles = {
    profilePhoto: null as File | null,
    idCopy: null as File | null,
    licenseCopy: null as File | null,
    contract: null as File | null
  };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddDriverModalComponent>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.openModal();
    });
  }

  openModal(): void {
    const modalConfig: AppModalConfig = {
      title: 'Add New Driver',
      subtitle: 'Fill in the driver information',
      wide: true
    };

    const leftButtons: ModalButton[] = [
      {
        label: 'Cancel',
        action: 'cancel',
        color: 'default'
      }
    ];

    const rightButtons: ModalButton[] = [
      {
        label: 'Add Driver',
        action: 'save',
        color: 'primary',
        icon: 'person_add'
      }
    ];

    const modalDialogRef = this.dialog.open(AppModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: false,
      panelClass: 'custom-modal-panel'
    });

    const instance = modalDialogRef.componentInstance;
    instance.config = modalConfig;
    instance.contentTemplate = this.driverFormTemplate;
    instance.leftButtons = leftButtons;
    instance.rightButtons = rightButtons;

    instance.buttonClicked.subscribe((action: string) => {
      if (action === 'save') {
        this.saveDriver(modalDialogRef, instance);
      } else if (action === 'cancel') {
        this.dialogRef.close();
      }
    });

    modalDialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close(result);
    });
  }

  onTabChange(tabId: string): void {
    this.activeTab = tabId;
  }

  private initializeForm(): void {
    this.driverForm = this.fb.group({
      // Personal Info
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      dateOfBirth: [''],
      idNumber: ['', Validators.required],
      address: ['', Validators.required],
      emergencyContactName: ['', Validators.required],
      emergencyContactPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],

      // Employment
      employeeId: [''],
      hireDate: ['', Validators.required],
      employmentType: ['Full Time', Validators.required],
      monthlySalary: [0, [Validators.required, Validators.min(0)]],
      department: ['Delivery', Validators.required],
      supervisor: [''],
      status: ['Active', Validators.required],

      // License & Vehicle
      licenseNumber: ['', Validators.required],
      licenseClass: [''],
      licenseExpiryDate: [''],
      assignedVehicle: [''],
      vehicleType: [''],
      maxDeliveriesPerDay: [10, [Validators.required, Validators.min(1)]],

      // Documents
      additionalNotes: ['']
    });
  }

  isTabValid(tab: string): boolean {
    if (tab === 'personal') {
      return (
        (this.driverForm.get('firstName')?.valid ?? false) &&
        (this.driverForm.get('lastName')?.valid ?? false) &&
        (this.driverForm.get('email')?.valid ?? false) &&
        (this.driverForm.get('phone')?.valid ?? false) &&
        (this.driverForm.get('idNumber')?.valid ?? false) &&
        (this.driverForm.get('address')?.valid ?? false) &&
        (this.driverForm.get('emergencyContactName')?.valid ?? false) &&
        (this.driverForm.get('emergencyContactPhone')?.valid ?? false)
      );
    } else if (tab === 'employment') {
      return (
        (this.driverForm.get('hireDate')?.valid ?? false) &&
        (this.driverForm.get('employmentType')?.valid ?? false) &&
        (this.driverForm.get('monthlySalary')?.valid ?? false) &&
        (this.driverForm.get('department')?.valid ?? false) &&
        (this.driverForm.get('status')?.valid ?? false)
      );
    } else if (tab === 'license') {
      return (
        (this.driverForm.get('licenseNumber')?.valid ?? false) &&
        (this.driverForm.get('maxDeliveriesPerDay')?.valid ?? false)
      );
    }
    return true;
  }

  onFileSelect(event: Event, fileType: 'profilePhoto' | 'idCopy' | 'licenseCopy' | 'contract'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.uploadedFiles[fileType] = input.files[0];
    }
  }

  removeFile(fileType: 'profilePhoto' | 'idCopy' | 'licenseCopy' | 'contract'): void {
    this.uploadedFiles[fileType] = null;
  }

  getFileName(fileType: 'profilePhoto' | 'idCopy' | 'licenseCopy' | 'contract'): string {
    return this.uploadedFiles[fileType]?.name || '';
  }

  hasFile(fileType: 'profilePhoto' | 'idCopy' | 'licenseCopy' | 'contract'): boolean {
    return this.uploadedFiles[fileType] !== null;
  }

  onEmploymentTypeChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.driverForm.patchValue({ employmentType: value.value });
    }
  }

  onDepartmentChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.driverForm.patchValue({ department: value.value });
    }
  }

  onStatusChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.driverForm.patchValue({ status: value.value });
    }
  }

  onSupervisorChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.driverForm.patchValue({ supervisor: value.value });
    }
  }

  onLicenseClassChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.driverForm.patchValue({ licenseClass: value.value });
    }
  }

  onVehicleChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.driverForm.patchValue({ assignedVehicle: value.value });
    }
  }

  onVehicleTypeChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.driverForm.patchValue({ vehicleType: value.value });
    }
  }

  canSave(): boolean {
    const firstName = this.driverForm.get('firstName');
    const lastName = this.driverForm.get('lastName');
    const phone = this.driverForm.get('phone');
    const idNumber = this.driverForm.get('idNumber');
    const licenseNumber = this.driverForm.get('licenseNumber');
    
    return !!(
      firstName?.valid && firstName?.value &&
      lastName?.valid && lastName?.value &&
      phone?.valid && phone?.value &&
      idNumber?.valid && idNumber?.value &&
      licenseNumber?.valid && licenseNumber?.value
    );
  }

  saveDriver(dialogRef: any, instance: AppModalComponent): void {
    if (!this.canSave()) {
      instance.showErrorMessage = true;
      instance.errorMessage = 'Please fill in all required fields';
      setTimeout(() => {
        instance.showErrorMessage = false;
      }, 3000);
      return;
    }

    const saveBtn = instance.rightButtons.find(b => b.action === 'save');
    if (saveBtn) saveBtn.loading = true;

    // Simulate API call
    setTimeout(() => {
      const driverData: Driver = {
        id: 'DRV-' + Date.now(),
        ...this.driverForm.value,
        documents: this.uploadedFiles
      };
      
      instance.showSuccessMessage = true;
      instance.successMessage = 'Driver added successfully!';
      
      setTimeout(() => {
        dialogRef.close(driverData);
      }, 1500);
    }, 800);
  }

  addDriver(): void {
    // This method is kept for backward compatibility but not used anymore
    // The actual save is handled by saveDriver method
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

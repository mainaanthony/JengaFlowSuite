import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

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
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './add-driver-modal.component.html',
  styleUrls: ['./add-driver-modal.component.scss']
})
export class AddDriverModalComponent implements OnInit {
  driverForm!: FormGroup;
  activeTab: 'personal' | 'employment' | 'license' | 'documents' = 'personal';

  employmentTypes = ['Full Time', 'Part Time', 'Contract', 'Temporary'];
  departments = ['Delivery', 'Warehouse', 'Logistics', 'Operations'];
  statuses = ['Active', 'Inactive', 'On Leave', 'Suspended'];
  licenseClasses = ['Class A', 'Class B', 'Class C', 'Class D', 'Motorcycle'];
  vehicleTypes = ['Motorcycle', 'Van', 'Truck', 'Pickup', 'Car'];
  
  supervisors = [
    'John Kamau - Manager',
    'Mary Njeri - Supervisor',
    'David Ochieng - Lead',
    'Grace Wanjiku - Coordinator'
  ];

  vehicles = [
    'KCB 123A - Toyota Hilux',
    'KCD 456B - Isuzu D-Max',
    'KCE 789C - Honda CRF250',
    'KCF 012D - Nissan NV200'
  ];

  uploadedFiles = {
    profilePhoto: null as File | null,
    idCopy: null as File | null,
    licenseCopy: null as File | null,
    contract: null as File | null
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddDriverModalComponent>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
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

  setTab(tab: 'personal' | 'employment' | 'license' | 'documents'): void {
    this.activeTab = tab;
  }

  isTabValid(tab: 'personal' | 'employment' | 'license' | 'documents'): boolean {
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

  addDriver(): void {
    if (!this.driverForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const driverData: Driver = {
      id: 'DRV-' + Date.now(),
      ...this.driverForm.value,
      documents: this.uploadedFiles
    };

    this.dialogRef.close(driverData);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

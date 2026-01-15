import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

interface OperatingHours {
  day: string;
  open: boolean;
  startTime: string;
  endTime: string;
}

interface Branch {
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

@Component({
  selector: 'add-branch-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './add-branch-modal.component.html',
  styleUrls: ['./add-branch-modal.component.scss']
})
export class AddBranchModalComponent implements OnInit {
  currentStep: 1 | 2 | 3 | 4 = 1;
  completedSteps = new Set<number>();

  // Form groups
  basicInfoForm: FormGroup;
  locationForm: FormGroup;
  operationsForm: FormGroup;
  settingsForm: FormGroup;

  // Data
  branchTypes = [
    'Main Branch',
    'Sub Branch',
    'Warehouse',
    'Service Center',
    'Retail Store'
  ];

  counties = [
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Kericho',
    'Kiambu',
    'Machakos',
    'Nyeri',
    'Uasin Gishu'
  ];

  operatingHours: OperatingHours[] = [
    { day: 'Monday', open: true, startTime: '08:00 AM', endTime: '06:00 PM' },
    { day: 'Tuesday', open: true, startTime: '08:00 AM', endTime: '06:00 PM' },
    { day: 'Wednesday', open: true, startTime: '08:00 AM', endTime: '06:00 PM' },
    { day: 'Thursday', open: true, startTime: '08:00 AM', endTime: '06:00 PM' },
    { day: 'Friday', open: true, startTime: '08:00 AM', endTime: '06:00 PM' },
    { day: 'Saturday', open: true, startTime: '09:00 AM', endTime: '05:00 PM' },
    { day: 'Sunday', open: false, startTime: '', endTime: '' }
  ];

  services = [
    { id: 'sales', label: 'Sales', checked: true },
    { id: 'delivery', label: 'Delivery', checked: false },
    { id: 'repairs', label: 'Repairs', checked: false },
    { id: 'customer-service', label: 'Customer Service', checked: true },
    { id: 'warranty', label: 'Warranty', checked: true }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddBranchModalComponent>
  ) {
    this.basicInfoForm = this.formBuilder.group({
      branchName: ['', [Validators.required]],
      branchCode: ['', [Validators.required]],
      branchType: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]],
      managerName: ['', [Validators.required]],
      managerPhone: ['', [Validators.required]],
      managerEmail: ['', [Validators.required, Validators.email]]
    });

    this.locationForm = this.formBuilder.group({
      streetAddress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      county: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['Kenya', [Validators.required]],
      latitude: [''],
      longitude: ['']
    });

    this.operationsForm = this.formBuilder.group({
      status: ['Active', [Validators.required]]
    });

    this.settingsForm = this.formBuilder.group({
      initialStaffCount: [''],
      monthlyRevenueTarget: [''],
      expectedOpeningDate: [''],
      additionalNotes: ['']
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
    if (step === 3) return this.basicInfoForm.valid && this.locationForm.valid;
    if (step === 4) return this.basicInfoForm.valid && this.locationForm.valid;
    return false;
  }

  isStepActive(step: number): boolean {
    return this.currentStep === step;
  }

  isStepCompleted(step: number): boolean {
    return this.completedSteps.has(step);
  }

  canProceedNext(): boolean {
    // Only check required fields in the current step
    if (this.currentStep === 1) return this.basicInfoForm.valid;
    if (this.currentStep === 2) return this.locationForm.valid;
    if (this.currentStep === 3) return this.operationsForm.valid;
    return true;
  }

  nextStep() {
    if (this.currentStep < 4 && this.canProceedNext()) {
      this.completedSteps.add(this.currentStep);
      this.currentStep = (this.currentStep + 1) as 1 | 2 | 3 | 4;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep = (this.currentStep - 1) as 1 | 2 | 3 | 4;
    }
  }

  toggleService(serviceId: string) {
    const service = this.services.find(s => s.id === serviceId);
    if (service) {
      service.checked = !service.checked;
    }
  }

  getSelectedServices(): string[] {
    return this.services.filter(s => s.checked).map(s => s.id);
  }

  toggleDay(index: number) {
    this.operatingHours[index].open = !this.operatingHours[index].open;
    if (!this.operatingHours[index].open) {
      this.operatingHours[index].startTime = '';
      this.operatingHours[index].endTime = '';
    }
  }

  addBranch() {
    if (this.basicInfoForm.valid && this.locationForm.valid) {
      const branchData: Branch = {
        id: 'branch-' + Date.now(),
        name: this.basicInfoForm.get('branchName')?.value,
        code: this.basicInfoForm.get('branchCode')?.value,
        type: this.basicInfoForm.get('branchType')?.value,
        phone: this.basicInfoForm.get('phoneNumber')?.value,
        email: this.basicInfoForm.get('emailAddress')?.value,
        managerName: this.basicInfoForm.get('managerName')?.value,
        managerPhone: this.basicInfoForm.get('managerPhone')?.value,
        managerEmail: this.basicInfoForm.get('managerEmail')?.value,
        streetAddress: this.locationForm.get('streetAddress')?.value,
        city: this.locationForm.get('city')?.value,
        county: this.locationForm.get('county')?.value,
        postalCode: this.locationForm.get('postalCode')?.value,
        country: this.locationForm.get('country')?.value,
        latitude: this.locationForm.get('latitude')?.value,
        longitude: this.locationForm.get('longitude')?.value,
        operatingHours: this.operatingHours,
        servicesOffered: this.getSelectedServices(),
        status: this.operationsForm.get('status')?.value,
        createdAt: new Date().toISOString()
      };

      console.log('Adding branch:', branchData);
      this.dialogRef.close(branchData);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AppModalComponent, ModalButton, AppModalConfig } from '../../shared/modals/app-modal.component';
import { AppTabsComponent, Tab } from '../../shared/app-tabs/app-tabs.component';
import { InputTextComponent } from '../../shared/input-text/input-text.component';
import { InputDropdownComponent, DropdownOption } from '../../shared/input-dropdown/input-dropdown.component';

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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    AppModalComponent,
    AppTabsComponent,
    InputTextComponent,
    InputDropdownComponent
  ],
  templateUrl: './add-branch-modal.component.html',
  styleUrls: ['./add-branch-modal.component.scss']
})
export class AddBranchModalComponent implements OnInit {
  currentStep: 1 | 2 | 3 | 4 = 1;
  completedSteps = new Set<number>();

  // Modal configuration
  modalConfig: AppModalConfig = {
    title: 'Add New Branch',
    subtitle: 'Complete all required information to add a new branch',
    wide: true
  };

  activeTabId: string = '1';

  get tabsWithState(): Tab[] {
    return [
      { id: '1', label: 'Basic Info', disabled: false },
      { id: '2', label: 'Location', disabled: !this.basicInfoForm.valid },
      { id: '3', label: 'Operations', disabled: !this.basicInfoForm.valid || !this.locationForm.valid },
      { id: '4', label: 'Settings', disabled: !this.basicInfoForm.valid || !this.locationForm.valid }
    ];
  }

  // Form groups
  basicInfoForm: FormGroup;
  locationForm: FormGroup;
  operationsForm: FormGroup;
  settingsForm: FormGroup;

  // Data
  branchTypes: DropdownOption[] = [
    { id: 'main', label: 'Main Branch' },
    { id: 'sub', label: 'Sub Branch' },
    { id: 'warehouse', label: 'Warehouse' },
    { id: 'service', label: 'Service Center' },
    { id: 'retail', label: 'Retail Store' }
  ];

  counties: DropdownOption[] = [
    { id: 'nairobi', label: 'Nairobi' },
    { id: 'mombasa', label: 'Mombasa' },
    { id: 'kisumu', label: 'Kisumu' },
    { id: 'nakuru', label: 'Nakuru' },
    { id: 'eldoret', label: 'Eldoret' },
    { id: 'kericho', label: 'Kericho' },
    { id: 'kiambu', label: 'Kiambu' },
    { id: 'machakos', label: 'Machakos' },
    { id: 'nyeri', label: 'Nyeri' },
    { id: 'uasinGishu', label: 'Uasin Gishu' }
  ];

  countries: DropdownOption[] = [
    { id: 'kenya', label: 'Kenya' },
    { id: 'uganda', label: 'Uganda' },
    { id: 'tanzania', label: 'Tanzania' },
    { id: 'rwanda', label: 'Rwanda' },
    { id: 'ethiopia', label: 'Ethiopia' },
    { id: 'southAfrica', label: 'South Africa' }
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
      phoneNumber: [''],
      emailAddress: ['', [Validators.email]],
      managerName: [''],
      managerPhone: [''],
      managerEmail: ['', [Validators.email]]
    });

    this.locationForm = this.formBuilder.group({
      streetAddress: ['', [Validators.required]],
      city: [''],
      county: [''],
      postalCode: [''],
      country: [{ id: 'kenya', label: 'Kenya' }, [Validators.required]],
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

  onTabChange(tabId: string): void {
    const step = parseInt(tabId) as 1 | 2 | 3 | 4;
    if (this.canProceedToStep(step)) {
      this.currentStep = step;
      this.activeTabId = tabId;
    }
  }

  setStep(step: 1 | 2 | 3 | 4) {
    if (this.canProceedToStep(step)) {
      this.currentStep = step;
      this.activeTabId = step.toString();
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
    if (this.currentStep === 1) {
      const isValid = this.basicInfoForm.valid;
      console.log('Step 1 validation:', isValid, this.basicInfoForm.value);
      return isValid;
    }
    if (this.currentStep === 2) return this.locationForm.valid;
    if (this.currentStep === 3) return this.operationsForm.valid;
    return true;
  }

  nextStep() {
    if (this.currentStep < 4 && this.canProceedNext()) {
      this.completedSteps.add(this.currentStep);
      this.currentStep = (this.currentStep + 1) as 1 | 2 | 3 | 4;
      this.activeTabId = this.currentStep.toString();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep = (this.currentStep - 1) as 1 | 2 | 3 | 4;
      this.activeTabId = this.currentStep.toString();
    }
  }

  handleButtonClick(action: string): void {
    console.log('Button clicked:', action, 'Current step:', this.currentStep, 'Active tab:', this.activeTabId);
    if (action === 'cancel') {
      this.closeDialog();
    } else if (action === 'next') {
      console.log('Calling nextStep, canProceedNext:', this.canProceedNext());
      this.nextStep();
      console.log('After nextStep - Current step:', this.currentStep, 'Active tab:', this.activeTabId);
    } else if (action === 'previous') {
      this.previousStep();
    } else if (action === 'save') {
      this.addBranch();
    }
  }

  getLeftButtons(): ModalButton[] {
    return [{ label: 'Cancel', action: 'cancel', color: 'default' }];
  }

  getRightButtons(): ModalButton[] {
    const buttons: ModalButton[] = [];

    if (this.currentStep > 1) {
      buttons.push({ label: 'Previous', action: 'previous', color: 'default' });
    }

    if (this.currentStep < 4) {
      buttons.push({
        label: 'Next',
        action: 'next',
        color: 'primary',
        disabled: !this.canProceedNext()
      });
    } else {
      buttons.push({
        label: 'Add Branch',
        action: 'save',
        color: 'primary',
        disabled: !this.basicInfoForm.valid || !this.locationForm.valid
      });
    }

    return buttons;
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
        type: this.basicInfoForm.get('branchType')?.value?.label || this.basicInfoForm.get('branchType')?.value,
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

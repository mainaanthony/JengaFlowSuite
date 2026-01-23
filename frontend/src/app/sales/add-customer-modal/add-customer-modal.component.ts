import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AppTabsComponent, Tab } from '../../shared/app-tabs/app-tabs.component';
import { InputTextComponent, InputTextConfig } from '../../shared/input-text/input-text.component';
import { InputDropdownComponent, DropdownOption, DropdownConfig } from '../../shared/input-dropdown/input-dropdown.component';
import { AppModalComponent, AppModalConfig, ModalButton } from '../../shared/modals/app-modal.component';

interface CustomerData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  idPassport: string;
  // Address Info
  streetAddress: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  // Business Info
  companyName: string;
  kraPin: string;
  vatNumber: string;
  businessType: string;
  // Account Settings
  customerType: string;
  creditLimit: number;
  discountRate: number;
  paymentTerms: string;
  notes: string;
}

@Component({
  selector: 'app-add-customer-modal',
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
  templateUrl: './add-customer-modal.component.html',
  styleUrls: ['./add-customer-modal.component.scss']
})
export class AddCustomerModalComponent implements OnInit, AfterViewInit {
  @ViewChild('customerFormTemplate') customerFormTemplate!: TemplateRef<any>;

  activeTab: string = 'personal-info';
  customerForm!: FormGroup;

  tabs: Tab[] = [
    { id: 'personal-info', label: 'Personal Info' },
    { id: 'address', label: 'Address' },
    { id: 'business-info', label: 'Business Info' },
    { id: 'account-settings', label: 'Account Settings' }
  ];

  // Input Configurations
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
    placeholder: 'customer@example.com',
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
    placeholder: 'mm/dd/yyyy',
    label: 'Date of Birth',
    type: 'text',
    clearable: true
  };

  idPassportConfig: InputTextConfig = {
    placeholder: 'Enter ID or passport number',
    label: 'ID/Passport Number',
    clearable: true
  };

  streetAddressConfig: InputTextConfig = {
    placeholder: 'Enter street address',
    label: 'Street Address',
    clearable: true
  };

  cityConfig: InputTextConfig = {
    placeholder: 'Enter city or town',
    label: 'City/Town',
    clearable: true
  };

  postalCodeConfig: InputTextConfig = {
    placeholder: '00100',
    label: 'Postal Code',
    clearable: true
  };

  companyNameConfig: InputTextConfig = {
    placeholder: 'Enter company name',
    label: 'Company Name',
    clearable: true
  };

  kraPinConfig: InputTextConfig = {
    placeholder: 'P051234567M',
    label: 'KRA PIN',
    clearable: true
  };

  vatNumberConfig: InputTextConfig = {
    placeholder: 'VAT registration number',
    label: 'VAT Number',
    clearable: true
  };

  creditLimitConfig: InputTextConfig = {
    placeholder: '0',
    label: 'Credit Limit (KSH)',
    type: 'number',
    clearable: true
  };

  discountRateConfig: InputTextConfig = {
    placeholder: '0',
    label: 'Discount Rate (%)',
    type: 'number',
    clearable: true
  };

  notesConfig: InputTextConfig = {
    placeholder: 'Additional notes about the customer...',
    label: 'Notes',
    description: true,
    rows: 3,
    clearable: true
  };

  // Dropdown Options
  genderOptions: DropdownOption[] = [
    { id: 'male', label: 'Male', value: 'male' },
    { id: 'female', label: 'Female', value: 'female' },
    { id: 'other', label: 'Other', value: 'other' }
  ];

  genderConfig: DropdownConfig = {
    placeholder: 'Select gender',
    searchable: false
  };

  countyOptions: DropdownOption[] = [
    { id: 'nairobi', label: 'Nairobi', value: 'nairobi' },
    { id: 'kiambu', label: 'Kiambu', value: 'kiambu' },
    { id: 'mombasa', label: 'Mombasa', value: 'mombasa' },
    { id: 'nakuru', label: 'Nakuru', value: 'nakuru' },
    { id: 'kisumu', label: 'Kisumu', value: 'kisumu' }
  ];

  countyConfig: DropdownConfig = {
    placeholder: 'Select county',
    searchable: true
  };

  businessTypeOptions: DropdownOption[] = [
    { id: 'retail', label: 'Retail', value: 'retail' },
    { id: 'wholesale', label: 'Wholesale', value: 'wholesale' },
    { id: 'manufacturing', label: 'Manufacturing', value: 'manufacturing' },
    { id: 'services', label: 'Services', value: 'services' },
    { id: 'other', label: 'Other', value: 'other' }
  ];

  businessTypeConfig: DropdownConfig = {
    placeholder: 'Select business type',
    searchable: true
  };

  customerTypeOptions: DropdownOption[] = [
    { id: 'individual', label: 'Individual', value: 'individual' },
    { id: 'business', label: 'Business', value: 'business' }
  ];

  customerTypeConfig: DropdownConfig = {
    placeholder: 'Select customer type',
    searchable: false
  };

  paymentTermsOptions: DropdownOption[] = [
    { id: 'cod', label: 'Cash on Delivery', value: 'cod' },
    { id: 'net7', label: 'Net 7', value: 'net7' },
    { id: 'net14', label: 'Net 14', value: 'net14' },
    { id: 'net30', label: 'Net 30', value: 'net30' },
    { id: 'prepaid', label: 'Prepaid', value: 'prepaid' }
  ];

  paymentTermsConfig: DropdownConfig = {
    placeholder: 'Select payment terms',
    searchable: true
  };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddCustomerModalComponent>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    // Open the AppModalComponent with our template
    setTimeout(() => {
      this.openModal();
      // Close this wrapper component immediately
      this.dialogRef.close();
    });
  }

  openModal(): void {
    const dialogRef = this.dialog.open(AppModalComponent, {
      disableClose: false,
      panelClass: 'custom-modal-container',
      width: '900px',
      maxWidth: '95vw'
    });

    const instance = dialogRef.componentInstance;
    instance.config = {
      title: 'Add New Customer',
      subtitle: 'Create a new customer profile with contact and account information'
    };

    instance.contentTemplate = this.customerFormTemplate;

    instance.leftButtons = [
      { label: 'Cancel', action: 'cancel', color: 'default' }
    ];

    instance.rightButtons = [
      { 
        label: 'Save Customer', 
        action: 'save', 
        color: 'primary', 
        icon: 'person_add',
        disabled: !this.canSave()
      }
    ];

    // Monitor form changes to update button state
    this.customerForm.valueChanges.subscribe(() => {
      const saveBtn = instance.rightButtons.find(b => b.action === 'save');
      if (saveBtn) {
        saveBtn.disabled = !this.canSave();
      }
    });

    instance.buttonClicked.subscribe((action: string) => {
      if (action === 'save') {
        this.saveCustomer(dialogRef, instance);
      }
    });
  }

  private initializeForm(): void {
    this.customerForm = this.fb.group({
      // Personal Info
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required]],
      dateOfBirth: [''],
      gender: [''],
      idPassport: [''],
      // Address Info
      streetAddress: [''],
      city: [''],
      county: [''],
      postalCode: [''],
      country: ['Kenya'],
      // Business Info
      companyName: [''],
      kraPin: [''],
      vatNumber: [''],
      businessType: [''],
      // Account Settings
      customerType: ['individual'],
      creditLimit: [0],
      discountRate: [0],
      paymentTerms: ['cod'],
      notes: ['']
    });
  }

  onTabChange(tabId: string): void {
    this.activeTab = tabId;
  }

  onGenderChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.customerForm.patchValue({ gender: value.value });
    }
  }

  onCountyChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.customerForm.patchValue({ county: value.value });
    }
  }

  onBusinessTypeChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.customerForm.patchValue({ businessType: value.value });
    }
  }

  onCustomerTypeChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.customerForm.patchValue({ customerType: value.value });
    }
  }

  onPaymentTermsChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.customerForm.patchValue({ paymentTerms: value.value });
    }
  }

  isTabValid(tabId: string): boolean {
    const tabControls: { [key: string]: string[] } = {
      'personal-info': ['firstName', 'lastName', 'phone'],
      'address': ['city', 'streetAddress'],
      'business-info': [],
      'account-settings': []
    };

    const controls = tabControls[tabId] || [];
    return controls.every(control => {
      const field = this.customerForm.get(control);
      return field && field.valid && field.value;
    });
  }

  canSave(): boolean {
    const firstName = this.customerForm.get('firstName');
    const lastName = this.customerForm.get('lastName');
    const phone = this.customerForm.get('phone');
    
    return !!(firstName?.valid && firstName?.value &&
              lastName?.valid && lastName?.value &&
              phone?.valid && phone?.value);
  }

  saveCustomer(dialogRef: any, instance: AppModalComponent): void {
    if (!this.canSave()) {
      instance.showErrorMessage = true;
      instance.errorMessage = 'Please fill in required fields (First Name, Last Name, Phone)';
      setTimeout(() => {
        instance.showErrorMessage = false;
      }, 3000);
      return;
    }

    const saveBtn = instance.rightButtons.find(b => b.action === 'save');
    if (saveBtn) saveBtn.loading = true;

    // Simulate API call
    setTimeout(() => {
      const customerData: CustomerData = this.customerForm.value;
      instance.showSuccessMessage = true;
      instance.successMessage = 'Customer added successfully!';
      
      setTimeout(() => {
        dialogRef.close(customerData);
      }, 1500);
    }, 800);
  }
}

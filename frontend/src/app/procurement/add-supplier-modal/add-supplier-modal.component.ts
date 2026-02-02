import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AppTabsComponent, Tab } from '../../shared/app-tabs/app-tabs.component';
import { InputTextComponent, InputTextConfig } from '../../shared/input-text/input-text.component';
import { InputDropdownComponent, DropdownOption, DropdownConfig } from '../../shared/input-dropdown/input-dropdown.component';
import { AppModalComponent, AppModalConfig, ModalButton } from '../../shared/modals/app-modal.component';

interface Supplier {
  id: string;
  companyName: string;
  tradingName?: string;
  registrationNumber: string;
  taxId: string;
  category: string;
  
  // Contact Information
  primaryContact: string;
  primaryPhone: string;
  primaryEmail: string;
  secondaryContact?: string;
  secondaryPhone?: string;
  secondaryEmail?: string;
  
  // Address
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  
  // Banking Details
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode?: string;
  swiftCode?: string;
  
  // Business Details
  businessType: string;
  yearsInBusiness: number;
  website?: string;
  
  // Payment Terms
  paymentTerms: string;
  creditLimit: number;
  currency: string;
  
  // Documents
  documents?: {
    businessLicense?: File | null;
    taxCertificate?: File | null;
    bankStatement?: File | null;
  };
  
  // Additional
  notes?: string;
  rating: number;
  status: 'Active' | 'Inactive' | 'Pending Verification';
}

@Component({
  selector: 'app-add-supplier-modal',
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
  templateUrl: './add-supplier-modal.component.html',
  styleUrls: ['./add-supplier-modal.component.scss']
})
export class AddSupplierModalComponent implements OnInit, AfterViewInit {
  @ViewChild('supplierFormTemplate') supplierFormTemplate!: TemplateRef<any>;
  supplierForm!: FormGroup;
  activeTab: string = 'basic';

  tabs: Tab[] = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'contact', label: 'Contact' },
    { id: 'business', label: 'Business' },
    { id: 'financial', label: 'Financial' },
    { id: 'compliance', label: 'Compliance' }
  ];

  // Input Text Configurations
  companyNameConfig: InputTextConfig = {
    placeholder: 'Enter company name',
    label: 'Company Name',
    required: true,
    clearable: true
  };

  tradingNameConfig: InputTextConfig = {
    placeholder: 'Enter trading name',
    label: 'Trading Name',
    clearable: true
  };

  registrationNumberConfig: InputTextConfig = {
    placeholder: 'Enter registration number',
    label: 'Registration Number',
    required: true,
    clearable: true
  };

  taxIdConfig: InputTextConfig = {
    placeholder: 'Enter tax ID / PIN',
    label: 'Tax ID',
    required: true,
    clearable: true
  };

  yearsInBusinessConfig: InputTextConfig = {
    placeholder: '0',
    label: 'Years in Business',
    type: 'number',
    required: true,
    clearable: true
  };

  websiteConfig: InputTextConfig = {
    placeholder: 'https://www.example.com',
    label: 'Website',
    type: 'url',
    clearable: true
  };

  primaryContactConfig: InputTextConfig = {
    placeholder: 'Enter primary contact name',
    label: 'Primary Contact',
    required: true,
    clearable: true
  };

  primaryPhoneConfig: InputTextConfig = {
    placeholder: '+254 XXX XXX XXX',
    label: 'Primary Phone',
    type: 'tel',
    required: true,
    clearable: true
  };

  primaryEmailConfig: InputTextConfig = {
    placeholder: 'contact@example.com',
    label: 'Primary Email',
    type: 'email',
    required: true,
    clearable: true
  };

  secondaryContactConfig: InputTextConfig = {
    placeholder: 'Enter secondary contact name',
    label: 'Secondary Contact',
    clearable: true
  };

  secondaryPhoneConfig: InputTextConfig = {
    placeholder: '+254 XXX XXX XXX',
    label: 'Secondary Phone',
    type: 'tel',
    clearable: true
  };

  secondaryEmailConfig: InputTextConfig = {
    placeholder: 'alternate@example.com',
    label: 'Secondary Email',
    type: 'email',
    clearable: true
  };

  streetConfig: InputTextConfig = {
    placeholder: 'Enter street address',
    label: 'Street Address',
    required: true,
    description: true,
    rows: 2,
    clearable: true
  };

  cityConfig: InputTextConfig = {
    placeholder: 'Enter city',
    label: 'City',
    required: true,
    clearable: true
  };

  postalCodeConfig: InputTextConfig = {
    placeholder: 'Enter postal code',
    label: 'Postal Code',
    clearable: true
  };

  countryConfig: InputTextConfig = {
    placeholder: 'Enter country',
    label: 'Country',
    required: true,
    clearable: true
  };

  yearEstablishedConfig: InputTextConfig = {
    placeholder: 'YYYY',
    label: 'Year Established',
    type: 'number',
    required: true,
    clearable: true
  };

  bankNameConfig: InputTextConfig = {
    placeholder: 'Enter bank name',
    label: 'Bank Name',
    required: true,
    clearable: true
  };

  branchCodeConfig: InputTextConfig = {
    placeholder: 'Enter branch code',
    label: 'Branch Code',
    clearable: true
  };

  accountNameConfig: InputTextConfig = {
    placeholder: 'Enter account name',
    label: 'Account Name',
    required: true,
    clearable: true
  };

  accountNumberConfig: InputTextConfig = {
    placeholder: 'Enter account number',
    label: 'Account Number',
    required: true,
    clearable: true
  };

  swiftCodeConfig: InputTextConfig = {
    placeholder: 'Enter SWIFT/BIC code',
    label: 'SWIFT Code',
    clearable: true
  };

  creditLimitConfig: InputTextConfig = {
    placeholder: '0',
    label: 'Credit Limit',
    type: 'number',
    required: true,
    clearable: true
  };

  businessLicenseNumberConfig: InputTextConfig = {
    placeholder: 'Enter business license number',
    label: 'Business License Number',
    clearable: true
  };

  certificateNumberConfig: InputTextConfig = {
    placeholder: 'Enter certificate number',
    label: 'Tax Certificate Number',
    clearable: true
  };

  notesConfig: InputTextConfig = {
    placeholder: 'Any additional notes about the supplier...',
    label: 'Additional Notes',
    description: true,
    rows: 4,
    clearable: true
  };

  // Dropdown Options
  categoryOptions: DropdownOption[] = [
    { id: 'electronics', label: 'Electronics & Technology', value: 'Electronics & Technology' },
    { id: 'office', label: 'Office Supplies', value: 'Office Supplies' },
    { id: 'construction', label: 'Construction Materials', value: 'Construction Materials' },
    { id: 'food', label: 'Food & Beverages', value: 'Food & Beverages' },
    { id: 'textiles', label: 'Textiles & Apparel', value: 'Textiles & Apparel' },
    { id: 'raw', label: 'Raw Materials', value: 'Raw Materials' },
    { id: 'services', label: 'Services', value: 'Services' },
    { id: 'other', label: 'Other', value: 'Other' }
  ];

  businessTypeOptions: DropdownOption[] = [
    { id: 'sole', label: 'Sole Proprietorship', value: 'Sole Proprietorship' },
    { id: 'partnership', label: 'Partnership', value: 'Partnership' },
    { id: 'limited', label: 'Limited Company', value: 'Limited Company' },
    { id: 'corporation', label: 'Corporation', value: 'Corporation' },
    { id: 'cooperative', label: 'Cooperative', value: 'Cooperative' },
    { id: 'ngo', label: 'NGO', value: 'NGO' }
  ];

  countyOptions: DropdownOption[] = [
    { id: 'nairobi', label: 'Nairobi', value: 'Nairobi' },
    { id: 'mombasa', label: 'Mombasa', value: 'Mombasa' },
    { id: 'kisumu', label: 'Kisumu', value: 'Kisumu' },
    { id: 'nakuru', label: 'Nakuru', value: 'Nakuru' },
    { id: 'eldoret', label: 'Eldoret', value: 'Eldoret' },
    { id: 'thika', label: 'Thika', value: 'Thika' },
    { id: 'kiambu', label: 'Kiambu', value: 'Kiambu' },
    { id: 'machakos', label: 'Machakos', value: 'Machakos' },
    { id: 'nyeri', label: 'Nyeri', value: 'Nyeri' },
    { id: 'meru', label: 'Meru', value: 'Meru' }
  ];

  numberOfEmployeesOptions: DropdownOption[] = [
    { id: 'emp1', label: '1-10', value: '1-10' },
    { id: 'emp2', label: '11-50', value: '11-50' },
    { id: 'emp3', label: '51-100', value: '51-100' },
    { id: 'emp4', label: '101-250', value: '101-250' },
    { id: 'emp5', label: '251-500', value: '251-500' },
    { id: 'emp6', label: '500+', value: '500+' }
  ];

  annualTurnoverOptions: DropdownOption[] = [
    { id: 'turn1', label: 'Under KES 1M', value: 'Under KES 1M' },
    { id: 'turn2', label: 'KES 1M - 5M', value: 'KES 1M - 5M' },
    { id: 'turn3', label: 'KES 5M - 10M', value: 'KES 5M - 10M' },
    { id: 'turn4', label: 'KES 10M - 50M', value: 'KES 10M - 50M' },
    { id: 'turn5', label: 'KES 50M - 100M', value: 'KES 50M - 100M' },
    { id: 'turn6', label: 'Over KES 100M', value: 'Over KES 100M' }
  ];

  paymentTermsOptions: DropdownOption[] = [
    { id: 'net15', label: 'Net 15', value: 'Net 15' },
    { id: 'net30', label: 'Net 30', value: 'Net 30' },
    { id: 'net45', label: 'Net 45', value: 'Net 45' },
    { id: 'net60', label: 'Net 60', value: 'Net 60' },
    { id: 'cod', label: 'Cash on Delivery', value: 'Cash on Delivery' },
    { id: 'advance', label: 'Advance Payment', value: 'Advance Payment' },
    { id: 'custom', label: 'Custom', value: 'Custom' }
  ];

  currencyOptions: DropdownOption[] = [
    { id: 'kes', label: 'KES - Kenyan Shilling', value: 'KES' },
    { id: 'usd', label: 'USD - US Dollar', value: 'USD' },
    { id: 'eur', label: 'EUR - Euro', value: 'EUR' },
    { id: 'gbp', label: 'GBP - British Pound', value: 'GBP' }
  ];

  // Dropdown Configurations
  categoryDropdownConfig: DropdownConfig = {
    placeholder: 'Select category',
    searchable: true,
    clearable: true
  };

  businessTypeDropdownConfig: DropdownConfig = {
    placeholder: 'Select business type',
    searchable: true,
    clearable: true
  };

  countyDropdownConfig: DropdownConfig = {
    placeholder: 'Select county',
    searchable: true,
    clearable: true
  };

  numberOfEmployeesDropdownConfig: DropdownConfig = {
    placeholder: 'Select number of employees',
    searchable: true,
    clearable: true
  };

  annualTurnoverDropdownConfig: DropdownConfig = {
    placeholder: 'Select annual turnover',
    searchable: true,
    clearable: true
  };

  paymentTermsDropdownConfig: DropdownConfig = {
    placeholder: 'Select payment terms',
    searchable: true,
    clearable: true
  };

  currencyDropdownConfig: DropdownConfig = {
    placeholder: 'Select currency',
    searchable: true,
    clearable: true
  };

  uploadedFiles = {
    businessLicense: null as File | null,
    taxCertificate: null as File | null,
    bankStatement: null as File | null
  };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddSupplierModalComponent>
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
      title: 'Add New Supplier',
      subtitle: 'Fill in the supplier information',
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
        label: 'Add Supplier',
        action: 'save',
        color: 'primary',
        icon: 'business'
      }
    ];

    const modalDialogRef = this.dialog.open(AppModalComponent, {
      width: '1100px',
      maxWidth: '95vw',
      disableClose: false,
      panelClass: 'custom-modal-panel'
    });

    const instance = modalDialogRef.componentInstance;
    instance.config = modalConfig;
    instance.contentTemplate = this.supplierFormTemplate;
    instance.leftButtons = leftButtons;
    instance.rightButtons = rightButtons;

    instance.buttonClicked.subscribe((action: string) => {
      if (action === 'save') {
        this.saveSupplier(modalDialogRef, instance);
      } else if (action === 'cancel') {
        this.dialogRef.close();
      }
    });

    modalDialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close(result);
    });
  }

  private initializeForm(): void {
    this.supplierForm = this.fb.group({
      // Basic Information
      companyName: ['', Validators.required],
      tradingName: [''],
      registrationNumber: ['', Validators.required],
      taxId: ['', Validators.required],
      category: ['', Validators.required],
      businessType: ['', Validators.required],
      yearsInBusiness: [0, [Validators.required, Validators.min(0)]],
      website: [''],
      
      // Business Details
      yearEstablished: ['', Validators.required],
      numberOfEmployees: ['', Validators.required],
      annualTurnover: ['', Validators.required],
      rating: [5],
      activeSupplier: [true],
      preferredSupplier: [false],
      
      // Compliance
      vatRegistered: [false],
      businessLicenseNumber: [''],
      certificateNumber: [''],

      // Contact Information
      primaryContact: ['', Validators.required],
      primaryPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      primaryEmail: ['', [Validators.required, Validators.email]],
      secondaryContact: [''],
      secondaryPhone: ['', Validators.pattern(/^[0-9]{10,15}$/)],
      secondaryEmail: ['', Validators.email],

      // Address
      street: ['', Validators.required],
      city: ['', Validators.required],
      county: ['', Validators.required],
      postalCode: [''],
      country: ['Kenya', Validators.required],

      // Banking Details
      bankName: ['', Validators.required],
      accountName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      branchCode: [''],
      swiftCode: [''],

      // Payment Terms
      paymentTerms: ['Net 30', Validators.required],
      creditLimit: [0, [Validators.required, Validators.min(0)]],
      currency: ['KES', Validators.required],

      // Additional
      notes: ['']
    });
  }

  onTabChange(tabId: string): void {
    this.activeTab = tabId;
  }

  setTab(tab: 'basic' | 'contact' | 'business' | 'financial' | 'compliance'): void {
    this.activeTab = tab;
  }

  // Dropdown Change Handlers
  onCategoryChange(value: string): void {
    this.supplierForm.patchValue({ category: value });
  }

  onBusinessTypeChange(value: string): void {
    this.supplierForm.patchValue({ businessType: value });
  }

  onCountyChange(value: string): void {
    this.supplierForm.patchValue({ county: value });
  }

  onNumberOfEmployeesChange(value: string): void {
    this.supplierForm.patchValue({ numberOfEmployees: value });
  }

  onAnnualTurnoverChange(value: string): void {
    this.supplierForm.patchValue({ annualTurnover: value });
  }

  onPaymentTermsChange(value: string): void {
    this.supplierForm.patchValue({ paymentTerms: value });
  }

  onCurrencyChange(value: string): void {
    this.supplierForm.patchValue({ currency: value });
  }

  rating = 5;

  setRating(stars: number): void {
    this.rating = stars;
    this.supplierForm.patchValue({ rating: stars });
  }

  isTabValid(tab: 'basic' | 'contact' | 'business' | 'financial' | 'compliance'): boolean {
    if (tab === 'basic') {
      return (
        (this.supplierForm.get('companyName')?.valid ?? false) &&
        (this.supplierForm.get('registrationNumber')?.valid ?? false) &&
        (this.supplierForm.get('taxId')?.valid ?? false) &&
        (this.supplierForm.get('category')?.valid ?? false) &&
        (this.supplierForm.get('businessType')?.valid ?? false)
      );
    } else if (tab === 'contact') {
      return (
        (this.supplierForm.get('primaryContact')?.valid ?? false) &&
        (this.supplierForm.get('primaryPhone')?.valid ?? false) &&
        (this.supplierForm.get('primaryEmail')?.valid ?? false) &&
        (this.supplierForm.get('street')?.valid ?? false) &&
        (this.supplierForm.get('city')?.valid ?? false) &&
        (this.supplierForm.get('county')?.valid ?? false)
      );
    } else if (tab === 'business') {
      return (
        (this.supplierForm.get('yearEstablished')?.valid ?? false) &&
        (this.supplierForm.get('numberOfEmployees')?.valid ?? false) &&
        (this.supplierForm.get('annualTurnover')?.valid ?? false)
      );
    } else if (tab === 'financial') {
      return (
        (this.supplierForm.get('bankName')?.valid ?? false) &&
        (this.supplierForm.get('accountName')?.valid ?? false) &&
        (this.supplierForm.get('accountNumber')?.valid ?? false) &&
        (this.supplierForm.get('paymentTerms')?.valid ?? false) &&
        (this.supplierForm.get('creditLimit')?.valid ?? false)
      );
    }
    return true;
  }

  onFileSelect(event: Event, fileType: 'businessLicense' | 'taxCertificate' | 'bankStatement'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.uploadedFiles[fileType] = input.files[0];
    }
  }

  removeFile(fileType: 'businessLicense' | 'taxCertificate' | 'bankStatement'): void {
    this.uploadedFiles[fileType] = null;
  }

  getFileName(fileType: 'businessLicense' | 'taxCertificate' | 'bankStatement'): string {
    return this.uploadedFiles[fileType]?.name || '';
  }

  hasFile(fileType: 'businessLicense' | 'taxCertificate' | 'bankStatement'): boolean {
    return this.uploadedFiles[fileType] !== null;
  }

  saveSupplier(modalDialogRef: MatDialogRef<AppModalComponent>, instance: any): void {
    if (!this.supplierForm.valid) {
      alert('Please fill in all required fields');
      instance.loading = false;
      return;
    }

    instance.loading = true;

    const supplierData: Supplier = {
      id: 'SUP-' + Date.now(),
      ...this.supplierForm.value,
      documents: this.uploadedFiles,
      rating: this.rating,
      status: 'Pending Verification' as const
    };

    setTimeout(() => {
      instance.loading = false;
      modalDialogRef.close();
      this.dialogRef.close(supplierData);
    }, 1000);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

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
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './add-supplier-modal.component.html',
  styleUrls: ['./add-supplier-modal.component.scss']
})
export class AddSupplierModalComponent implements OnInit {
  supplierForm!: FormGroup;
  activeTab: 'basic' | 'contact' | 'business' | 'financial' | 'compliance' = 'basic';

  categories = [
    'Electronics & Technology',
    'Office Supplies',
    'Construction Materials',
    'Food & Beverages',
    'Textiles & Apparel',
    'Raw Materials',
    'Services',
    'Other'
  ];

  businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Limited Company',
    'Corporation',
    'Cooperative',
    'NGO'
  ];

  paymentTermsOptions = [
    'Net 15',
    'Net 30',
    'Net 45',
    'Net 60',
    'Cash on Delivery',
    'Advance Payment',
    'Custom'
  ];

  currencies = ['KES', 'USD', 'EUR', 'GBP'];

  employeeRanges = [
    '1-10',
    '11-50',
    '51-100',
    '101-250',
    '251-500',
    '500+'
  ];

  turnoverRanges = [
    'Under KES 1M',
    'KES 1M - 5M',
    'KES 5M - 10M',
    'KES 10M - 50M',
    'KES 50M - 100M',
    'Over KES 100M'
  ];

  counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
    'Thika', 'Kiambu', 'Machakos', 'Nyeri', 'Meru'
  ];

  uploadedFiles = {
    businessLicense: null as File | null,
    taxCertificate: null as File | null,
    bankStatement: null as File | null
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddSupplierModalComponent>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
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

  setTab(tab: 'basic' | 'contact' | 'business' | 'financial' | 'compliance'): void {
    this.activeTab = tab;
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

  saveSupplier(): void {
    if (!this.supplierForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const supplierData: Supplier = {
      id: 'SUP-' + Date.now(),
      ...this.supplierForm.value,
      documents: this.uploadedFiles,
      rating: 0,
      status: 'Pending Verification' as const
    };

    this.dialogRef.close(supplierData);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

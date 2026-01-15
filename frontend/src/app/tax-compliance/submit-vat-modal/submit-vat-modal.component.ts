import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

interface VatCalculation {
  taxPeriod: string;
  pinNumber: string;
  outputVat: {
    standardRateSales: number;
    standardRateAmount: number;
    zeroRatedSales: number;
    zeroRatedAmount: number;
    exemptSales: number;
    exemptAmount: number;
    totalOutput: number;
  };
  inputVat: {
    localPurchases: number;
    localPurchasesVat: number;
    importVat: number;
    importVatAmount: number;
    otherInputVat: number;
    otherInputVatAmount: number;
    totalInput: number;
  };
  netVatDue: number;
  dueDate: string;
}

interface ComplianceCheck {
  id: string;
  title: string;
  description: string;
  status: 'passed' | 'warning' | 'failed';
}

interface VatSubmission {
  taxPeriod: string;
  pinNumber: string;
  netVatDue: number;
  authorizedPerson: string;
  positionTitle: string;
  contactNumber: string;
  additionalComments: string;
  declarationConfirmed: boolean;
  taxPeriodStart: string;
  taxPeriodEnd: string;
  submissionDate: string;
}

@Component({
  selector: 'submit-vat-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './submit-vat-modal.component.html',
  styleUrls: ['./submit-vat-modal.component.scss']
})
export class SubmitVatModalComponent implements OnInit {
  activeStep: 1 | 2 | 3 = 1;
  completedSteps = new Set<number>();

  // VAT Calculation Data
  vatCalculation: VatCalculation = {
    taxPeriod: 'January 2024',
    pinNumber: 'P051234567M',
    outputVat: {
      standardRateSales: 1867187,
      standardRateAmount: 298750,
      zeroRatedSales: 125000,
      zeroRatedAmount: 0,
      exemptSales: 75000,
      exemptAmount: 0,
      totalOutput: 298750
    },
    inputVat: {
      localPurchases: 890625,
      localPurchasesVat: 142500,
      importVat: 0,
      importVatAmount: 0,
      otherInputVat: 0,
      otherInputVatAmount: 0,
      totalInput: 142500
    },
    netVatDue: 156250,
    dueDate: 'February 20, 2024'
  };

  // Compliance Checks
  complianceChecks: ComplianceCheck[] = [
    {
      id: 'sales-recorded',
      title: 'All sales transactions recorded',
      description: 'Complete sales data available',
      status: 'passed'
    },
    {
      id: 'purchase-verified',
      title: 'Purchase invoices verified',
      description: 'All purchase VAT validated',
      status: 'passed'
    },
    {
      id: 'vat-registration',
      title: 'VAT registration valid',
      description: 'Registration certificate current',
      status: 'passed'
    },
    {
      id: 'previous-returns',
      title: 'Previous returns filed',
      description: 'No outstanding returns',
      status: 'passed'
    },
    {
      id: 'bank-reconciliation',
      title: 'Bank reconciliation complete',
      description: 'Minor discrepancies noted',
      status: 'warning'
    }
  ];

  // Forms
  reviewForm: FormGroup;
  complianceForm: FormGroup;
  declarationForm: FormGroup;

  // Computed properties
  complianceStatus = 'Ready for Submission';
  complianceStatusClass = 'passed';

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SubmitVatModalComponent>
  ) {
    this.reviewForm = this.formBuilder.group({});
    this.complianceForm = this.formBuilder.group({
      taxPeriodStart: ['01/01/2024', Validators.required],
      taxPeriodEnd: ['01/31/2024', Validators.required]
    });
    this.declarationForm = this.formBuilder.group({
      authorizedPerson: ['', [Validators.required]],
      positionTitle: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\+254\d{3}-\d{3}-\d{6}$/)]],
      additionalComments: [''],
      declarationConfirmed: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() {}

  setStep(step: 1 | 2 | 3) {
    if (this.canProceedToStep(step)) {
      this.activeStep = step;
    }
  }

  canProceedToStep(step: 1 | 2 | 3): boolean {
    if (step === 1) return true;
    if (step === 2) {
      // Can proceed if step 1 is "complete" (always true for VAT review)
      return true;
    }
    if (step === 3) {
      // Can proceed if step 2 compliance form is valid
      return this.complianceForm.valid;
    }
    return false;
  }

  isStepActive(step: number): boolean {
    return this.activeStep === step;
  }

  isStepCompleted(step: number): boolean {
    return this.completedSteps.has(step);
  }

  getComplianceIcon(status: string): string {
    switch (status) {
      case 'passed':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'failed':
        return 'cancel';
      default:
        return 'info';
    }
  }

  proceedToStep2() {
    this.completedSteps.add(1);
    this.activeStep = 2;
  }

  proceedToStep3() {
    if (this.complianceForm.valid) {
      this.completedSteps.add(2);
      this.activeStep = 3;
    }
  }

  goBack() {
    if (this.activeStep > 1) {
      this.activeStep = (this.activeStep - 1) as 1 | 2 | 3;
    }
  }

  submitVatReturn() {
    if (this.declarationForm.valid) {
      const submission: VatSubmission = {
        taxPeriod: this.vatCalculation.taxPeriod,
        pinNumber: this.vatCalculation.pinNumber,
        netVatDue: this.vatCalculation.netVatDue,
        authorizedPerson: this.declarationForm.get('authorizedPerson')?.value,
        positionTitle: this.declarationForm.get('positionTitle')?.value,
        contactNumber: this.declarationForm.get('contactNumber')?.value,
        additionalComments: this.declarationForm.get('additionalComments')?.value,
        declarationConfirmed: this.declarationForm.get('declarationConfirmed')?.value,
        taxPeriodStart: this.complianceForm.get('taxPeriodStart')?.value,
        taxPeriodEnd: this.complianceForm.get('taxPeriodEnd')?.value,
        submissionDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      };
      this.dialogRef.close(submission);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

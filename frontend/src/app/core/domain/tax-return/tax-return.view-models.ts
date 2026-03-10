// ---- List/Display View Models ----

export interface TaxReturnListItem {
  period: string;
  type: string;
  amount: number;
  status: 'Submitted' | 'Approved' | 'Pending';
  submitted: string;
  dueDate: string;
}

export interface ComplianceRequirement {
  name: string;
  status: 'Valid' | 'Pending Renewal' | 'Not Required';
  expiryDate: string;
  progress: number;
  icon: string;
}

export interface VATData {
  inputVAT: number;
  outputVAT: number;
  netVATDue: number;
  submissionStatus: string;
  submissionDueDate: string;
}

export interface MonthlyVATTrend {
  month: string;
  amount: number;
}

// ---- Form View Models ----

export interface VatCalculation {
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

export interface ComplianceCheck {
  id: string;
  title: string;
  description: string;
  status: 'passed' | 'warning' | 'failed';
}

export interface VatSubmission {
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

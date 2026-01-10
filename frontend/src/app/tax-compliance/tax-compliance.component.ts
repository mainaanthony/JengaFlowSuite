import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { ButtonSolidComponent } from '../shared/button-solid/button-solid.component';
import { CardComponent } from '../shared/card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

interface TaxReturn {
  period: string;
  type: string;
  amount: number;
  status: 'Submitted' | 'Approved' | 'Pending';
  submitted: string;
  dueDate: string;
}

interface ComplianceRequirement {
  name: string;
  status: 'Valid' | 'Pending Renewal' | 'Not Required';
  expiryDate: string;
  progress: number;
  icon: string;
}

interface VATData {
  inputVAT: number;
  outputVAT: number;
  netVATDue: number;
  submissionStatus: string;
  submissionDueDate: string;
}

interface MonthlyVATTrend {
  month: string;
  amount: number;
}

@Component({
  selector: 'tax-compliance',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    ButtonSolidComponent,
    CardComponent,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './tax-compliance.component.html',
  styleUrls: ['./tax-compliance.component.scss']
})
export class TaxComplianceComponent implements OnInit {
  activeTab: 'vat-management' | 'tax-returns' | 'compliance' = 'vat-management';

  stats = {
    currentVATDue: 'KES 156,250',
    complianceScore: 92,
    complianceScoreChange: 3,
    pendingReturns: 2,
    pendingReturnsChange: 1,
    annualTaxPaid: 'KES 2.4M',
    taxPaidChange: 5
  };

  vatData: VATData = {
    inputVAT: 142500,
    outputVAT: 298750,
    netVATDue: 156250,
    submissionStatus: 'Pending Submission',
    submissionDueDate: '2024-02-20'
  };

  monthlyVATTrend: MonthlyVATTrend[] = [
    { month: 'Dec 2023', amount: 125800 },
    { month: 'Nov 2023', amount: 98500 },
    { month: 'Oct 2023', amount: 142300 },
    { month: 'Sep 2023', amount: 156200 }
  ];

  taxReturns: TaxReturn[] = [
    {
      period: 'December 2023',
      type: 'VAT Return',
      amount: 125800,
      status: 'Submitted',
      submitted: '2024-01-18',
      dueDate: '2024-01-20'
    },
    {
      period: 'November 2023',
      type: 'VAT Return',
      amount: 98500,
      status: 'Approved',
      submitted: '2023-12-15',
      dueDate: '2023-12-20'
    },
    {
      period: 'Q4 2023',
      type: 'Income Tax',
      amount: 456000,
      status: 'Submitted',
      submitted: '2024-01-25',
      dueDate: '2024-01-31'
    }
  ];

  complianceRequirements: ComplianceRequirement[] = [
    {
      name: 'VAT Registration Certificate',
      status: 'Valid',
      expiryDate: '2024-12-31',
      progress: 100,
      icon: 'check_circle'
    },
    {
      name: 'Business License',
      status: 'Valid',
      expiryDate: '2024-06-30',
      progress: 100,
      icon: 'check_circle'
    },
    {
      name: 'Fire Safety Certificate',
      status: 'Pending Renewal',
      expiryDate: '2024-02-15',
      progress: 65,
      icon: 'warning'
    },
    {
      name: 'Environmental Impact Assessment',
      status: 'Not Required',
      expiryDate: '',
      progress: 0,
      icon: 'info'
    }
  ];

  ngOnInit() {
    // Component initialized
  }

  setTab(tab: 'vat-management' | 'tax-returns' | 'compliance') {
    this.activeTab = tab;
  }

  exportForKRA() {
    console.log('Export data for KRA');
  }

  generateReport() {
    console.log('Generate compliance report');
  }

  submitVATReturn() {
    console.log('Submit VAT return');
  }

  previewReturn() {
    console.log('Preview return');
  }

  downloadReturn() {
    console.log('Download return');
  }

  fileVATReturn() {
    console.log('File VAT return');
  }

  calculateWHT() {
    console.log('Calculate WHT');
  }

  runComplianceCheck() {
    console.log('Run compliance check');
  }

  downloadDocument(item: TaxReturn | ComplianceRequirement) {
    console.log('Download document:', item);
  }

  renewCertificate(requirement: ComplianceRequirement) {
    console.log('Renew certificate:', requirement);
  }

  viewDocument(requirement: ComplianceRequirement) {
    console.log('View document:', requirement);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  getComplianceStatusColor(status: string): string {
    switch (status) {
      case 'Valid':
        return '#4caf50';
      case 'Pending Renewal':
        return '#ff9800';
      case 'Not Required':
        return '#9e9e9e';
      default:
        return '#999';
    }
  }
}

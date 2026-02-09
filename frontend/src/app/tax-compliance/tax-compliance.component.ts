import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { ButtonSolidComponent } from '../shared/button-solid/button-solid.component';
import { CardComponent } from '../shared/card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { SubmitVatModalComponent } from './submit-vat-modal/submit-vat-modal.component';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  TaxReturnRepository,
  SaleRepository,
  TaxReturn as DomainTaxReturn,
  Sale as DomainSale
} from '../core/domain/domain.barrel';

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
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './tax-compliance.component.html',
  styleUrls: ['./tax-compliance.component.scss']
})
export class TaxComplianceComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  activeTab: 'vat-management' | 'tax-returns' | 'compliance' = 'vat-management';
  loading = false;

  constructor(
    private dialog: MatDialog,
    private taxReturnRepository: TaxReturnRepository,
    private saleRepository: SaleRepository
  ) {}

  stats = {
    currentVATDue: 'KES 0',
    complianceScore: 0,
    complianceScoreChange: 0,
    pendingReturns: 0,
    pendingReturnsChange: 0,
    annualTaxPaid: 'KES 0',
    taxPaidChange: 0
  };

  vatData: VATData = {
    inputVAT: 0,
    outputVAT: 0,
    netVATDue: 0,
    submissionStatus: 'Not Submitted',
    submissionDueDate: ''
  };

  monthlyVATTrend: MonthlyVATTrend[] = [];
  taxReturns: TaxReturn[] = [];
  complianceRequirements: ComplianceRequirement[] = [];

  ngOnInit() {
    this.loadTaxData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTaxData() {
    this.loading = true;
    
    forkJoin({
      taxReturns: this.taxReturnRepository.getAll(),
      sales: this.saleRepository.getAll()
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ taxReturns, sales }) => {
        this.processTaxData(taxReturns, sales);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tax data:', err);
        this.loading = false;
      }
    });
  }

  private processTaxData(taxReturns: DomainTaxReturn[], sales: DomainSale[]) {
    // Calculate VAT from sales (16% VAT rate in Kenya)
    const VATRate = 0.16;
    const totalSales = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    const outputVAT = totalSales * VATRate;
    
    // Input VAT would come from purchase orders - placeholder for now
    const inputVAT = 0;
    const netVATDue = outputVAT - inputVAT;
    
    this.vatData = {
      inputVAT,
      outputVAT,
      netVATDue,
      submissionStatus: netVATDue > 0 ? 'Pending Submission' : 'Not Required',
      submissionDueDate: this.getNextVATDueDate()
    };
    
    // Map tax returns
    this.taxReturns = taxReturns.map(tr => ({
      period: tr.period,
      type: tr.taxType || 'VAT Return',
      amount: tr.amount,
      status: this.mapTaxStatus(tr.status),
      submitted: tr.submittedDate ? new Date(tr.submittedDate).toLocaleDateString() : 'N/A',
      dueDate: tr.dueDate ? new Date(tr.dueDate).toLocaleDateString() : 'N/A'
    }));
    
    // Calculate monthly VAT trend (last 4 months)
    this.calculateMonthlyVATTrend(sales);
    
    // Update stats
    const pendingReturns = this.taxReturns.filter(tr => tr.status === 'Pending').length;
    const annualTaxPaid = taxReturns
      .filter(tr => tr.status === 'Approved' || tr.status === 'Paid')
      .reduce((sum, tr) => sum + (tr.amount || 0), 0);
    
    this.stats = {
      currentVATDue: `KES ${Math.round(netVATDue).toLocaleString()}`,
      complianceScore: this.calculateComplianceScore(taxReturns),
      complianceScoreChange: 0,
      pendingReturns,
      pendingReturnsChange: 0,
      annualTaxPaid: `KES ${annualTaxPaid.toLocaleString()}`,
      taxPaidChange: 0
    };
    
    // Initialize compliance requirements (static for now)
    this.initializeComplianceRequirements();
  }

  private mapTaxStatus(status: string): 'Submitted' | 'Approved' | 'Pending' {
    const statusMap: { [key: string]: 'Submitted' | 'Approved' | 'Pending' } = {
      'SUBMITTED': 'Submitted',
      'APPROVED': 'Approved',
      'PENDING': 'Pending'
    };
    return statusMap[status?.toUpperCase()] || 'Pending';
  }

  private getNextVATDueDate(): string {
    // VAT is due on the 20th of each month
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 20);
    return nextMonth.toLocaleDateString();
  }

  private calculateMonthlyVATTrend(sales: DomainSale[]) {
    const VATRate = 0.16;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    
    // Get last 4 months
    for (let i = 3; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthSales = sales.filter(sale => {
        const saleDate = new Date(sale.saleDate);
        return saleDate.getMonth() === month.getMonth() && 
               saleDate.getFullYear() === month.getFullYear();
      });
      
      const monthTotal = monthSales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
      const monthVAT = monthTotal * VATRate;
      
      this.monthlyVATTrend.push({
        month: `${months[month.getMonth()]} ${month.getFullYear()}`,
        amount: Math.round(monthVAT)
      });
    }
  }

  private calculateComplianceScore(taxReturns: DomainTaxReturn[]): number {
    if (taxReturns.length === 0) return 0;
    
    const onTimeReturns = taxReturns.filter(tr => {
      if (!tr.submittedDate || !tr.dueDate) return false;
      return new Date(tr.submittedDate) <= new Date(tr.dueDate);
    }).length;
    
    return Math.round((onTimeReturns / taxReturns.length) * 100);
  }

  private initializeComplianceRequirements() {
    // Static compliance requirements (would be dynamic in production)
    this.complianceRequirements = [
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
      }
    ];
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
    const dialogRef = this.dialog.open(SubmitVatModalComponent, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('VAT return submitted:', result);
        // Handle the VAT submission (e.g., save to backend, update UI)
        // In a real scenario, this would call a backend service to submit to KRA
      }
    });
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

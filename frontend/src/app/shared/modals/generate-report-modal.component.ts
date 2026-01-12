import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

interface Branch {
  id: string;
  name: string;
}

@Component({
  selector: 'app-generate-report-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './generate-report-modal.component.html',
  styleUrls: ['./generate-report-modal.component.scss']
})
export class GenerateReportModalComponent implements OnInit {
  currentStep: 1 | 2 | 3 = 1;
  selectedReportType: string = '';

  // Step 1: Report Type Selection
  reportTypes: ReportType[] = [
    {
      id: 'sales',
      name: 'Sales Report',
      description: 'Comprehensive sales performance analysis',
      icon: 'trending_up',
      features: ['Revenue breakdown', 'Product performance', 'Customer analysis', 'Payment trends']
    },
    {
      id: 'inventory',
      name: 'Inventory Report',
      description: 'Stock levels, movements, and valuation',
      icon: 'inventory_2',
      features: ['Stock levels', 'Low stock alerts', 'Inventory valuation', 'Movement history']
    },
    {
      id: 'procurement',
      name: 'Procurement Report',
      description: 'Purchase orders and supplier performance',
      icon: 'shopping_cart',
      features: ['PO analysis', 'Supplier performance', 'Cost analysis', 'Delivery tracking']
    },
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'Revenue, expenses, and profit analysis',
      icon: 'bar_chart',
      features: ['P&L statements', 'Cash flow', 'Tax reports', 'Budget variance']
    },
    {
      id: 'operational',
      name: 'Operational Report',
      description: 'Delivery, staff, and branch performance',
      icon: 'local_shipping',
      features: ['Delivery metrics', 'Staff performance', 'Branch comparison', 'Efficiency analysis']
    },
    {
      id: 'customer',
      name: 'Customer Report',
      description: 'Customer behavior and loyalty analysis',
      icon: 'group',
      features: ['Customer segmentation', 'Purchase patterns', 'Loyalty metrics', 'Credit analysis']
    }
  ];

  // Step 2: Filters & Options
  timePeriod = 'Last 30 days';
  timePeriods = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 6 months', 'Last year'];

  branches: Branch[] = [
    { id: '1', name: 'Main Store' },
    { id: '2', name: 'Westlands Branch' },
    { id: '3', name: 'Eastlands Branch' },
    { id: '4', name: 'Industrial Area' }
  ];

  selectedBranches: string[] = [];

  reportFormat = 'PDF';
  reportFormats = ['PDF', 'Excel', 'CSV'];

  groupBy = 'Date';
  groupByOptions = ['Date', 'Product', 'Category', 'Branch', 'Customer'];

  sortBy = 'Date (Newest first)';
  sortByOptions = ['Date (Newest first)', 'Date (Oldest first)', 'Amount (Highest)', 'Amount (Lowest)', 'Name (A-Z)'];

  includeExecutiveSummary = true;
  includeChartsGraphs = true;
  includeDetailedData = true;

  // Step 3: Delivery & Scheduling
  reportTitle = '';
  reportDescription = '';
  emailRecipients = 'email1@company.com, email2@company.com';
  saveToLibrary = true;
  scheduleAutomaticGeneration = false;

  // Report Preview
  reportPreview = {
    type: 'Customer Report',
    dateRange: 'Last 30 days',
    branches: 'All branches',
    format: 'PDF',
    estimatedSize: 'Based on your filters: ~2.4 MB (PDF)'
  };

  constructor(
    public dialogRef: MatDialogRef<GenerateReportModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeFormData();
  }

  initializeFormData(): void {
    // Pre-fill if data is passed
    if (this.data) {
      this.selectedReportType = this.data.reportType || '';
      this.reportTitle = `${this.getReportTypeName(this.selectedReportType)} - ${new Date().toLocaleDateString('en-US')}`;
    }
  }

  selectReportType(reportId: string): void {
    this.selectedReportType = reportId;
  }

  getReportTypeName(id: string): string {
    const report = this.reportTypes.find(r => r.id === id);
    return report ? report.name : '';
  }

  getSelectedReport(): ReportType | undefined {
    return this.reportTypes.find(r => r.id === this.selectedReportType);
  }

  toggleBranch(branchId: string): void {
    const index = this.selectedBranches.indexOf(branchId);
    if (index > -1) {
      this.selectedBranches.splice(index, 1);
    } else {
      this.selectedBranches.push(branchId);
    }
    this.updateReportPreview();
  }

  isBranchSelected(branchId: string): boolean {
    return this.selectedBranches.includes(branchId);
  }

  selectAllBranches(): void {
    this.selectedBranches = this.branches.map(b => b.id);
    this.updateReportPreview();
  }

  goToStep(step: 1 | 2 | 3): void {
    if (step < this.currentStep || this.isStepValid(this.currentStep)) {
      this.currentStep = step;
      this.updateReportPreview();
    }
  }

  nextStep(): void {
    if (this.currentStep < 3 && this.isStepValid(this.currentStep)) {
      this.currentStep = (this.currentStep + 1) as 1 | 2 | 3;
      this.updateReportPreview();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep = (this.currentStep - 1) as 1 | 2 | 3;
    }
  }

  isStepValid(step: number): boolean {
    if (step === 1) {
      return this.selectedReportType !== '';
    }
    if (step === 2) {
      return this.selectedBranches.length > 0 || true; // Optional
    }
    return true;
  }

  updateReportPreview(): void {
    const branchesText = this.selectedBranches.length === 0 
      ? 'All branches' 
      : this.selectedBranches.length === this.branches.length 
        ? 'All branches' 
        : `${this.selectedBranches.length} selected`;

    this.reportPreview = {
      type: this.getReportTypeName(this.selectedReportType),
      dateRange: this.timePeriod,
      branches: branchesText,
      format: this.reportFormat,
      estimatedSize: 'Based on your filters: ~2.4 MB (PDF)'
    };
  }

  previewReport(): void {
    console.log('Opening report preview...');
    alert('Report preview would open in a new window');
  }

  generateReport(): void {
    if (!this.selectedReportType) {
      alert('Please select a report type');
      return;
    }

    const reportData = {
      type: this.selectedReportType,
      title: this.reportTitle,
      description: this.reportDescription,
      timePeriod: this.timePeriod,
      branches: this.selectedBranches.length === 0 ? this.branches.map(b => b.id) : this.selectedBranches,
      format: this.reportFormat,
      groupBy: this.groupBy,
      sortBy: this.sortBy,
      includeExecutiveSummary: this.includeExecutiveSummary,
      includeChartsGraphs: this.includeChartsGraphs,
      includeDetailedData: this.includeDetailedData,
      emailRecipients: this.emailRecipients.split(',').map(e => e.trim()),
      saveToLibrary: this.saveToLibrary,
      scheduleAutomaticGeneration: this.scheduleAutomaticGeneration,
      generatedAt: new Date().toISOString()
    };

    console.log('Generating report with data:', reportData);
    this.dialogRef.close(reportData);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getStepClass(step: number): string {
    return this.currentStep === step ? 'active' : this.currentStep > step ? 'completed' : '';
  }
}

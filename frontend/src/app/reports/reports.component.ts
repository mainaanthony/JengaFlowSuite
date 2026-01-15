import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CardComponent } from '../shared/card/card.component';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { ButtonSolidComponent } from '../shared/button-solid/button-solid.component';
import { GenerateReportModalComponent } from '../shared/modals/generate-report-modal.component';

// Data Models
interface ReportMetric {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
}

interface TopProduct {
  name: string;
  units: number;
  margin: number;
  revenue: number;
}

interface BranchPerformance {
  branch: string;
  orders: number;
  revenue: number;
  delta: string;
  deltaType: 'positive' | 'negative';
}

interface InventoryMetric {
  label: string;
  value: number | string;
  status: 'healthy' | 'warning' | 'critical';
}

interface FinancialStatement {
  label: string;
  value: number;
}

interface CashFlowData {
  type: 'inflow' | 'outflow' | 'net';
  label: string;
  value: number;
}

interface KeyRatio {
  label: string;
  value: string | number;
}

interface StockMovement {
  title: string;
  description: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    StatCardComponent,
    ButtonSolidComponent
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  // Active tab tracking
  activeTab: string = 'sales-analytics';
  activeReportTab: string = 'financial-reports';
  selectedMonth: string = 'This Month';

  // Stat cards data
  stats = {
    totalRevenue: 'KES 4.2M',
    totalRevenueChange: '+12.5%',
    grossProfit: 'KES 1.8M',
    grossProfitChange: '+8.2%',
    unitsSold: 15234,
    unitsSoldChange: '-2.1%',
    avgOrderValue: 'KES 2,750',
    avgOrderValueChange: '+15.3%'
  };

  // Sales Analytics Tab
  topProducts: TopProduct[] = [
    { name: '25mm PVC Pipes', units: 1250, margin: 35, revenue: 156000 },
    { name: 'Wood Screws 2in', units: 980, margin: 28, revenue: 98000 },
    { name: 'Paint Brushes Set', units: 750, margin: 45, revenue: 112500 },
    { name: 'Cement Bags', units: 650, margin: 18, revenue: 325000 },
    { name: 'Electrical Cables', units: 520, margin: 32, revenue: 208000 }
  ];

  branchPerformance: BranchPerformance[] = [
    { branch: 'Main Branch', orders: 456, revenue: 1800000, delta: '+15%', deltaType: 'positive' },
    { branch: 'Westlands', orders: 312, revenue: 1200000, delta: '+8%', deltaType: 'positive' },
    { branch: 'Eastleigh', orders: 245, revenue: 900000, delta: '+22%', deltaType: 'positive' },
    { branch: 'Industrial Area', orders: 156, revenue: 500000, delta: '-5%', deltaType: 'negative' }
  ];

  // Inventory Reports Tab
  inventoryHealth: InventoryMetric[] = [
    { label: 'Total Stock Value', value: 'KES 8.5M', status: 'healthy' },
    { label: 'Low Stock Items', value: 23, status: 'warning' },
    { label: 'Out of Stock', value: 7, status: 'critical' },
    { label: 'Turnover Rate', value: '6.2x', status: 'healthy' }
  ];

  stockMovement: StockMovement = {
    title: 'Stock Movement Analysis',
    description: 'Visual analysis of inventory flow, restocking patterns, and seasonal trends'
  };

  // Financial Reports Tab
  pnlStatement: FinancialStatement[] = [
    { label: 'Revenue', value: 4200000 },
    { label: 'COGS', value: 2400000 },
    { label: 'Gross Profit', value: 1800000 }
  ];

  cashFlow: CashFlowData[] = [
    { type: 'inflow', label: 'Inflow', value: 3800000 },
    { type: 'outflow', label: 'Outflow', value: 2100000 },
    { type: 'net', label: 'Net Flow', value: 1700000 }
  ];

  keyRatios: KeyRatio[] = [
    { label: 'Gross Margin', value: '42.8%' },
    { label: 'Inventory Turnover', value: '6.2x' },
    { label: 'ROI', value: '28.5%' }
  ];

  // Custom Reports Tab
  isCustomReportOpen: boolean = false;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    // Component initialized
  }

  // Tab switching methods
  setTab(tab: string) {
    this.activeTab = tab;
  }

  setReportTab(tab: string) {
    this.activeReportTab = tab;
  }

  // Report generation methods
  exportData() {
    console.log('Exporting data for current month...');
    // Implementation for data export
  }

  generateReport() {
    const dialogRef = this.dialog.open(GenerateReportModalComponent, {
      width: '900px',
      maxWidth: '90vw',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Report generated with data:', result);
        alert(`Report "${result.title}" generated successfully!`);
      }
    });
  }

  downloadReport() {
    console.log('Downloading report...');
    // Implementation for report download
  }

  viewAnalytics() {
    console.log('Viewing detailed analytics...');
    // Implementation for detailed analytics view
  }

  createReport() {
    console.log('Creating custom report...');
    this.isCustomReportOpen = !this.isCustomReportOpen;
  }

  scheduleReport() {
    console.log('Scheduling report...');
    // Implementation for report scheduling
  }

  // Utility methods
  getStatusClass(status: string): string {
    return status.toLowerCase().replaceAll(/\s+/g, '-');
  }

  getDeltaClass(deltaType: string): string {
    return deltaType;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(value);
  }

  getMarginColor(margin: number): string {
    if (margin >= 40) return '#28a745';
    if (margin >= 25) return '#17a2b8';
    return '#ffc107';
  }

  getRevenueColor(value: number): string {
    if (value >= 1000000) return '#1976d2';
    return '#757575';
  }
}

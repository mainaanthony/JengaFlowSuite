import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { ButtonSolidComponent } from '../shared/button-solid/button-solid.component';
import { CardComponent } from '../shared/card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { GenerateReportModalComponent } from '../shared/modals/generate-report-modal.component';

interface PurchaseOrder {
  id: string;
  supplier: string;
  amount: number;
  status: string;
  date: string;
}

interface LowStockItem {
  name: string;
  current: number;
  total: number;
  branch: string;
}

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    StatCardComponent,
    ButtonSolidComponent,
    CardComponent,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  purchaseOrders: PurchaseOrder[] = [
    { id: 'PO-2024-001', supplier: 'ABC Hardware Suppliers', amount: 45600, status: 'Pending', date: '2024-01-15' },
    { id: 'PO-2024-002', supplier: 'XYZ Supply Co', amount: 32400, status: 'Approved', date: '2024-01-14' }
  ];

  lowStockItems: LowStockItem[] = [
    { name: '25mm PVC Pipes', current: 5, total: 20, branch: 'Main Branch' },
    { name: 'Wood Screws 2in', current: 8, total: 25, branch: 'Main Branch' }
  ];

  stats = {
    totalRevenue: 'KES 2,847,000',
    revenueChange: 12.3,
    productsInStock: '1,247',
    productsChange: -3.2,
    ordersToday: 23,
    ordersChange: 8.1,
    lowStockItems: 12,
    lowStockChange: 4
  };

  ngOnInit() {
    // Component initialized, data ready
  }

  onSearch(query: string) {
    console.log('Search query:', query);
  }

  generateReport() {
    const dialogRef = this.dialog.open(GenerateReportModalComponent, {
      width: '900px',
      maxWidth: '90vw',
      disableClose: false,
      data: { reportType: 'sales' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Report generated with data:', result);
        alert(`Report "${result.title}" generated successfully!`);
      }
    });
  }

  newSale() {
    console.log('New Sale clicked');
  }

  addProduct() {
    console.log('Add Product clicked');
  }

  createPO() {
    console.log('Create PO clicked');
  }

  addUser() {
    console.log('Add User clicked');
  }
}

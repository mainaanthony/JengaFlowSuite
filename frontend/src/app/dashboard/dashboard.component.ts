import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { ButtonSolidComponent } from '../shared/button-solid/button-solid.component';
import { CardComponent } from '../shared/card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { GenerateReportModalComponent } from '../shared/modals/generate-report-modal.component';
import { NewSaleModalComponent } from '../sales/new-sale-modal/new-sale-modal.component';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { 
  ProductRepository, 
  SaleRepository, 
  PurchaseOrderRepository,
  Product as DomainProduct,
  Sale as DomainSale,
  PurchaseOrder as DomainPurchaseOrder
} from '../core/domain/domain.barrel';
import { CreatePOModalComponent } from '../procurement/create-po-modal/create-po-modal.component';
import { AddUserModalComponent } from '../users/add-user-modal/add-user-modal.component';

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
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  loading = false;

  constructor(
    private dialog: MatDialog,
    private productRepository: ProductRepository,
    private saleRepository: SaleRepository,
    private purchaseOrderRepository: PurchaseOrderRepository
  ) {}

  purchaseOrders: PurchaseOrder[] = [];
  lowStockItems: LowStockItem[] = [];

  stats = {
    totalRevenue: 'KES 0',
    revenueChange: 0,
    productsInStock: '0',
    productsChange: 0,
    ordersToday: 0,
    ordersChange: 0,
    lowStockItems: 0,
    lowStockChange: 0
  };

  ngOnInit() {
    this.loadDashboardData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData() {
    this.loading = true;
    
    forkJoin({
      products: this.productRepository.getAll(),
      sales: this.saleRepository.getAll(),
      purchaseOrders: this.purchaseOrderRepository.getAll()
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ products, sales, purchaseOrders }) => {
        this.processDashboardData(products, sales, purchaseOrders);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.loading = false;
      }
    });
  }

  private processDashboardData(
    products: DomainProduct[], 
    sales: DomainSale[], 
    purchaseOrders: DomainPurchaseOrder[]
  ) {
    // Calculate total revenue from sales
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    
    // Count products in stock
    const productsInStock = products.length;
    
    // Count today's orders (sales)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ordersToday = sales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === today.getTime();
    }).length;
    
    // Count low stock items (would need inventory data)
    const lowStockCount = 0; // TODO: Calculate from inventory records when available
    
    // Map recent purchase orders
    this.purchaseOrders = purchaseOrders
      .slice(0, 5)
      .map(po => ({
        id: po.poNumber,
        supplier: po.supplier?.name || 'N/A',
        amount: po.totalAmount,
        status: po.status,
        date: new Date(po.expectedDeliveryDate).toLocaleDateString()
      }));
    
    // Update stats
    this.stats = {
      totalRevenue: `KES ${totalRevenue.toLocaleString()}`,
      revenueChange: 0, // TODO: Calculate compared to previous period
      productsInStock: productsInStock.toString(),
      productsChange: 0, // TODO: Calculate compared to previous period
      ordersToday,
      ordersChange: 0, // TODO: Calculate compared to yesterday
      lowStockItems: lowStockCount,
      lowStockChange: 0 // TODO: Calculate change
    };
    
    // Low stock items placeholder
    this.lowStockItems = [];
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
      }
    });
  }

  newSale() {
    const dialogRef = this.dialog.open(NewSaleModalComponent, {
      width: '1200px',
      maxWidth: '95vw',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Sale completed:', result);
        this.loadDashboardData(); // Reload data after sale
      }
    });
  }

  addProduct() {
    // Navigate to inventory page or open add product modal
    console.log('Add Product clicked - Navigate to inventory');
  }

  createPO() {
    const dialogRef = this.dialog.open(CreatePOModalComponent, {
      width: '1200px',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboardData(); // Reload data after creating PO
      }
    });
  }

  addUser() {
    const dialogRef = this.dialog.open(AddUserModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User added:', result);
      }
    });
  }
}

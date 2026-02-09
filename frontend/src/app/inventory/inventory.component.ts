import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { ButtonSolidComponent } from '../shared/button-solid/button-solid.component';
import { CardComponent } from '../shared/card/card.component';
import { AppTableComponent, ColumnConfig, TableAction, TableActionEvent } from '../shared/app-table/app-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { AddProductModalComponent } from '../shared/modals/add-product-modal.component';
import { ProductRepository, Product as DomainProduct } from '../core/domain/domain.barrel';

interface Product {
  id: string;
  name: string;
  brand: string;
  sku: string;
  category: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  main: number;
  westlands: number;
  eastleigh: number;
  total: number;
  price: number;
}

@Component({
  selector: 'inventory',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    ButtonSolidComponent,
    CardComponent,
    AppTableComponent,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  searchControl = new FormControl('');
  loading = false;

  // Table configuration
  productColumns: ColumnConfig[] = [];
  productActions: TableAction[] = [];

  constructor(
    private dialog: MatDialog,
    private productRepository: ProductRepository
  ) {
    this.initializeTableConfig();
  }

  stats = {
    totalProducts: '0',
    productsChange: 0,
    lowStockItems: 0,
    lowStockChange: 0,
    totalValue: 'KES 0',
    valueChange: 0,
    categories: '0',
    categoriesChange: 0
  };

  products: Product[] = [];


  // products: Product[] = [
  //   {
  //     id: '1',
  //     name: '25mm PVC Pipes',
  //     brand: 'Kenpipe',
  //     sku: 'KP-PVC-25-6M',
  //     category: 'Plumbing',
  //     status: 'In Stock',
  //     main: 5,
  //     westlands: 12,
  //     eastleigh: 8,
  //     total: 25,
  //     price: 850
  //   },
  //   {
  //     id: '2',
  //     name: 'Wood Screws 2 inch',
  //     brand: 'ProFix',
  //     sku: 'PF-WS-2IN-100',
  //     category: 'Fasteners',
  //     status: 'In Stock',
  //     main: 45,
  //     westlands: 12,
  //     eastleigh: 23,
  //     total: 80,
  //     price: 25
  //   },
  //   {
  //     id: '3',
  //     name: 'Paint Brushes Set',
  //     brand: 'Crown',
  //     sku: 'CR-PB-SET-4',
  //     category: 'Painting',
  //     status: 'In Stock',
  //     main: 3,
  //     westlands: 18,
  //     eastleigh: 7,
  //     total: 28,
  //     price: 1200
  //   },
  //   {
  //     id: '4',
  //     name: 'Cement 50kg Bags',
  //     brand: 'Bamburi',
  //     sku: 'BAM-CEM-50KG',
  //     category: 'Building Materials',
  //     status: 'In Stock',
  //     main: 125,
  //     westlands: 89,
  //     eastleigh: 8,
  //     total: 222,
  //     price: 780
  //   }
  // ];
  filteredProducts: Product[] = [];

  ngOnInit() {
    this.loadProducts();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    this.loading = true;
    this.productRepository.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products: DomainProduct[]) => {
          this.products = products.map(p => this.mapDomainProductToUIProduct(p));
          this.filteredProducts = [...this.products];
          this.updateStats();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.loading = false;
        }
      });
  }

  mapDomainProductToUIProduct(product: DomainProduct): Product {
    // TODO: Get inventory counts from inventory records
    return {
      id: product.id.toString(),
      name: product.name,
      brand: product.brand || '',
      sku: product.sku,
      category: product.category?.name || 'N/A',
      status: this.getStockStatus(0), // TODO: Calculate from inventory
      main: 0,
      westlands: 0,
      eastleigh: 0,
      total: 0,
      price: product.price
    };
  }

  getStockStatus(total: number): 'In Stock' | 'Low Stock' | 'Out of Stock' {
    if (total === 0) return 'Out of Stock';
    if (total < 10) return 'Low Stock';
    return 'In Stock';
  }

  updateStats() {
    const totalProducts = this.products.length;
    const lowStockItems = this.products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock').length;
    const totalValue = this.products.reduce((sum, p) => sum + (p.price * p.total), 0);
    const categories = new Set(this.products.map(p => p.category)).size;

    this.stats = {
      totalProducts: totalProducts.toString(),
      productsChange: 0,
      lowStockItems: lowStockItems,
      lowStockChange: 0,
      totalValue: `KES ${(totalValue / 1000).toFixed(1)}K`,
      valueChange: 0,
      categories: categories.toString(),
      categoriesChange: 0
    };
  }

  initializeTableConfig(): void {
    // Define table columns
    this.productColumns = [
      {
        key: 'name',
        label: 'Product',
        width: '220px',
        type: 'text',
        subText: 'brand'
      },
      {
        key: 'sku',
        label: 'SKU',
        width: '140px',
        type: 'text'
      },
      {
        key: 'category',
        label: 'Category',
        width: '150px',
        type: 'text'
      },
      {
        key: 'status',
        label: 'Stock Status',
        width: '130px',
        type: 'enum',
        enumValues: [
          { value: 'In Stock', label: 'In Stock', color: '#10b981' },
          { value: 'Low Stock', label: 'Low Stock', color: '#f59e0b' },
          { value: 'Out of Stock', label: 'Out of Stock', color: '#ef4444' }
        ]
      },
      {
        key: 'main',
        label: 'Main',
        width: '80px',
        type: 'number'
      },
      {
        key: 'westlands',
        label: 'Westlands',
        width: '100px',
        type: 'number'
      },
      {
        key: 'eastleigh',
        label: 'Eastleigh',
        width: '100px',
        type: 'number'
      },
      {
        key: 'total',
        label: 'Total',
        width: '80px',
        type: 'number'
      },
      {
        key: 'price',
        label: 'Price',
        width: '120px',
        type: 'currency'
      }
    ];

    // Define table actions
    this.productActions = [
      { id: 'edit', label: 'Edit Product', icon: 'edit', color: 'primary' },
      { id: 'delete', label: 'Delete Product', icon: 'delete', color: 'warn' }
    ];
  }

  onTableAction(event: TableActionEvent): void {
    const product = event.row as Product;
    switch (event.action) {
      case 'edit':
        this.editProduct(product);
        break;
      case 'delete':
        this.deleteProduct(product);
        break;
    }
  }

  onTableSearch(searchTerm: string): void {
    this.searchControl.setValue(searchTerm);
  }

  onFilter(): void {
    console.log('Filter clicked');
  }

  setupSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(query => {
        this.onSearch(query || '');
      });
  }

  onSearch(query: string) {
    if (!query.trim()) {
      this.filteredProducts = this.products;
    } else {
      const lowerQuery = query.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.sku.toLowerCase().includes(lowerQuery) ||
        product.brand.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
      );
    }
  }

  exportData() {
    console.log('Export inventory data');
  }

  scanProduct() {
    console.log('Open product scanner');
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddProductModalComponent, {
      width: '1100px',
      maxWidth: '95vw',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts(); // Reload products after adding
      }
    });
  }

  editProduct(product: Product) {
    // Extract product ID from display format (PRD-001 -> 1)
    const productId = product.id.replace('PRD-', '');
    
    this.productRepository.get(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (domainProduct: DomainProduct) => {
          const dialogRef = this.dialog.open(AddProductModalComponent, {
            width: '1100px',
            maxWidth: '95vw',
            disableClose: false,
            data: { product: domainProduct } // Pass product data for editing
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.loadProducts(); // Reload products after editing
            }
          });
        },
        error: (error: any) => {
          console.error('Error loading product for edit:', error);
        }
      });
  }

  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete product ${product.name}?`)) {
      // Extract product ID from display format (PRD-001 -> 1)
      const productId = product.id.replace('PRD-', '');
      
      this.productRepository.delete(productId, { description: `Deleted product ${product.name}` })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log(`Product ${product.name} deleted successfully`);
            this.loadProducts(); // Reload products after deletion
          },
          error: (error: any) => {
            console.error('Error deleting product:', error);
          }
        });
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }
}

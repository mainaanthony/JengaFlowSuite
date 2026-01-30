import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { ButtonSolidComponent } from '../shared/button-solid/button-solid.component';
import { CardComponent } from '../shared/card/card.component';
import { AppTableComponent, ColumnConfig, TableAction, TableActionEvent } from '../shared/app-table/app-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { AddProductModalComponent } from '../shared/modals/add-product-modal.component';

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
export class InventoryComponent implements OnInit {
  searchControl = new FormControl('');

  // Table configuration
  productColumns: ColumnConfig[] = [];
  productActions: TableAction[] = [];

  constructor(private dialog: MatDialog) {
    this.initializeTableConfig();
  }

  stats = {
    totalProducts: '1,247',
    productsChange: 12,
    lowStockItems: 12,
    lowStockChange: 4,
    totalValue: 'KES 2.8M',
    valueChange: 8.5,
    categories: '24',
    categoriesChange: 2
  };

  products: Product[] = [
    {
      id: '1',
      name: '25mm PVC Pipes',
      brand: 'Kenpipe',
      sku: 'KP-PVC-25-6M',
      category: 'Plumbing',
      status: 'In Stock',
      main: 5,
      westlands: 12,
      eastleigh: 8,
      total: 25,
      price: 850
    },
    {
      id: '2',
      name: 'Wood Screws 2 inch',
      brand: 'ProFix',
      sku: 'PF-WS-2IN-100',
      category: 'Fasteners',
      status: 'In Stock',
      main: 45,
      westlands: 12,
      eastleigh: 23,
      total: 80,
      price: 25
    },
    {
      id: '3',
      name: 'Paint Brushes Set',
      brand: 'Crown',
      sku: 'CR-PB-SET-4',
      category: 'Painting',
      status: 'In Stock',
      main: 3,
      westlands: 18,
      eastleigh: 7,
      total: 28,
      price: 1200
    },
    {
      id: '4',
      name: 'Cement 50kg Bags',
      brand: 'Bamburi',
      sku: 'BAM-CEM-50KG',
      category: 'Building Materials',
      status: 'In Stock',
      main: 125,
      westlands: 89,
      eastleigh: 8,
      total: 222,
      price: 780
    }
  ];

  filteredProducts: Product[] = [];

  ngOnInit() {
    this.filteredProducts = this.products;
    this.setupSearch();
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
        console.log('Product added/saved:', result);
        alert(`Product "${result.name}" ${result.isDraft ? 'saved as draft' : 'added'} successfully!`);
        // TODO: Add product to inventory list
      }
    });
  }

  editProduct(product: Product) {
    console.log('Edit product:', product);
  }

  deleteProduct(product: Product) {
    console.log('Delete product:', product);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }
}

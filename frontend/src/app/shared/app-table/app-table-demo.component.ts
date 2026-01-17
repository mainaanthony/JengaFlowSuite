import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppTableComponent, ColumnConfig, TableAction, TableActionEvent } from '../app-table/app-table.component';

interface Product {
  id: string;
  name: string;
  brand: string;
  sku: string;
  category: string;
  stockStatus: 'in-stock' | 'out-of-stock' | 'low-stock';
  main: number;
  westlands: number;
  eastleigh: number;
  total: number;
  price: number;
}

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, AppTableComponent],
  template: `
    <div class="demo-container">
      <div class="demo-header">
        <h1>Product Inventory</h1>
        <p>Manage and track your product stock levels</p>
      </div>

      <app-table
        [columns]="columns"
        [rows]="products"
        [actions]="tableActions"
        [showSearch]="true"
        [showFilter]="true"
        searchPlaceholder="Search products..."
        (actionTriggered)="onTableAction($event)"
        (searchChanged)="onSearch($event)"
        (filterClicked)="onFilter()"
      ></app-table>

      <div class="demo-info">
        <p>Last action: <strong>{{ lastAction || 'None' }}</strong></p>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      background-color: #f8f9fa;
      min-height: 100vh;
    }

    .demo-header {
      margin-bottom: 2rem;

      h1 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 28px;
      }

      p {
        margin: 0;
        color: #999;
        font-size: 14px;
      }
    }

    .demo-info {
      margin-top: 1.5rem;
      padding: 1rem;
      background-color: white;
      border-radius: 6px;
      border-left: 4px solid #1976d2;

      p {
        margin: 0;
        font-size: 14px;
        color: #666;
      }

      strong {
        color: #1976d2;
      }
    }
  `]
})
export class TableDemoComponent implements OnInit {
  columns: ColumnConfig[] = [
    {
      key: 'name',
      label: 'Product',
      width: '180px',
      subText: 'brand'
    },
    {
      key: 'sku',
      label: 'SKU',
      width: '120px'
    },
    {
      key: 'category',
      label: 'Category',
      width: '120px'
    },
    {
      key: 'stockStatus',
      label: 'Stock Status',
      width: '120px',
      type: 'enum',
      enumValues: [
        { value: 'in-stock', label: 'In Stock', color: '#4caf50' },
        { value: 'out-of-stock', label: 'Out of Stock', color: '#f44336' },
        { value: 'low-stock', label: 'Low Stock', color: '#ff9800' }
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
      width: '100px',
      type: 'currency'
    }
  ];

  tableActions: TableAction[] = [
    { id: 'edit', label: 'Edit', icon: 'edit', color: 'primary' },
    { id: 'view', label: 'View Details', icon: 'visibility', color: 'primary' },
    { id: 'delete', label: 'Delete', icon: 'delete', color: 'warn' }
  ];

  products: Product[] = [
    {
      id: '1',
      name: '25mm PVC Pipes',
      brand: 'Kenpipe',
      sku: 'KP-PVC-25-6M',
      category: 'Plumbing',
      stockStatus: 'in-stock',
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
      stockStatus: 'in-stock',
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
      stockStatus: 'in-stock',
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
      stockStatus: 'in-stock',
      main: 125,
      westlands: 89,
      eastleigh: 8,
      total: 222,
      price: 780
    },
    {
      id: '5',
      name: 'Electrical Wire 2.5mm',
      brand: 'Nextel',
      sku: 'NXT-EW-2.5-100M',
      category: 'Electrical',
      stockStatus: 'low-stock',
      main: 2,
      westlands: 5,
      eastleigh: 1,
      total: 8,
      price: 3500
    },
    {
      id: '6',
      name: 'Steel Nails 3 inch',
      brand: 'Kimani Steel',
      sku: 'KS-NAIL-3IN-1KG',
      category: 'Hardware',
      stockStatus: 'out-of-stock',
      main: 0,
      westlands: 0,
      eastleigh: 0,
      total: 0,
      price: 450
    }
  ];

  lastAction = '';

  ngOnInit(): void {
    console.log('Table Demo initialized');
  }

  onTableAction(event: TableActionEvent): void {
    console.log('Table action triggered:', event);
    this.lastAction = `${event.action} - ${event.row.name}`;

    switch (event.action) {
      case 'edit':
        console.log('Editing product:', event.row);
        break;
      case 'view':
        console.log('Viewing details for:', event.row);
        break;
      case 'delete':
        console.log('Deleting product:', event.row);
        this.products = this.products.filter(p => p.id !== event.row.id);
        this.lastAction = `Deleted - ${event.row.name}`;
        break;
    }
  }

  onSearch(searchTerm: string): void {
    console.log('Search:', searchTerm);
  }

  onFilter(): void {
    console.log('Filter clicked');
  }
}

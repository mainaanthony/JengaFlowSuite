import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppTableComponent, ColumnConfig, TableAction, TableActionEvent } from '../../shared/app-table/app-table.component';
import { AppTabsComponent, Tab } from '../../shared/app-tabs/app-tabs.component';

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
  selector: 'app-test-pages',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, AppTableComponent, AppTabsComponent],
  templateUrl: './test-pages.component.html',
  styleUrls: ['./test-pages.component.scss']
})
export class TestPagesComponent implements OnInit {
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

  dashboardTabs: Tab[] = [
    { id: 'today-sales', label: 'Today\'s Sales' },
    { id: 'pending-orders', label: 'Pending Orders' },
    { id: 'customers', label: 'Customers' }
  ];

  activeTab = 'today-sales';
  lastAction = '';

  ngOnInit(): void {
    console.log('Test Pages initialized');
  }

  onTabChange(tabId: string): void {
    this.activeTab = tabId;
    console.log('Tab changed to:', tabId);
    this.lastAction = `Switched to ${this.dashboardTabs.find(t => t.id === tabId)?.label}`;
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

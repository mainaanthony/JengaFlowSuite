import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { ButtonSolidComponent } from '../shared/button-solid/button-solid.component';
import { CardComponent } from '../shared/card/card.component';
import { AppTableComponent, ColumnConfig, TableAction, TableActionEvent } from '../shared/app-table/app-table.component';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { NewSaleModalComponent } from './new-sale-modal/new-sale-modal.component';
import { ModalService } from '../core/services/modal.service';

interface Transaction {
  id: string;
  customer: string;
  items: number;
  total: number;
  paymentMethod: 'Cash' | 'M-Pesa' | 'Card';
  status: 'Completed' | 'Processing' | 'Pending';
  time: string;
  attendant: string;
}

interface PendingOrder {
  id: string;
  customer: string;
  items: number;
  total: number;
  deadline: string;
  status: 'Pending Confirmation' | 'Ready for Pickup' | 'On Hold';
}

@Component({
  selector: 'sales',
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
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  searchControl = new FormControl('');
  activeTab: 'today' | 'pending' | 'customers' = 'today';

  // Table configuration
  transactionColumns: ColumnConfig[] = [];
  transactionActions: TableAction[] = [];
  orderColumns: ColumnConfig[] = [];
  orderActions: TableAction[] = [];

  constructor(
    private dialog: MatDialog,
    private modalService: ModalService
  ) {
    this.initializeTableConfig();
  }

  stats = {
    todaysSales: 'KES 156,400',
    salesChange: 18.2,
    transactions: 47,
    transactionsChange: 8,
    pendingOrders: 12,
    pendingChange: 3,
    avgSaleValue: 'KES 3,328',
    avgChange: -2.2
  };

  transactions: Transaction[] = [
    {
      id: 'SAL-2024-001',
      customer: 'John Mwangi',
      items: 5,
      total: 12500,
      paymentMethod: 'Cash',
      status: 'Completed',
      time: '09:30 AM',
      attendant: 'Mary Njeru'
    },
    {
      id: 'SAL-2024-002',
      customer: 'Grace Wanjiku',
      items: 2,
      total: 4800,
      paymentMethod: 'M-Pesa',
      status: 'Completed',
      time: '10:15 AM',
      attendant: 'Peter Kamau'
    },
    {
      id: 'SAL-2024-003',
      customer: 'Walk-in Customer',
      items: 8,
      total: 18750,
      paymentMethod: 'Card',
      status: 'Processing',
      time: '11:45 AM',
      attendant: 'Mary Njeru'
    }
  ];

  pendingOrders: PendingOrder[] = [
    {
      id: 'ORD-2024-001',
      customer: 'ABC Construction',
      items: 15,
      total: 45600,
      deadline: '2024-01-20',
      status: 'Pending Confirmation'
    },
    {
      id: 'ORD-2024-002',
      customer: 'Kiambu Builders',
      items: 8,
      total: 28900,
      deadline: '2024-01-18',
      status: 'Ready for Pickup'
    }
  ];

  filteredTransactions: Transaction[] = [];
  filteredOrders: PendingOrder[] = [];

  ngOnInit() {
    this.filteredTransactions = this.transactions;
    this.filteredOrders = this.pendingOrders;
    this.setupSearch();
  }

  initializeTableConfig(): void {
    // Define transaction table columns
    this.transactionColumns = [
      {
        key: 'id',
        label: 'Sale ID',
        width: '140px',
        type: 'text'
      },
      {
        key: 'customer',
        label: 'Customer',
        width: '180px',
        type: 'text'
      },
      {
        key: 'items',
        label: 'Items',
        width: '100px',
        type: 'custom',
        format: (value: number) => `${value} items`
      },
      {
        key: 'total',
        label: 'Total',
        width: '130px',
        type: 'currency'
      },
      {
        key: 'paymentMethod',
        label: 'Payment',
        width: '120px',
        type: 'enum',
        enumValues: [
          { value: 'Cash', label: 'Cash', color: '#10b981' },
          { value: 'M-Pesa', label: 'M-Pesa', color: '#3b82f6' },
          { value: 'Card', label: 'Card', color: '#8b5cf6' }
        ]
      },
      {
        key: 'status',
        label: 'Status',
        width: '130px',
        type: 'enum',
        enumValues: [
          { value: 'Completed', label: 'Completed', color: '#10b981' },
          { value: 'Processing', label: 'Processing', color: '#f59e0b' },
          { value: 'Pending', label: 'Pending', color: '#6b7280' }
        ]
      },
      {
        key: 'time',
        label: 'Time',
        width: '100px',
        type: 'text'
      },
      {
        key: 'attendant',
        label: 'Attendant',
        width: '150px',
        type: 'text'
      }
    ];

    // Define transaction table actions
    this.transactionActions = [
      { id: 'edit', label: 'Edit Transaction', icon: 'edit', color: 'primary' },
      { id: 'delete', label: 'Delete Transaction', icon: 'delete', color: 'warn' }
    ];

    // Define order table columns
    this.orderColumns = [
      {
        key: 'id',
        label: 'Order ID',
        width: '140px',
        type: 'text'
      },
      {
        key: 'customer',
        label: 'Customer',
        width: '180px',
        type: 'text'
      },
      {
        key: 'items',
        label: 'Items',
        width: '100px',
        type: 'custom',
        format: (value: number) => `${value} items`
      },
      {
        key: 'total',
        label: 'Total',
        width: '130px',
        type: 'currency'
      },
      {
        key: 'deadline',
        label: 'Deadline',
        width: '130px',
        type: 'date'
      },
      {
        key: 'status',
        label: 'Status',
        width: '180px',
        type: 'enum',
        enumValues: [
          { value: 'Pending Confirmation', label: 'Pending Confirmation', color: '#f59e0b' },
          { value: 'Ready for Pickup', label: 'Ready for Pickup', color: '#10b981' },
          { value: 'On Hold', label: 'On Hold', color: '#ef4444' }
        ]
      }
    ];

    // Define order table actions
    this.orderActions = [
      { id: 'edit', label: 'Edit Order', icon: 'edit', color: 'primary' },
      { id: 'delete', label: 'Delete Order', icon: 'delete', color: 'warn' }
    ];
  }

  onTransactionTableAction(event: TableActionEvent): void {
    const transaction = event.row as Transaction;
    switch (event.action) {
      case 'edit':
        this.editTransaction(transaction);
        break;
      case 'delete':
        this.deleteTransaction(transaction);
        break;
    }
  }

  onOrderTableAction(event: TableActionEvent): void {
    const order = event.row as PendingOrder;
    switch (event.action) {
      case 'edit':
        this.editOrder(order);
        break;
      case 'delete':
        this.deleteOrder(order);
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
    const lowerQuery = query.toLowerCase();

    if (this.activeTab === 'today') {
      if (!query.trim()) {
        this.filteredTransactions = this.transactions;
      } else {
        this.filteredTransactions = this.transactions.filter(t =>
          t.id.toLowerCase().includes(lowerQuery) ||
          t.customer.toLowerCase().includes(lowerQuery) ||
          t.attendant.toLowerCase().includes(lowerQuery)
        );
      }
    } else if (this.activeTab === 'pending') {
      if (!query.trim()) {
        this.filteredOrders = this.pendingOrders;
      } else {
        this.filteredOrders = this.pendingOrders.filter(o =>
          o.id.toLowerCase().includes(lowerQuery) ||
          o.customer.toLowerCase().includes(lowerQuery)
        );
      }
    }
  }

  setTab(tab: 'today' | 'pending' | 'customers') {
    this.activeTab = tab;
    this.searchControl.setValue('');
  }

  exportSales() {
    console.log('Export sales data');
  }

  printReceipt() {
    console.log('Print receipt');
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
        alert(`Sale completed for ${result.customerName}! Total: KES ${result.total.toFixed(2)}`);
      }
    });
  }

  getPaymentMethodClass(method: string): string {
    return method.toLowerCase().replace(/\s+/g, '-');
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  editTransaction(transaction: Transaction) {
    console.log('Edit transaction:', transaction);
  }

  deleteTransaction(transaction: Transaction) {
    console.log('Delete transaction:', transaction);
  }

  editOrder(order: PendingOrder) {
    console.log('Edit order:', order);
  }

  deleteOrder(order: PendingOrder) {
    console.log('Delete order:', order);
  }

  async addCustomer() {
    const dialogRef = await this.modalService.openModal('add-customer');

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Customer added:', result);
        alert(`Customer "${result.firstName} ${result.lastName}" added successfully!`);
        // TODO: Save customer data to backend
      }
    });
  }
}

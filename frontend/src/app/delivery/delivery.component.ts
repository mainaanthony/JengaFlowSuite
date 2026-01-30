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
import { AddDriverModalComponent } from './add-driver-modal/add-driver-modal.component';
import { ScheduleDeliveryModalComponent } from './schedule-delivery-modal/schedule-delivery-modal.component';

interface Delivery {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  driver: string;
  driverVehicle: string;
  status: 'In Transit' | 'Delivered' | 'Pending';
  priority: 'High' | 'Normal' | 'Low';
  scheduled: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: 'Available' | 'On Delivery';
  activeDeliveries: number;
  rating: number;
}

@Component({
  selector: 'delivery',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    ButtonSolidComponent,
    CardComponent,
    AppTableComponent,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
  searchControl = new FormControl('');
  activeTab: 'active-deliveries' | 'drivers' | 'route-optimization' = 'active-deliveries';

  // Table configuration
  deliveryColumns: ColumnConfig[] = [];
  deliveryActions: TableAction[] = [];
  driverColumns: ColumnConfig[] = [];
  driverActions: TableAction[] = [];

  stats = {
    activeDeliveries: 8,
    activeDeliveriesChange: 3,
    todaysDeliveries: 15,
    todaysDeliveriesChange: 12,
    availableDrivers: 5,
    availableDriversChange: 0,
    avgDeliveryTime: '2.3hrs',
    avgDeliveryTimeChange: -15
  };

  constructor(private dialog: MatDialog) {
    this.initializeTableConfig();
  }

  deliveries: Delivery[] = [
    {
      id: 'DEL-2024-001',
      orderId: 'ORD-2024-003',
      customer: 'ABC Construction',
      address: '123 Moi Avenue, Nairobi',
      driver: 'James Mwangi',
      driverVehicle: 'KCA 123A',
      status: 'In Transit',
      priority: 'High',
      scheduled: '2024-01-15 14:00'
    },
    {
      id: 'DEL-2024-002',
      orderId: 'ORD-2024-004',
      customer: 'Kiambu Builders',
      address: '45 Industrial Area, Kiambu',
      driver: 'Mary Wanjiku',
      driverVehicle: 'KBZ 456B',
      status: 'Delivered',
      priority: 'Normal',
      scheduled: '2024-01-15 10:30'
    },
    {
      id: 'DEL-2024-003',
      orderId: 'ORD-2024-005',
      customer: 'Home Depot Ltd',
      address: '67 Tom Mboya Street, CBD',
      driver: 'Peter Kamau',
      driverVehicle: 'KCD 789C',
      status: 'Pending',
      priority: 'Low',
      scheduled: '2024-01-16 09:00'
    }
  ];

  drivers: Driver[] = [
    {
      id: 'DRV-001',
      name: 'James Mwangi',
      phone: '+254-700-123456',
      vehicle: 'KCA 123A',
      status: 'Available',
      activeDeliveries: 0,
      rating: 4.8
    },
    {
      id: 'DRV-002',
      name: 'Mary Wanjiku',
      phone: '+254-722-987654',
      vehicle: 'KBZ 456B',
      status: 'On Delivery',
      activeDeliveries: 1,
      rating: 4.9
    }
  ];

  filteredDeliveries: Delivery[] = [];
  filteredDrivers: Driver[] = [];

  ngOnInit() {
    this.filteredDeliveries = this.deliveries;
    this.filteredDrivers = this.drivers;
    this.setupSearch();
  }

  initializeTableConfig(): void {
    // Define delivery table columns
    this.deliveryColumns = [
      {
        key: 'id',
        label: 'Delivery ID',
        width: '140px',
        type: 'text'
      },
      {
        key: 'orderId',
        label: 'Order ID',
        width: '140px',
        type: 'link'
      },
      {
        key: 'customer',
        label: 'Customer',
        width: '180px',
        type: 'text'
      },
      {
        key: 'address',
        label: 'Address',
        width: '220px',
        type: 'text'
      },
      {
        key: 'driver',
        label: 'Driver',
        width: '160px',
        type: 'text',
        subText: 'driverVehicle'
      },
      {
        key: 'status',
        label: 'Status',
        width: '130px',
        type: 'enum',
        enumValues: [
          { value: 'In Transit', label: 'In Transit', color: '#3b82f6' },
          { value: 'Delivered', label: 'Delivered', color: '#10b981' },
          { value: 'Pending', label: 'Pending', color: '#f59e0b' }
        ]
      },
      {
        key: 'priority',
        label: 'Priority',
        width: '110px',
        type: 'enum',
        enumValues: [
          { value: 'High', label: 'High', color: '#ef4444' },
          { value: 'Normal', label: 'Normal', color: '#6b7280' },
          { value: 'Low', label: 'Low', color: '#9ca3af' }
        ]
      },
      {
        key: 'scheduled',
        label: 'Scheduled',
        width: '160px',
        type: 'text'
      }
    ];

    // Define delivery table actions
    this.deliveryActions = [
      { id: 'edit', label: 'Edit Delivery', icon: 'edit', color: 'primary' },
      { id: 'delete', label: 'Delete Delivery', icon: 'delete', color: 'warn' }
    ];

    // Define driver table columns
    this.driverColumns = [
      {
        key: 'id',
        label: 'Driver ID',
        width: '130px',
        type: 'text'
      },
      {
        key: 'name',
        label: 'Name',
        width: '180px',
        type: 'text'
      },
      {
        key: 'phone',
        label: 'Phone',
        width: '150px',
        type: 'text'
      },
      {
        key: 'vehicle',
        label: 'Vehicle',
        width: '120px',
        type: 'text'
      },
      {
        key: 'status',
        label: 'Status',
        width: '130px',
        type: 'enum',
        enumValues: [
          { value: 'Available', label: 'Available', color: '#10b981' },
          { value: 'On Delivery', label: 'On Delivery', color: '#3b82f6' }
        ]
      },
      {
        key: 'activeDeliveries',
        label: 'Active Deliveries',
        width: '140px',
        type: 'number'
      },
      {
        key: 'rating',
        label: 'Rating',
        width: '100px',
        type: 'custom',
        format: (value: number) => `⭐ ${value}`
      }
    ];

    // Define driver table actions
    this.driverActions = [
      { id: 'edit', label: 'Edit Driver', icon: 'edit', color: 'primary' },
      { id: 'delete', label: 'Delete Driver', icon: 'delete', color: 'warn' }
    ];
  }

  onTableAction(event: TableActionEvent): void {
    const delivery = event.row as Delivery;
    switch (event.action) {
      case 'edit':
        this.editDelivery(delivery);
        break;
      case 'delete':
        this.deleteDelivery(delivery);
        break;
    }
  }

  onDriverTableAction(event: TableActionEvent): void {
    const driver = event.row as Driver;
    switch (event.action) {
      case 'edit':
        this.editDriver(driver);
        break;
      case 'delete':
        this.deleteDriver(driver);
        break;
    }
  }

  onCellClick(event: { column: string; row: any; value: any }): void {
    if (event.column === 'orderId') {
      console.log('Navigate to order:', event.value);
      // TODO: Navigate to order details page
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

    if (this.activeTab === 'active-deliveries') {
      if (!query.trim()) {
        this.filteredDeliveries = this.deliveries;
      } else {
        this.filteredDeliveries = this.deliveries.filter(d =>
          d.id.toLowerCase().includes(lowerQuery) ||
          d.orderId.toLowerCase().includes(lowerQuery) ||
          d.customer.toLowerCase().includes(lowerQuery) ||
          d.driver.toLowerCase().includes(lowerQuery)
        );
      }
    } else if (this.activeTab === 'drivers') {
      if (!query.trim()) {
        this.filteredDrivers = this.drivers;
      } else {
        this.filteredDrivers = this.drivers.filter(dr =>
          dr.id.toLowerCase().includes(lowerQuery) ||
          dr.name.toLowerCase().includes(lowerQuery) ||
          dr.vehicle.toLowerCase().includes(lowerQuery)
        );
      }
    }
  }

  setTab(tab: 'active-deliveries' | 'drivers' | 'route-optimization') {
    this.activeTab = tab;
    this.searchControl.setValue('');
  }

  exportRoutes() {
    console.log('Export delivery routes');
  }

  addDriver() {
    const dialogRef = this.dialog.open(AddDriverModalComponent, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Driver added:', result);
        // Handle the new driver data (e.g., save to backend, update UI)
      }
    });
  }

  scheduleDelivery() {
    const dialogRef = this.dialog.open(ScheduleDeliveryModalComponent, {
      width: '1000px',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Delivery scheduled:', result);
        // Handle the scheduled delivery data (e.g., save to backend, update UI)
        this.deliveries.push({
          id: `DEL-${Date.now()}`,
          orderId: `ORD-${Date.now()}`,
          customer: result.customerName,
          address: result.deliveryAddress,
          driver: result.assignedDriver,
          driverVehicle: result.assignedVehicle,
          status: 'Pending',
          priority: result.priority,
          scheduled: `${result.deliveryDate} ${result.preferredTime || '09:00'}`
        });
      }
    });
  }

  editDelivery(delivery: Delivery) {
    console.log('Edit delivery:', delivery);
  }

  deleteDelivery(delivery: Delivery) {
    console.log('Delete delivery:', delivery);
  }

  editDriver(driver: Driver) {
    console.log('Edit driver:', driver);
  }

  deleteDriver(driver: Driver) {
    console.log('Delete driver:', driver);
  }

  optimizeRoutes() {
    console.log('Optimize delivery routes');
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  getPriorityClass(priority: string): string {
    return priority.toLowerCase().replace(/\s+/g, '-');
  }
}

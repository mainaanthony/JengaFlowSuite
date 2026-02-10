import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { ButtonSolidComponent } from '../shared/button-solid/button-solid.component';
import { CardComponent } from '../shared/card/card.component';
import { AppTableComponent, ColumnConfig, TableAction, TableActionEvent } from '../shared/app-table/app-table.component';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { AddDriverModalComponent } from './add-driver-modal/add-driver-modal.component';
import { ScheduleDeliveryModalComponent } from './schedule-delivery-modal/schedule-delivery-modal.component';
import { 
  DeliveryRepository, 
  DriverRepository,
  Delivery as DomainDelivery,
  Driver as DomainDriver 
} from '../core/domain/domain.barrel';
import { DeliveryStatus, Priority } from '../core/enums/enums.barrel';

interface Delivery {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  driver: string;
  driverVehicle: string;
  status: 'In Transit' | 'Delivered' | 'Pending' | 'Cancelled';
  priority: 'High' | 'Normal' | 'Low';
  scheduled: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: 'Available' | 'On Delivery' | 'Off Duty' | string;
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
export class DeliveryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  searchControl = new FormControl('');
  activeTab: 'active-deliveries' | 'drivers' | 'route-optimization' = 'active-deliveries';
  loading = false;

  // Table configuration
  deliveryColumns: ColumnConfig[] = [];
  deliveryActions: TableAction[] = [];
  driverColumns: ColumnConfig[] = [];
  driverActions: TableAction[] = [];

  stats = {
    activeDeliveries: 0,
    activeDeliveriesChange: 0,
    todaysDeliveries: 0,
    todaysDeliveriesChange: 0,
    availableDrivers: 0,
    availableDriversChange: 0,
    avgDeliveryTime: '0hrs',
    avgDeliveryTimeChange: 0
  };

  constructor(
    private dialog: MatDialog,
    private deliveryRepository: DeliveryRepository,
    private driverRepository: DriverRepository
  ) {
    this.initializeTableConfig();
  }

  deliveries: Delivery[] = [];
  drivers: Driver[] = [];

  filteredDeliveries: Delivery[] = [];
  filteredDrivers: Driver[] = [];

  ngOnInit() {
    this.loadDeliveries();
    this.loadDrivers();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDeliveries(): void {
    this.loading = true;
    this.deliveryRepository.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (deliveries: DomainDelivery[]) => {
          this.deliveries = deliveries.map(d => ({
            id: d.deliveryNumber,
            orderId: d.saleId?.toString() || 'N/A',
            customer: 'Customer', // TODO: Join with customer data
            address: d.deliveryAddress,
            driver: 'Driver', // TODO: Join with driver data
            driverVehicle: 'Vehicle', // TODO: Join with driver vehicle
            status: d.status === DeliveryStatus.Pending ? 'Pending' : 
                    d.status === DeliveryStatus.InTransit ? 'In Transit' : 
                    d.status === DeliveryStatus.Delivered ? 'Delivered' : 'Cancelled',
            priority: d.priority === Priority.High ? 'High' : 
                      d.priority === Priority.Low ? 'Low' : 'Normal',
            scheduled: d.scheduledDate.toString()
          }));
          this.filteredDeliveries = this.deliveries;
          this.updateStats();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading deliveries:', error);
          this.filteredDeliveries = [];
          this.loading = false;
        }
      });
  }

  private loadDrivers(): void {
    this.driverRepository.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (drivers: DomainDriver[]) => {
          this.drivers = drivers.map(d => ({
            id: d.id.toString(),
            name: d.name,
            phone: d.phone,
            vehicle: d.vehicle || 'N/A',
            status: d.status || 'Available',
            activeDeliveries: 0, // TODO: Calculate from deliveries
            rating: d.rating || 4.5
          }));
          this.filteredDrivers = this.drivers;
        },
        error: (error) => {
          console.error('Error loading drivers:', error);
          this.filteredDrivers = [];
        }
      });
  }

  private updateStats(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    this.stats.activeDeliveries = this.deliveries.length;
    this.stats.todaysDeliveries = this.deliveries.filter(d => {
      const scheduledDate = new Date(d.scheduled);
      scheduledDate.setHours(0, 0, 0, 0);
      return scheduledDate.getTime() === today.getTime();
    }).length;
    this.stats.availableDrivers = this.drivers.filter(d => d.status === 'Available').length;
    
    // TODO: Calculate these from actual data
    this.stats.activeDeliveriesChange = 0;
    this.stats.todaysDeliveriesChange = 0;
    this.stats.availableDriversChange = 0;
    this.stats.avgDeliveryTime = '0hrs';
    this.stats.avgDeliveryTimeChange = 0;
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
        this.loadDrivers();
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
        this.loadDeliveries();
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

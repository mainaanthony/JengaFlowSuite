import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { ButtonSolidComponent } from '../shared/button-solid/button-solid.component';
import { CardComponent } from '../shared/card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

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
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
  searchControl = new FormControl('');
  activeTab: 'active-deliveries' | 'drivers' | 'route-optimization' = 'active-deliveries';

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
    console.log('Add new driver');
  }

  scheduleDelivery() {
    console.log('Schedule new delivery');
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

interface DeliveryOrder {
  id: string;
  // Delivery Info
  deliveryType: string;
  priority: string;
  deliveryDate: Date;
  preferredTime?: string;
  estimatedDuration: number;
  
  // Customer
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupAddress: string;
  deliveryAddress: string;
  deliveryInstructions?: string;
  contactPerson: string;
  contactPhone: string;
  
  // Package
  packageWeight: number;
  packageDimensions: string;
  packageValue: number;
  requiresSignature: boolean;
  fragileItem: boolean;
  hazardousMaterial: boolean;
  cashOnDelivery: boolean;
  deliveryInsurance: boolean;
  gpsTracking: boolean;
  
  // Assignment
  assignedDriver?: string;
  assignedVehicle?: string;
  deliveryRoute?: string;
  smsNotification: boolean;
  emailNotification: boolean;
  additionalNotes?: string;
}

@Component({
  selector: 'app-schedule-delivery-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './schedule-delivery-modal.component.html',
  styleUrls: ['./schedule-delivery-modal.component.scss']
})
export class ScheduleDeliveryModalComponent implements OnInit {
  deliveryForm!: FormGroup;
  activeTab: 'delivery-info' | 'customer' | 'package' | 'assignment' = 'delivery-info';

  deliveryTypes = ['Standard Delivery', 'Express Delivery', 'Same-Day Delivery', 'Scheduled Delivery'];
  priorities = ['Low', 'Normal', 'High', 'Urgent'];
  deliveryRoutes = [
    'Route A - CBD',
    'Route B - Westlands',
    'Route C - Eastlands',
    'Route D - Southlands',
    'Route E - Northlands'
  ];

  customers = [
    { id: 'CUST-001', name: 'ABC Construction', phone: '+254 712 345 678', email: 'abc@construction.com' },
    { id: 'CUST-002', name: 'XYZ Enterprises', phone: '+254 723 456 789', email: 'xyz@enterprises.com' },
    { id: 'CUST-003', name: 'Tech Solutions Ltd', phone: '+254 734 567 890', email: 'info@techsolutions.com' }
  ];

  drivers = [
    'James Mwangi',
    'Peter Kipchoge',
    'Grace Wanjiru',
    'David Ochieng',
    'Mary Njeri'
  ];

  vehicles = [
    'KCB 123A - Toyota Hilux',
    'KCD 456B - Isuzu D-Max',
    'KCE 789C - Honda CRF250',
    'KCF 012D - Nissan NV200'
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ScheduleDeliveryModalComponent>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.deliveryForm = this.fb.group({
      // Delivery Info
      deliveryType: ['Standard Delivery', Validators.required],
      priority: ['Normal', Validators.required],
      deliveryDate: ['', Validators.required],
      preferredTime: [''],
      estimatedDuration: [60, [Validators.required, Validators.min(1)]],

      // Customer
      customerId: ['', Validators.required],
      customerName: ['', Validators.required],
      customerPhone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{9,15}$/)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      pickupAddress: [''],
      deliveryAddress: ['', Validators.required],
      deliveryInstructions: [''],
      contactPerson: ['', Validators.required],
      contactPhone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{9,15}$/)]],

      // Package
      packageWeight: [0, [Validators.required, Validators.min(0)]],
      packageDimensions: [''],
      packageValue: [0, [Validators.required, Validators.min(0)]],
      requiresSignature: [true],
      fragileItem: [false],
      hazardousMaterial: [false],
      cashOnDelivery: [false],
      deliveryInsurance: [false],
      gpsTracking: [true],

      // Assignment
      assignedDriver: [''],
      assignedVehicle: [''],
      deliveryRoute: [''],
      smsNotification: [true],
      emailNotification: [false],
      additionalNotes: ['']
    });

    // Auto-populate customer info when customer is selected
    this.deliveryForm.get('customerId')?.valueChanges.subscribe(customerId => {
      if (customerId) {
        const customer = this.customers.find(c => c.id === customerId);
        if (customer) {
          this.deliveryForm.patchValue({
            customerName: customer.name,
            customerPhone: customer.phone,
            customerEmail: customer.email
          });
        }
      }
    });
  }

  setTab(tab: 'delivery-info' | 'customer' | 'package' | 'assignment'): void {
    this.activeTab = tab;
  }

  isTabValid(tab: 'delivery-info' | 'customer' | 'package' | 'assignment'): boolean {
    if (tab === 'delivery-info') {
      return (
        (this.deliveryForm.get('deliveryType')?.valid ?? false) &&
        (this.deliveryForm.get('priority')?.valid ?? false) &&
        (this.deliveryForm.get('deliveryDate')?.valid ?? false)
      );
    } else if (tab === 'customer') {
      return (
        (this.deliveryForm.get('customerId')?.valid ?? false) &&
        (this.deliveryForm.get('customerName')?.valid ?? false) &&
        (this.deliveryForm.get('deliveryAddress')?.valid ?? false) &&
        (this.deliveryForm.get('contactPerson')?.valid ?? false)
      );
    } else if (tab === 'package') {
      return (
        (this.deliveryForm.get('packageWeight')?.valid ?? false) &&
        (this.deliveryForm.get('packageValue')?.valid ?? false)
      );
    }
    return true;
  }

  scheduleDelivery(): void {
    if (!this.deliveryForm.valid) {
      alert('Please fill in all required fields');
      return;
    }

    const deliveryData: DeliveryOrder = {
      id: 'DEL-' + Date.now(),
      ...this.deliveryForm.value
    };

    this.dialogRef.close(deliveryData);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

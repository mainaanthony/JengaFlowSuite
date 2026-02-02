import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AppTabsComponent, Tab } from '../../shared/app-tabs/app-tabs.component';
import { InputTextComponent, InputTextConfig } from '../../shared/input-text/input-text.component';
import { InputDropdownComponent, DropdownOption, DropdownConfig } from '../../shared/input-dropdown/input-dropdown.component';
import { AppModalComponent, AppModalConfig, ModalButton } from '../../shared/modals/app-modal.component';

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
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    AppTabsComponent,
    InputTextComponent,
    InputDropdownComponent
  ],
  templateUrl: './schedule-delivery-modal.component.html',
  styleUrls: ['./schedule-delivery-modal.component.scss']
})
export class ScheduleDeliveryModalComponent implements OnInit, AfterViewInit {
  @ViewChild('deliveryFormTemplate') deliveryFormTemplate!: TemplateRef<any>;
  deliveryForm!: FormGroup;
  activeTab: string = 'delivery-info';

  tabs: Tab[] = [
    { id: 'delivery-info', label: 'Delivery Info' },
    { id: 'customer', label: 'Customer' },
    { id: 'package', label: 'Package' },
    { id: 'assignment', label: 'Assignment' }
  ];

  // Input Text Configurations
  deliveryDateConfig: InputTextConfig = {
    label: 'Delivery Date',
    type: 'date',
    required: true,
    clearable: true
  };

  preferredTimeConfig: InputTextConfig = {
    label: 'Preferred Time',
    type: 'text',
    placeholder: 'e.g., 10:00 AM',
    clearable: true
  };

  estimatedDurationConfig: InputTextConfig = {
    label: 'Estimated Duration (minutes)',
    type: 'number',
    placeholder: '60',
    required: true,
    clearable: true
  };

  customerNameConfig: InputTextConfig = {
    label: 'Customer Name',
    placeholder: 'Enter customer name',
    required: true,
    clearable: true
  };

  customerPhoneConfig: InputTextConfig = {
    label: 'Customer Phone',
    type: 'tel',
    placeholder: '+254 XXX XXX XXX',
    required: true,
    clearable: true
  };

  customerEmailConfig: InputTextConfig = {
    label: 'Customer Email',
    type: 'email',
    placeholder: 'customer@example.com',
    required: true,
    clearable: true
  };

  pickupAddressConfig: InputTextConfig = {
    label: 'Pickup Address',
    placeholder: 'Enter pickup address (leave empty if from warehouse)',
    description: true,
    rows: 2,
    clearable: true
  };

  deliveryAddressConfig: InputTextConfig = {
    label: 'Delivery Address',
    placeholder: 'Enter complete delivery address',
    description: true,
    rows: 3,
    required: true,
    clearable: true
  };

  deliveryInstructionsConfig: InputTextConfig = {
    label: 'Delivery Instructions',
    placeholder: 'Special instructions for the driver...',
    description: true,
    rows: 2,
    clearable: true
  };

  contactPersonConfig: InputTextConfig = {
    label: 'Contact Person',
    placeholder: 'Person to receive delivery',
    required: true,
    clearable: true
  };

  contactPhoneConfig: InputTextConfig = {
    label: 'Contact Phone',
    type: 'tel',
    placeholder: '+254 XXX XXX XXX',
    required: true,
    clearable: true
  };

  packageWeightConfig: InputTextConfig = {
    label: 'Package Weight (kg)',
    type: 'number',
    placeholder: '0',
    required: true,
    clearable: true
  };

  packageDimensionsConfig: InputTextConfig = {
    label: 'Dimensions (L x W x H cm)',
    placeholder: 'e.g., 30 x 20 x 15',
    clearable: true
  };

  packageValueConfig: InputTextConfig = {
    label: 'Package Value (KSH)',
    type: 'number',
    placeholder: '0',
    required: true,
    clearable: true
  };

  additionalNotesConfig: InputTextConfig = {
    label: 'Additional Notes',
    placeholder: 'Any additional notes for this delivery...',
    description: true,
    rows: 4,
    clearable: true
  };

  // Dropdown Options
  deliveryTypeOptions: DropdownOption[] = [
    { id: 'standard', label: 'Standard Delivery', value: 'Standard Delivery' },
    { id: 'express', label: 'Express Delivery', value: 'Express Delivery' },
    { id: 'sameday', label: 'Same-Day Delivery', value: 'Same-Day Delivery' },
    { id: 'scheduled', label: 'Scheduled Delivery', value: 'Scheduled Delivery' }
  ];

  priorityOptions: DropdownOption[] = [
    { id: 'low', label: 'Low', value: 'Low' },
    { id: 'normal', label: 'Normal', value: 'Normal' },
    { id: 'high', label: 'High', value: 'High' },
    { id: 'urgent', label: 'Urgent', value: 'Urgent' }
  ];

  customerOptions: DropdownOption[] = [
    { id: 'CUST-001', label: 'ABC Construction', value: 'CUST-001', details: { phone: '+254 712 345 678', email: 'abc@construction.com' } },
    { id: 'CUST-002', label: 'XYZ Enterprises', value: 'CUST-002', details: { phone: '+254 723 456 789', email: 'xyz@enterprises.com' } },
    { id: 'CUST-003', label: 'Tech Solutions Ltd', value: 'CUST-003', details: { phone: '+254 734 567 890', email: 'info@techsolutions.com' } }
  ];

  driverOptions: DropdownOption[] = [
    { id: 'drv1', label: 'James Mwangi', value: 'James Mwangi' },
    { id: 'drv2', label: 'Peter Kipchoge', value: 'Peter Kipchoge' },
    { id: 'drv3', label: 'Grace Wanjiru', value: 'Grace Wanjiru' },
    { id: 'drv4', label: 'David Ochieng', value: 'David Ochieng' },
    { id: 'drv5', label: 'Mary Njeri', value: 'Mary Njeri' }
  ];

  vehicleOptions: DropdownOption[] = [
    { id: 'veh1', label: 'KCB 123A - Toyota Hilux', value: 'KCB 123A - Toyota Hilux' },
    { id: 'veh2', label: 'KCD 456B - Isuzu D-Max', value: 'KCD 456B - Isuzu D-Max' },
    { id: 'veh3', label: 'KCE 789C - Honda CRF250', value: 'KCE 789C - Honda CRF250' },
    { id: 'veh4', label: 'KCF 012D - Nissan NV200', value: 'KCF 012D - Nissan NV200' }
  ];

  routeOptions: DropdownOption[] = [
    { id: 'routeA', label: 'Route A - CBD', value: 'Route A - CBD' },
    { id: 'routeB', label: 'Route B - Westlands', value: 'Route B - Westlands' },
    { id: 'routeC', label: 'Route C - Eastlands', value: 'Route C - Eastlands' },
    { id: 'routeD', label: 'Route D - Southlands', value: 'Route D - Southlands' },
    { id: 'routeE', label: 'Route E - Northlands', value: 'Route E - Northlands' }
  ];

  // Dropdown Configurations
  deliveryTypeDropdownConfig: DropdownConfig = {
    placeholder: 'Select delivery type',
    searchable: true,
    clearable: true
  };

  priorityDropdownConfig: DropdownConfig = {
    placeholder: 'Select priority',
    searchable: true,
    clearable: true
  };

  customerDropdownConfig: DropdownConfig = {
    placeholder: 'Select customer',
    searchable: true,
    clearable: true
  };

  driverDropdownConfig: DropdownConfig = {
    placeholder: 'Select driver',
    searchable: true,
    clearable: true
  };

  vehicleDropdownConfig: DropdownConfig = {
    placeholder: 'Select vehicle',
    searchable: true,
    clearable: true
  };

  routeDropdownConfig: DropdownConfig = {
    placeholder: 'Select or create route',
    searchable: true,
    clearable: true
  };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ScheduleDeliveryModalComponent>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.openModal();
    });
  }

  openModal(): void {
    const modalConfig: AppModalConfig = {
      title: 'Schedule New Delivery',
      subtitle: 'Fill in the delivery information',
      wide: true
    };

    const leftButtons: ModalButton[] = [
      {
        label: 'Cancel',
        action: 'cancel',
        color: 'default'
      }
    ];

    const rightButtons: ModalButton[] = [
      {
        label: 'Schedule Delivery',
        action: 'save',
        color: 'primary',
        icon: 'schedule'
      }
    ];

    const modalDialogRef = this.dialog.open(AppModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: false,
      panelClass: 'custom-modal-panel'
    });

    const instance = modalDialogRef.componentInstance;
    instance.config = modalConfig;
    instance.contentTemplate = this.deliveryFormTemplate;
    instance.leftButtons = leftButtons;
    instance.rightButtons = rightButtons;

    instance.buttonClicked.subscribe((action: string) => {
      if (action === 'save') {
        this.saveDelivery(modalDialogRef, instance);
      } else if (action === 'cancel') {
        this.dialogRef.close();
      }
    });

    modalDialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close(result);
    });
  }

  onTabChange(tabId: string): void {
    this.activeTab = tabId;
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
        const customer = this.customerOptions.find(c => c.id === customerId);
        if (customer && customer.details) {
          this.deliveryForm.patchValue({
            customerName: customer.label,
            customerPhone: customer.details['phone'],
            customerEmail: customer.details['email']
          });
        }
      }
    });
  }

  onDeliveryTypeChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.deliveryForm.patchValue({ deliveryType: value.value });
    }
  }

  onPriorityChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.deliveryForm.patchValue({ priority: value.value });
    }
  }

  onCustomerChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.deliveryForm.patchValue({ customerId: value.value });
      // The valueChanges subscriber will handle populating other fields
    }
  }

  onDriverChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.deliveryForm.patchValue({ assignedDriver: value.value });
    }
  }

  onVehicleChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.deliveryForm.patchValue({ assignedVehicle: value.value });
    }
  }

  onRouteChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.deliveryForm.patchValue({ deliveryRoute: value.value });
    }
  }

  isTabValid(tab: string): boolean {
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

  canSave(): boolean {
    const deliveryType = this.deliveryForm.get('deliveryType');
    const priority = this.deliveryForm.get('priority');
    const deliveryDate = this.deliveryForm.get('deliveryDate');
    const customerId = this.deliveryForm.get('customerId');
    const deliveryAddress = this.deliveryForm.get('deliveryAddress');
    
    return !!(
      deliveryType?.valid && deliveryType?.value &&
      priority?.valid && priority?.value &&
      deliveryDate?.valid && deliveryDate?.value &&
      customerId?.valid && customerId?.value &&
      deliveryAddress?.valid && deliveryAddress?.value
    );
  }

  saveDelivery(dialogRef: any, instance: AppModalComponent): void {
    if (!this.canSave()) {
      instance.showErrorMessage = true;
      instance.errorMessage = 'Please fill in all required fields';
      setTimeout(() => {
        instance.showErrorMessage = false;
      }, 3000);
      return;
    }

    const saveBtn = instance.rightButtons.find(b => b.action === 'save');
    if (saveBtn) saveBtn.loading = true;

    // Simulate API call
    setTimeout(() => {
      const deliveryData: DeliveryOrder = {
        id: 'DEL-' + Date.now(),
        ...this.deliveryForm.value
      };
      
      instance.showSuccessMessage = true;
      instance.successMessage = 'Delivery scheduled successfully!';
      
      setTimeout(() => {
        dialogRef.close(deliveryData);
      }, 1500);
    }, 800);
  }

  scheduleDelivery(): void {
    // This method is kept for backward compatibility but not used anymore
    // The actual save is handled by saveDelivery method
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

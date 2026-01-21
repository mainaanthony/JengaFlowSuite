import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AppTableComponent, ColumnConfig, TableAction, TableActionEvent } from '../../shared/app-table/app-table.component';
import { AppTabsComponent, Tab } from '../../shared/app-tabs/app-tabs.component';
import { InputDropdownComponent, DropdownOption, DropdownConfig } from '../../shared/input-dropdown/input-dropdown.component';
import { InputTextComponent, InputTextConfig } from '../../shared/input-text/input-text.component';
import { StepIndicatorComponent, Step } from '../../shared/step-indicator/step-indicator.component';
import { CheckoutModalComponent } from '../../shared/modals/checkout-modal.component';
import { AppModalComponent } from '../../shared/modals/app-modal.component';
import { ItemSelectorComponent, SelectorItem, ItemSelectorConfig } from '../../shared/item-selector/item-selector.component';

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
  imports: [CommonModule, FormsModule, MatIconModule, AppTableComponent, AppTabsComponent, InputDropdownComponent, InputTextComponent, StepIndicatorComponent, CheckoutModalComponent, AppModalComponent, ItemSelectorComponent],
  templateUrl: './test-pages.component.html',
  styleUrls: ['./test-pages.component.scss']
})
export class TestPagesComponent implements OnInit {
  @ViewChild('confirmDeleteTemplate') confirmDeleteTemplate!: TemplateRef<any>;
  @ViewChild('formContentTemplate') formContentTemplate!: TemplateRef<any>;
  @ViewChild('successTemplate') successTemplate!: TemplateRef<any>;

  constructor(private readonly dialog: MatDialog) {}
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

  // Dropdown Examples
  suppliers: DropdownOption[] = [
    {
      id: 1,
      label: 'Metro Building Supplies',
      value: 'metro',
      details: {
        email: 'procurement@metro.co.ke',
        phone: '+254 712 345 678',
        terms: 'Terms: Net 15',
        description: 'Leading building supplies distributor'
      }
    },
    {
      id: 2,
      label: 'ABC Hardware Suppliers',
      value: 'abc',
      details: {
        email: 'sales@abchardware.com',
        phone: '+254 722 456 789',
        terms: 'Terms: Net 30',
        description: 'Premium hardware solutions'
      }
    },
    {
      id: 3,
      label: 'Prime Tools Ltd',
      value: 'prime',
      details: {
        email: 'orders@primetools.co.ke',
        phone: '+254 733 567 890',
        terms: 'Terms: Net 7',
        description: 'Specialized tools and equipment'
      }
    }
  ];

  categories: DropdownOption[] = [
    { id: 1, label: 'Plumbing', value: 'plumbing' },
    { id: 2, label: 'Electrical', value: 'electrical' },
    { id: 3, label: 'Hardware', value: 'hardware' },
    { id: 4, label: 'Building Materials', value: 'materials' },
    { id: 5, label: 'Painting Supplies', value: 'painting' }
  ];

  paymentMethods: DropdownOption[] = [
    { id: 1, label: 'Cash', value: 'cash' },
    { id: 2, label: 'Credit Card', value: 'card' },
    { id: 3, label: 'Bank Transfer', value: 'transfer' },
    { id: 4, label: 'Check', value: 'check' },
    { id: 5, label: 'Mobile Money', value: 'mobile' }
  ];

  supplierConfig: DropdownConfig = {
    placeholder: 'Select supplier...',
    searchable: true,
    multiSelect: false,
    clearable: true,
    showDetailsCard: true,
    detailsTitle: 'Supplier Details',
    detailsFields: ['email', 'terms']
  };

  categoryConfig: DropdownConfig = {
    placeholder: 'Select category...',
    searchable: true,
    multiSelect: false,
    clearable: true,
    showDetailsCard: false
  };

  paymentConfig: DropdownConfig = {
    placeholder: 'Select payment method...',
    searchable: true,
    multiSelect: true,
    clearable: true,
    showDetailsCard: false
  };

  selectedSupplier: DropdownOption | null = null;
  selectedCategory: DropdownOption | null = null;
  selectedPayments: DropdownOption[] = [];

  dashboardTabs: Tab[] = [
    { id: 'today-sales', label: 'Today\'s Sales' },
    { id: 'pending-orders', label: 'Pending Orders' },
    { id: 'customers', label: 'Customers' }
  ];

  activeTab = 'today-sales';
  lastAction = '';

  // Text Input Examples
  productName = '';
  supplierEmail = '';
  contactPhone = '';
  productDescription = '';

  productNameConfig: InputTextConfig = {
    placeholder: 'Enter product name',
    label: 'Product Name',
    required: true,
    clearable: true,
    minLength: 3,
    maxLength: 50,
    helperText: 'Product name must be 3-50 characters'
  };

  emailConfig: InputTextConfig = {
    placeholder: 'Enter email address',
    label: 'Email Address',
    type: 'email',
    required: true,
    clearable: true,
    helperText: 'Valid email format required'
  };

  phoneConfig: InputTextConfig = {
    placeholder: 'Enter phone number',
    label: 'Phone Number',
    type: 'tel',
    clearable: true,
    helperText: 'Include country code (optional)'
  };

  descriptionConfig: InputTextConfig = {
    placeholder: 'Enter product description',
    label: 'Description',
    description: true,
    rows: 4,
    maxLength: 200,
    clearable: true,
    helperText: 'Brief description of the product'
  };

  // Item Selector Demo
  itemSelectorConfig: ItemSelectorConfig = {
    availableTitle: 'Available Products',
    selectedTitle: 'Shopping Cart (1)',
    actionIcon: 'shopping_cart',
    actionTooltip: 'Add to cart',
    showPrice: true,
    showStock: true,
    showQuantity: true,
    currencySymbol: 'KES',
    allowDragDrop: true
  };

  availableProducts: SelectorItem[] = [
    {
      id: 'prod-1',
      title: 'Samsung Galaxy A15',
      subtitle: 'SKU: SAM-A15-001',
      price: 18500,
      stock: 15,
      stockStatus: 'in-stock',
      quantity: 1
    },
    {
      id: 'prod-2',
      title: 'iPhone 15 Pro',
      subtitle: 'SKU: APP-IP15P-001',
      price: 125000,
      stock: 8,
      stockStatus: 'in-stock',
      quantity: 1
    },
    {
      id: 'prod-3',
      title: 'Sony WH-1000XM5 Headphones',
      subtitle: 'SKU: SON-WH-001',
      price: 32000,
      stock: 12,
      stockStatus: 'in-stock',
      quantity: 1
    },
    {
      id: 'prod-4',
      title: 'iPad Air 11-inch',
      subtitle: 'SKU: APP-IPAD-AIR-11',
      price: 89900,
      stock: 3,
      stockStatus: 'low-stock',
      quantity: 1
    },
    {
      id: 'prod-5',
      title: 'Samsung Galaxy Buds2 Pro',
      subtitle: 'SKU: SAM-BUDS-PRO',
      price: 16500,
      stock: 0,
      stockStatus: 'out-of-stock',
      quantity: 1
    },
    {
      id: 'prod-6',
      title: 'OnePlus 12',
      subtitle: 'SKU: ONE-12-001',
      price: 54900,
      stock: 20,
      stockStatus: 'in-stock',
      quantity: 1
    }
  ];

  selectedProducts: SelectorItem[] = [
    {
      id: 'prod-1',
      title: 'Samsung Galaxy A15',
      subtitle: 'SKU: SAM-A15-001',
      price: 18500,
      stock: 15,
      stockStatus: 'in-stock',
      quantity: 1
    }
  ];

  ngOnInit(): void {
    console.log('Test Pages initialized');
  }

  onTabChange(tabId: string): void {
    this.activeTab = tabId;
    console.log('Tab changed to:', tabId);
    this.lastAction = `Switched to ${this.dashboardTabs.find(t => t.id === tabId)?.label}`;
  }

  onSupplierChange(supplier: DropdownOption | DropdownOption[] | null): void {
    this.selectedSupplier = supplier as DropdownOption | null;
    console.log('Supplier selected:', supplier);
    this.lastAction = supplier ? `Supplier: ${(supplier as DropdownOption).label}` : 'Supplier cleared';
  }

  onCategoryChange(category: DropdownOption | DropdownOption[] | null): void {
    this.selectedCategory = category as DropdownOption | null;
    console.log('Category selected:', category);
    this.lastAction = category ? `Category: ${(category as DropdownOption).label}` : 'Category cleared';
  }

  onPaymentChange(payments: DropdownOption | DropdownOption[] | null): void {
    this.selectedPayments = Array.isArray(payments) ? payments : (payments ? [payments as DropdownOption] : []);
    console.log('Payments selected:', payments);
    const labels = this.selectedPayments.map(p => p.label).join(', ');
    this.lastAction = labels ? `Payments: ${labels}` : 'Payments cleared';
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

  onProductNameChange(value: string): void {
    this.productName = value;
    console.log('Product name:', value);
    this.lastAction = `Product Name: ${value}`;
  }

  onEmailChange(value: string): void {
    this.supplierEmail = value;
    console.log('Email:', value);
    this.lastAction = `Email: ${value}`;
  }

  onPhoneChange(value: string): void {
    this.contactPhone = value;
    console.log('Phone:', value);
    this.lastAction = `Phone: ${value}`;
  }

  onDescriptionChange(value: string): void {
    this.productDescription = value;
    console.log('Description:', value);
    this.lastAction = `Description updated (${value.length} chars)`;
  }

  // Step Indicator Demo Properties
  checkoutSteps: Step[] = [
    { id: 1, label: 'Customer', icon: 'person' },
    { id: 2, label: 'Products', icon: 'shopping_cart' },
    { id: 3, label: 'Checkout', icon: 'payment' }
  ];

  branchSteps: Step[] = [
    { id: 1, label: 'Basic Info', icon: 'info' },
    { id: 2, label: 'Location', icon: 'location_on' },
    { id: 3, label: 'Operations', icon: 'schedule' },
    { id: 4, label: 'Settings', icon: 'settings' }
  ];

  transferSteps: Step[] = [
    { id: 1, label: 'Source & Dest', icon: 'local_shipping' },
    { id: 2, label: 'Products', icon: 'inventory_2' },
    { id: 3, label: 'Quantities', icon: 'numbers' },
    { id: 4, label: 'Review', icon: 'assignment' },
    { id: 5, label: 'Confirm', icon: 'check_circle' }
  ];

  activeCheckoutStep = 1;
  completedCheckoutSteps: number[] = [];
  disabledCheckoutSteps: number[] = [];

  activeBranchStep = 1;
  completedBranchSteps: number[] = [];
  disabledBranchSteps: number[] = [];

  activeTransferStep = 1;
  completedTransferSteps: number[] = [];
  disabledTransferSteps: number[] = [3, 4, 5];

  // Step Indicator Methods
  onCheckoutStepChange(step: number): void {
    if (!this.disabledCheckoutSteps.includes(step)) {
      this.activeCheckoutStep = step;
      this.lastAction = `Checkout Step Changed to: ${step}`;
      console.log('Checkout step changed to:', step);
    }
  }

  markCheckoutStepComplete(): void {
    if (!this.completedCheckoutSteps.includes(this.activeCheckoutStep)) {
      this.completedCheckoutSteps.push(this.activeCheckoutStep);
      this.lastAction = `Checkout Step ${this.activeCheckoutStep} Completed`;
      console.log('Completed steps:', this.completedCheckoutSteps);
    }
  }

  resetCheckoutFlow(): void {
    this.activeCheckoutStep = 1;
    this.completedCheckoutSteps = [];
    this.lastAction = 'Checkout flow reset';
  }

  onBranchStepChange(step: number): void {
    if (!this.disabledBranchSteps.includes(step)) {
      this.activeBranchStep = step;
      this.lastAction = `Branch Setup Step Changed to: ${step}`;
      console.log('Branch step changed to:', step);
    }
  }

  completeBranchStep(step: number): void {
    if (!this.completedBranchSteps.includes(step)) {
      this.completedBranchSteps.push(step);
      this.lastAction = `Branch Step ${step} Completed`;
      console.log('Completed steps:', this.completedBranchSteps);
    }
  }

  resetBranchFlow(): void {
    this.activeBranchStep = 1;
    this.completedBranchSteps = [];
    this.lastAction = 'Branch setup flow reset';
  }

  onTransferStepChange(step: number): void {
    if (!this.disabledTransferSteps.includes(step)) {
      this.activeTransferStep = step;
      this.lastAction = `Transfer Step Changed to: ${step}`;
      console.log('Transfer step changed to:', step);
    }
  }

  completeTransferStep(step: number): void {
    if (!this.completedTransferSteps.includes(step) && !this.disabledTransferSteps.includes(step)) {
      this.completedTransferSteps.push(step);
      // Enable next step when current is completed
      if (this.disabledTransferSteps.includes(step + 1)) {
        this.disabledTransferSteps = this.disabledTransferSteps.filter(s => s !== step + 1);
      }
      this.lastAction = `Transfer Step ${step} Completed`;
      console.log('Completed steps:', this.completedTransferSteps);
    }
  }

  resetTransferFlow(): void {
    this.activeTransferStep = 1;
    this.completedTransferSteps = [];
    this.disabledTransferSteps = [3, 4, 5];
    this.lastAction = 'Transfer flow reset';
  }

  // Open Checkout Modal with Step Indicator
  openCheckoutModal(): void {
    this.dialog.open(CheckoutModalComponent, {
      disableClose: false,
      panelClass: 'custom-modal-container'
    });
  }

  // Test Modal: Confirmation Dialog
  openConfirmDeleteModal(): void {
    const dialogRef = this.dialog.open(AppModalComponent, {
      disableClose: false,
      panelClass: 'custom-modal-container'
    });

    const instance = dialogRef.componentInstance;
    instance.config = {
      title: 'Delete Product',
      description: 'Are you sure you want to delete this product? This action cannot be undone.',
      subtitle: 'This will permanently remove the product from inventory'
    };
    instance.leftButtons = [
      { label: 'Cancel', action: 'cancel', color: 'default' }
    ];
    instance.rightButtons = [
      { label: 'Delete', action: 'delete', color: 'accent', icon: 'delete' }
    ];

    instance.buttonClicked.subscribe((action: string) => {
      if (action === 'delete') {
        const deleteBtn = instance.rightButtons.find(b => b.action === 'delete');
        if (deleteBtn) deleteBtn.loading = true;
        setTimeout(() => {
          instance.showSuccessMessage = true;
          instance.successMessage = 'Product deleted successfully!';
          setTimeout(() => {
            dialogRef.close();
          }, 2000);
        }, 1000);
      }
    });
  }

  // Test Modal: Form Dialog with Input
  openFormModal(): void {
    const dialogRef = this.dialog.open(AppModalComponent, {
      disableClose: false,
      panelClass: 'custom-modal-container'
    });

    const instance = dialogRef.componentInstance;
    instance.config = {
      title: 'Add New Supplier',
      description: 'Fill in the supplier information below',
      subtitle: 'All fields marked with * are required'
    };
    instance.leftButtons = [
      { label: 'Cancel', action: 'cancel', color: 'default' }
    ];
    instance.rightButtons = [
      { label: 'Save', action: 'save', color: 'primary', icon: 'save' }
    ];

    let isSaving = false;
    instance.saveCompleted.subscribe(() => {
      if (!isSaving) {
        isSaving = true;
        const saveBtn = instance.rightButtons.find(b => b.action === 'save');
        if (saveBtn) saveBtn.loading = true;

        setTimeout(() => {
          instance.showSuccessMessage = true;
          instance.successMessage = 'Supplier added successfully!';
          if (saveBtn) saveBtn.loading = false;
          setTimeout(() => {
            dialogRef.close();
          }, 2000);
        }, 1500);
      }
    });
  }

  // Test Modal: Simple Info Dialog
  openInfoModal(): void {
    const dialogRef = this.dialog.open(AppModalComponent, {
      disableClose: false,
      panelClass: 'custom-modal-container'
    });

    const instance = dialogRef.componentInstance;
    instance.config = {
      title: 'System Notification',
      description: 'Your inventory sync is complete.',
      subtitle: 'All changes have been saved to the database'
    };
    instance.leftButtons = [];
    instance.rightButtons = [
      { label: 'Got it', action: 'close', color: 'primary' }
    ];
  }

  // Item Selector Event Handlers
  onItemSelected(item: SelectorItem): void {
    console.log('Item added to cart:', item);
    this.itemSelectorConfig.selectedTitle = `Shopping Cart (${this.selectedProducts.length})`;
  }

  onItemRemoved(item: SelectorItem): void {
    console.log('Item removed from cart:', item);
    this.itemSelectorConfig.selectedTitle = `Shopping Cart (${this.selectedProducts.length})`;
  }

  onItemMoved(event: { item: SelectorItem; from: 'available' | 'selected'; to: 'available' | 'selected' }): void {
    console.log('Item moved:', event);
  }

  onSelectedItemsChanged(items: SelectorItem[]): void {
    this.selectedProducts = items;
    this.itemSelectorConfig.selectedTitle = `Shopping Cart (${items.length})`;
    console.log('Selected items updated:', items);
  }
}

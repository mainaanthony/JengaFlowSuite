import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InputTextComponent, InputTextConfig } from '../../shared/input-text/input-text.component';
import { InputDropdownComponent, DropdownOption, DropdownConfig } from '../../shared/input-dropdown/input-dropdown.component';
import { AppModalComponent, AppModalConfig, ModalButton } from '../../shared/modals/app-modal.component';
import { 
  SaleRepository, 
  ProductRepository,
  Sale as DomainSale, 
  SaleItem as DomainSaleItem,
  Customer as DomainCustomer,
  Product as DomainProduct
} from '../../core/domain/domain.barrel';
import { PaymentMethod, OrderStatus } from '../../core/enums/enums.barrel';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
}

interface CartItem {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface SaleTransaction {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  cartItems: CartItem[];
  subtotal: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  paymentMethod: 'Cash' | 'M-Pesa' | 'Card';
  amountPaid: number;
  balance: number;
  notes: string;
  timestamp: Date;
  attendant: string;
}

@Component({
  selector: 'app-new-sale-modal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatIconModule,
    InputTextComponent,
    InputDropdownComponent
  ],
  templateUrl: './new-sale-modal.component.html',
  styleUrls: ['./new-sale-modal.component.scss']
})
export class NewSaleModalComponent implements OnInit, AfterViewInit {
  @ViewChild('saleFormTemplate') saleFormTemplate!: TemplateRef<any>;
  currentStep: 1 | 2 | 3 = 1;
  Math = Math;
  modalInstance: any = null;

  // Forms
  customerForm!: FormGroup;
  productsForm!: FormGroup;
  checkoutForm!: FormGroup;

  // Data
  customers: Customer[] = [
    { id: '1', name: 'John Kamau', phone: '0712345678', email: 'john@example.com', loyaltyPoints: 450 },
    { id: '2', name: 'Mary Kipchoge', phone: '0723456789', email: 'mary@example.com', loyaltyPoints: 320 },
    { id: '3', name: 'Walk-in Customer', phone: '', email: '', loyaltyPoints: 0 }
  ];

  products: Product[] = [
    { id: '1', name: 'Samsung Galaxy A15', sku: 'SAM-A15-001', price: 18500, stock: 15, category: 'Electronics' },
    { id: '2', name: 'iPhone 15 Pro', sku: 'APP-IP15P-001', price: 125000, stock: 8, category: 'Electronics' },
    { id: '3', name: 'Sony WH-1000XM5 Headphones', sku: 'SON-WH-001', price: 32000, stock: 12, category: 'Accessories' },
    { id: '4', name: 'Samsung 65" QLED TV', sku: 'SAM-TV65-001', price: 85000, stock: 3, category: 'Electronics' },
    { id: '5', name: 'Portable Charger 20000mAh', sku: 'POR-CHG-20K', price: 3500, stock: 45, category: 'Accessories' }
  ];

  filteredProducts: Product[] = [];
  filteredCustomers: Customer[] = [];

  selectedCustomer: Customer | null = null;
  cart: CartItem[] = [];
  showNewCustomerForm: boolean = false;
  totals = {
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0
  };

  // Input Text Configurations
  newCustomerNameConfig: InputTextConfig = {
    placeholder: 'Enter full name',
    label: 'Customer Name',
    required: true,
    clearable: true
  };

  newCustomerPhoneConfig: InputTextConfig = {
    placeholder: 'Enter phone number',
    label: 'Phone Number',
    type: 'tel',
    required: true,
    clearable: true
  };

  discountValueConfig: InputTextConfig = {
    placeholder: '0',
    label: 'Discount Value',
    type: 'number',
    required: true,
    clearable: true
  };

  amountPaidConfig: InputTextConfig = {
    placeholder: '0',
    label: 'Amount Paid (KES)',
    type: 'number',
    required: true,
    clearable: true
  };

  notesConfig: InputTextConfig = {
    placeholder: 'Add order notes...',
    label: 'Notes (Optional)',
    description: true,
    rows: 3,
    clearable: true
  };

  // Dropdown Options
  discountTypeOptions: DropdownOption[] = [
    { id: 'percentage', label: 'Discount %', value: 'percentage' },
    { id: 'fixed', label: 'Discount KES', value: 'fixed' }
  ];

  paymentMethodOptions: DropdownOption[] = [
    { id: 'cash', label: 'Cash', value: 'Cash' },
    { id: 'mpesa', label: 'M-Pesa', value: 'M-Pesa' },
    { id: 'card', label: 'Card', value: 'Card' }
  ];

  // Dropdown Configurations
  discountTypeDropdownConfig: DropdownConfig = {
    placeholder: 'Select discount type',
    searchable: false,
    clearable: false
  };

  paymentMethodDropdownConfig: DropdownConfig = {
    placeholder: 'Select payment method',
    searchable: false,
    clearable: false
  };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<NewSaleModalComponent>,
    private saleRepository: SaleRepository,
    private productRepository: ProductRepository,
    @Inject(MAT_DIALOG_DATA) public data?: { saleId?: number }
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadProducts();
    this.filteredCustomers = [...this.customers];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.openModal();
    });
  }

  openModal(): void {
    const modalConfig: AppModalConfig = {
      title: 'New Sale',
      subtitle: 'Process a new sales transaction',
      wide: true
    };

    const leftButtons: ModalButton[] = [];
    const rightButtons: ModalButton[] = [];

    // Step-specific buttons
    if (this.currentStep === 1) {
      leftButtons.push({
        label: 'Cancel',
        action: 'cancel',
        color: 'default'
      });
      rightButtons.push({
        label: 'Continue',
        action: 'next',
        color: 'primary',
        icon: 'arrow_forward',
        disabled: !this.canProceedToStep2()
      });
    } else if (this.currentStep === 2) {
      leftButtons.push({
        label: 'Back',
        action: 'previous',
        color: 'default',
        icon: 'arrow_back'
      });
      rightButtons.push({
        label: 'Continue',
        action: 'next',
        color: 'primary',
        icon: 'arrow_forward',
        disabled: !this.canProceedToStep3()
      });
    } else if (this.currentStep === 3) {
      leftButtons.push({
        label: 'Back',
        action: 'previous',
        color: 'default',
        icon: 'arrow_back'
      });
      rightButtons.push({
        label: 'Complete Sale',
        action: 'save',
        color: 'primary',
        icon: 'check'
      });
    }

    const modalDialogRef = this.dialog.open(AppModalComponent, {
      width: '1200px',
      maxWidth: '95vw',
      disableClose: false,
      panelClass: 'custom-modal-panel'
    });

    const instance = modalDialogRef.componentInstance;
    this.modalInstance = instance;
    instance.config = modalConfig;
    instance.contentTemplate = this.saleFormTemplate;
    instance.leftButtons = leftButtons;
    instance.rightButtons = rightButtons;

    instance.buttonClicked.subscribe((action: string) => {
      if (action === 'save') {
        this.completeSale(modalDialogRef, instance);
      } else if (action === 'next') {
        this.nextStep();
        this.updateModalButtons(instance);
      } else if (action === 'previous') {
        this.previousStep();
        this.updateModalButtons(instance);
      } else if (action === 'cancel') {
        this.dialogRef.close();
      }
    });

    modalDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.dialogRef.close(result);
      }
    });
  }

  private initializeForms(): void {
    this.customerForm = this.fb.group({
      customerSearch: [''],
      newCustomerName: [''],
      newCustomerPhone: ['']
    });

    this.productsForm = this.fb.group({
      productSearch: [''],
      barcodeInput: ['']
    });

    this.checkoutForm = this.fb.group({
      discountType: ['percentage'],
      discountValue: [0, [Validators.required, Validators.min(0)]],
      paymentMethod: ['Cash', Validators.required],
      amountPaid: [0, [Validators.required, Validators.min(0)]],
      notes: ['']
    });

    // Set initial dropdown values
    this.checkoutForm.patchValue({
      discountType: 'percentage',
      paymentMethod: 'Cash'
    });
  }

  // Dropdown Change Handlers
  onDiscountTypeChange(value: string): void {
    this.checkoutForm.patchValue({ discountType: value });
    this.onDiscountChange();
  }

  onPaymentMethodChange(value: string): void {
    this.checkoutForm.patchValue({ paymentMethod: value });
  }

  updateButtonState(): void {
    if (!this.modalInstance) return;

    if (this.currentStep === 1) {
      const canProceed = this.canProceedToStep2();
      if (this.modalInstance.rightButtons && this.modalInstance.rightButtons.length > 0) {
        this.modalInstance.rightButtons[0].disabled = !canProceed;
      }
    } else if (this.currentStep === 2) {
      const canProceed = this.canProceedToStep3();
      if (this.modalInstance.rightButtons && this.modalInstance.rightButtons.length > 0) {
        this.modalInstance.rightButtons[0].disabled = !canProceed;
      }
    }
  }

  updateModalButtons(instance: AppModalComponent): void {
    const leftButtons: ModalButton[] = [];
    const rightButtons: ModalButton[] = [];

    if (this.currentStep === 1) {
      leftButtons.push({
        label: 'Cancel',
        action: 'cancel',
        color: 'default'
      });
      rightButtons.push({
        label: 'Continue',
        action: 'next',
        color: 'primary',
        icon: 'arrow_forward',
        disabled: !this.canProceedToStep2()
      });
    } else if (this.currentStep === 2) {
      leftButtons.push({
        label: 'Back',
        action: 'previous',
        color: 'default',
        icon: 'arrow_back'
      });
      rightButtons.push({
        label: 'Continue',
        action: 'next',
        color: 'primary',
        icon: 'arrow_forward',
        disabled: !this.canProceedToStep3()
      });
    } else if (this.currentStep === 3) {
      leftButtons.push({
        label: 'Back',
        action: 'previous',
        color: 'default',
        icon: 'arrow_back'
      });
      rightButtons.push({
        label: 'Complete Sale',
        action: 'save',
        color: 'primary',
        icon: 'check'
      });
    }

    instance.leftButtons = leftButtons;
    instance.rightButtons = rightButtons;
  }

  // Step 1: Customer Selection
  searchCustomers(): void {
    const searchTerm = this.customerForm.get('customerSearch')?.value.toLowerCase();
    this.filteredCustomers = this.customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm) ||
      c.phone.includes(searchTerm)
    );
  }

  selectCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.showNewCustomerForm = false;
    this.updateButtonState();
  }

  toggleNewCustomerForm(): void {
    this.showNewCustomerForm = !this.showNewCustomerForm;
    if (this.showNewCustomerForm) {
      this.selectedCustomer = null;
    }
    this.updateButtonState();
  }

  createNewCustomer(): void {
    const name = this.customerForm.get('newCustomerName')?.value;
    const phone = this.customerForm.get('newCustomerPhone')?.value;

    if (!name || !phone) {
      alert('Please enter customer name and phone');
      return;
    }

    const newCustomer: Customer = {
      id: Date.now().toString(),
      name,
      phone,
      email: '',
      loyaltyPoints: 0
    };

    this.customers.push(newCustomer);
    this.filteredCustomers = [...this.customers];
    this.selectedCustomer = newCustomer;
    this.showNewCustomerForm = false;

    this.customerForm.patchValue({
      newCustomerName: '',
      newCustomerPhone: ''
    });

    this.updateButtonState();
  }

  canProceedToStep2(): boolean {
    return !!this.selectedCustomer;
  }

  // Step 2: Product Selection
  searchProducts(): void {
    const searchTerm = this.productsForm.get('productSearch')?.value.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.sku.includes(searchTerm)
    );
  }

  scanBarcode(): void {
    const barcode = this.productsForm.get('barcodeInput')?.value;
    const product = this.products.find(p => p.sku === barcode);
    if (product) {
      this.addProductToCart(product);
      this.productsForm.get('barcodeInput')?.reset();
    }
  }

  addProductToCart(product: Product): void {
    const existingItem = this.cart.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.subtotal = existingItem.price * existingItem.quantity;
    } else {
      this.cart.push({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        price: product.price,
        quantity: 1,
        subtotal: product.price
      });
    }

    this.calculateTotals();
    this.updateButtonState();
  }

  updateCartQuantity(index: number, newQuantity: number): void {
    if (newQuantity > 0) {
      this.cart[index].quantity = newQuantity;
      this.cart[index].subtotal = this.cart[index].price * newQuantity;
    }
    this.calculateTotals();
    this.updateButtonState();
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    this.calculateTotals();
    this.updateButtonState();
  }

  canProceedToStep3(): boolean {
    return this.cart.length > 0;
  }

  // Step 3: Checkout
  calculateTotals(): void {
    const subtotal = this.cart.reduce((sum, item) => sum + item.subtotal, 0);

    const discountType = this.checkoutForm.get('discountType')?.value;
    const discountValue = parseFloat(this.checkoutForm.get('discountValue')?.value || 0);

    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = (subtotal * discountValue) / 100;
    } else {
      discountAmount = discountValue;
    }

    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * 0.16; // 16% VAT
    const total = subtotalAfterDiscount + taxAmount;

    this.totals = {
      subtotal,
      discountAmount,
      taxAmount,
      total
    };
  }

  getBalance(): number {
    const amountPaid = parseFloat(this.checkoutForm.get('amountPaid')?.value || 0);
    return this.totals.total - amountPaid;
  }

  onDiscountChange(): void {
    this.calculateTotals();
  }

  completeSale(modalDialogRef: MatDialogRef<AppModalComponent>, instance: any): void {
    if (!this.selectedCustomer || this.cart.length === 0) {
      alert('Please select a customer and add products');
      return;
    }

    if (!this.checkoutForm.valid) {
      alert('Please complete the checkout form');
      return;
    }

    instance.loading = true;

    // Create the sale with items - backend will calculate totals
    const saleData = {
      customerId: parseInt(this.selectedCustomer.id),
      branchId: 1, // Default branch - should come from authenticated user context
      attendantUserId: 1, // Should come from authenticated user
      paymentMethod: this.checkoutForm.get('paymentMethod')?.value,
      notes: this.checkoutForm.get('notes')?.value || '',
      items: this.cart.map(item => ({
        productId: parseInt(item.productId),
        quantity: item.quantity,
        unitPrice: item.price,
        discount: 0 // Can be added if discount is  tracked
      }))
    };

    // Create the sale - backend calculates and returns authoritative totals
    this.saleRepository.create(saleData as any, { 
      description: `New sale for ${this.selectedCustomer.name}` 
    }).subscribe({
        next: (createdSale) => {
          console.log('Sale created with backend-calculated total:', createdSale.totalAmount);
          instance.loading = false;
          modalDialogRef.close(createdSale);
          this.dialogRef.close(createdSale);
        },
        error: (err: any) => {
          console.error('Failed to create sale:', err);
          alert('Failed to create sale. Please try again.');
          instance.loading = false;
        }
      });
  }

  loadProducts(): void {
    this.productRepository.getAll().subscribe({
      next: (products: DomainProduct[]) => {
        this.products = products.map(p => ({
          id: p.id.toString(),
          name: p.name,
          sku: p.sku,
          price: p.price,
          stock: 0, // Not in domain model - would need inventory
          category: '' // Would need to fetch category name
        }));
        this.filteredProducts = [...this.products];
      },
      error: (err: any) => {
        console.error('Failed to load products:', err);
        this.filteredProducts = [];
      }
    });
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep = (this.currentStep - 1) as any;
    }
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.canProceedToStep2()) {
      this.currentStep = 2;
    } else if (this.currentStep === 2 && this.canProceedToStep3()) {
      this.currentStep = 3;
    }
  }
}

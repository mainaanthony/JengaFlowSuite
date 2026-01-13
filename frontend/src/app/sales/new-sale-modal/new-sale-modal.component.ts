import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './new-sale-modal.component.html',
  styleUrls: ['./new-sale-modal.component.scss']
})
export class NewSaleModalComponent implements OnInit {
  currentStep: 1 | 2 | 3 = 1;
  Math = Math;

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
  totals = {
    subtotal: 0,
    discountAmount: 0,
    taxAmount: 0,
    total: 0
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewSaleModalComponent>
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.filteredProducts = [...this.products];
    this.filteredCustomers = [...this.customers];
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
  }

  createNewCustomer(): void {
    const name = this.customerForm.get('newCustomerName')?.value;
    const phone = this.customerForm.get('newCustomerPhone')?.value;

    if (name && phone) {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name,
        phone,
        email: '',
        loyaltyPoints: 0
      };
      this.selectedCustomer = newCustomer;
      this.customers.push(newCustomer);
    }
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
  }

  updateCartQuantity(index: number, newQuantity: number): void {
    if (newQuantity > 0) {
      this.cart[index].quantity = newQuantity;
      this.cart[index].subtotal = this.cart[index].price * newQuantity;
    }
    this.calculateTotals();
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    this.calculateTotals();
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

  completeSale(): void {
    if (!this.selectedCustomer || this.cart.length === 0) {
      alert('Please select a customer and add products');
      return;
    }

    if (!this.checkoutForm.valid) {
      alert('Please complete the checkout form');
      return;
    }

    const saleData: SaleTransaction = {
      id: 'TRX-' + Date.now(),
      customerId: this.selectedCustomer.id,
      customerName: this.selectedCustomer.name,
      customerPhone: this.selectedCustomer.phone,
      cartItems: this.cart,
      subtotal: this.totals.subtotal,
      discountType: this.checkoutForm.get('discountType')?.value,
      discountValue: parseFloat(this.checkoutForm.get('discountValue')?.value || 0),
      discountAmount: this.totals.discountAmount,
      taxAmount: this.totals.taxAmount,
      total: this.totals.total,
      paymentMethod: this.checkoutForm.get('paymentMethod')?.value,
      amountPaid: parseFloat(this.checkoutForm.get('amountPaid')?.value || 0),
      balance: this.getBalance(),
      notes: this.checkoutForm.get('notes')?.value || '',
      timestamp: new Date(),
      attendant: 'Current User' // Will be replaced with actual user
    };

    this.dialogRef.close(saleData);
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

  closeDialog(): void {
    this.dialogRef.close();
  }
}

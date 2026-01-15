import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
}

interface Branch {
  id: string;
  name: string;
}

interface SelectedProduct {
  product: Product;
  quantity: number;
}

interface TransferData {
  fromBranch: string;
  toBranch: string;
  transferType: string;
  priorityLevel: string;
  requestedBy: string;
  expectedDate: string;
  reason: string;
  additionalNotes: string;
  selectedProducts: SelectedProduct[];
}

@Component({
  selector: 'app-stock-transfer-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, FormsModule],
  templateUrl: './stock-transfer-modal.component.html',
  styleUrl: './stock-transfer-modal.component.scss'
})
export class StockTransferModalComponent implements OnInit {
  currentStep: 1 | 2 | 3 = 1;
  completedSteps = new Set<number>();
  searchControl: string = '';

  transferDetailsForm!: FormGroup;
  reviewForm!: FormGroup;

  // Mock data
  branches: Branch[] = [
    { id: 'BR-001', name: 'Main Branch' },
    { id: 'BR-002', name: 'Westlands Branch' },
    { id: 'BR-003', name: 'Eastleigh Branch' },
    { id: 'BR-004', name: 'Industrial Area' }
  ];

  allProducts: Product[] = [
    { id: 'PRD-001', name: 'Dell Laptop XPS 13', sku: 'DL-XPS13-001', stock: 15, price: 85000 },
    { id: 'PRD-002', name: 'iPhone 14 Pro', sku: 'IP-14P-001', stock: 8, price: 120000 },
    { id: 'PRD-003', name: 'Samsung 55" TV', sku: 'SM-TV55-001', stock: 5, price: 65000 },
    { id: 'PRD-004', name: 'HP Printer LaserJet', sku: 'HP-LJ-001', stock: 12, price: 25000 },
    { id: 'PRD-005', name: 'Sony WH-1000XM5 Headphones', sku: 'SN-WH5-001', stock: 22, price: 35000 },
    { id: 'PRD-006', name: 'iPad Air 5', sku: 'IP-AIR5-001', stock: 10, price: 95000 },
    { id: 'PRD-007', name: 'MacBook Pro 14"', sku: 'MB-PRO14-001', stock: 6, price: 200000 },
    { id: 'PRD-008', name: 'LG Ultrawide Monitor', sku: 'LG-UW34-001', stock: 9, price: 45000 },
    { id: 'PRD-009', name: 'Logitech MX Master 3S', sku: 'LG-MXM3S-001', stock: 18, price: 15000 },
    { id: 'PRD-010', name: 'Corsair K95 Mechanical Keyboard', sku: 'CR-K95-001', stock: 14, price: 22000 },
    { id: 'PRD-011', name: 'Razer DeathAdder Mouse', sku: 'RZ-DA-001', stock: 25, price: 8000 },
    { id: 'PRD-012', name: 'ASUS ROG Gaming Laptop', sku: 'AS-ROG-001', stock: 7, price: 150000 },
    { id: 'PRD-013', name: 'Samsung SSD 980 Pro', sku: 'SM-SSD980-001', stock: 32, price: 12000 },
    { id: 'PRD-014', name: 'Western Digital HDD', sku: 'WD-HDD-001', stock: 20, price: 8500 },
    { id: 'PRD-015', name: 'BenQ PD Monitor 27"', sku: 'BQ-PD27-001', stock: 11, price: 35000 },
    { id: 'PRD-016', name: 'Elgato Stream Deck', sku: 'EL-SD-001', stock: 16, price: 28000 },
    { id: 'PRD-017', name: 'Blue Yeti Microphone', sku: 'BL-YETI-001', stock: 19, price: 12000 },
    { id: 'PRD-018', name: 'Rode Wireless Mic', sku: 'RD-WM-001', stock: 13, price: 18000 },
    { id: 'PRD-019', name: 'Peak Design Backpack', sku: 'PK-BAG-001', stock: 24, price: 22000 },
    { id: 'PRD-020', name: 'Canon EOS R6 Camera', sku: 'CN-R6-001', stock: 4, price: 280000 }
  ];

  transferTypes = ['Inter-Branch Transfer', 'Stock Replenishment', 'Emergency Transfer', 'Return Transfer'];
  priorityLevels = ['Low Priority', 'Normal Priority', 'High Priority', 'Urgent'];

  selectedProducts: SelectedProduct[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<StockTransferModalComponent>
  ) {
    this.initializeForms();
  }

  ngOnInit() {}

  private initializeForms() {
    this.transferDetailsForm = this.formBuilder.group({
      fromBranch: ['', Validators.required],
      toBranch: ['', Validators.required],
      transferType: ['Inter-Branch Transfer', Validators.required],
      priorityLevel: ['Normal Priority', Validators.required],
      requestedBy: ['', Validators.required],
      expectedDate: ['', Validators.required],
      reason: ['', Validators.required],
      additionalNotes: ['']
    });
  }

  setStep(step: 1 | 2 | 3) {
    if (this.canProceedToStep(step)) {
      this.currentStep = step;
    }
  }

  canProceedToStep(step: 1 | 2 | 3): boolean {
    if (step === 1) return true;
    if (step === 2) return this.transferDetailsForm.valid;
    if (step === 3) return this.transferDetailsForm.valid && this.selectedProducts.length > 0;
    return false;
  }

  isStepActive(step: 1 | 2 | 3): boolean {
    return this.currentStep === step;
  }

  isStepCompleted(step: 1 | 2 | 3): boolean {
    return this.completedSteps.has(step);
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep = (this.currentStep - 1) as 1 | 2 | 3;
    }
  }

  nextStep() {
    if (this.canProceedToStep((this.currentStep + 1) as 1 | 2 | 3)) {
      this.completedSteps.add(this.currentStep);
      this.currentStep = (this.currentStep + 1) as 1 | 2 | 3;
    }
  }

  getFilteredProducts(): Product[] {
    if (!this.searchControl.trim()) {
      return this.allProducts.filter(p => !this.selectedProducts.some(sp => sp.product.id === p.id));
    }

    const term = this.searchControl.toLowerCase();
    return this.allProducts.filter(p => 
      !this.selectedProducts.some(sp => sp.product.id === p.id) &&
      (p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term))
    );
  }

  addProduct(product: Product) {
    if (!this.selectedProducts.some(sp => sp.product.id === product.id)) {
      this.selectedProducts.push({ product, quantity: 1 });
      this.searchControl = '';
    }
  }

  removeProduct(productId: string) {
    this.selectedProducts = this.selectedProducts.filter(sp => sp.product.id !== productId);
  }

  updateQuantity(productId: string, quantity: number) {
    const selected = this.selectedProducts.find(sp => sp.product.id === productId);
    if (selected && quantity > 0 && quantity <= selected.product.stock) {
      selected.quantity = quantity;
    }
  }

  increaseQuantity(productId: string) {
    const selected = this.selectedProducts.find(sp => sp.product.id === productId);
    if (selected && selected.quantity < selected.product.stock) {
      selected.quantity++;
    }
  }

  decreaseQuantity(productId: string) {
    const selected = this.selectedProducts.find(sp => sp.product.id === productId);
    if (selected && selected.quantity > 1) {
      selected.quantity--;
    }
  }

  getTotalValue(): number {
    return this.selectedProducts.reduce((sum, sp) => sum + (sp.product.price * sp.quantity), 0);
  }

  formatCurrency(value: number): string {
    return `KSH ${value.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  submitTransfer() {
    if (this.canProceedToStep(3)) {
      const transferData: TransferData = {
        fromBranch: this.transferDetailsForm.get('fromBranch')?.value,
        toBranch: this.transferDetailsForm.get('toBranch')?.value,
        transferType: this.transferDetailsForm.get('transferType')?.value,
        priorityLevel: this.transferDetailsForm.get('priorityLevel')?.value,
        requestedBy: this.transferDetailsForm.get('requestedBy')?.value,
        expectedDate: this.transferDetailsForm.get('expectedDate')?.value,
        reason: this.transferDetailsForm.get('reason')?.value,
        additionalNotes: this.transferDetailsForm.get('additionalNotes')?.value,
        selectedProducts: this.selectedProducts
      };

      this.dialogRef.close(transferData);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getFromBranchName(): string {
    const branchId = this.transferDetailsForm.get('fromBranch')?.value;
    return this.branches.find(b => b.id === branchId)?.name || '';
  }

  getToBranchName(): string {
    const branchId = this.transferDetailsForm.get('toBranch')?.value;
    return this.branches.find(b => b.id === branchId)?.name || '';
  }

  getPriorityBadgeClass(priority: string): string {
    if (priority.includes('Low')) return 'priority-low';
    if (priority.includes('High') || priority.includes('Urgent')) return 'priority-high';
    return 'priority-normal';
  }}
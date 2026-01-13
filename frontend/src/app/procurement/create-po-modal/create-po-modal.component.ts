import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

interface Supplier {
  id: string;
  name: string;
  category: string;
  paymentTerms: string;
}

interface POItem {
  id: string;
  name: string;
  description: string;
  specifications: string;
  quantity: number;
  unitPrice: number;
  urgency: string;
  total: number;
}

interface PurchaseOrder {
  poNumber: string;
  supplier: string;
  supplierDetails: Supplier | null;
  paymentTerms: string;
  requestedBy: string;
  branch: string;
  priority: string;
  expectedDelivery: string;
  deliveryAddress: string;
  budgetCode: string;
  approver: string;
  items: POItem[];
  subtotal: number;
  vat: number;
  total: number;
  publicNotes: string;
  internalNotes: string;
  attachments: File[];
}

@Component({
  selector: 'app-create-po-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './create-po-modal.component.html',
  styleUrls: ['./create-po-modal.component.scss']
})
export class CreatePOModalComponent implements OnInit {
  currentStep: 1 | 2 | 3 = 1;
  poForm!: FormGroup;
  itemForm!: FormGroup;
  reviewForm!: FormGroup;

  activeReviewTab: 'review' | 'notes' = 'review';

  suppliers: Supplier[] = [
    { id: '1', name: 'Metro Building Supplies', category: 'Construction Materials', paymentTerms: 'Net 15' },
    { id: '2', name: 'ABC Hardware Suppliers', category: 'Hardware & Tools', paymentTerms: 'Net 30' },
    { id: '3', name: 'Prime Tools Ltd', category: 'Equipment', paymentTerms: 'Net 45' }
  ];

  paymentTermsOptions = ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Cash on Delivery'];
  branches = ['Westlands Branch', 'CBD Branch', 'Eastlands Branch', 'Mombasa Branch'];
  priorities = ['Normal', 'High', 'Urgent', 'Low'];
  urgencies = ['Normal', 'Urgent', 'Critical'];
  budgetCodes = ['CAPEX-2026-001', 'OPEX-2026-045', 'PROJ-2026-012'];
  approvers = ['Sarah Johnson - Manager', 'David Mwangi - Director', 'Grace Kimani - Finance Head'];

  items: POItem[] = [];
  selectedSupplier: Supplier | null = null;
  attachments: File[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreatePOModalComponent>
  ) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.poForm = this.fb.group({
      supplier: ['', Validators.required],
      paymentTerms: ['', Validators.required],
      poNumber: [this.generatePONumber()],
      requestedBy: ['John Mwangi'],
      branch: ['', Validators.required],
      priority: ['Normal', Validators.required],
      expectedDelivery: [''],
      deliveryAddress: ['', Validators.required],
      budgetCode: [''],
      approver: ['']
    });

    this.itemForm = this.fb.group({
      itemName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      urgency: ['Normal', Validators.required],
      description: [''],
      specifications: ['']
    });

    this.reviewForm = this.fb.group({
      publicNotes: [''],
      internalNotes: ['']
    });

    // Watch supplier selection
    this.poForm.get('supplier')?.valueChanges.subscribe(supplierId => {
      this.selectedSupplier = this.suppliers.find(s => s.id === supplierId) || null;
      if (this.selectedSupplier) {
        this.poForm.patchValue({ paymentTerms: this.selectedSupplier.paymentTerms });
      }
    });
  }

  private generatePONumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `PO-${year}-${random}`;
  }

  getSupplierDisplay(supplierId: string): string {
    const supplier = this.suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : '';
  }

  getItemTotal(): number {
    const quantity = this.itemForm.get('quantity')?.value || 0;
    const unitPrice = this.itemForm.get('unitPrice')?.value || 0;
    return quantity * unitPrice;
  }

  addItem(): void {
    if (!this.itemForm.valid) {
      alert('Please fill in all required item fields');
      return;
    }

    const newItem: POItem = {
      id: Date.now().toString(),
      name: this.itemForm.get('itemName')?.value,
      description: this.itemForm.get('description')?.value || '',
      specifications: this.itemForm.get('specifications')?.value || '',
      quantity: this.itemForm.get('quantity')?.value,
      unitPrice: this.itemForm.get('unitPrice')?.value,
      urgency: this.itemForm.get('urgency')?.value,
      total: this.getItemTotal()
    };

    this.items.push(newItem);
    this.itemForm.reset({
      itemName: '',
      quantity: 1,
      unitPrice: 0,
      urgency: 'Normal',
      description: '',
      specifications: ''
    });
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  updateItemQuantity(index: number, newQuantity: number): void {
    if (newQuantity > 0) {
      this.items[index].quantity = newQuantity;
      this.items[index].total = this.items[index].quantity * this.items[index].unitPrice;
    }
  }

  getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  getVAT(): number {
    return this.getSubtotal() * 0.16;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getVAT();
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        this.attachments.push(input.files[i]);
      }
    }
  }

  removeAttachment(index: number): void {
    this.attachments.splice(index, 1);
  }

  canProceedToStep2(): boolean {
    // Check only required fields for Step 1
    const supplierValid = this.poForm.get('supplier')?.valid ?? false;
    const branchValid = this.poForm.get('branch')?.valid ?? false;
    return supplierValid && branchValid;
  }

  canProceedToStep3(): boolean {
    return this.items.length > 0;
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

  setReviewTab(tab: 'review' | 'notes'): void {
    this.activeReviewTab = tab;
  }

  saveDraft(): void {
    const poData = this.compilePOData();
    console.log('Saving draft:', poData);
    this.dialogRef.close({ draft: true, data: poData });
  }

  createPO(): void {
    if (!this.canProceedToStep2() || !this.canProceedToStep3()) {
      alert('Please complete all required fields');
      return;
    }

    const poData = this.compilePOData();
    console.log('Creating PO:', poData);
    this.dialogRef.close({ draft: false, data: poData });
  }

  private compilePOData(): PurchaseOrder {
    return {
      ...this.poForm.value,
      supplierDetails: this.selectedSupplier,
      items: this.items,
      subtotal: this.getSubtotal(),
      vat: this.getVAT(),
      total: this.getTotal(),
      publicNotes: this.reviewForm.get('publicNotes')?.value || '',
      internalNotes: this.reviewForm.get('internalNotes')?.value || '',
      attachments: this.attachments
    };
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

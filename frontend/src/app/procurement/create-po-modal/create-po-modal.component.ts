import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InputTextComponent, InputTextConfig } from '../../shared/input-text/input-text.component';
import { InputDropdownComponent, DropdownOption, DropdownConfig } from '../../shared/input-dropdown/input-dropdown.component';
import { AppModalComponent, AppModalConfig, ModalButton } from '../../shared/modals/app-modal.component';
import { 
  PurchaseOrderRepository, 
  SupplierRepository,
  PurchaseOrder as DomainPurchaseOrder,
  PurchaseOrderItem as DomainPurchaseOrderItem,
  Supplier as DomainSupplier
} from '../../core/domain/domain.barrel';
import { OrderStatus } from '../../core/enums/enums.barrel';

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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, InputTextComponent, InputDropdownComponent],
  templateUrl: './create-po-modal.component.html',
  styleUrls: ['./create-po-modal.component.scss']
})
export class CreatePOModalComponent implements OnInit, AfterViewInit {
  @ViewChild('poFormTemplate') poFormTemplate!: TemplateRef<any>;
  currentStep: 1 | 2 | 3 = 1;
  poForm!: FormGroup;
  itemForm!: FormGroup;
  reviewForm!: FormGroup;
  modalInstance: any = null;

  activeReviewTab: 'review' | 'notes' = 'review';

  // Input Text Configurations
  poNumberConfig: InputTextConfig = {
    placeholder: 'Auto-generated',
    label: 'PO Number',
    clearable: false
  };

  requestedByConfig: InputTextConfig = {
    placeholder: 'Requested by',
    label: 'Requested By',
    clearable: false
  };

  expectedDeliveryConfig: InputTextConfig = {
    placeholder: 'Select delivery date',
    label: 'Expected Delivery Date',
    type: 'date',
    clearable: true
  };

  deliveryAddressConfig: InputTextConfig = {
    placeholder: 'Enter complete delivery address...',
    label: 'Delivery Address',
    description: true,
    rows: 3,
    clearable: true
  };

  itemNameConfig: InputTextConfig = {
    placeholder: 'Enter item name',
    label: 'Item Name',
    required: true,
    clearable: true
  };

  itemDescriptionConfig: InputTextConfig = {
    placeholder: 'Item description...',
    label: 'Description',
    description: true,
    rows: 3,
    clearable: true
  };

  itemSpecsConfig: InputTextConfig = {
    placeholder: 'Technical specifications...',
    label: 'Specifications',
    description: true,
    rows: 3,
    clearable: true
  };

  itemQuantityConfig: InputTextConfig = {
    placeholder: '1',
    label: 'Quantity',
    type: 'number',
    required: true,
    clearable: true
  };

  itemUnitPriceConfig: InputTextConfig = {
    placeholder: '0',
    label: 'Unit Price (KES)',
    type: 'number',
    required: true,
    clearable: true
  };

  publicNotesConfig: InputTextConfig = {
    placeholder: 'Any special instructions for the supplier...',
    label: 'Public Notes (visible to supplier)',
    description: true,
    rows: 4,
    clearable: true
  };

  internalNotesConfig: InputTextConfig = {
    placeholder: 'Internal notes for your team...',
    label: 'Internal Notes (private)',
    description: true,
    rows: 4,
    clearable: true
  };

  // Dropdown Options
  supplierOptions: DropdownOption[] = [];
  paymentTermsOptions: DropdownOption[] = [];
  branchOptions: DropdownOption[] = [];
  priorityOptions: DropdownOption[] = [];
  urgencyOptions: DropdownOption[] = [];
  budgetCodeOptions: DropdownOption[] = [];
  approverOptions: DropdownOption[] = [];

  // Dropdown Configurations
  supplierDropdownConfig: DropdownConfig = {
    placeholder: 'Choose a supplier',
    searchable: true,
    clearable: true
  };

  paymentTermsDropdownConfig: DropdownConfig = {
    placeholder: 'Select payment terms',
    searchable: true,
    clearable: true
  };

  branchDropdownConfig: DropdownConfig = {
    placeholder: 'Select branch',
    searchable: true,
    clearable: true
  };

  priorityDropdownConfig: DropdownConfig = {
    placeholder: 'Select priority',
    searchable: true,
    clearable: true
  };

  urgencyDropdownConfig: DropdownConfig = {
    placeholder: 'Select urgency',
    searchable: true,
    clearable: true
  };

  budgetCodeDropdownConfig: DropdownConfig = {
    placeholder: 'Select budget code',
    searchable: true,
    clearable: true
  };

  approverDropdownConfig: DropdownConfig = {
    placeholder: 'Select approver',
    searchable: true,
    clearable: true
  };

  suppliers: Supplier[] = [
    { id: '1', name: 'Metro Building Supplies', category: 'Construction Materials', paymentTerms: 'Net 15' },
    { id: '2', name: 'ABC Hardware Suppliers', category: 'Hardware & Tools', paymentTerms: 'Net 30' },
    { id: '3', name: 'Prime Tools Ltd', category: 'Equipment', paymentTerms: 'Net 45' }
  ];

  paymentTerms = ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Cash on Delivery'];
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
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CreatePOModalComponent>,
    private purchaseOrderRepository: PurchaseOrderRepository,
    private supplierRepository: SupplierRepository,
    @Inject(MAT_DIALOG_DATA) public data?: { poId?: number }
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.initializeDropdownOptions();
    this.loadSuppliers();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.openModal();
    });
  }

  openModal(): void {
    const modalConfig: AppModalConfig = {
      title: 'Create Purchase Order',
      subtitle: 'Create a new purchase order for supplier procurement',
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
        disabled: !this.canProceedToStep2()
      });
    } else if (this.currentStep === 2) {
      leftButtons.push({
        label: 'Back',
        action: 'previous',
        color: 'default'
      });
      rightButtons.push({
        label: 'Continue',
        action: 'next',
        color: 'primary',
        disabled: !this.canProceedToStep3()
      });
    } else if (this.currentStep === 3) {
      leftButtons.push({
        label: 'Back',
        action: 'previous',
        color: 'default'
      });
      rightButtons.push(
        {
          label: 'Create PO',
          action: 'save',
          color: 'primary',
          icon: 'description'
        }
      );
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
    instance.contentTemplate = this.poFormTemplate;
    instance.leftButtons = leftButtons;
    instance.rightButtons = rightButtons;

    instance.buttonClicked.subscribe((action: string) => {
      if (action === 'save') {
        this.createPO(modalDialogRef, instance);
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

  private initializeDropdownOptions(): void {
    // Convert suppliers to dropdown options
    this.supplierOptions = this.suppliers.map(supplier => ({
      id: supplier.id,
      label: `${supplier.name} - ${supplier.category}`,
      value: supplier.id
    }));

    // Convert payment terms to dropdown options
    this.paymentTermsOptions = this.paymentTerms.map((term, index) => ({
      id: `pt${index}`,
      label: term,
      value: term
    }));

    // Convert branches to dropdown options
    this.branchOptions = this.branches.map((branch, index) => ({
      id: `br${index}`,
      label: branch,
      value: branch
    }));

    // Convert priorities to dropdown options
    this.priorityOptions = this.priorities.map((priority, index) => ({
      id: `pr${index}`,
      label: priority,
      value: priority
    }));

    // Convert urgencies to dropdown options
    this.urgencyOptions = this.urgencies.map((urgency, index) => ({
      id: `ur${index}`,
      label: urgency,
      value: urgency
    }));

    // Convert budget codes to dropdown options
    this.budgetCodeOptions = this.budgetCodes.map((code, index) => ({
      id: `bc${index}`,
      label: code,
      value: code
    }));

    // Convert approvers to dropdown options
    this.approverOptions = this.approvers.map((approver, index) => ({
      id: `ap${index}`,
      label: approver,
      value: approver
    }));
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
  }

  // Dropdown Change Handlers
  onSupplierChange(option: DropdownOption | null): void {
    if (!option) return;
    const value = option.value || option.id;
    this.poForm.patchValue({ supplier: value });
    this.selectedSupplier = this.suppliers.find(s => s.id === value) || null;
    if (this.selectedSupplier) {
      this.poForm.patchValue({ paymentTerms: this.selectedSupplier.paymentTerms });
    }
    this.updateButtonState();
  }

  onPaymentTermsChange(option: DropdownOption | null): void {
    if (!option) return;
    const value = option.value || option.label;
    this.poForm.patchValue({ paymentTerms: value });
    this.updateButtonState();
  }

  onBranchChange(option: DropdownOption | null): void {
    if (!option) return;
    const value = option.value || option.label;
    this.poForm.patchValue({ branch: value });
    this.updateButtonState();
  }

  onPriorityChange(option: DropdownOption | null): void {
    if (!option) return;
    const value = option.value || option.label;
    this.poForm.patchValue({ priority: value });
    this.updateButtonState();
  }

  onUrgencyChange(option: DropdownOption | null): void {
    if (!option) return;
    const value = option.value || option.label;
    this.itemForm.patchValue({ urgency: value });
  }

  onBudgetCodeChange(option: DropdownOption | null): void {
    if (!option) return;
    const value = option.value || option.label;
    this.poForm.patchValue({ budgetCode: value });
  }

  onApproverChange(option: DropdownOption | null): void {
    if (!option) return;
    const value = option.value || option.label;
    this.poForm.patchValue({ approver: value });
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
        label: 'Create PO',
        action: 'save',
        color: 'primary',
        icon: 'check'
      });
    }

    instance.leftButtons = leftButtons;
    instance.rightButtons = rightButtons;
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
    this.updateButtonState();
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
    this.updateButtonState();
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

  saveDraft(modalDialogRef: MatDialogRef<AppModalComponent>, instance: any): void {
    instance.loading = true;
    const poData = this.compilePOData();
    console.log('Saving draft:', poData);
    
    setTimeout(() => {
      instance.loading = false;
      modalDialogRef.close();
      this.dialogRef.close({ draft: true, data: poData });
    }, 1000);
  }

  createPO(modalDialogRef: MatDialogRef<AppModalComponent>, instance: any): void {
    if (!this.canProceedToStep2() || !this.canProceedToStep3()) {
      alert('Please complete all required fields');
      instance.loading = false;
      return;
    }

    if (!this.items || this.items.length === 0) {
      alert('Please add at least one item to the purchase order');
      instance.loading = false;
      return;
    }

    instance.loading = true;

    // Create purchase order with items - backend will calculate totals
    const poData = {
      supplierId: this.selectedSupplier ? parseInt(this.selectedSupplier.id) : 1,
      createdByUserId: 1, // Should come from authenticated user
      expectedDeliveryDate: new Date(this.poForm.get('expectedDelivery')?.value),
      notes: this.reviewForm.get('publicNotes')?.value || '',
      items: this.items.map(item => ({
        productId: parseInt(item.id), // Assuming item.id is productId
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };

    this.purchaseOrderRepository.create(poData as any, { 
      description: `Created PO for ${this.selectedSupplier?.name || 'supplier'}` 
    }).subscribe({
      next: (createdPO) => {
        console.log('Purchase Order created with backend-calculated total:', createdPO.totalAmount);
        instance.loading = false;
        modalDialogRef.close(createdPO);
        this.dialogRef.close(createdPO);
      },
      error: (err) => {
        console.error('Failed to create purchase order:', err);
        alert('Failed to create purchase order. Please try again.');
        instance.loading = false;
      }
    });
  }

  loadSuppliers(): void {
    this.supplierRepository.getAll().subscribe({
      next: (suppliers: DomainSupplier[]) => {
        this.suppliers = suppliers.map(s => ({
          id: s.id.toString(),
          name: s.name,
          category: s.category || '',
          paymentTerms: 'Net 30' // Default value, not in domain model
        }));
      },
      error: (err: any) => {
        console.error('Failed to load suppliers:', err);
      }
    });
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

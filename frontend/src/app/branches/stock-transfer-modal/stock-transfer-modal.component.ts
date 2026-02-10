import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { AppModalComponent, ModalButton, AppModalConfig } from '../../shared/modals/app-modal.component';
import { StepIndicatorComponent, Step } from '../../shared/step-indicator/step-indicator.component';
import { InputTextComponent } from '../../shared/input-text/input-text.component';
import { InputDropdownComponent, DropdownOption } from '../../shared/input-dropdown/input-dropdown.component';
import { ItemSelectorComponent, SelectorItem, ItemSelectorConfig } from '../../shared/item-selector/item-selector.component';
import { 
  StockTransferRepository, 
  BranchRepository,
  ProductRepository,
  StockTransfer as DomainStockTransfer,
  StockTransferItem 
} from '../../core/domain/domain.barrel';
import { StockTransferStatus } from '../../core/enums/enums.barrel';
import { Apollo } from 'apollo-angular';
import { ADD_STOCK_TRANSFER_ITEM } from '../../core/domain/stock-transfer/stock-transfer-item.queries';
import { forkJoin } from 'rxjs';

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
}

interface TransferProductData {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

interface TransferData {
  fromBranch: DropdownOption | null;
  toBranch: DropdownOption | null;
  transferType: DropdownOption;
  priorityLevel: DropdownOption;
  requestedBy: string;
  expectedDate: string;
  reason: string;
  additionalNotes: string;
  selectedProducts: TransferProductData[];
}

@Component({
  selector: 'app-stock-transfer-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    AppModalComponent,
    StepIndicatorComponent,
    InputTextComponent,
    InputDropdownComponent,
    ItemSelectorComponent
  ],
  templateUrl: './stock-transfer-modal.component.html',
  styleUrl: './stock-transfer-modal.component.scss'
})
export class StockTransferModalComponent implements OnInit {
  currentStep: 1 | 2 | 3 = 1;
  completedSteps = new Set<number>();
  searchControl: string = '';
  Array = Array; // Make Array available in template

  // Modal configuration
  modalConfig: AppModalConfig = {
    title: 'Stock Transfer Request',
    subtitle: 'Transfer inventory between branches',
    wide: true
  };

  // Steps configuration
  steps: Step[] = [
    { id: 1, label: 'Transfer Details' },
    { id: 2, label: 'Select Products' },
    { id: 3, label: 'Review & Submit' }
  ];

  transferDetailsForm!: FormGroup;
  reviewForm!: FormGroup;

  // Item selector configuration
  itemSelectorConfig: ItemSelectorConfig = {
    availableTitle: 'Available Products',
    selectedTitle: 'Selected Products',
    actionIcon: 'add_shopping_cart',
    actionTooltip: 'Add to transfer',
    showPrice: true,
    showStock: true,
    showQuantity: true,
    allowDragDrop: true,
    currencySymbol: 'KES'
  };

  availableProducts: SelectorItem[] = [];
  selectedProductItems: SelectorItem[] = [];

  // Mock data
  branches: DropdownOption[] = [
    { id: 'BR-001', label: 'Main Branch' },
    { id: 'BR-002', label: 'Westlands Branch' },
    { id: 'BR-003', label: 'Eastleigh Branch' },
    { id: 'BR-004', label: 'Industrial Area' }
  ];

  transferTypes: DropdownOption[] = [
    { id: 'inter-branch', label: 'Inter-Branch Transfer' },
    { id: 'replenishment', label: 'Stock Replenishment' },
    { id: 'emergency', label: 'Emergency Transfer' },
    { id: 'return', label: 'Return Transfer' }
  ];

  priorityLevels: DropdownOption[] = [
    { id: 'low', label: 'Low Priority' },
    { id: 'normal', label: 'Normal Priority' },
    { id: 'high', label: 'High Priority' },
    { id: 'urgent', label: 'Urgent' }
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

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<StockTransferModalComponent>,
    private stockTransferRepository: StockTransferRepository,
    private branchRepository: BranchRepository,
    private productRepository: ProductRepository,
    private apollo: Apollo
  ) {
    this.initializeForms();
    this.initializeProducts();
  }

  ngOnInit() {}

  private initializeProducts() {
    this.availableProducts = this.allProducts.map(p => ({
      id: p.id,
      title: p.name,
      subtitle: p.sku,
      price: p.price,
      stock: p.stock,
      quantity: 1,
      stockStatus: this.getProductStockStatus(p.stock)
    }));
  }

  private getProductStockStatus(stock: number): 'in-stock' | 'out-of-stock' | 'low-stock' {
    if (stock === 0) return 'out-of-stock';
    if (stock < 10) return 'low-stock';
    return 'in-stock';
  }

  handleButtonClick(action: string): void {
    if (action === 'cancel') {
      this.closeDialog();
    } else if (action === 'next') {
      this.nextStep();
    } else if (action === 'previous') {
      this.previousStep();
    } else if (action === 'save') {
      this.submitTransfer();
    }
  }

  getLeftButtons(): ModalButton[] {
    return [{ label: 'Cancel', action: 'cancel', color: 'default' }];
  }

  getRightButtons(): ModalButton[] {
    const buttons: ModalButton[] = [];

    if (this.currentStep > 1) {
      buttons.push({ label: 'Previous', action: 'previous', color: 'default' });
    }

    if (this.currentStep < 3) {
      buttons.push({
        label: 'Next',
        action: 'next',
        color: 'primary',
        disabled: !this.canProceedToStep((this.currentStep + 1) as 1 | 2 | 3)
      });
    } else {
      buttons.push({
        label: 'Submit Transfer',
        action: 'save',
        color: 'primary',
        disabled: !this.canProceedToStep(3)
      });
    }

    return buttons;
  }

  private initializeForms() {
    this.transferDetailsForm = this.formBuilder.group({
      fromBranch: [null, Validators.required],
      toBranch: [null, Validators.required],
      transferType: [{ id: 'inter-branch', label: 'Inter-Branch Transfer' }, Validators.required],
      priorityLevel: [{ id: 'normal', label: 'Normal Priority' }, Validators.required],
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
    if (step === 3) return this.transferDetailsForm.valid && this.selectedProductItems.length > 0;
    return false;
  }

  isStepActive(step: 1 | 2 | 3): boolean {
    return this.currentStep === step;
  }

  onSelectedItemsChanged(items: SelectorItem[]): void {
    this.selectedProductItems = items;
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

  getTotalValue(): number {
    return this.selectedProductItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  }

  formatCurrency(value: number): string {
    return `KSH ${value.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  submitTransfer() {
    if (this.canProceedToStep(3)) {
      const formValues = this.transferDetailsForm.value;
      
      const stockTransfer: Partial<DomainStockTransfer> = {
        transferNumber: 'STR-' + Date.now(),
        fromBranchId: formValues.fromBranch?.id ? parseInt(formValues.fromBranch.id.toString().replace('BR-', '')) : 0,
        toBranchId: formValues.toBranch?.id ? parseInt(formValues.toBranch.id.toString().replace('BR-', '')) : 0,
        requestedByUserId: 1, // TODO: Get from auth service
        status: StockTransferStatus.Pending,
        requestedDate: new Date(),
        completedDate: null,
        notes: formValues.reason + (formValues.additionalNotes ? '\n' + formValues.additionalNotes : '')
      };

      const logInfo = {
        userId: '1', // TODO: Get from auth service
        timestamp: new Date().toISOString(),
        action: 'CREATE',
        ipAddress: '127.0.0.1'
      };

      this.stockTransferRepository.create(stockTransfer, logInfo).subscribe({
        next: (savedTransfer: Partial<DomainStockTransfer>) => {
          // Save items if there are any
          if (this.selectedProductItems.length > 0 && savedTransfer.id) {
            this.saveTransferItems(savedTransfer.id, logInfo).subscribe({
              next: () => {
                const transferData: TransferData = {
                  fromBranch: formValues.fromBranch,
                  toBranch: formValues.toBranch,
                  transferType: formValues.transferType,
                  priorityLevel: formValues.priorityLevel,
                  requestedBy: formValues.requestedBy,
                  expectedDate: formValues.expectedDate,
                  reason: formValues.reason,
                  additionalNotes: formValues.additionalNotes,
                  selectedProducts: this.selectedProductItems.map(item => ({
                    id: item.id,
                    name: item.title,
                    sku: item.subtitle || '',
                    quantity: item.quantity || 1,
                    price: item.price || 0
                  }))
                };
                this.dialogRef.close({ ...transferData, id: savedTransfer.id });
              },
              error: (itemError: any) => {
                console.error('Error creating stock transfer items:', itemError);
                alert('Stock transfer created but failed to save items: ' + (itemError.message || 'Unknown error'));
                this.dialogRef.close(savedTransfer);
              }
            });
          } else {
            this.dialogRef.close(savedTransfer);
          }
        },
        error: (error: any) => {
          console.error('Error creating stock transfer:', error);
          alert('Failed to create stock transfer: ' + (error.message || 'Unknown error'));
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getFromBranchName(): string {
    const branch = this.transferDetailsForm.get('fromBranch')?.value;
    return branch?.label || '';
  }

  getToBranchName(): string {
    const branch = this.transferDetailsForm.get('toBranch')?.value;
    return branch?.label || '';
  }

  getTransferTypeLabel(value: any): string {
    return value?.label || value || '';
  }

  getPriorityLabel(value: any): string {
    return value?.label || value || '';
  }

  private saveTransferItems(transferId: number, logInfo: any) {
    const itemMutations = this.selectedProductItems.map(item => {
      const input = {
        stockTransferId: transferId,
        productId: parseInt(item.id),
        quantityRequested: item.quantity || 1,
        quantityTransferred: null
      };

      return this.apollo.mutate({
        mutation: ADD_STOCK_TRANSFER_ITEM,
        variables: { input, logInfo }
      });
    });

    return forkJoin(itemMutations);
  }

  getPriorityBadgeClass(priority: any): string {
    const label = priority?.label || priority || '';
    if (label.includes('Low')) return 'priority-low';
    if (label.includes('High') || label.includes('Urgent')) return 'priority-high';
    return 'priority-normal';
  }
}
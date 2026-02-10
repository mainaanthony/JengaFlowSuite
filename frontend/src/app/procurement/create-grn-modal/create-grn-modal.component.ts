import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { StepIndicatorComponent, Step } from '../../shared/step-indicator/step-indicator.component';
import { InputTextComponent, InputTextConfig } from '../../shared/input-text/input-text.component';
import { InputDropdownComponent, DropdownOption, DropdownConfig } from '../../shared/input-dropdown/input-dropdown.component';
import { AppModalComponent, AppModalConfig, ModalButton } from '../../shared/modals/app-modal.component';
import { 
  GoodsReceivedNoteRepository, 
  PurchaseOrderRepository,
  GoodsReceivedNote as DomainGRN,
  GoodsReceivedNoteItem 
} from '../../core/domain/domain.barrel';
import { GoodsReceivedNoteStatus } from '../../core/enums/enums.barrel';
import { Apollo } from 'apollo-angular';
import { ADD_GOODS_RECEIVED_NOTE_ITEM } from '../../core/domain/goods-received-note/goods-received-note-item.queries';
import { forkJoin } from 'rxjs';

interface GRNItem {
  id: string;
  product: string;
  sku: string;
  ordered: number;
  received: number;
  condition: string;
  status: string;
  notes: string;
}

interface GRNData {
  grnNumber: string;
  receivedDate: string;
  purchaseOrder: string;
  supplier: string;
  receivedBy: string;
  warehouseLocation: string;
  generalNotes: string;
  items: GRNItem[];
}

@Component({
  selector: 'app-create-grn-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    StepIndicatorComponent,
    InputTextComponent,
    InputDropdownComponent,
    AppModalComponent
  ],
  templateUrl: './create-grn-modal.component.html',
  styleUrls: ['./create-grn-modal.component.scss']
})
export class CreateGrnModalComponent implements OnInit, AfterViewInit {
  @ViewChild('grnFormTemplate') grnFormTemplate!: TemplateRef<any>;

  currentStep: number = 1;
  grnForm!: FormGroup;
  items: GRNItem[] = [];
  completedSteps: number[] = [];

  // Modal Configuration
  modalConfig: AppModalConfig = {
    title: 'Create Goods Receipt Note (GRN)',
    subtitle: 'Add received goods to inventory',
    wide: true,
    disableClose: false
  };

  rightButtons: ModalButton[] = [
    { label: 'Previous', action: 'previous', color: 'default', disabled: true },
    { label: 'Next', action: 'next', color: 'primary' }
  ];

  steps: Step[] = [
    { id: 1, label: 'GRN Details' },
    { id: 2, label: 'Items Verification' },
    { id: 3, label: 'Review & Create' }
  ];

  // Input Configurations
  grnNumberConfig: InputTextConfig = {
    placeholder: 'Auto-generated',
    label: 'GRN Number',
    disabled: true
  };

  receivedDateConfig: InputTextConfig = {
    placeholder: 'Select date',
    label: 'Received Date',
    type: 'date',
    required: true
  };

  supplierConfig: InputTextConfig = {
    placeholder: 'Supplier name',
    label: 'Supplier',
    disabled: true
  };

  receivedByConfig: InputTextConfig = {
    placeholder: 'Name of person receiving goods',
    label: 'Received By',
    required: true
  };

  notesConfig: InputTextConfig = {
    placeholder: 'Any general notes about the delivery...',
    label: 'General Notes'
  };

  // Dropdown Options
  purchaseOrderOptions: DropdownOption[] = [
    { id: 'po-001', label: 'PO-2024-001', value: 'PO-2024-001' },
    { id: 'po-002', label: 'PO-2024-002', value: 'PO-2024-002' },
    { id: 'po-003', label: 'PO-2024-003', value: 'PO-2024-003' }
  ];

  purchaseOrderConfig: DropdownConfig = {
    placeholder: 'Select purchase order',
    searchable: true
  };

  warehouseOptions: DropdownOption[] = [
    { id: 'main', label: 'Main Warehouse', value: 'main' },
    { id: 'branch', label: 'Branch Storage', value: 'branch' },
    { id: 'temp', label: 'Temporary Storage', value: 'temp' }
  ];

  warehouseConfig: DropdownConfig = {
    placeholder: 'Select warehouse',
    searchable: false
  };

  conditionOptions: DropdownOption[] = [
    { id: 'good', label: 'Good', value: 'good' },
    { id: 'damaged', label: 'Damaged', value: 'damaged' },
    { id: 'partial', label: 'Partial', value: 'partial' }
  ];

  conditionConfig: DropdownConfig = {
    placeholder: 'Condition',
    searchable: false
  };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateGrnModalComponent>,
    private grnRepository: GoodsReceivedNoteRepository,
    private purchaseOrderRepository: PurchaseOrderRepository,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadMockItems();
    
    // Subscribe to form value changes to update button states
    this.grnForm.valueChanges.subscribe(() => {
      this.updateButtons();
    });
  }

  ngAfterViewInit(): void {
    // Component is now ready to be displayed through app-modal
    this.updateButtons();
  }

  private updateButtons(): void {
    this.rightButtons = [
      {
        label: this.currentStep > 1 ? 'Previous' : 'Cancel',
        action: this.currentStep > 1 ? 'previous' : 'cancel',
        color: this.currentStep > 1 ? 'default' : 'default'
      },
      {
        label: this.currentStep === 3 ? 'Create GRN' : 'Next',
        action: this.currentStep === 3 ? 'save' : 'next',
        color: 'primary',
        disabled: !this.isCurrentStepValid()
      }
    ];
  }

  onButtonClick(action: string): void {
    switch (action) {
      case 'next':
        if (this.currentStep < 3) {
          this.currentStep++;
          this.updateButtons();
        }
        break;
      case 'previous':
        if (this.currentStep > 1) {
          this.currentStep--;
          this.updateButtons();
        }
        break;
      case 'save':
        this.saveGRN();
        break;
      case 'cancel':
        this.dialogRef.close();
        break;
    }
  }

  private saveGRN(): void {
    if (this.grnForm.valid) {
      const formData = this.grnForm.value;
      
      const grn: Partial<DomainGRN> = {
        grnNumber: formData.grnNumber,
        purchaseOrderId: parseInt(formData.purchaseOrder) || 0,
        receivedByUserId: 1, // TODO: Get from auth service
        receivedDate: new Date(formData.receivedDate),
        notes: formData.generalNotes || null,
        status: GoodsReceivedNoteStatus.FullyReceived
      };

      const logInfo = {
        userId: '1', // TODO: Get from auth service
        timestamp: new Date().toISOString(),
        action: 'CREATE',
        ipAddress: '127.0.0.1'
      };

      this.grnRepository.create(grn, logInfo).subscribe({
        next: (savedGRN: Partial<DomainGRN>) => {
          // Save items if there are any
          if (this.items.length > 0 && savedGRN.id) {
            this.saveGRNItems(savedGRN.id, logInfo).subscribe({
              next: () => {
                this.dialogRef.close(savedGRN);
              },
              error: (itemError: any) => {
                console.error('Error creating GRN items:', itemError);
                alert('GRN created but failed to save items: ' + (itemError.message || 'Unknown error'));
                this.dialogRef.close(savedGRN);
              }
            });
          } else {
            this.dialogRef.close(savedGRN);
          }
        },
        error: (error: any) => {
          console.error('Error creating GRN:', error);
          alert('Failed to create GRN: ' + (error.message || 'Unknown error'));
        }
      });
    }
  }

  private isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!(this.grnForm.get('receivedDate')?.valid &&
               this.grnForm.get('purchaseOrder')?.valid &&
               this.grnForm.get('receivedBy')?.valid &&
               this.grnForm.get('warehouseLocation')?.valid);
      case 2:
        return this.items.length > 0 && this.getTotalReceived() > 0;
      case 3:
        return true;
      default:
        return false;
    }
  }

  private initializeForm(): void {
    this.grnForm = this.fb.group({
      grnNumber: ['GRN-2026-116'],
      receivedDate: ['', Validators.required],
      purchaseOrder: ['', Validators.required],
      supplier: [''],
      receivedBy: ['', Validators.required],
      warehouseLocation: ['', Validators.required],
      generalNotes: ['']
    });
  }

  private loadMockItems(): void {
    this.items = [
      {
        id: '1',
        product: 'Cement Bags',
        sku: 'CMT-50KG-001',
        ordered: 200,
        received: 200,
        condition: 'good',
        status: 'Complete',
        notes: ''
      },
      {
        id: '2',
        product: 'Steel Rods 12mm',
        sku: 'STL-12MM-001',
        ordered: 100,
        received: 100,
        condition: 'good',
        status: 'Complete',
        notes: ''
      }
    ];
  }

  onPurchaseOrderChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.grnForm.patchValue({ purchaseOrder: value.value });
      // Auto-populate supplier based on PO
      this.grnForm.patchValue({ supplier: 'Metro Building Supplies' });
    }
  }

  onWarehouseChange(value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      this.grnForm.patchValue({ warehouseLocation: value.value });
    }
  }

  onConditionChange(item: GRNItem, value: DropdownOption | DropdownOption[] | null): void {
    if (value && !Array.isArray(value)) {
      item.condition = value.value;
    }
  }

  incrementReceived(item: GRNItem): void {
    if (item.received < item.ordered) {
      item.received++;
      this.updateItemStatus(item);
    }
  }

  decrementReceived(item: GRNItem): void {
    if (item.received > 0) {
      item.received--;
      this.updateItemStatus(item);
    }
  }

  updateReceivedValue(item: GRNItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value) || 0;
    item.received = Math.min(Math.max(0, value), item.ordered);
    this.updateItemStatus(item);
  }

  private updateItemStatus(item: GRNItem): void {
    if (item.received === item.ordered) {
      item.status = 'Complete';
    } else if (item.received > 0) {
      item.status = 'Partial';
    } else {
      item.status = 'Pending';
    }
  }

  getTotalOrdered(): number {
    return this.items.reduce((sum, item) => sum + item.ordered, 0);
  }

  getTotalReceived(): number {
    return this.items.reduce((sum, item) => sum + item.received, 0);
  }

  getTotalValue(): number {
    return 180000; // Mock value
  }

  nextStep(): void {
    if (this.currentStep === 1 && !this.isStep1Valid()) {
      return;
    }

    if (this.currentStep < 3) {
      if (!this.completedSteps.includes(this.currentStep)) {
        this.completedSteps.push(this.currentStep);
      }
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  private isStep1Valid(): boolean {
    const form = this.grnForm;
    return !!(
      form.get('receivedDate')?.valid &&
      form.get('purchaseOrder')?.valid &&
      form.get('receivedBy')?.valid &&
      form.get('warehouseLocation')?.valid
    );
  }

  canProceed(): boolean {
    if (this.currentStep === 1) {
      return this.isStep1Valid();
    }
    return true;
  }

  createGRN(): void {
    const grnData: GRNData = {
      ...this.grnForm.value,
      items: this.items
    };

    this.dialogRef.close(grnData);
  }

  private saveGRNItems(grnId: number, logInfo: any) {
    const itemMutations = this.items.map(item => {
      const input = {
        goodsReceivedNoteId: grnId,
        productId: parseInt(item.id),
        quantityOrdered: item.ordered,
        quantityReceived: item.received,
        remarks: item.notes || null
      };

      return this.apollo.mutate({
        mutation: ADD_GOODS_RECEIVED_NOTE_ITEM,
        variables: { input, logInfo }
      });
    });

    return forkJoin(itemMutations);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

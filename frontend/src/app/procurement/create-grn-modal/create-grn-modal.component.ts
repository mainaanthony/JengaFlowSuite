import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { StepIndicatorComponent, Step } from '../../shared/step-indicator/step-indicator.component';
import { InputTextComponent, InputTextConfig } from '../../shared/input-text/input-text.component';
import { InputDropdownComponent, DropdownOption, DropdownConfig } from '../../shared/input-dropdown/input-dropdown.component';
import { AppModalComponent, AppModalConfig, ModalButton } from '../../shared/modals/app-modal.component';

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
    public dialogRef: MatDialogRef<CreateGrnModalComponent>
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadMockItems();
  }

  ngAfterViewInit(): void {
    // Open the AppModalComponent with our template
    setTimeout(() => {
      this.openModal();
      // Close this wrapper component immediately
      this.dialogRef.close();
    });
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

  openModal(): void {
    const dialogRef = this.dialog.open(AppModalComponent, {
      disableClose: false,
      panelClass: 'custom-modal-container',
      width: '1100px',
      maxWidth: '95vw'
    });

    const instance = dialogRef.componentInstance;
    instance.config = {
      title: 'Create Goods Received Note (GRN)',
      subtitle: 'Record and verify goods received from suppliers',
      wide: true
    };

    instance.contentTemplate = this.grnFormTemplate;

    instance.leftButtons = [
      { label: 'Cancel', action: 'cancel', color: 'default' }
    ];

    // Initial buttons for step 1
    this.updateButtonsForStep(instance);

    // Monitor form changes to update button state
    this.grnForm.valueChanges.subscribe(() => {
      const nextBtn = instance.rightButtons.find(b => b.action === 'next');
      if (nextBtn) {
        nextBtn.disabled = !this.canProceed();
      }
    });

    instance.buttonClicked.subscribe((action: string) => {
      if (action === 'cancel') {
        dialogRef.close();
      } else if (action === 'previous') {
        this.previousStep();
        this.updateButtonsForStep(instance);
      } else if (action === 'next') {
        this.nextStep();
        this.updateButtonsForStep(instance);
      } else if (action === 'save') {
        // 'save' is used for the final Create GRN button
        this.submitGRN(dialogRef, instance);
      }
    });
  }

  private updateButtonsForStep(instance: AppModalComponent): void {
    if (this.currentStep === 1) {
      instance.rightButtons = [
        { 
          label: 'Next', 
          action: 'next', 
          color: 'primary',
          disabled: !this.canProceed()
        }
      ];
    } else if (this.currentStep === 2) {
      instance.rightButtons = [
        { label: 'Previous', action: 'previous', color: 'default' },
        { 
          label: 'Next', 
          action: 'next', 
          color: 'primary',
          disabled: !this.canProceed()
        }
      ];
    } else if (this.currentStep === 3) {
      instance.rightButtons = [
        { label: 'Previous', action: 'previous', color: 'default' },
        { 
          label: 'Create GRN', 
          action: 'save', 
          color: 'primary',
          icon: 'check_circle'
        }
      ];
    }
  }

  private submitGRN(dialogRef: any, instance: AppModalComponent): void {
    const submitBtn = instance.rightButtons.find(b => b.action === 'save');
    if (submitBtn) submitBtn.loading = true;

    // Simulate API call
    setTimeout(() => {
      const grnData: GRNData = this.grnForm.value;
      instance.showSuccessMessage = true;
      instance.successMessage = 'GRN created successfully!';
      
      setTimeout(() => {
        dialogRef.close(grnData);
      }, 1500);
    }, 800);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

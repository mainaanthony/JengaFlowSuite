import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { ButtonSolidComponent } from '../shared/button-solid/button-solid.component';
import { CardComponent } from '../shared/card/card.component';
import { AppTableComponent, ColumnConfig, TableAction, TableActionEvent } from '../shared/app-table/app-table.component';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { AddSupplierModalComponent } from './add-supplier-modal/add-supplier-modal.component';
import { CreatePOModalComponent } from './create-po-modal/create-po-modal.component';
import { ModalService } from '../core/services/modal.service';
import {
  PurchaseOrderRepository,
  SupplierRepository,
  GoodsReceivedNoteRepository,
  PurchaseOrder as DomainPurchaseOrder,
  Supplier as DomainSupplier,
  GoodsReceivedNote as DomainGRN
} from '../core/domain/domain.barrel';

interface PurchaseOrder {
  id: string;
  supplier: string;
  items: number;
  total: number;
  status: 'Pending Approval' | 'Approved' | 'Delivered';
  created: string;
  expectedDelivery: string;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  category: string;
  rating: number;
  status: 'Active' | 'Inactive';
}

interface GoodsReceivedNote {
  id: string;
  poNumber: string;
  supplier: string;
  items: number;
  receivedDate: string;
  status: string;
}

@Component({
  selector: 'procurement',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    ButtonSolidComponent,
    CardComponent,
    AppTableComponent,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './procurement.component.html',
  styleUrls: ['./procurement.component.scss']
})
export class ProcurementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  searchControl = new FormControl('');
  activeTab: 'purchase-orders' | 'suppliers' | 'goods-received' = 'purchase-orders';
  loading = false;

  // Table configuration
  poColumns: ColumnConfig[] = [];
  poActions: TableAction[] = [];
  supplierColumns: ColumnConfig[] = [];
  supplierActions: TableAction[] = [];

  constructor(
    private dialog: MatDialog, 
    private modalService: ModalService,
    private purchaseOrderRepository: PurchaseOrderRepository,
    private supplierRepository: SupplierRepository,
    private grnRepository: GoodsReceivedNoteRepository
  ) {
    this.initializeTableConfig();
  }

  stats = {
    activePOs: 0,
    activePOsChange: 0,
    pendingApproval: 0,
    pendingApprovalChange: 0,
    inTransit: 0,
    inTransitChange: 0,
    monthlySpend: 'KES 0',
    monthlySpendChange: 0
  };

  purchaseOrders: PurchaseOrder[] = [];
  // purchaseOrders: PurchaseOrder[] = [
  //   {
  //     id: 'PO-2024-001',
  //     supplier: 'ABC Hardware Suppliers',
  //     items: 15,
  //     total: 45600,
  //     status: 'Pending Approval',
  //     created: '2024-01-15',
  //     expectedDelivery: '2024-01-25'
  //   },
  //   {
  //     id: 'PO-2024-002',
  //     supplier: 'Metro Building Supplies',
  //     items: 8,
  //     total: 78900,
  //     status: 'Approved',
  //     created: '2024-01-14',
  //     expectedDelivery: '2024-01-22'
  //   },
  //   {
  //     id: 'PO-2024-003',
  //     supplier: 'Prime Tools Ltd',
  //     items: 12,
  //     total: 23400,
  //     status: 'Delivered',
  //     created: '2024-01-13',
  //     expectedDelivery: '2024-01-20'
  //   }
  // ];

  // suppliers: Supplier[] = [
  //   {
  //     id: 'SUP-001',
  //     name: 'ABC Hardware Suppliers',
  //     contact: 'supplier@abc.com',
  //     phone: '+254-700-123456',
  //     category: 'General Hardware',
  //     rating: 4.8,
  //     status: 'Active'
  //   },
  //   {
  //     id: 'SUP-002',
  //     name: 'Metro Building Supplies',
  //     contact: 'orders@metro.co.ke',
  //     phone: '+254-722-987654',
  //     category: 'Building Materials',
  //     rating: 4.5,
  //     status: 'Active'
  //   }
  // ];
  suppliers: Supplier[] = [];
  goodsReceivedNotes: GoodsReceivedNote[] = [];

  filteredPOs: PurchaseOrder[] = [];
  filteredSuppliers: Supplier[] = [];
  filteredGRNs: GoodsReceivedNote[] = [];

  ngOnInit() {
    this.loadAllData();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAllData() {
    this.loadPurchaseOrders();
    this.loadSuppliers();
    this.loadGoodsReceivedNotes();
  }

  loadPurchaseOrders() {
    this.loading = true;
    this.purchaseOrderRepository.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pos: DomainPurchaseOrder[]) => {
          this.purchaseOrders = pos.map(po => ({
            id: po.poNumber,
            supplier: po.supplier?.name || 'Unknown Supplier',
            items: 0, // TODO: Calculate from PO items
            total: po.totalAmount,
            status: this.mapPOStatus(po.status),
            created: new Date(po.expectedDeliveryDate).toLocaleDateString(),
            expectedDelivery: po.expectedDeliveryDate ? new Date(po.expectedDeliveryDate).toLocaleDateString() : 'N/A'
          }));
          this.filteredPOs = [...this.purchaseOrders];
          this.updateStats();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading purchase orders:', err);
          this.loading = false;
        }
      });
  }

  loadSuppliers() {
    this.supplierRepository.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (suppliers: DomainSupplier[]) => {
          this.suppliers = suppliers.map(s => ({
            id: `SUP-${s.id.toString().padStart(3, '0')}`,
            name: s.name,
            contact: s.email || 'N/A',
            phone: s.phone || 'N/A',
            category: s.category || 'General',
            rating: s.rating || 0,
            status: s.isActive ? 'Active' : 'Inactive'
          }));
          this.filteredSuppliers = [...this.suppliers];
        },
        error: (err) => {
          console.error('Error loading suppliers:', err);
        }
      });
  }

  loadGoodsReceivedNotes() {
    this.grnRepository.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (grns: DomainGRN[]) => {
          this.goodsReceivedNotes = grns.map(grn => ({
            id: grn.grnNumber,
            poNumber: grn.purchaseOrder?.poNumber || 'N/A',
            supplier: grn.purchaseOrder?.supplier?.name || 'N/A',
            items: 0, // TODO: Calculate from GRN items
            receivedDate: new Date(grn.receivedDate).toLocaleDateString(),
            status: grn.status
          }));
          this.filteredGRNs = [...this.goodsReceivedNotes];
        },
        error: (err) => {
          console.error('Error loading GRNs:', err);
        }
      });
  }

  private mapPOStatus(status: string): 'Pending Approval' | 'Approved' | 'Delivered' {
    const statusMap: { [key: string]: 'Pending Approval' | 'Approved' | 'Delivered' } = {
      'PENDING': 'Pending Approval',
      'APPROVED': 'Approved',
      'DELIVERED': 'Delivered',
      'COMPLETED': 'Delivered'
    };
    return statusMap[status?.toUpperCase()] || 'Pending Approval';
  }

  updateStats() {
    const activePOs = this.purchaseOrders.filter(po => 
      po.status === 'Approved' || po.status === 'Pending Approval'
    ).length;
    
    const pendingApproval = this.purchaseOrders.filter(po => 
      po.status === 'Pending Approval'
    ).length;
    
    const inTransit = this.purchaseOrders.filter(po => 
      po.status === 'Approved'
    ).length;
    
    const monthlySpend = this.purchaseOrders.reduce((sum, po) => sum + (po.total || 0), 0);

    this.stats = {
      activePOs,
      activePOsChange: 0, // TODO: Compare with previous period
      pendingApproval,
      pendingApprovalChange: 0,
      inTransit,
      inTransitChange: 0,
      monthlySpend: `KES ${monthlySpend.toLocaleString()}`,
      monthlySpendChange: 0
    };
  }

  initializeTableConfig(): void {
    // Define purchase order table columns
    this.poColumns = [
      {
        key: 'id',
        label: 'PO Number',
        width: '140px',
        type: 'link'
      },
      {
        key: 'supplier',
        label: 'Supplier',
        width: '200px',
        type: 'text'
      },
      {
        key: 'items',
        label: 'Items',
        width: '100px',
        type: 'custom',
        format: (value: number) => `${value} items`
      },
      {
        key: 'total',
        label: 'Total',
        width: '130px',
        type: 'currency'
      },
      {
        key: 'status',
        label: 'Status',
        width: '160px',
        type: 'enum',
        enumValues: [
          { value: 'Pending Approval', label: 'Pending Approval', color: '#f59e0b' },
          { value: 'Approved', label: 'Approved', color: '#10b981' },
          { value: 'Delivered', label: 'Delivered', color: '#3b82f6' }
        ]
      },
      {
        key: 'created',
        label: 'Created',
        width: '120px',
        type: 'date'
      },
      {
        key: 'expectedDelivery',
        label: 'Expected Delivery',
        width: '150px',
        type: 'date'
      }
    ];

    // Define PO table actions
    this.poActions = [
      { id: 'edit', label: 'Edit PO', icon: 'edit', color: 'primary' },
      { id: 'delete', label: 'Delete PO', icon: 'delete', color: 'warn' }
    ];

    // Define supplier table columns
    this.supplierColumns = [
      {
        key: 'id',
        label: 'Supplier ID',
        width: '130px',
        type: 'text'
      },
      {
        key: 'name',
        label: 'Name',
        width: '200px',
        type: 'text',
        subText: 'contact'
      },
      {
        key: 'phone',
        label: 'Phone',
        width: '150px',
        type: 'text'
      },
      {
        key: 'category',
        label: 'Category',
        width: '160px',
        type: 'text'
      },
      {
        key: 'rating',
        label: 'Rating',
        width: '100px',
        type: 'custom',
        format: (value: number) => `⭐ ${value}`
      },
      {
        key: 'status',
        label: 'Status',
        width: '120px',
        type: 'enum',
        enumValues: [
          { value: 'Active', label: 'Active', color: '#10b981' },
          { value: 'Inactive', label: 'Inactive', color: '#ef4444' }
        ]
      }
    ];

    // Define supplier table actions
    this.supplierActions = [
      { id: 'edit', label: 'Edit Supplier', icon: 'edit', color: 'primary' },
      { id: 'delete', label: 'Delete Supplier', icon: 'delete', color: 'warn' }
    ];
  }

  onPOTableAction(event: TableActionEvent): void {
    const po = event.row as PurchaseOrder;
    switch (event.action) {
      case 'edit':
        this.editPO(po);
        break;
      case 'delete':
        this.deletePO(po);
        break;
    }
  }

  onSupplierTableAction(event: TableActionEvent): void {
    const supplier = event.row as Supplier;
    switch (event.action) {
      case 'edit':
        this.editSupplier(supplier);
        break;
      case 'delete':
        this.deleteSupplier(supplier);
        break;
    }
  }

  onPOCellClick(event: { column: string; row: any; value: any }): void {
    if (event.column === 'id') {
      console.log('Navigate to PO:', event.value);
      // TODO: Navigate to PO details page
    }
  }

  onTableSearch(searchTerm: string): void {
    this.searchControl.setValue(searchTerm);
  }

  onFilter(): void {
    console.log('Filter clicked');
  }

  setupSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(query => {
        this.onSearch(query || '');
      });
  }

  onSearch(query: string) {
    const lowerQuery = query.toLowerCase();

    if (this.activeTab === 'purchase-orders') {
      if (!query.trim()) {
        this.filteredPOs = this.purchaseOrders;
      } else {
        this.filteredPOs = this.purchaseOrders.filter(po =>
          po.id.toLowerCase().includes(lowerQuery) ||
          po.supplier.toLowerCase().includes(lowerQuery)
        );
      }
    } else if (this.activeTab === 'suppliers') {
      if (!query.trim()) {
        this.filteredSuppliers = this.suppliers;
      } else {
        this.filteredSuppliers = this.suppliers.filter(s =>
          s.id.toLowerCase().includes(lowerQuery) ||
          s.name.toLowerCase().includes(lowerQuery) ||
          s.contact.toLowerCase().includes(lowerQuery)
        );
      }
    } else if (this.activeTab === 'goods-received') {
      if (!query.trim()) {
        this.filteredGRNs = this.goodsReceivedNotes;
      } else {
        this.filteredGRNs = this.goodsReceivedNotes.filter(grn =>
          grn.id.toLowerCase().includes(lowerQuery) ||
          grn.poNumber.toLowerCase().includes(lowerQuery)
        );
      }
    }
  }

  setTab(tab: 'purchase-orders' | 'suppliers' | 'goods-received') {
    this.activeTab = tab;
    this.searchControl.setValue('');
  }

  exportData() {
    console.log('Export procurement data');
  }

  addSupplier() {
    const dialogRef = this.dialog.open(AddSupplierModalComponent, {
      width: '1100px',
      maxWidth: '95vw',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Supplier added:', result);
        alert(`Supplier "${result.companyName}" added successfully!`);
      }
    });
  }

  createPO() {
    const dialogRef = this.dialog.open(CreatePOModalComponent, {
      width: '1200px',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'create') {
        console.log('Purchase Order created:', result.data);
        this.loadPurchaseOrders(); // Reload purchase orders
      } else if (result && result.action === 'draft') {
        console.log('Purchase Order saved as draft:', result.data);
        this.loadPurchaseOrders(); // Reload purchase orders
      }
    });
  }

  editPO(po: PurchaseOrder) {
    console.log('Edit PO:', po);
  }

  deletePO(po: PurchaseOrder) {
    console.log('Delete PO:', po);
  }

  editSupplier(supplier: Supplier) {
    console.log('Edit supplier:', supplier);
  }

  deleteSupplier(supplier: Supplier) {
    console.log('Delete supplier:', supplier);
  }

  async createGRN() {
    const dialogRef = await this.modalService.openModal('create-grn');

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('GRN created:', result);
        alert(`GRN "${result.grnNumber}" created successfully!`);
        // TODO: Save GRN data to backend
      }
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(/\s+/g, '-');
  }

  getRatingStars(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('⭐');
      }
    }
    return stars;
  }
}

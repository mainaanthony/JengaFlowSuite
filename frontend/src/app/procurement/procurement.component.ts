import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { ButtonSolidComponent } from '../shared/button-solid/button-solid.component';
import { CardComponent } from '../shared/card/card.component';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { AddSupplierModalComponent } from './add-supplier-modal/add-supplier-modal.component';
import { CreatePOModalComponent } from './create-po-modal/create-po-modal.component';

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
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './procurement.component.html',
  styleUrls: ['./procurement.component.scss']
})
export class ProcurementComponent implements OnInit {
  searchControl = new FormControl('');
  activeTab: 'purchase-orders' | 'suppliers' | 'goods-received' = 'purchase-orders';

  constructor(private dialog: MatDialog) {}

  stats = {
    activePOs: 23,
    activePOsChange: 3,
    pendingApproval: 7,
    pendingApprovalChange: 2,
    inTransit: 5,
    inTransitChange: 1,
    monthlySpend: 'KES 2.4M',
    monthlySpendChange: -12
  };

  purchaseOrders: PurchaseOrder[] = [
    {
      id: 'PO-2024-001',
      supplier: 'ABC Hardware Suppliers',
      items: 15,
      total: 45600,
      status: 'Pending Approval',
      created: '2024-01-15',
      expectedDelivery: '2024-01-25'
    },
    {
      id: 'PO-2024-002',
      supplier: 'Metro Building Supplies',
      items: 8,
      total: 78900,
      status: 'Approved',
      created: '2024-01-14',
      expectedDelivery: '2024-01-22'
    },
    {
      id: 'PO-2024-003',
      supplier: 'Prime Tools Ltd',
      items: 12,
      total: 23400,
      status: 'Delivered',
      created: '2024-01-13',
      expectedDelivery: '2024-01-20'
    }
  ];

  suppliers: Supplier[] = [
    {
      id: 'SUP-001',
      name: 'ABC Hardware Suppliers',
      contact: 'supplier@abc.com',
      phone: '+254-700-123456',
      category: 'General Hardware',
      rating: 4.8,
      status: 'Active'
    },
    {
      id: 'SUP-002',
      name: 'Metro Building Supplies',
      contact: 'orders@metro.co.ke',
      phone: '+254-722-987654',
      category: 'Building Materials',
      rating: 4.5,
      status: 'Active'
    }
  ];

  goodsReceivedNotes: GoodsReceivedNote[] = [];

  filteredPOs: PurchaseOrder[] = [];
  filteredSuppliers: Supplier[] = [];
  filteredGRNs: GoodsReceivedNote[] = [];

  ngOnInit() {
    this.filteredPOs = this.purchaseOrders;
    this.filteredSuppliers = this.suppliers;
    this.filteredGRNs = this.goodsReceivedNotes;
    this.setupSearch();
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
        // Handle the created PO (e.g., save to backend, update UI)
      } else if (result && result.action === 'draft') {
        console.log('Purchase Order saved as draft:', result.data);
        // Handle the draft PO
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

  createGRN() {
    console.log('Create GRN');
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

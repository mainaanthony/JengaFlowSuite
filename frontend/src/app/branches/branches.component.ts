import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppTableComponent, ColumnConfig, TableAction, TableActionEvent } from '../shared/app-table/app-table.component';
import { StockTransferModalComponent } from './stock-transfer-modal/stock-transfer-modal.component';
import { AddBranchModalComponent } from './add-branch-modal/add-branch-modal.component';
import { BranchRepository, Branch as DomainBranch } from '../core/domain/domain.barrel';

// Interfaces
interface BranchStat {
  label: string;
  value: string | number;
  delta?: number;
  icon: string;
}

interface Branch {
  id: string;
  name: string;
  code: string;
  location: string;
  phone: string;
  email: string;
  manager: string;
  staff: number;
  revenue: string;
  products: number;
  customers: number;
  status: 'Active' | 'Inactive' | 'Under Renovation';
}

interface BranchPerformance {
  branch: string;
  manager: string;
  revenue: string;
  deltaPercent: number;
}

interface StaffAllocation {
  branch: string;
  established: string;
  staff: number;
  status: 'Active' | 'Under Renovation';
}

interface InventoryItem {
  category: string;
  mainBranch: number;
  westlandsBranch: number;
  eastleighBranch: number;
  industrialArea: number;
  total: number;
}

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, AppTableComponent],
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Math utility for template
  Math = Math;

  // Search and filter
  searchControl = new FormControl('');
  activeTab: 'allBranches' | 'performance' | 'inventory' = 'allBranches';
  loading = false;

  // Table configuration
  branchColumns: ColumnConfig[] = [];
  branchActions: TableAction[] = [];

  constructor(
    private dialog: MatDialog,
    private branchRepository: BranchRepository
  ) {
    this.initializeTableConfig();
  }

  // Stats
  stats: BranchStat[] = [];

  // Branches data
  branches: Branch[] = [];
  filteredBranches: Branch[] = [];

  // Performance data
  performanceData: BranchPerformance[] = [];

  // Staff allocation
  staffAllocation: StaffAllocation[] = [];

  // Inventory distribution
  inventoryData: InventoryItem[] = [];

  ngOnInit(): void {
    this.loadBranches();
    this.initializeStats();
    this.initializePerformanceData();
    this.initializeStaffAllocation();
    this.initializeInventoryData();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBranches() {
    this.loading = true;
    this.branchRepository.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (branches: DomainBranch[]) => {
          this.branches = branches.map(b => this.mapDomainBranchToUIBranch(b));
          this.filteredBranches = [...this.branches];
          this.updateStats();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading branches:', error);
          this.loading = false;
        }
      });
  }

  mapDomainBranchToUIBranch(branch: DomainBranch): Branch {
    return {
      id: `BR-${branch.id.toString().padStart(3, '0')}`,
      name: branch.name,
      code: branch.code,
      location: branch.address || 'N/A',
      phone: branch.phone || 'N/A',
      email: branch.email || 'N/A',
      manager: 'N/A', // TODO: Get from users
      staff: 0, // TODO: Count from users
      revenue: 'KES 0', // TODO: Calculate from sales
      products: 0, // TODO: Count from inventory
      customers: 0, // TODO: Count from customers
      status: branch.isActive ? 'Active' : 'Inactive'
    };
  }

  updateStats() {
    const totalBranches = this.branches.length;
    const activeBranches = this.branches.filter(b => b.status === 'Active').length;
    
    this.stats = [
      { label: 'Total Branches', value: totalBranches, icon: 'store' },
      { label: 'Active Branches', value: activeBranches, icon: 'check_circle' },
      { label: 'Total Staff', value: 0, icon: 'people' }, // TODO: Count from users
      { label: 'Total Revenue', value: 'KES 0', icon: 'trending_up' } // TODO: Sum from sales
    ];
  }

  initializeTableConfig(): void {
    // Define table columns
    this.branchColumns = [
      {
        key: 'name',
        label: 'Branch',
        width: '200px',
        type: 'text',
        subText: 'code'
      },
      {
        key: 'location',
        label: 'Location',
        width: '220px',
        type: 'text',
        subText: 'phone',
        format: (value: string) => value.replace('📍 ', '')
      },
      {
        key: 'manager',
        label: 'Manager',
        width: '150px',
        type: 'text'
      },
      {
        key: 'staff',
        label: 'Staff',
        width: '100px',
        type: 'text',
        format: (value: number) => `${value} staff`
      },
      {
        key: 'revenue',
        label: 'Revenue',
        width: '180px',
        type: 'text'
      },
      {
        key: 'status',
        label: 'Status',
        width: '140px',
        type: 'enum',
        enumValues: [
          { value: 'Active', label: 'Active', color: '#10b981' },
          { value: 'Inactive', label: 'Inactive', color: '#ef4444' },
          { value: 'Under Renovation', label: 'Under Renovation', color: '#f59e0b' }
        ]
      }
    ];

    // Define table actions
    this.branchActions = [
      { id: 'edit', label: 'Edit Branch', icon: 'edit', color: 'primary' },
      { id: 'delete', label: 'Delete Branch', icon: 'delete', color: 'warn' },
      { id: 'transfer', label: 'Stock Transfer', icon: 'compare_arrows', color: 'accent' }
    ];
  }

  onTableAction(event: TableActionEvent): void {
    const branch = event.row as Branch;
    switch (event.action) {
      case 'edit':
        this.editBranch(branch);
        break;
      case 'delete':
        this.deleteBranch(branch);
        break;
      case 'transfer':
        this.stockTransfer();
        break;
    }
  }

  onTableSearch(searchTerm: string): void {
    this.searchControl.setValue(searchTerm);
  }

  onFilter(): void {
    console.log('Filter clicked');
  }

  initializeStats(): void {
    this.stats = [
      {
        label: 'Total Branches',
        value: 4,
        delta: 1,
        icon: 'store'
      },
      {
        label: 'Active Branches',
        value: 3,
        delta: 0,
        icon: 'check_circle'
      },
      {
        label: 'Total Staff',
        value: 23,
        delta: 2,
        icon: 'group'
      },
      {
        label: 'Combined Revenue',
        value: 'KES 4.4M',
        delta: 12,
        icon: 'trending_up'
      }
    ];
  }

  initializeBranches(): void {
    // Dummy data commented out - now using real data from loadBranches()
    /*
    this.branches = [
      {
        id: 'BR-001',
        code: 'BR-001',
        name: 'Main Branch',
        location: '📍 123 Moi Avenue, Nairobi CBD',
        phone: '+254-700-123001',
        email: 'main@engaflow.com',
        manager: 'Mary Njeru',
        staff: 8,
        revenue: 'KES 1,800,000',
        products: 1247,
        customers: 156,
        status: 'Active'
      },
      {
        id: 'BR-002',
        code: 'BR-002',
        name: 'Westlands Branch',
        location: '📍 45 Waiyaki Way, Westlands',
        phone: '+254-700-123002',
        email: 'westlands@engaflow.com',
        manager: 'Peter Kamau',
        staff: 5,
        revenue: 'KES 1,200,000',
        products: 892,
        customers: 98,
        status: 'Active'
      },
      {
        id: 'BR-003',
        code: 'BR-003',
        name: 'Eastleigh Branch',
        location: '📍 67 1st Avenue, Eastleigh',
        phone: '+254-700-123003',
        email: 'eastleigh@engaflow.com',
        manager: 'Grace Wanjiku',
        staff: 6,
        revenue: 'KES 900,000',
        products: 654,
        customers: 87,
        status: 'Active'
      },
      {
        id: 'BR-004',
        code: 'BR-004',
        name: 'Industrial Area',
        location: '📍 12 Enterprise Road, Industrial Area',
        phone: '+254-700-123004',
        email: 'industrial@engaflow.com',
        manager: 'James Mwangi',
        staff: 4,
        revenue: 'KES 500,000',
        products: 425,
        customers: 45,
        status: 'Under Renovation'
      }
    ];
    this.filteredBranches = [...this.branches];
    */
    // Real data is now loaded via loadBranches() method which fetches from BranchRepository
  }

  initializePerformanceData(): void {
    // Dummy data commented out - TODO: Calculate from real sales data
    /*
    this.performanceData = [
      {
        branch: 'Main Branch',
        manager: 'Mary Njeru',
        revenue: 'KES 1,800,000',
        deltaPercent: 9
      },
      {
        branch: 'Westlands Branch',
        manager: 'Peter Kamau',
        revenue: 'KES 1,200,000',
        deltaPercent: 5
      },
      {
        branch: 'Eastleigh Branch',
        manager: 'Grace Wanjiku',
        revenue: 'KES 900,000',
        deltaPercent: 13
      },
      {
        branch: 'Industrial Area',
        manager: 'James Mwangi',
        revenue: 'KES 500,000',
        deltaPercent: 12
      }
    ];
    */
    // TODO: Calculate performance data from real branches and sales data
    this.performanceData = [];
  }

  initializeStaffAllocation(): void {
    // Dummy data commented out - TODO: Calculate from real user data
    /*
    this.staffAllocation = [
      {
        branch: 'Main Branch',
        established: '1/15/2020',
        staff: 8,
        status: 'Active'
      },
      {
        branch: 'Westlands Branch',
        established: '3/10/2021',
        staff: 5,
        status: 'Active'
      },
      {
        branch: 'Eastleigh Branch',
        established: '6/20/2021',
        staff: 6,
        status: 'Active'
      },
      {
        branch: 'Industrial Area',
        established: '7/5/2022',
        staff: 4,
        status: 'Under Renovation'
      }
    ];
    */
    // TODO: Calculate staff allocation from real branches and users data
    this.staffAllocation = [];
  }

  initializeInventoryData(): void {
    // Dummy data commented out - TODO: Calculate from real inventory data
    /*
    this.inventoryData = [
      {
        category: 'Power Tools',
        mainBranch: 450,
        westlandsBranch: 320,
        eastleighBranch: 280,
        industrialArea: 150,
        total: 1200
      },
      {
        category: 'Hand Tools',
        mainBranch: 380,
        westlandsBranch: 250,
        eastleighBranch: 220,
        industrialArea: 120,
        total: 970
      },
      {
        category: 'Hardware',
        mainBranch: 320,
        westlandsBranch: 210,
        eastleighBranch: 180,
        industrialArea: 100,
        total: 810
      },
      {
        category: 'Safety Equipment',
        mainBranch: 180,
        westlandsBranch: 140,
        eastleighBranch: 120,
        industrialArea: 65,
        total: 505
      }
    ];
    */
    // TODO: Calculate inventory distribution from real inventory records
    this.inventoryData = [];
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((searchTerm) => {
        this.filterBranches(searchTerm || '');
      });
  }

  filterBranches(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredBranches = [...this.branches];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredBranches = this.branches.filter(branch =>
      branch.name.toLowerCase().includes(term) ||
      branch.location.toLowerCase().includes(term) ||
      branch.manager.toLowerCase().includes(term) ||
      branch.email.toLowerCase().includes(term)
    );
  }

  setActiveTab(tab: 'allBranches' | 'performance' | 'inventory'): void {
    this.activeTab = tab;
  }

  // Actions
  addBranch(): void {
    const dialogRef = this.dialog.open(AddBranchModalComponent, {
      width: '900px',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBranches();
        // console.log('Branch created:', result);
        // // TODO: Save to backend API
        // // Add new branch to the list
        // const newBranch: Branch = {
        //   id: `BR-${(this.branches.length + 1).toString().padStart(3, '0')}`,
        //   code: result.branchCode,
        //   name: result.branchName,
        //   location: `📍 ${result.locationForm.get('city')?.value}, ${result.locationForm.get('county')?.value}`,
        //   phone: result.phoneNumber,
        //   email: result.emailAddress,
        //   manager: result.managerName,
        //   staff: 0,
        //   revenue: 'KES 0',
        //   products: 0,
        //   customers: 0,
        //   status: 'Active'
        // };
        // this.branches.push(newBranch);
        // this.filteredBranches = [...this.branches];
      }
    });
  }

  editBranch(branch: Branch): void {
    // Extract branch ID from display format (BR-001 -> 1)
    const branchId = branch.id.replace('BR-', '');
    
    this.branchRepository.get(branchId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (domainBranch: DomainBranch) => {
          const dialogRef = this.dialog.open(AddBranchModalComponent, {
            width: '900px',
            maxHeight: '90vh',
            disableClose: false,
            data: { branch: domainBranch } // Pass branch data for editing
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.loadBranches(); // Reload branches after editing
            }
          });
        },
        error: (error: any) => {
          console.error('Error loading branch for edit:', error);
        }
      });
  }

  deleteBranch(branch: Branch): void {
    if (confirm(`Are you sure you want to delete ${branch.name}?`)) {
      // Extract branch ID from display format (BR-001 -> 1)
      const branchId = branch.id.replace('BR-', '');
      
      this.branchRepository.delete(branchId, { description: `Deleted branch ${branch.name}` })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log(`Branch ${branch.name} deleted successfully`);
            this.loadBranches(); // Reload branches after deletion
          },
          error: (error: any) => {
            console.error('Error deleting branch:', error);
          }
        });
    }
  }

  stockTransfer(): void {
    const dialogRef = this.dialog.open(StockTransferModalComponent, {
      width: '1100px',
      maxHeight: '90vh',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Stock transfer submitted:', result);
        // TODO: Save to backend API
        // Example result structure:
        // {
        //   fromBranch: 'BR-001',
        //   toBranch: 'BR-002',
        //   transferType: 'Inter-Branch Transfer',
        //   priorityLevel: 'Normal Priority',
        //   requestedBy: 'John Doe',
        //   expectedDate: '2024-01-20',
        //   reason: 'Stock replenishment',
        //   additionalNotes: 'Fragile items',
        //   selectedProducts: [
        //     { product: {...}, quantity: 5 },
        //     { product: {...}, quantity: 2 }
        //   ]
        // }
      }
    });
  }

  getDeltaClass(delta: number): string {
    if (delta > 0) return 'positive';
    if (delta < 0) return 'negative';
    return 'neutral';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 'Inactive':
        return 'status-inactive';
      case 'Under Renovation':
        return 'status-renovation';
      default:
        return '';
    }
  }
}

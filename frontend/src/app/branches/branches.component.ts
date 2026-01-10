import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {
  // Math utility for template
  Math = Math;

  // Search and filter
  searchControl = new FormControl('');
  activeTab: 'allBranches' | 'performance' | 'inventory' = 'allBranches';

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
    this.initializeStats();
    this.initializeBranches();
    this.initializePerformanceData();
    this.initializeStaffAllocation();
    this.initializeInventoryData();
    this.setupSearch();
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
  }

  initializePerformanceData(): void {
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
  }

  initializeStaffAllocation(): void {
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
  }

  initializeInventoryData(): void {
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
    // TODO: Implement add branch modal
    console.log('Add branch clicked');
  }

  editBranch(branch: Branch): void {
    // TODO: Implement edit branch modal
    console.log('Edit branch:', branch.name);
  }

  deleteBranch(branch: Branch): void {
    if (confirm(`Are you sure you want to delete ${branch.name}?`)) {
      this.branches = this.branches.filter(b => b.id !== branch.id);
      this.filteredBranches = this.filteredBranches.filter(b => b.id !== branch.id);
    }
  }

  stockTransfer(): void {
    // TODO: Implement stock transfer modal
    console.log('Stock transfer clicked');
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

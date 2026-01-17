import { Routes } from '@angular/router'



export const APP_ROUTES: Routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)},
    {path: 'inventory', loadComponent: () => import('./inventory/inventory.component').then(m => m.InventoryComponent)},
    {path: 'sales', loadComponent: () => import('./sales/sales.component').then(m => m.SalesComponent)},
    {path: 'procurement', loadComponent: () => import('./procurement/procurement.component').then(m => m.ProcurementComponent)},
    {path: 'delivery', loadComponent: () => import('./delivery/delivery.component').then(m => m.DeliveryComponent)},
    {path: 'tax-compliance', loadComponent: () => import('./tax-compliance/tax-compliance.component').then(m => m.TaxComplianceComponent)},
    {path: 'reports', loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent)},
    {path: 'users', loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)},
    {path: 'branches', loadComponent: () => import('./branches/branches.component').then(m => m.BranchesComponent)},
    {path: 'settings', loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)},
    {path: 'test-pages', loadComponent: () => import('./test-pages/test-pages-page.component').then(m => m.TestPagesPageComponent)},
    { path: '**', redirectTo: '' }
]
import { Routes } from '@angular/router'



export const APP_ROUTES: Routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)},
    {path: 'inventory', loadComponent: () => import('./inventory/inventory.component').then(m => m.InventoryComponent)},
    {path: 'sales', loadComponent: () => import('./sales/sales.component').then(m => m.SalesComponent)},
    {path: 'procurement', loadComponent: () => import('./procurement/procurement.component').then(m => m.ProcurementComponent)},
    {path: 'delivery', loadComponent: () => import('./delivery/delivery.component').then(m => m.DeliveryComponent)},
    {path: 'tax-compliance', loadComponent: () => import('./tax-compliance/tax-compliance.component').then(m => m.TaxComplianceComponent)},
    {path: 'reports', loadComponent: () => import('./placeholder/placeholder.component').then(m => m.PlaceholderComponent)},
    {path: 'users', loadComponent: () => import('./placeholder/placeholder.component').then(m => m.PlaceholderComponent)},
    {path: 'branches', loadComponent: () => import('./placeholder/placeholder.component').then(m => m.PlaceholderComponent)},
    { path: '**', redirectTo: '' }
]
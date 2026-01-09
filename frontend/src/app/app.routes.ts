import { Routes } from '@angular/router'



export const APP_ROUTES: Routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)},
    {path: 'inventory', loadComponent: () => import('./inventory/inventory.component').then(m => m.InventoryComponent)},
    {path: 'sales', loadComponent: () => import('./placeholder/placeholder.component').then(m => m.PlaceholderComponent)},
    {path: 'procurement', loadComponent: () => import('./placeholder/placeholder.component').then(m => m.PlaceholderComponent)},
    {path: 'delivery', loadComponent: () => import('./placeholder/placeholder.component').then(m => m.PlaceholderComponent)},
    {path: 'reports', loadComponent: () => import('./placeholder/placeholder.component').then(m => m.PlaceholderComponent)},
    {path: 'users', loadComponent: () => import('./placeholder/placeholder.component').then(m => m.PlaceholderComponent)},
    {path: 'branches', loadComponent: () => import('./placeholder/placeholder.component').then(m => m.PlaceholderComponent)},
    { path: '**', redirectTo: '' }
]
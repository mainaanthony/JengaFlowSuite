import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // Explicit menu definition. Keep this file authoritative for menu ordering, titles, and icons.
  // Do not auto-generate from routes to preserve presentation decisions.
  navItems: NavItem[] = [
    { title: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
    {
      title: 'Report Management',
      icon: 'description',
      items: [
        { title: 'Current Reports', link: '/reports' },
        { title: 'Report Templates', link: '/report-management/report-templates' },
        { title: 'Vendor Management', link: '/report-management/vendor-management' }
      ]
    },
    { title: 'Inventory', icon: 'inventory_2', link: '/inventory' },
    { title: 'Sales', icon: 'store', link: '/sales' },
    { title: 'Procurement', icon: 'shopping_cart', link: '/procurement' },
    { title: 'Delivery', icon: 'local_shipping', link: '/delivery' },
    { title: 'Reports', icon: 'assessment', link: '/reports' },
    { title: 'Users', icon: 'group', link: '/users' },
    { title: 'Branches', icon: 'location_on', link: '/branches' }
  ];
}

export interface NavItem {
  title: string;
  link?: string;
  icon?: string;
  items?: NavItem[];
  visible?: boolean; // optional, default true
}


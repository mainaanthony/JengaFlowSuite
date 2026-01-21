import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface SidebarSection {
  label: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  link?: string;
  icon?: string;
  items?: NavItem[];
  visible?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() collapsed = false;

  // Menu organized by sections for better UX
  sections: SidebarSection[] = [
    {
      label: 'OVERVIEW',
      items: [
        { title: 'Dashboard', icon: 'dashboard', link: '/dashboard' }
      ]
    },
    {
      label: 'OPERATIONS',
      items: [
        { title: 'Inventory', icon: 'inventory_2', link: '/inventory' },
        { title: 'Sales & POS', icon: 'store', link: '/sales' },
        { title: 'Procurement', icon: 'shopping_cart', link: '/procurement' },
        { title: 'Delivery', icon: 'local_shipping', link: '/delivery' }
      ]
    },
    {
      label: 'FINANCE',
      items: [
        { title: 'Tax & Compliance', icon: 'assignment', link: '/tax-compliance' },
        { title: 'Reports', icon: 'assessment', link: '/reports' }
      ]
    },
    {
      label: 'MANAGEMENT',
      items: [
        { title: 'Users', icon: 'group', link: '/users' },
        { title: 'Branches', icon: 'location_on', link: '/branches' },
        { title: 'Settings', icon: 'settings', link: '/settings' },
        { title: 'Test Pages', icon: 'bug_report', link: '/test-pages' }
      ]
    }
  ];
}
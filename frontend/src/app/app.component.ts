import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, MatIcon, SidebarComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class AppComponent {
  userInitials = 'JK';
  currentBranch = 'Main Branch';
  profileMenuOpen = false;

  constructor(private router: Router) {}

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  navigateTo(page: string): void {
    this.profileMenuOpen = false;
    this.router.navigate([`/${page}`]);
  }

  logout(): void {
    // TODO: Implement logout logic (clear session, redirect to login)
    console.log('Logging out...');
    this.profileMenuOpen = false;
    this.router.navigate(['/login']);
  }
}

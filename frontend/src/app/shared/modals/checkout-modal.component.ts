import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StepIndicatorComponent, Step } from '../step-indicator/step-indicator.component';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, StepIndicatorComponent],
  templateUrl: './checkout-modal.component.html',
  styleUrls: ['./checkout-modal.component.scss']
})
export class CheckoutModalComponent {
  steps: Step[] = [
    { id: 1, label: 'Customer', icon: 'person' },
    { id: 2, label: 'Products', icon: 'shopping_cart' },
    { id: 3, label: 'Checkout', icon: 'payment' }
  ];

  activeStep = 1;
  completedSteps: number[] = [];

  constructor(public dialogRef: MatDialogRef<CheckoutModalComponent>) {}

  onStepChange(step: number): void {
    this.activeStep = step;
  }

  nextStep(): void {
    if (this.activeStep < this.steps.length) {
      if (!this.completedSteps.includes(this.activeStep)) {
        this.completedSteps.push(this.activeStep);
      }
      this.activeStep++;
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  getStepContent(): string {
    switch (this.activeStep) {
      case 1:
        return 'Enter customer information and select from existing customers.';
      case 2:
        return 'Browse and select products to add to cart.';
      case 3:
        return 'Review order, apply discounts, and proceed to payment.';
      default:
        return '';
    }
  }
}

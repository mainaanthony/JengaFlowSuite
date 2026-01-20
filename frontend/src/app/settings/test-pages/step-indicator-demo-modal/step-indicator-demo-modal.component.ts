import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StepIndicatorComponent, Step } from '../../../shared/step-indicator/step-indicator.component';

@Component({
  selector: 'app-step-indicator-demo-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, StepIndicatorComponent],
  templateUrl: './step-indicator-demo-modal.component.html',
  styleUrls: ['./step-indicator-demo-modal.component.scss']
})
export class StepIndicatorDemoModalComponent {
  steps: Step[] = [
    { id: 1, label: 'Customer', icon: 'person' },
    { id: 2, label: 'Products', icon: 'shopping_cart' },
    { id: 3, label: 'Checkout', icon: 'payment' }
  ];

  activeStep = 1;
  completedSteps: number[] = [];
  disabledSteps: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<StepIndicatorDemoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onStepChange(step: number): void {
    if (!this.disabledSteps.includes(step)) {
      this.activeStep = step;
    }
  }

  markStepComplete(): void {
    if (!this.completedSteps.includes(this.activeStep)) {
      this.completedSteps.push(this.activeStep);
    }
  }

  nextStep(): void {
    if (this.activeStep < this.steps.length) {
      this.markStepComplete();
      this.activeStep++;
    }
  }

  previousStep(): void {
    if (this.activeStep > 1) {
      this.activeStep--;
    }
  }

  resetFlow(): void {
    this.activeStep = 1;
    this.completedSteps = [];
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

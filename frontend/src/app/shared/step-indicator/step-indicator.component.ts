import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface Step {
  id: number;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-step-indicator',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.scss']
})
export class StepIndicatorComponent implements OnInit {
  @Input() steps: Step[] = [];
  @Input() activeStep = 1;
  @Input() completedSteps: number[] = [];
  @Input() disabledSteps: number[] = [];

  @Output() stepChange = new EventEmitter<number>();

  ngOnInit(): void {
    // Component initialized
  }

  onStepClick(stepId: number): void {
    if (!this.disabledSteps.includes(stepId)) {
      this.stepChange.emit(stepId);
    }
  }

  isStepActive(stepId: number): boolean {
    return this.activeStep === stepId;
  }

  isStepCompleted(stepId: number): boolean {
    return this.completedSteps.includes(stepId);
  }

  isStepDisabled(stepId: number): boolean {
    return this.disabledSteps.includes(stepId);
  }

  getStepClass(stepId: number): string {
    if (this.isStepDisabled(stepId)) {
      return 'disabled';
    }
    if (this.isStepActive(stepId)) {
      return 'active';
    }
    if (this.isStepCompleted(stepId)) {
      return 'completed';
    }
    return '';
  }

  isLineActive(index: number): boolean {
    const nextStepId = index + 2;
    return this.completedSteps.includes(index + 1) || this.activeStep >= nextStepId;
  }
}

import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type ButtonAction = 'save' | 'cancel' | 'close' | 'next' | 'previous' | 'delete' | 'confirm';

export interface ModalButton {
  label: string;
  action: ButtonAction;
  color?: 'primary' | 'accent' | 'default'; // primary=blue, accent=orange, default=white
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export interface AppModalConfig {
  title: string;
  description?: string;
  subtitle?: string;
  showBackdrop?: boolean;
  disableClose?: boolean;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './app-modal.component.html',
  styleUrls: ['./app-modal.component.scss']
})
export class AppModalComponent {
  @Input() config: AppModalConfig = { title: 'Modal' };
  @Input() contentTemplate: TemplateRef<any> | null = null;
  @Input() leftButtons: ModalButton[] = [];
  @Input() rightButtons: ModalButton[] = [];
  @Input() showErrorMessage: boolean = false;
  @Input() errorMessage: string = '';
  @Input() successMessage: string = '';
  @Input() showSuccessMessage: boolean = false;

  @Output() buttonClicked = new EventEmitter<string>();
  @Output() saveCompleted = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  constructor(public dialogRef: MatDialogRef<AppModalComponent>) {}

  onButtonClick(button: ModalButton): void {
    if (button.disabled || button.loading) return;

    this.buttonClicked.emit(button.action);

    if (button.action === 'save') {
      this.saveCompleted.emit();
    } else if (button.action === 'cancel' || button.action === 'close') {
      this.cancelled.emit();
      this.dialogRef.close();
    }
  }

  closeModal(): void {
    this.cancelled.emit();
    this.dialogRef.close();
  }

  getButtonClass(button: ModalButton): string {
    let classes = 'modal-button';
    classes += ` btn-${button.color || 'default'}`;
    if (button.disabled) classes += ' disabled';
    if (button.loading) classes += ' loading';
    return classes;
  }
}

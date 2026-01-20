import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface InputTextConfig {
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  clearable?: boolean;
  errorMessage?: string;
  helperText?: string;
  description?: boolean;
  minLength?: number;
  maxLength?: number;
  rows?: number;
}

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true
    }
  ]
})
export class InputTextComponent implements ControlValueAccessor {
  @Input() config: InputTextConfig = {
    placeholder: '',
    label: '',
    required: false,
    disabled: false,
    type: 'text',
    clearable: true
  };

  @Output() valueChanged = new EventEmitter<string>();
  @Output() focused = new EventEmitter<void>();
  @Output() blurred = new EventEmitter<void>();

  value = '';
  isFocused = false;
  hasError = false;

  // ControlValueAccessor implementation
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    if (value !== null && value !== undefined) {
      this.value = value;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.config) {
      this.config.disabled = isDisabled;
    }
  }

  onInputChange(event: any): void {
    const value = event.target.value;
    this.value = value;
    this.onChange(value);
    this.valueChanged.emit(value);
  }

  onFocus(): void {
    this.isFocused = true;
    this.focused.emit();
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
    this.blurred.emit();
    this.validateInput();
  }

  clearValue(): void {
    this.value = '';
    this.onChange('');
    this.valueChanged.emit('');
  }

  validateInput(): void {
    if (this.config.required && !this.value.trim()) {
      this.hasError = true;
      this.config.errorMessage = `${this.config.label || 'This field'} is required`;
      return;
    }

    if (this.config.minLength && this.value.length < this.config.minLength) {
      this.hasError = true;
      this.config.errorMessage = `Minimum ${this.config.minLength} characters required`;
      return;
    }

    if (this.config.type === 'email' && this.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.value)) {
        this.hasError = true;
        this.config.errorMessage = 'Invalid email address';
        return;
      }
    }

    this.hasError = false;
    this.config.errorMessage = '';
  }

  get showError(): boolean {
    return this.hasError && !this.isFocused;
  }

  get isValid(): boolean {
    return !this.hasError && this.value.length > 0;
  }
}

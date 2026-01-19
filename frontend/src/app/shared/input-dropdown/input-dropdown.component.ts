import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface DropdownOption {
  id: string | number;
  label: string;
  value?: any;
  details?: {
    email?: string;
    phone?: string;
    terms?: string;
    description?: string;
    [key: string]: any;
  };
  disabled?: boolean;
}

export interface DropdownConfig {
  placeholder?: string;
  searchable?: boolean;
  multiSelect?: boolean;
  clearable?: boolean;
  showDetailsCard?: boolean;
  detailsTitle?: string;
  detailsFields?: string[];
}

@Component({
  selector: 'app-input-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './input-dropdown.component.html',
  styleUrls: ['./input-dropdown.component.scss']
})
export class InputDropdownComponent {
  @Input() options: DropdownOption[] = [];
  @Input() config: DropdownConfig = {
    placeholder: 'Select an option...',
    searchable: true,
    multiSelect: false,
    clearable: true,
    showDetailsCard: false,
    detailsTitle: 'Details',
    detailsFields: []
  };

  @Output() selectionChanged = new EventEmitter<DropdownOption | DropdownOption[] | null>();

  isOpen = false;
  searchTerm = '';
  selectedOptions: DropdownOption[] = [];
  hoveredOptionId: string | number | null = null;

  constructor(private elementRef: ElementRef) {}

  get filteredOptions(): DropdownOption[] {
    if (!this.searchTerm.trim()) {
      return this.options;
    }
    return this.options.filter(opt =>
      opt.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get selectedLabels(): string {
    if (this.selectedOptions.length === 0) {
      return this.config.placeholder || 'Select an option...';
    }
    if (this.config.multiSelect) {
      return this.selectedOptions.map(opt => opt.label).join(', ');
    }
    return this.selectedOptions[0].label;
  }

  get selectedOption(): DropdownOption | null {
    return this.selectedOptions.length > 0 ? this.selectedOptions[0] : null;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.searchTerm = '';
    }
  }

  openDropdown(): void {
    this.isOpen = true;
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.searchTerm = '';
  }

  selectOption(option: DropdownOption): void {
    if (option.disabled) {
      return;
    }

    if (this.config.multiSelect) {
      const index = this.selectedOptions.findIndex(opt => opt.id === option.id);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      } else {
        this.selectedOptions.push(option);
      }
      this.selectionChanged.emit([...this.selectedOptions]);
    } else {
      this.selectedOptions = [option];
      this.selectionChanged.emit(option);
      this.closeDropdown();
    }
  }

  isSelected(option: DropdownOption): boolean {
    return this.selectedOptions.some(opt => opt.id === option.id);
  }

  clearSelection(): void {
    this.selectedOptions = [];
    this.searchTerm = '';
    this.selectionChanged.emit(null);
  }

  removeSelectedOption(optionId: string | number, event: MouseEvent): void {
    event.stopPropagation();
    const index = this.selectedOptions.findIndex(opt => opt.id === optionId);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
      if (this.config.multiSelect) {
        this.selectionChanged.emit([...this.selectedOptions]);
      } else if (this.selectedOptions.length === 0) {
        this.selectionChanged.emit(null);
      }
    }
  }

  setHoveredOption(optionId: string | number | null): void {
    this.hoveredOptionId = optionId;
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  getDetailsValue(field: string, details: any): string {
    if (!details) return '';
    
    const value = details[field.toLowerCase()];
    return value ? String(value) : '';
  }
}

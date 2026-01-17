import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

export interface ColumnConfig {
  key: string;
  label: string;
  width?: string;
  type?: 'text' | 'number' | 'enum' | 'currency' | 'date' | 'custom';
  enumValues?: { value: string; label: string; color: string }[];
  format?: (value: any) => string;
  subText?: string; // for secondary text below main value
}

export interface TableAction {
  id: string;
  label: string;
  icon: string;
  color?: string; // 'primary' | 'warn' | 'accent'
}

export interface TableActionEvent {
  action: string;
  row: any;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.scss']
})
export class AppTableComponent {
  @Input() columns: ColumnConfig[] = [];
  @Input() rows: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading = false;
  @Input() searchPlaceholder = 'Search...';
  @Input() showSearch = true;
  @Input() showFilter = true;

  @Output() actionTriggered = new EventEmitter<TableActionEvent>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() filterClicked = new EventEmitter<void>();

  searchTerm = '';
  activeMenuRowId: string | number | null = null;

  getColumnWidth(column: ColumnConfig): string {
    return column.width || 'auto';
  }

  getValue(row: any, column: ColumnConfig): any {
    return row[column.key];
  }

  getFormattedValue(row: any, column: ColumnConfig): string {
    const value = this.getValue(row, column);

    if (value === null || value === undefined) {
      return '-';
    }

    switch (column.type) {
      case 'currency':
        return typeof value === 'number' ? `KES ${value.toLocaleString()}` : value;
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      case 'enum':
        return this.getEnumLabel(value, column);
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'custom':
        return column.format ? column.format(value) : value;
      default:
        return column.format ? column.format(value) : value;
    }
  }

  getEnumLabel(value: any, column: ColumnConfig): string {
    const enumValue = column.enumValues?.find(e => e.value === value);
    return enumValue ? enumValue.label : value;
  }

  getEnumColor(value: any, column: ColumnConfig): string {
    const enumValue = column.enumValues?.find(e => e.value === value);
    return enumValue ? enumValue.color : '#999';
  }

  isEnumType(column: ColumnConfig): boolean {
    return column.type === 'enum';
  }

  onAction(action: TableAction, row: any): void {
    this.actionTriggered.emit({
      action: action.id,
      row: row
    });
    this.activeMenuRowId = null;
  }

  toggleActionMenu(rowId: string | number): void {
    this.activeMenuRowId = this.activeMenuRowId === rowId ? null : rowId;
  }

  isActionMenuOpen(rowId: string | number): boolean {
    return this.activeMenuRowId === rowId;
  }

  closeActionMenu(): void {
    this.activeMenuRowId = null;
  }

  onSearch(value: string): void {
    this.searchTerm = value;
    this.searchChanged.emit(value);
  }

  onFilter(): void {
    this.filterClicked.emit();
  }

  getSubText(row: any, column: ColumnConfig): string {
    if (column.subText) {
      return row[column.subText] || '';
    }
    return '';
  }
}

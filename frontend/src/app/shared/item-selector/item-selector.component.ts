import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface SelectorItem {
  id: string;
  title: string;
  subtitle?: string;
  price?: number;
  quantity?: number;
  stock?: number;
  stockStatus?: 'in-stock' | 'out-of-stock' | 'low-stock';
  [key: string]: any; // Allow additional properties
}

export interface ItemSelectorConfig {
  availableTitle: string;
  selectedTitle: string;
  actionIcon: string; // Material icon name (e.g., 'shopping_cart', 'build', 'add_circle')
  actionTooltip?: string;
  showPrice?: boolean;
  showStock?: boolean;
  showQuantity?: boolean;
  maxSelected?: number;
  allowDragDrop?: boolean;
  currencySymbol?: string;
}

@Component({
  selector: 'app-item-selector',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.scss']
})
export class ItemSelectorComponent implements OnInit {
  @Input() config: ItemSelectorConfig = {
    availableTitle: 'Available Items',
    selectedTitle: 'Selected Items',
    actionIcon: 'shopping_cart',
    allowDragDrop: true,
    showPrice: true,
    showStock: true,
    showQuantity: true,
    currencySymbol: 'KES'
  };

  @Input() availableItems: SelectorItem[] = [];
  @Input() selectedItems: SelectorItem[] = [];

  @Output() itemSelected = new EventEmitter<SelectorItem>();
  @Output() itemRemoved = new EventEmitter<SelectorItem>();
  @Output() itemMoved = new EventEmitter<{ item: SelectorItem; from: 'available' | 'selected'; to: 'available' | 'selected' }>();
  @Output() selectedItemsChanged = new EventEmitter<SelectorItem[]>();

  ngOnInit(): void {
    if (!this.config.allowDragDrop) {
      this.config.allowDragDrop = true;
    }
  }

  // Action button click (e.g., Add to Cart)
  onActionClick(item: SelectorItem, source: 'available' | 'selected'): void {
    if (source === 'available') {
      // Add to selected
      if (this.config.maxSelected && this.selectedItems.length >= this.config.maxSelected) {
        console.warn(`Maximum ${this.config.maxSelected} items allowed`);
        return;
      }

      const itemCopy = { ...item, quantity: item.quantity || 1 };
      this.selectedItems = [...this.selectedItems, itemCopy];
      this.itemSelected.emit(itemCopy);
      this.selectedItemsChanged.emit(this.selectedItems);
    } else {
      // Remove from selected
      this.selectedItems = this.selectedItems.filter(i => i.id !== item.id);
      this.itemRemoved.emit(item);
      this.selectedItemsChanged.emit(this.selectedItems);
    }
  }

  // Drag and drop handler
  drop(event: CdkDragDrop<SelectorItem[]>): void {
    if (!this.config.allowDragDrop) return;

    const isMovingWithinSameList = event.previousContainer === event.container;

    if (isMovingWithinSameList) {
      // Reorder within same list
      const items = event.container.data;
      const [moved] = items.splice(event.previousIndex, 1);
      items.splice(event.currentIndex, 0, moved);
      
      // Trigger change detection
      if (event.container.data === this.selectedItems) {
        this.selectedItems = [...this.selectedItems];
        this.selectedItemsChanged.emit(this.selectedItems);
      } else {
        this.availableItems = [...this.availableItems];
      }
    } else {
      // Moving between lists
      const item = event.previousContainer.data[event.previousIndex];
      const isMovingToSelected = event.container.data === this.selectedItems;

      // Remove from source
      event.previousContainer.data.splice(event.previousIndex, 1);

      if (isMovingToSelected) {
        // Adding to selected list
        if (this.config.maxSelected && this.selectedItems.length >= this.config.maxSelected) {
          // Put it back if max reached
          event.previousContainer.data.splice(event.previousIndex, 0, item);
          return;
        }

        const itemCopy = { ...item, quantity: item.quantity || 1 };
        event.container.data.splice(event.currentIndex, 0, itemCopy);
        this.selectedItems = [...this.selectedItems];
        this.itemSelected.emit(itemCopy);
        this.selectedItemsChanged.emit(this.selectedItems);
      } else {
        // Removing from selected (moving back to available)
        event.container.data.splice(event.currentIndex, 0, item);
        this.availableItems = [...this.availableItems];
        this.itemRemoved.emit(item);
        this.selectedItems = [...this.selectedItems];
        this.selectedItemsChanged.emit(this.selectedItems);
      }

      this.itemMoved.emit({
        item,
        from: event.previousContainer.data === this.availableItems ? 'available' : 'selected',
        to: isMovingToSelected ? 'selected' : 'available'
      });
    }
  }

  // Helper to format price
  formatPrice(price: number | undefined): string {
    if (price === undefined) return '';
    return `${this.config.currencySymbol} ${price.toLocaleString()}`;
  }

  // Helper to get stock status color
  getStockStatusColor(status?: string): string {
    switch (status) {
      case 'in-stock':
        return '#4caf50';
      case 'low-stock':
        return '#ff9800';
      case 'out-of-stock':
        return '#f44336';
      default:
        return '#999';
    }
  }

  // Helper to get stock status text
  getStockStatusText(stock?: number, status?: string): string {
    if (status === 'out-of-stock') return 'Out of Stock';
    if (status === 'low-stock') return `Stock: ${stock}`;
    if (stock !== undefined) return `Stock: ${stock}`;
    return '';
  }

  // Helper to calculate total price
  calculateTotalPrice(): number {
    return this.selectedItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  }
}

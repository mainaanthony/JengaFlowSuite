import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

@Component({
    selector: 'app-tabs',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './app-tabs.component.html',
    styleUrls: ['./app-tabs.component.scss']
})
export class AppTabsComponent {
    @Input() tabs: Tab[] = [];
    @Input() activeTabId: string = '';
    @Input() stretch: boolean = false;

    @Output() tabChanged = new EventEmitter<string>();

    selectTab(tabId: string): void {
        const tab = this.tabs.find(t => t.id === tabId);
        if (tab && !tab.disabled) {
            this.activeTabId = tabId;
            this.tabChanged.emit(tabId);
        }
    }

    isActive(tabId: string): boolean {
        return this.activeTabId === tabId;
    }

    isDisabled(tabId: string): boolean {
        const tab = this.tabs.find(t => t.id === tabId);
        return tab?.disabled || false;
    }
}

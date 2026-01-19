import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Tab {
  id: string;
  label: string;
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

    @Output() tabChanged = new EventEmitter<string>();

    selectTab(tabId: string): void {
        this.activeTabId = tabId;
        this.tabChanged.emit(tabId);
    }

    isActive(tabId: string): boolean {
        return this.activeTabId === tabId;
    }
}

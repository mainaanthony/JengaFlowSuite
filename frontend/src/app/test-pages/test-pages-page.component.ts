import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestPagesComponent } from '../settings/test-pages/test-pages.component';

@Component({
  selector: 'app-test-pages-page',
  standalone: true,
  imports: [CommonModule, TestPagesComponent],
  template: `<app-test-pages></app-test-pages>`
})
export class TestPagesPageComponent {}

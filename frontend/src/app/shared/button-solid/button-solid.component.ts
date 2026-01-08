import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-solid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-solid.component.html',
  styleUrl: './button-solid.component.css'
})
export class ButtonSolidComponent {
  @Input() variant: 'primary' | 'secondary' | 'default' = 'default';
}

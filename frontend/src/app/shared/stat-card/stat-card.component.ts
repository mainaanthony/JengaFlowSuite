import { Component, Input} from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [NgClass, MatIconModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.css']
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() delta = 0;

  get deltaLabel(){
     return (this.delta >  0 ? '+': '') + this.delta + '%'
  }
}

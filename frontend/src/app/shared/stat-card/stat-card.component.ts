import { Component, Input} from '@angular/core';
import { CardComponent } from '../card/card.component';
import { NgClass } from "../../../../node_modules/@angular/common/index";

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CardComponent, NgClass],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css'
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() delta = 0;

  get deltaLabel(){
     return (this.delta >  0 ? '+': '') + this.delta + '%'
  }
}

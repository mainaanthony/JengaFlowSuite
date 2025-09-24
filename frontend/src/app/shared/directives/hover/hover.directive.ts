import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[app-hover-directive]',
  standalone: true
})
export class HoverDirective {
  @Input('app-hover-directive') text='';
  tooltip?: HTMLElement;

  constructor(private el: ElementRef, private r:Renderer2) { }

  @HostListener('mouseenter') show(){
    if(!this.text) return;
    this.tooltip = this.r.createElement('div');
    this.r.setStyle(this.tooltip, 'position', 'fixed');
    this.r.setStyle(this.tooltip, 'background', '#222');
    this.r.setStyle(this.tooltip, 'color', '#fff');
    this.r.setStyle(this.tooltip, 'padding', '6px 8px');
    this.r.setStyle(this.tooltip, 'border-radius', '6px');
    this.r.setStyle(this.tooltip, 'font-size', '12px');
    this.r.setStyle(this.tooltip, 'z-index', '9999');
    this.r.setProperty(this.tooltip, 'textContent', this.text);
    if (this.tooltip)  document.body.appendChild(this.tooltip);
    this.position;
  }

  @HostListener('mouseleave') hide(){
    if(this.tooltip) {
      this.tooltip.remove();
      this.tooltip = undefined;
    }
  }

  @HostListener('mousemove', ['$event']) position(e?: MouseEvent){
    if(!this.tooltip) return;
    const x = (e? e.clientX: (this.el.nativeElement.getBoundingClientRect().left + 10)) + 12;
    const y = (e? e.clientY: (this.el.nativeElement.getBoundingClientRect().top + 12)) + 12;
    this.r.setStyle(this.tooltip, 'left', x + 'px');
    this.r.setStyle(this.tooltip, 'top', y + 'px');
  }

}

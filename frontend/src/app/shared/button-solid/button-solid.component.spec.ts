import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSolidComponent } from './button-solid.component';

describe('BttonSolidComponent', () => {
  let component: ButtonSolidComponent;
  let fixture: ComponentFixture<ButtonSolidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonSolidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonSolidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

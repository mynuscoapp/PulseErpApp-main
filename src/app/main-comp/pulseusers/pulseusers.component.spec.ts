import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PulseusersComponent } from './pulseusers.component';

describe('PulseusersComponent', () => {
  let component: PulseusersComponent;
  let fixture: ComponentFixture<PulseusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PulseusersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PulseusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

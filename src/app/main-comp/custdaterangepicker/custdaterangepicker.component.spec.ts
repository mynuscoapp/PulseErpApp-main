import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustdaterangepickerComponent } from './custdaterangepicker.component';

describe('CustdaterangepickerComponent', () => {
  let component: CustdaterangepickerComponent;
  let fixture: ComponentFixture<CustdaterangepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustdaterangepickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustdaterangepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmazonpaymentsComponent } from './amazonpayments.component';

describe('AmazonpaymentsComponent', () => {
  let component: AmazonpaymentsComponent;
  let fixture: ComponentFixture<AmazonpaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmazonpaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmazonpaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

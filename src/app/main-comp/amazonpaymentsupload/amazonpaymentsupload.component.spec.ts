import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmazonpaymentsuploadComponent } from './amazonpaymentsupload.component';

describe('AmazonpaymentsuploadComponent', () => {
  let component: AmazonpaymentsuploadComponent;
  let fixture: ComponentFixture<AmazonpaymentsuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmazonpaymentsuploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmazonpaymentsuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

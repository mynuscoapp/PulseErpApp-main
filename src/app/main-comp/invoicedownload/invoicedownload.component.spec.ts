import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicedownloadComponent } from './invoicedownload.component';

describe('InvoicedownloadComponent', () => {
  let component: InvoicedownloadComponent;
  let fixture: ComponentFixture<InvoicedownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicedownloadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicedownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BitrixstockComponent } from './bitrixstock.component';

describe('BitrixstockComponent', () => {
  let component: BitrixstockComponent;
  let fixture: ComponentFixture<BitrixstockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BitrixstockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BitrixstockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
